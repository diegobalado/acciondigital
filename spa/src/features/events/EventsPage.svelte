<script>
	import { onMount } from 'svelte';
	import { APP_TITLE } from '../../app/config/migration';
	import MediaCard from '../../shared/components/MediaCard.svelte';
	import { loadEventsCatalog, searchEventsCatalog } from './eventsApi';
	import { createEventsClickTracker, trackEventsClickEvent } from './eventsTracking';
	import { mergeProgressiveFeed } from './eventsPagination';

	export let loadEvents = loadEventsCatalog;
	export let searchEvents = searchEventsCatalog;
	export let pageSize = 12;
	export let trackEvent = trackEventsClickEvent;
	export let createTracker = createEventsClickTracker;

	let status = 'loading';
	let feed = [];
	let isLoadingMore = false;
	let searchQuery = '';
	let searchStatus = 'idle';
	let searchResults = [];
	let activeQuery = '';
	$: hasSearchQuery = activeQuery.length > 0;
	$: visibleFeed = hasSearchQuery
		? searchResults.map((event) => ({ type: 'event', event }))
		: feed;
	$: visibleStatus = hasSearchQuery ? searchStatus : status;
	$: searchSummary = hasSearchQuery
		? `Busqueda "${activeQuery}": ${searchResults.length} resultado(s)`
		: `Pagina ${pagination.page} de ${pagination.totalPages} | Total: ${pagination.totalItems}`;
	let progressive = {
		nextPage: null,
		canLoadMore: false
	};
	let pagination = {
		page: 1,
		pageSize: 12,
		totalItems: 0,
		totalPages: 1,
		hasPreviousPage: false,
		hasNextPage: false
	};

	$: tracker = createTracker({ trackEvent });
	$: loadMoreLabel = isLoadingMore ? 'Cargando mas eventos...' : 'Desplazate para cargar mas';

	async function requestPage(page, append = false) {
		if (append) {
			if (isLoadingMore) {
				return;
			}
			isLoadingMore = true;
		} else {
			status = 'loading';
		}

		try {
			const result = await loadEvents({ page, pageSize });
			feed = mergeProgressiveFeed(feed, result.feed, append);
			pagination = result.pagination;
			progressive = result.progressive;
			status = feed.length > 0 ? 'ready' : 'empty';
		} catch {
			status = 'error';
		} finally {
			if (append) {
				isLoadingMore = false;
			}
		}
	}

	async function submitSearch() {
		const normalizedQuery = searchQuery.trim();
		if (!normalizedQuery) {
			activeQuery = '';
			searchResults = [];
			searchStatus = 'idle';
			return;
		}

		searchStatus = 'loading';
		activeQuery = normalizedQuery;

		try {
			const result = await searchEvents({ query: normalizedQuery });
			searchResults = Array.isArray(result?.events) ? result.events : [];
			searchStatus = searchResults.length > 0 ? 'ready' : 'empty';
		} catch {
			searchStatus = 'error';
		}
	}

	function clearSearch() {
		searchQuery = '';
		activeQuery = '';
		searchResults = [];
		searchStatus = 'idle';
	}

	onMount(async () => {
		await requestPage(1, false);
	});

	function getCardProps(item) {
		if (item.type === 'event') {
			return {
				variant: 'event',
				href: item.event.eventUrl || '#',
				title: item.event.title,
				label: item.event.title,
				imageUrl: item.event.coverImageUrl,
				target: '_self'
			};
		}

		return {
			variant: 'ad',
			href: item.ad?.href || '#',
			title: item.ad?.name || 'Publicidad',
			label: item.ad?.name || 'Publicidad',
			imageUrl: item.ad?.imageUrl || '',
			target: item.ad?.target || '_self'
		};
	}

	function onInfiniteScrollSentinel(node) {
		if (typeof IntersectionObserver !== 'function') {
			return {};
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const hasIntersectingEntry = entries.some((entry) => entry.isIntersecting);
				if (hasIntersectingEntry) {
					void loadMore();
				}
			},
			{ rootMargin: '220px 0px' }
		);

		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	async function loadMore() {
		if (!progressive.canLoadMore || !progressive.nextPage || isLoadingMore || status !== 'ready') {
			return;
		}

		await requestPage(progressive.nextPage, true);
	}
</script>

<main class="events-shell">
	<header>
		<h1>{APP_TITLE}</h1>
		<h2>Eventos</h2>
	</header>
	<form class="events-search" on:submit|preventDefault={submitSearch} data-testid="events-search-form">
		<label for="events-search-input">Buscar por bib/numero</label>
		<div class="events-search-controls">
			<input
				id="events-search-input"
				type="search"
				bind:value={searchQuery}
				placeholder="Ej: 145"
				data-testid="events-search-input"
			/>
			<button type="submit" data-testid="events-search-submit">Buscar</button>
			{#if hasSearchQuery}
				<button type="button" on:click={clearSearch} data-testid="events-search-clear">Limpiar</button>
			{/if}
		</div>
	</form>

	{#if visibleStatus === 'loading'}
		<p data-testid="events-loading">Cargando catalogo de eventos...</p>
	{:else if visibleStatus === 'error'}
		<p data-testid="events-error">No se pudo cargar el catalogo de eventos.</p>
	{:else if visibleStatus === 'empty'}
		<p data-testid="events-empty">
			{#if hasSearchQuery}
				No hay resultados para la busqueda actual.
			{:else}
				No hay eventos disponibles por el momento.
			{/if}
		</p>
	{:else}
		<p class="events-summary" data-testid="events-summary">{searchSummary}</p>
		<ul class="events-grid" data-testid="events-list">
			{#each visibleFeed as item}
				<li data-testid={item.type === 'ad' ? 'events-ad-item' : undefined}>
					<MediaCard {...getCardProps(item)} trackingPayload={item} onTrack={tracker.trackFeedClick} />
				</li>
			{/each}
			{#if isLoadingMore}
				{#each [0, 1, 2] as skeletonIndex (skeletonIndex)}
					<li class="events-skeleton-item" data-testid="events-skeleton-item" aria-hidden="true">
						<div class="events-skeleton-thumb"></div>
						<div class="events-skeleton-line events-skeleton-line-main"></div>
						<div class="events-skeleton-line events-skeleton-line-sub"></div>
					</li>
				{/each}
			{/if}
		</ul>
		{#if !hasSearchQuery && progressive.canLoadMore}
			<div class="events-infinite" data-testid="events-infinite-status" aria-live="polite">
				<p>{loadMoreLabel}</p>
				<div class="events-infinite-sentinel" data-testid="events-infinite-sentinel" use:onInfiniteScrollSentinel></div>
			</div>
		{/if}
	{/if}
</main>

<style>
	.events-shell {
		margin: 0 auto;
		max-width: 960px;
		padding: 2rem 1rem;
	}

	header {
		margin-bottom: 1rem;
	}

	.events-search {
		display: grid;
		gap: 0.45rem;
		margin-bottom: 1rem;
	}

	.events-search label {
		font-size: 0.9rem;
		opacity: 0.85;
	}

	.events-search-controls {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.events-search-controls input {
		flex: 1 1 220px;
		padding: 0.55rem 0.65rem;
		border-radius: 0.4rem;
		border: 1px solid #c9c9c9;
	}

	.events-search-controls button {
		padding: 0.55rem 0.7rem;
		border-radius: 0.4rem;
		border: 1px solid #b8b8b8;
		background: #fff;
		cursor: pointer;
	}

	h1,
	h2 {
		margin: 0;
	}

	h2 {
		font-size: 1.3rem;
		opacity: 0.85;
	}

	.events-summary {
		margin: 0 0 0.75rem;
		font-size: 0.95rem;
		opacity: 0.8;
	}

	.events-grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	}

	.events-grid li {
		margin: 0;
	}

	.events-infinite {
		display: grid;
		justify-items: center;
		margin-top: 1rem;
		font-size: 0.95rem;
		opacity: 0.82;
	}

	.events-infinite-sentinel {
		width: 100%;
		height: 1px;
	}

	.events-skeleton-item {
		padding: 0.75rem;
		border: 1px solid #ebebeb;
		border-radius: 0.6rem;
		background: #fafafa;
		display: grid;
		gap: 0.45rem;
	}

	.events-skeleton-thumb {
		height: 120px;
		border-radius: 0.45rem;
		background: linear-gradient(90deg, #efefef 25%, #f7f7f7 50%, #efefef 75%);
		background-size: 250% 100%;
		animation: events-skeleton-pulse 1.1s linear infinite;
	}

	.events-skeleton-line {
		height: 0.6rem;
		border-radius: 0.4rem;
		background: linear-gradient(90deg, #efefef 25%, #f7f7f7 50%, #efefef 75%);
		background-size: 250% 100%;
		animation: events-skeleton-pulse 1.1s linear infinite;
	}

	.events-skeleton-line-main {
		width: 82%;
	}

	.events-skeleton-line-sub {
		width: 58%;
	}

	@keyframes events-skeleton-pulse {
		from {
			background-position: 100% 0;
		}

		to {
			background-position: -100% 0;
		}
	}
</style>

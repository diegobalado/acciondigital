<script>
	import { onMount } from 'svelte';
	import { APP_TITLE } from '../../app/config/migration';
	import MediaCard from '../../shared/components/MediaCard.svelte';
	import PageLayout from '../../shared/components/PageLayout.svelte';
	import { loadEventsCatalog, searchEventsCatalog } from './eventsApi';
	import { createEventsClickTracker, trackEventsClickEvent } from './eventsTracking';
	import { mergeProgressiveFeed } from './eventsPagination';
	import {
		addItemToCart,
		cartTotalsStore
	} from '../../services/cartStore';
	import {
		actionButtonClass,
		buttonClass,
		cardGridClass,
		fieldLabelClass,
		formStackClass,
		infiniteStatusClass,
		pageSubtitleClass,
		pageTitleClass,
		statusMessageClass,
		summaryTextClass,
		textInputClass
	} from '../../shared/ui/classes';

	/** @type {any} */
	export let loadEvents = null;
	/** @type {any} */
	export let searchEvents = null;
	export let pageSize = 12;
	export let trackEvent = trackEventsClickEvent;
	export let createTracker = createEventsClickTracker;
	export let eventCartUnitPrice = 1000;

	let status = 'loading';
	let feed = [];
	let isLoadingMore = false;
	let searchQuery = '';
	let searchStatus = 'idle';
	let searchResults = [];
	let isUntaggedSearch = false;
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

	function getLocationSearch() {
		if (typeof window === 'undefined') {
			return '';
		}

		return window.location.search || '';
	}

	function withCurrentSearch(href) {
		const locationSearch = getLocationSearch();
		if (!href || !locationSearch) {
			return href;
		}

		const currentParams = new URLSearchParams(locationSearch);
		if (!currentParams.has('mirror')) {
			return href;
		}

		const [baseHref, existingSearch = ''] = href.split('?');
		const mergedParams = new URLSearchParams(existingSearch);
		currentParams.forEach((value, key) => {
			if (!mergedParams.has(key)) {
				mergedParams.set(key, value);
			}
		});

		const nextSearch = mergedParams.toString();
		return nextSearch ? `${baseHref}?${nextSearch}` : baseHref;
	}

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
			const loadEventsFn = loadEvents || loadEventsCatalog;
			const requestOptions = { page, pageSize };
			const locationSearch = getLocationSearch();
			if (locationSearch) {
				requestOptions.search = locationSearch;
			}

			const result = await loadEventsFn(requestOptions);
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
		tracker.trackSearchSubmitted(normalizedQuery);

		if (!normalizedQuery) {
			activeQuery = '';
			searchResults = [];
			isUntaggedSearch = false;
			searchStatus = 'idle';
			return;
		}

		searchStatus = 'loading';
		activeQuery = normalizedQuery;

		try {
			const searchEventsFn = searchEvents || searchEventsCatalog;
			const requestOptions = { query: normalizedQuery };
			const locationSearch = getLocationSearch();
			if (locationSearch) {
				requestOptions.search = locationSearch;
			}

			const result = await searchEventsFn(requestOptions);
			searchResults = Array.isArray(result?.events) ? result.events : [];
			isUntaggedSearch = Boolean(result?.isUntagged);
			searchStatus = searchResults.length > 0 ? 'ready' : 'empty';
			tracker.trackSearchResult(normalizedQuery, searchResults.length > 0);
		} catch {
			isUntaggedSearch = false;
			searchStatus = 'error';
		}
	}

	function clearSearch() {
		tracker.trackSearchCleared();
		searchQuery = '';
		activeQuery = '';
		searchResults = [];
		isUntaggedSearch = false;
		searchStatus = 'idle';
	}

	onMount(async () => {
		await requestPage(1, false);
	});

	function getCardProps(item) {
		if (item.type === 'event') {
			return {
				variant: 'event',
				href: withCurrentSearch(item.event.eventUrl || '#'),
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

	function toCartItemFromEvent(eventItem) {
		return {
			id: eventItem.id,
			name: eventItem.title,
			summary: eventItem.id,
			price: Number(eventItem.price) || eventCartUnitPrice,
			quantity: 1,
			image: eventItem.coverImageUrl || '',
			event: eventItem.id,
			ph: '',
			type: 'Galeria'
		};
	}

	function addEventToCart(eventItem) {
		addItemToCart(toCartItemFromEvent(eventItem));
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

<PageLayout shell="narrow" headerVariant="compact">
	<svelte:fragment slot="header">
		<h1 class={pageTitleClass}>{APP_TITLE}</h1>
		<h2 class={pageSubtitleClass}>Eventos</h2>
	</svelte:fragment>
	<form class={formStackClass} on:submit|preventDefault={submitSearch} data-testid="events-search-form">
		<label class={fieldLabelClass} for="events-search-input">Buscar por bib/numero</label>
		<div class="flex flex-wrap gap-2">
			<input
				class={textInputClass}
				id="events-search-input"
				type="search"
				bind:value={searchQuery}
				placeholder="Ej: 145"
				data-testid="events-search-input"
			/>
			<button class={buttonClass} type="submit" data-testid="events-search-submit">Buscar</button>
			{#if hasSearchQuery}
				<button
					class={buttonClass}
					type="button"
					on:click={clearSearch}
					data-testid="events-search-clear"
				>
					Limpiar
				</button>
			{/if}
		</div>
	</form>
	<p class={summaryTextClass} data-testid="events-cart-hint">
		Carrito global: {$cartTotalsStore.totalQuantity} item(s). Revisa el popup de Carrito o la pagina completa.
	</p>

	{#if visibleStatus === 'loading'}
		<div class="mt-8 flex justify-center" data-testid="events-loading">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else if visibleStatus === 'error'}
		<div class="alert alert-error mt-4" data-testid="events-error">No se pudo cargar el catalogo de eventos.</div>
	{:else if visibleStatus === 'empty'}
		<div class="alert mt-4" data-testid="events-empty">
			{#if hasSearchQuery}
				{#if isUntaggedSearch}
					La busqueda "sin clasificar" no aplica al catalogo de eventos.
				{:else}
					No hay resultados para la busqueda actual.
				{/if}
			{:else}
				No hay eventos disponibles por el momento.
			{/if}
		</div>
	{:else}
		<p class={summaryTextClass} data-testid="events-summary">{searchSummary}</p>
		<ul class={cardGridClass} data-testid="events-list">
			{#each visibleFeed as item}
				<li data-testid={item.type === 'ad' ? 'events-ad-item' : undefined}>
					<MediaCard {...getCardProps(item)} trackingPayload={item} onTrack={tracker.trackFeedClick} />
					{#if item.type === 'event'}
						<button
							class={`mt-2 w-full ${actionButtonClass}`}
							type="button"
							on:click={() => addEventToCart(item.event)}
							data-testid="events-add-to-cart"
						>
							Agregar al carrito
						</button>
					{/if}
				</li>
			{/each}
			{#if isLoadingMore}
				{#each [0, 1, 2] as skeletonIndex (skeletonIndex)}
					<li class="card bg-base-200" data-testid="events-skeleton-item" aria-hidden="true">
						<div class="skeleton h-[120px] w-full rounded-b-none"></div>
						<div class="card-body gap-2 p-3">
							<div class="skeleton h-2 w-[82%]"></div>
							<div class="skeleton h-2 w-[58%]"></div>
						</div>
					</li>
				{/each}
			{/if}
		</ul>
		{#if !hasSearchQuery && progressive.canLoadMore}
			<div class={infiniteStatusClass} data-testid="events-infinite-status" aria-live="polite">
				<p>{loadMoreLabel}</p>
				<div class="h-px w-full" data-testid="events-infinite-sentinel" use:onInfiniteScrollSentinel></div>
			</div>
		{/if}
	{/if}
</PageLayout>

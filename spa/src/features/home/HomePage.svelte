<script>
	import { onMount } from 'svelte';
	import { APP_SUBTITLE, APP_TITLE } from '../../app/config/migration';
	import { loadHomeContent } from './homeApi';
	import MediaCard from '../../shared/components/MediaCard.svelte';
	import { createHomeClickTracker, trackHomeClickEvent } from './homeTracking';
	import {
		cardGridClass,
		narrowPageShellClass,
		pageTitleClass,
		secondaryTextClass,
		spaciousPageHeaderClass,
		statusMessageClass,
		subtleTextClass,
		summaryTextClass
	} from '../../shared/ui/classes';

	export let loadHome = loadHomeContent;
	export let trackEvent = trackHomeClickEvent;
	export let createTracker = createHomeClickTracker;

	let events = [];
	let ads = [];
	let feed = [];
	let status = 'loading';
	$: tracker = createTracker({ trackEvent });

	function withCurrentSearch(href) {
		if (!href || typeof window === 'undefined' || !window.location.search) {
			return href;
		}

		const currentParams = new URLSearchParams(window.location.search);
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

	onMount(async () => {
		try {
			const result = await loadHome({ search: window.location.search });
			events = result.events;
			ads = result.ads;
			feed = result.feed;
			status = feed.length > 0 ? 'ready' : 'empty';
		} catch {
			status = 'error';
		}
	});

	function getCardProps(item) {
		if (item.type === 'event') {
			return {
				variant: 'event',
				href: withCurrentSearch(item.event.eventUrl || '#'),
				title: item.event.title,
				label: item.event.title,
				imageUrl: item.event.thumbnailUrl || item.event.imageUrl || '',
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
</script>

<main class={narrowPageShellClass}>
	<header class={spaciousPageHeaderClass}>
		<h1 class={pageTitleClass}>{APP_TITLE}</h1>
		<p class={secondaryTextClass}>{APP_SUBTITLE}</p>
	</header>

	{#if status === 'loading'}
		<p class={statusMessageClass} data-testid="home-loading">Cargando eventos...</p>
	{:else if status === 'error'}
		<p class={statusMessageClass} data-testid="home-error">No se pudo cargar el inicio.</p>
	{:else if status === 'empty'}
		<p class={statusMessageClass} data-testid="home-empty">No hay eventos disponibles por el momento.</p>
	{:else}
		<p class={summaryTextClass} data-testid="home-summary">
			Eventos: {events.length} | Ads: {ads.length}
		</p>
		<ul class={cardGridClass} data-testid="home-events-list">
			{#each feed as item}
				<li
					class={`grid gap-1 ${item.type === 'ad' ? 'rounded-lg bg-sky-50' : ''}`}
					data-testid={item.type === 'ad' ? 'home-ad-item' : undefined}
				>
					<MediaCard
						{...getCardProps(item)}
						trackingPayload={item}
						onTrack={tracker.trackFeedClick}
					/>
					{#if item.type === 'event' && item.event.photographer}
						<small class={subtleTextClass}>Foto: {item.event.photographer}</small>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</main>
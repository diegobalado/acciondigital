<script>
	import { onMount } from 'svelte';
	import { APP_SUBTITLE, APP_TITLE } from '../../app/config/migration';
	import { loadHomeContent } from './homeApi';
	import MediaCard from '../../shared/components/MediaCard.svelte';
	import { createHomeClickTracker, trackHomeClickEvent } from './homeTracking';

	export let loadHome = loadHomeContent;
	export let trackEvent = trackHomeClickEvent;
	export let createTracker = createHomeClickTracker;

	let events = [];
	let ads = [];
	let feed = [];
	let status = 'loading';
	$: tracker = createTracker({ trackEvent });

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
				href: item.event.eventUrl || '#',
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

<main class="mx-auto max-w-[960px] px-4 py-8">
	<header class="mb-5">
		<h1 class="m-0 text-[2rem] leading-tight">{APP_TITLE}</h1>
		<p class="mt-2">{APP_SUBTITLE}</p>
	</header>

	{#if status === 'loading'}
		<p class="mt-2" data-testid="home-loading">Cargando eventos...</p>
	{:else if status === 'error'}
		<p class="mt-2" data-testid="home-error">No se pudo cargar el inicio.</p>
	{:else if status === 'empty'}
		<p class="mt-2" data-testid="home-empty">No hay eventos disponibles por el momento.</p>
	{:else}
		<p class="mb-3 text-sm opacity-80" data-testid="home-summary">
			Eventos: {events.length} | Ads: {ads.length}
		</p>
		<ul class="m-0 grid list-none gap-3 p-0" data-testid="home-events-list">
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
						<small class="opacity-75">Foto: {item.event.photographer}</small>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</main>
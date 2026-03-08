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

<main class="home-shell">
	<header>
		<h1>{APP_TITLE}</h1>
		<p>{APP_SUBTITLE}</p>
	</header>

	{#if status === 'loading'}
		<p data-testid="home-loading">Cargando eventos...</p>
	{:else if status === 'error'}
		<p data-testid="home-error">No se pudo cargar el inicio.</p>
	{:else if status === 'empty'}
		<p data-testid="home-empty">No hay eventos disponibles por el momento.</p>
	{:else}
		<p class="home-summary" data-testid="home-summary">
			Eventos: {events.length} | Ads: {ads.length}
		</p>
		<ul class="home-events" data-testid="home-events-list">
			{#each feed as item}
				<li class:item-ad={item.type === 'ad'} data-testid={item.type === 'ad' ? 'home-ad-item' : undefined}>
					<MediaCard
						{...getCardProps(item)}
						trackingPayload={item}
						onTrack={tracker.trackFeedClick}
					/>
					{#if item.type === 'event' && item.event.photographer}
						<small>Foto: {item.event.photographer}</small>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</main>

<style>
	.home-shell {
		margin: 0 auto;
		max-width: 960px;
		padding: 2rem 1rem;
	}

	header {
		margin-bottom: 1.25rem;
	}

	h1 {
		margin: 0;
		font-size: 2rem;
	}

	p {
		margin: 0.5rem 0 0;
	}

	.home-events {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.75rem;
	}

	li {
		display: grid;
		gap: 0.25rem;
	}

	.home-summary {
		margin: 0 0 0.75rem;
		font-size: 0.9rem;
		opacity: 0.8;
	}

	li.item-ad {
		background: #f2f7fb;
		border-radius: 0.5rem;
	}

	small {
		opacity: 0.75;
	}
</style>
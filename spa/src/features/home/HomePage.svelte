<script>
	import { onMount } from 'svelte';
	import { APP_SUBTITLE, APP_TITLE } from '../../app/config/migration';
	import { loadHomeContent } from './homeApi';

	export let loadHome = loadHomeContent;

	let events = [];
	let ads = [];
	let feed = [];
	let status = 'loading';

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
				{#if item.type === 'event'}
					<li>
						<a href={item.event.eventUrl || '#'}>{item.event.title}</a>
						{#if item.event.photographer}
							<small>Foto: {item.event.photographer}</small>
						{/if}
					</li>
				{:else}
					<li class="home-ad" data-testid="home-ad-item">
						<a href={item.ad.href} target={item.ad.target} rel="noreferrer noopener">
							{#if item.ad.imageUrl}
								<img src={item.ad.imageUrl} alt={item.ad.name || 'Publicidad'} />
							{:else}
								Publicidad
							{/if}
						</a>
					</li>
				{/if}
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
		padding: 0.75rem;
		border: 1px solid #d7d7d7;
		border-radius: 0.5rem;
		display: grid;
		gap: 0.25rem;
	}

	.home-summary {
		margin: 0 0 0.75rem;
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.home-ad {
		background: #f2f7fb;
	}

	.home-ad img {
		display: block;
		max-width: 100%;
		height: auto;
	}

	a {
		color: #0d4a84;
		font-weight: 600;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	small {
		opacity: 0.75;
	}
</style>
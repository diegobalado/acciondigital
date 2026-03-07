<script>
	import { onMount } from 'svelte';
	import { APP_SUBTITLE, APP_TITLE } from '../../app/config/migration';
	import { loadHomeEvents } from './homeApi';

	export let loadEvents = loadHomeEvents;

	let events = [];
	let status = 'loading';

	onMount(async () => {
		try {
			events = await loadEvents();
			status = events.length > 0 ? 'ready' : 'empty';
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
		<ul class="home-events" data-testid="home-events-list">
			{#each events as event}
				<li>
					<a href={event.eventUrl || '#'}>{event.title}</a>
					{#if event.photographer}
						<small>Foto: {event.photographer}</small>
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
		padding: 0.75rem;
		border: 1px solid #d7d7d7;
		border-radius: 0.5rem;
		display: grid;
		gap: 0.25rem;
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
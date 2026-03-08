<script>
	import { onMount } from 'svelte';
	import { APP_TITLE } from '../../app/config/migration';
	import MediaCard from '../../shared/components/MediaCard.svelte';
	import { loadEventsCatalog } from './eventsApi';

	export let loadEvents = loadEventsCatalog;

	let status = 'loading';
	let events = [];
	let pagination = {
		page: 1,
		pageSize: 12,
		totalItems: 0,
		totalPages: 1,
		hasPreviousPage: false,
		hasNextPage: false
	};

	async function requestPage(page) {
		status = 'loading';
		try {
			const result = await loadEvents({ page });
			events = result.events;
			pagination = result.pagination;
			status = events.length > 0 ? 'ready' : 'empty';
		} catch {
			status = 'error';
		}
	}

	onMount(async () => {
		await requestPage(1);
	});
</script>

<main class="events-shell">
	<header>
		<h1>{APP_TITLE}</h1>
		<h2>Eventos</h2>
	</header>

	{#if status === 'loading'}
		<p data-testid="events-loading">Cargando catalogo de eventos...</p>
	{:else if status === 'error'}
		<p data-testid="events-error">No se pudo cargar el catalogo de eventos.</p>
	{:else if status === 'empty'}
		<p data-testid="events-empty">No hay eventos disponibles por el momento.</p>
	{:else}
		<p class="events-summary" data-testid="events-summary">
			Pagina {pagination.page} de {pagination.totalPages} | Total: {pagination.totalItems}
		</p>
		<ul class="events-grid" data-testid="events-list">
			{#each events as event}
				<li>
					<MediaCard
						variant="event"
						href={event.eventUrl || '#'}
						title={event.title}
						label={event.title}
						imageUrl={event.coverImageUrl}
						target="_self"
					/>
				</li>
			{/each}
		</ul>
		<nav class="events-pagination" aria-label="Paginacion de eventos">
			<button
				type="button"
				on:click={() => requestPage(pagination.page - 1)}
				disabled={!pagination.hasPreviousPage}
			>
				Anterior
			</button>
			<button
				type="button"
				on:click={() => requestPage(pagination.page + 1)}
				disabled={!pagination.hasNextPage}
			>
				Siguiente
			</button>
		</nav>
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

	.events-pagination {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.events-pagination button {
		padding: 0.5rem 0.75rem;
		border: 1px solid #b8b8b8;
		border-radius: 0.4rem;
		background: #fff;
		cursor: pointer;
	}

	.events-pagination button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
</style>

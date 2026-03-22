<script>
	import { onMount } from 'svelte';
	import { loadAmigosContent } from './amigosApi';
	import PageLayout from '../../shared/components/PageLayout.svelte';
	import {
		cardGridClass,
		statusMessageClass,
		summaryTextClass
	} from '../../shared/ui/classes';

	export let loadAmigos = loadAmigosContent;

	let amigos = [];
	let status = 'loading';

	onMount(async () => {
		try {
			const result = await loadAmigos();
			amigos = result.amigos;
			status = amigos.length > 0 ? 'ready' : 'empty';
		} catch {
			status = 'error';
		}
	});
</script>

<PageLayout title="Paginas Amigas" subtitle="Proyectos y marcas vinculadas a Accion Digital.">

	{#if status === 'loading'}
		<p class={statusMessageClass} data-testid="amigos-loading">Cargando paginas amigas...</p>
	{:else if status === 'error'}
		<p class={statusMessageClass} data-testid="amigos-error">No se pudo cargar la seccion de amigos.</p>
	{:else if status === 'empty'}
		<p class={statusMessageClass} data-testid="amigos-empty">No hay paginas amigas disponibles.</p>
	{:else}
		<p class={summaryTextClass} data-testid="amigos-summary">Paginas: {amigos.length}</p>
		<ul class={cardGridClass} data-testid="amigos-list">
			{#each amigos as amigo}
				<li class="grid gap-2 rounded-lg border border-zinc-200 bg-white p-3">
					<a
						href={amigo.websiteUrl}
						target={amigo.target}
						rel={amigo.target === '_blank' ? 'noreferrer noopener' : undefined}
						class="block overflow-hidden rounded-md border border-zinc-200"
					>
						{#if amigo.imageUrl}
							<img class="block aspect-[4/3] w-full object-cover" src={amigo.imageUrl} alt={amigo.name} loading="lazy" />
						{/if}
					</a>
					<div class="grid gap-1">
						<h2 class="m-0 text-lg font-semibold">{amigo.name}</h2>
						{#if amigo.subtitle}
							<p class="m-0 text-sm text-zinc-700">{amigo.subtitle}</p>
						{/if}
						{#if amigo.location}
							<p class="m-0 text-sm text-zinc-600">{amigo.location}</p>
						{/if}
						<div class="mt-1 grid gap-1 text-sm">
							<a href={amigo.websiteUrl} target={amigo.target} rel={amigo.target === '_blank' ? 'noreferrer noopener' : undefined}>
								{amigo.websiteUrl}
							</a>
							{#if amigo.emailUrl}
								<a href={amigo.emailUrl}>{amigo.email}</a>
							{/if}
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</PageLayout>

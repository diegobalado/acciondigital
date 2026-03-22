<script>
	import { onMount } from 'svelte';
	import { loadFaqContent } from './faqApi';
	import {
		narrowPageShellClass,
		pageTitleClass,
		secondaryTextClass,
		spaciousPageHeaderClass,
		statusMessageClass,
		summaryTextClass
	} from '../../shared/ui/classes';

	export let loadFaq = loadFaqContent;

	let faqItems = [];
	let status = 'loading';
	let openItemId = '';

	onMount(async () => {
		try {
			const result = await loadFaq();
			faqItems = result.faqItems;
			status = faqItems.length > 0 ? 'ready' : 'empty';
		} catch {
			status = 'error';
		}
	});

	function toggleItem(id) {
		openItemId = openItemId === id ? '' : id;
	}
</script>

<main class={narrowPageShellClass}>
	<header class={spaciousPageHeaderClass}>
		<h1 class={pageTitleClass}>Preguntas Frecuentes</h1>
		<p class={secondaryTextClass}>Guia rapida para buscar, comprar y recibir tus fotos.</p>
	</header>

	{#if status === 'loading'}
		<p class={statusMessageClass} data-testid="faq-loading">Cargando preguntas frecuentes...</p>
	{:else if status === 'error'}
		<p class={statusMessageClass} data-testid="faq-error">No se pudo cargar la seccion de ayuda.</p>
	{:else if status === 'empty'}
		<p class={statusMessageClass} data-testid="faq-empty">No hay preguntas frecuentes disponibles.</p>
	{:else}
		<p class={summaryTextClass} data-testid="faq-summary">Preguntas: {faqItems.length}</p>
		<ul class="m-0 grid list-none gap-3 p-0" data-testid="faq-list">
			{#each faqItems as item}
				<li class="rounded-lg border border-zinc-200 bg-white p-3">
					<button
						type="button"
						class="w-full cursor-pointer border-0 bg-transparent p-0 text-left text-base font-semibold"
						on:click={() => toggleItem(item.id)}
						aria-expanded={openItemId === item.id}
						data-testid={`faq-toggle-${item.id}`}
					>
						{item.question}
					</button>
					{#if openItemId === item.id}
						<p class="m-0 mt-2 text-sm text-zinc-700" data-testid={`faq-answer-${item.id}`}>{item.answer}</p>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</main>

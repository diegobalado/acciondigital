<script>
	import PageLayout from './PageLayout.svelte';
</script>

<PageLayout>
	<svelte:fragment slot="header">
		<h1>Header custom</h1>
	</svelte:fragment>
	<section data-testid="layout-content">Contenido</section>
</PageLayout>

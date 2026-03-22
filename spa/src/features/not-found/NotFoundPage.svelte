<script>
	import PageLayout from '../../shared/components/PageLayout.svelte';

	export let returnHref = '/';
	export let returnLabel = 'Volver al inicio';
</script>

<PageLayout title="Pagina no encontrada" subtitle="La ruta solicitada no existe en esta SPA.">
	<section class="grid gap-3" data-testid="not-found-content">
		<p class="m-0 text-sm opacity-80">
			Revisa la direccion o utiliza la navegacion principal para volver a una seccion valida.
		</p>
		<a class="btn btn-ghost btn-sm w-fit" href={returnHref} data-testid="not-found-return-link">{returnLabel}</a>
	</section>
</PageLayout>

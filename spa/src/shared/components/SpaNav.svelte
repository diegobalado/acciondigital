<script>
	import { buildNavHref, isNavItemActive, SPA_NAV_ITEMS } from '../../app/routing/navigation';

	export let currentRoute = '';
	export let currentSearch = '';
</script>

<nav class="border-b border-base-300 bg-base-100/90 backdrop-blur" aria-label="Navegacion principal" data-testid="spa-nav">
	<div class="mx-auto flex max-w-[1120px] flex-wrap items-center gap-2 px-4 py-3">
		<a class="mr-2 text-sm font-bold uppercase tracking-wide text-sky-700" href={buildNavHref('/', currentSearch)}>
			Accion Digital
		</a>
		<ul class="m-0 flex list-none flex-wrap items-center gap-1 p-0" data-testid="spa-nav-list">
			{#each SPA_NAV_ITEMS as item (item.id)}
				<li>
					<a
						href={buildNavHref(item.href, currentSearch)}
						class={`btn btn-ghost btn-sm ${isNavItemActive(item, currentRoute) ? 'btn-active' : ''}`}
						aria-current={isNavItemActive(item, currentRoute) ? 'page' : undefined}
						data-testid={`spa-nav-link-${item.id}`}
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</nav>

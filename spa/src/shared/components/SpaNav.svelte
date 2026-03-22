<script>
	import { cartItemsStore, cartTotalsStore } from '../../services/cartStore';
	import { buildNavHref, isNavItemActive, SPA_NAV_ITEMS } from '../../app/routing/navigation';

	export let currentRoute = '';
	export let currentSearch = '';

	let isCartPopupOpen = false;

	function toggleCartPopup() {
		isCartPopupOpen = !isCartPopupOpen;
	}

	function closeCartPopup() {
		isCartPopupOpen = false;
	}
</script>

<a href="#spa-main-content" class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-base-100 focus:px-3 focus:py-2">Saltar al contenido principal</a>

<nav class="border-b border-base-300 bg-base-100/90 backdrop-blur" aria-label="Navegacion principal" data-testid="spa-nav">
	<div class="mx-auto flex max-w-[1120px] flex-wrap items-center gap-2 px-4 py-3">
		<a
			class="mr-2 text-sm font-bold uppercase tracking-wide text-sky-700"
			href={buildNavHref('/', currentSearch)}
			aria-label="Accion Digital, ir al inicio"
		>
			Accion Digital
		</a>
		<ul class="m-0 flex list-none flex-wrap items-center gap-1 p-0" data-testid="spa-nav-list">
			{#each SPA_NAV_ITEMS as item (item.id)}
				<li>
					{#if item.id === 'carrito'}
						<button
							type="button"
							class={`btn btn-ghost btn-sm ${isNavItemActive(item, currentRoute) ? 'btn-active' : ''}`}
							on:click={toggleCartPopup}
							aria-expanded={isCartPopupOpen}
							aria-controls="spa-cart-popup"
							data-testid="spa-nav-cart-toggle"
						>
							Carrito ({$cartTotalsStore.totalQuantity})
						</button>
					{:else}
						<a
							href={buildNavHref(item.href, currentSearch)}
							class={`btn btn-ghost btn-sm ${isNavItemActive(item, currentRoute) ? 'btn-active' : ''}`}
							aria-current={isNavItemActive(item, currentRoute) ? 'page' : undefined}
							data-testid={`spa-nav-link-${item.id}`}
						>
							{item.label}
						</a>
					{/if}
				</li>
			{/each}
		</ul>

		{#if isCartPopupOpen}
			<div
				id="spa-cart-popup"
				class="card card-compact border border-base-300 bg-base-100 p-3 shadow-lg"
				role="dialog"
				aria-label="Resumen del carrito"
				data-testid="spa-nav-cart-popup"
			>
				<p class="m-0 text-sm" data-testid="spa-nav-cart-summary">
					Items: {$cartTotalsStore.totalQuantity} | Total: ${$cartTotalsStore.totalPrice}
				</p>
				{#if $cartItemsStore.length === 0}
					<p class="m-0 mt-2 text-sm opacity-70" data-testid="spa-nav-cart-empty">Tu carrito esta vacio.</p>
				{:else}
					<ul class="m-0 mt-2 grid max-h-36 list-none gap-1 overflow-auto p-0" data-testid="spa-nav-cart-list">
						{#each $cartItemsStore.slice(0, 3) as item (item.id + '-' + item.event)}
							<li class="text-sm" data-testid="spa-nav-cart-item">
								<strong>{item.name}</strong>
								<span class="ml-1 opacity-70">x{item.quantity}</span>
							</li>
						{/each}
					</ul>
				{/if}
				<div class="mt-2 flex gap-2">
					<a
						class="btn btn-ghost btn-xs"
						href={buildNavHref('/carrito/', currentSearch)}
						on:click={closeCartPopup}
						data-testid="spa-nav-open-cart-page"
					>
						Ver carrito completo
					</a>
					<button class="btn btn-ghost btn-xs" type="button" on:click={closeCartPopup} data-testid="spa-nav-close-cart-popup">
						Cerrar
					</button>
				</div>
			</div>
		{/if}
	</div>
</nav>

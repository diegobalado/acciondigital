<script>
	import PageLayout from '../../shared/components/PageLayout.svelte';
	import {
		actionButtonClass,
		cartItemClass,
		compactButtonClass,
		errorTextClass,
		summaryTextClass
	} from '../../shared/ui/classes';
	import {
		cartItemsStore,
		cartTotalsStore,
		clearCart,
		removeItemFromCart,
		submitCartCheckout,
		updateItemQuantityInCart
	} from '../../services/cartStore';

	export let submitCheckout = null;
	export let createCheckoutPayload = null;

	let checkoutError = '';
	let isCheckoutPending = false;

	async function handleCheckout() {
		if ($cartItemsStore.length === 0 || isCheckoutPending) {
			return;
		}

		checkoutError = '';
		isCheckoutPending = true;
		try {
			await submitCartCheckout({
				submitPayload: submitCheckout || undefined,
				createPayload: createCheckoutPayload || undefined
			});
		} catch {
			checkoutError = 'No se pudo iniciar el checkout. Intenta nuevamente.';
		} finally {
			isCheckoutPending = false;
		}
	}

	function removeItem(item) {
		removeItemFromCart({ id: item.id, event: item.event });
	}

	function changeQuantity(item, value) {
		updateItemQuantityInCart({ id: item.id, event: item.event }, value);
	}
</script>

<PageLayout title="Carrito" subtitle="Revisa y ajusta tus fotos antes de finalizar la compra.">
	<p class={summaryTextClass} data-testid="cart-page-summary">
		Items: {$cartTotalsStore.totalQuantity} | Subtotal: ${$cartTotalsStore.subtotal} | Total: ${$cartTotalsStore.totalPrice}
	</p>

	{#if $cartItemsStore.length === 0}
		<div class="alert" data-testid="cart-page-empty">Tu carrito esta vacio.</div>
	{:else}
		<ul class="m-0 grid list-none gap-2 p-0" data-testid="cart-page-list">
			{#each $cartItemsStore as item (item.id + '-' + item.event)}
				<li class={cartItemClass} data-testid="cart-page-item">
					<strong>{item.name}</strong>
					<p class="m-0 text-sm opacity-70">{item.summary}</p>
					<div class="mt-2 flex items-center gap-2">
						<label>
							Cantidad
							<input
								class="input input-bordered input-xs ml-1 w-16"
								type="number"
								min="1"
								value={item.quantity}
								on:change={(event) => changeQuantity(item, event.currentTarget.value)}
								data-testid="cart-page-quantity"
							/>
						</label>
						<button
							class={compactButtonClass}
							type="button"
							on:click={() => removeItem(item)}
							data-testid="cart-page-remove"
						>
							Quitar
						</button>
					</div>
				</li>
			{/each}
		</ul>
	{/if}

	<div class="mt-3 flex flex-wrap items-center gap-2">
		<button
			class={actionButtonClass}
			type="button"
			disabled={$cartItemsStore.length === 0 || isCheckoutPending}
			on:click={handleCheckout}
			data-testid="cart-page-checkout"
		>
			{isCheckoutPending ? 'Procesando...' : 'Ir al checkout'}
		</button>
		<button
			class={compactButtonClass}
			type="button"
			disabled={$cartItemsStore.length === 0 || isCheckoutPending}
			on:click={clearCart}
			data-testid="cart-page-clear"
		>
			Vaciar carrito
		</button>
		{#if checkoutError}
			<span class={errorTextClass} data-testid="cart-page-error">{checkoutError}</span>
		{/if}
	</div>
</PageLayout>

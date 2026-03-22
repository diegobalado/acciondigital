<script>
	import HomePage from './features/home/HomePage.svelte';
	import EventsPage from './features/events/EventsPage.svelte';
	import EventGalleryPage from './features/events/EventGalleryPage.svelte';
	import CartPage from './features/cart/CartPage.svelte';
	import AmigosPage from './features/amigos/AmigosPage.svelte';
	import FaqPage from './features/faq/FaqPage.svelte';
	import ContactoPage from './features/contacto/ContactoPage.svelte';
	import NotFoundPage from './features/not-found/NotFoundPage.svelte';
	import SpaNav from './shared/components/SpaNav.svelte';
	import { APP_ROUTES, resolveAppRouteFromWindow } from './app/routing/routes';
	import { buildNavHref } from './app/routing/navigation';

	const route = resolveAppRouteFromWindow();
	const currentSearch = typeof window !== 'undefined' ? window.location.search || '' : '';
	const notFoundReturnHref = buildNavHref('/', currentSearch);
</script>

	<SpaNav currentRoute={route} {currentSearch} />

	<div id="spa-main-content" tabindex="-1">
		{#if route === APP_ROUTES.EVENT_GALLERY}
			<EventGalleryPage />
		{:else if route === APP_ROUTES.EVENTS}
			<EventsPage />
		{:else if route === APP_ROUTES.AMIGOS}
			<AmigosPage />
		{:else if route === APP_ROUTES.CART}
			<CartPage />
		{:else if route === APP_ROUTES.FAQ}
			<FaqPage />
		{:else if route === APP_ROUTES.CONTACTO}
			<ContactoPage />
		{:else if route === APP_ROUTES.HOME}
			<HomePage />
		{:else}
			<NotFoundPage returnHref={notFoundReturnHref} />
		{/if}
	</div>

<script>
	import HomePage from './features/home/HomePage.svelte';
	import EventsPage from './features/events/EventsPage.svelte';
	import EventGalleryPage from './features/events/EventGalleryPage.svelte';
	import AmigosPage from './features/amigos/AmigosPage.svelte';
	import FaqPage from './features/faq/FaqPage.svelte';
	import ContactoPage from './features/contacto/ContactoPage.svelte';
	import SpaNav from './shared/components/SpaNav.svelte';
	import { APP_ROUTES, resolveAppRouteFromWindow } from './app/routing/routes';

	const route = resolveAppRouteFromWindow();
	const currentSearch = typeof window !== 'undefined' ? window.location.search || '' : '';
</script>

	<SpaNav currentRoute={route} {currentSearch} />

	{#if route === APP_ROUTES.EVENT_GALLERY}
		<EventGalleryPage />
	{:else if route === APP_ROUTES.EVENTS}
		<EventsPage />
	{:else if route === APP_ROUTES.AMIGOS}
		<AmigosPage />
	{:else if route === APP_ROUTES.FAQ}
		<FaqPage />
	{:else if route === APP_ROUTES.CONTACTO}
		<ContactoPage />
{:else}
	<HomePage />
{/if}

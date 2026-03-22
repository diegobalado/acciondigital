<script>
	import HomePage from './features/home/HomePage.svelte';
	import EventsPage from './features/events/EventsPage.svelte';
	import EventGalleryPage from './features/events/EventGalleryPage.svelte';
	import AmigosPage from './features/amigos/AmigosPage.svelte';
	import FaqPage from './features/faq/FaqPage.svelte';
	import ContactoPage from './features/contacto/ContactoPage.svelte';

	const routePath = typeof window !== 'undefined' ? window.location.pathname : '/';
	const isEventsRoute = routePath === '/eventos' || routePath === '/eventos/';
	const isAmigosRoute = routePath === '/amigos' || routePath === '/amigos/';
	const isFaqRoute = routePath === '/faq' || routePath === '/faq/';
	const isContactoRoute = routePath === '/contacto' || routePath === '/contacto/';
	const routeSearch = typeof window !== 'undefined' ? window.location.search : '';
	const routeParams = new URLSearchParams(routeSearch);
	const hasSelectedEvent = routeParams.has('g') || routeParams.has('id');
</script>

{#if isEventsRoute}
	{#if hasSelectedEvent}
		<EventGalleryPage />
	{:else}
		<EventsPage />
	{/if}
{:else if isAmigosRoute}
	<AmigosPage />
{:else if isFaqRoute}
	<FaqPage />
{:else if isContactoRoute}
	<ContactoPage />
{:else}
	<HomePage />
{/if}

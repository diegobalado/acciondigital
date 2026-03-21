<script>
	import HomePage from './features/home/HomePage.svelte';
	import EventsPage from './features/events/EventsPage.svelte';
	import EventGalleryPage from './features/events/EventGalleryPage.svelte';
	import AmigosPage from './features/amigos/AmigosPage.svelte';

	const routePath = typeof window !== 'undefined' ? window.location.pathname : '/';
	const isEventsRoute = routePath === '/eventos' || routePath === '/eventos/';
	const isAmigosRoute = routePath === '/amigos' || routePath === '/amigos/';
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
{:else}
	<HomePage />
{/if}

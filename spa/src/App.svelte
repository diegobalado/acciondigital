<script>
	import HomePage from './features/home/HomePage.svelte';
	import EventsPage from './features/events/EventsPage.svelte';
	import EventGalleryPage from './features/events/EventGalleryPage.svelte';

	const routePath = typeof window !== 'undefined' ? window.location.pathname : '/';
	const isEventsRoute = routePath === '/eventos' || routePath === '/eventos/';
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
{:else}
	<HomePage />
{/if}

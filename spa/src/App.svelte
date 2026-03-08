<script>
	import HomePage from './features/home/HomePage.svelte';
	import EventsPage from './features/events/EventsPage.svelte';

	const routePath = typeof window !== 'undefined' ? window.location.pathname : '/';
	const isEventsRoute = routePath === '/eventos' || routePath === '/eventos/';
</script>

{#if isEventsRoute}
	<EventsPage />
{:else}
	<HomePage />
{/if}

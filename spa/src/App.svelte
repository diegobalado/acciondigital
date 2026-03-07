<script>
	import { APP_SUBTITLE, APP_TITLE } from './shared/migration';
</script>

<main class="shell">
	<h1>{APP_TITLE}</h1>
	<p>{APP_SUBTITLE}</p>
</main>

<style>
	.shell {
		min-height: 100vh;
		display: grid;
		place-content: center;
		gap: 0.75rem;
		text-align: center;
	}

	h1 {
		margin: 0;
		font-size: 2rem;
	}

	p {
		margin: 0;
		opacity: 0.75;
	}
</style>

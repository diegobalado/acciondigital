<script>
	export let variant = 'event';
	export let href = '#';
	export let title = '';
	export let label = '';
	export let imageUrl = '';
	export let target = '_self';
	export let trackingPayload = null;
	export let onTrack = () => {};

	function handleClick() {
		onTrack(trackingPayload);
	}
</script>

<article class={`media-card media-card--${variant}`} data-testid="media-card">
	<a
		class="media-card-link"
		href={href || '#'}
		target={target}
		rel={target === '_blank' ? 'noreferrer noopener' : undefined}
		on:click={handleClick}
	>
		{#if imageUrl}
			<img class="media-card-image" src={imageUrl} alt="" loading="lazy" />
		{/if}
		{#if label}
			<span class="media-card-label">{label}</span>
		{/if}
		{#if !label && title}
			<span class="media-card-label">{title}</span>
		{/if}
	</a>
</article>

<style>
	.media-card {
		border: 1px solid #d7d7d7;
		border-radius: 0.5rem;
		overflow: hidden;
		background: #fff;
	}

	.media-card--ad {
		background: #f2f7fb;
	}

	.media-card-link {
		display: block;
		text-decoration: none;
		color: inherit;
	}

	.media-card-image {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	.media-card-label {
		display: block;
		padding: 0.75rem;
		font-weight: 600;
		font-size: 0.95rem;
		color: #0d4a84;
	}
</style>

<script>
	export let variant = 'event';
	export let href = '#';
	export let title = '';
	export let label = '';
	export let imageUrl = '';
	export let target = '_self';
	export let trackingPayload = null;
	export let onTrack = (_payload) => {};
	$: mediaCardClass =
		variant === 'ad'
			? 'overflow-hidden rounded-lg border border-zinc-300 bg-sky-50'
			: 'overflow-hidden rounded-lg border border-zinc-300 bg-white';
	const mediaCardLinkClass = 'block text-inherit no-underline';
	const mediaCardImageClass = 'block aspect-[4/3] w-full object-cover';
	const mediaCardLabelClass = 'block p-3 text-[0.95rem] font-semibold text-sky-900';

	function handleClick() {
		onTrack(trackingPayload);
	}
</script>

<article class={mediaCardClass} data-testid="media-card">
	<a
		class={mediaCardLinkClass}
		href={href || '#'}
		target={target}
		rel={target === '_blank' ? 'noreferrer noopener' : undefined}
		on:click={handleClick}
	>
		{#if imageUrl}
			<img class={mediaCardImageClass} src={imageUrl} alt="" loading="lazy" />
		{/if}
		{#if label}
			<span class={mediaCardLabelClass}>{label}</span>
		{/if}
		{#if !label && title}
			<span class={mediaCardLabelClass}>{title}</span>
		{/if}
	</a>
</article>

<script>
	import {
		narrowPageShellClass,
		pageHeaderClass,
		pageTitleClass,
		secondaryTextClass,
		spaciousPageHeaderClass,
		widePageShellClass
	} from '../ui/classes';

	export let shell = 'narrow';
	export let title = '';
	export let subtitle = '';
	export let headerVariant = 'spacious';

	$: shellClass = shell === 'wide' ? widePageShellClass : narrowPageShellClass;
	$: headerClass = headerVariant === 'compact' ? pageHeaderClass : spaciousPageHeaderClass;
</script>

<main class={shellClass}>
	{#if $$slots.header}
		<header class={headerClass}>
			<slot name="header" />
		</header>
	{:else if title}
		<header class={headerClass}>
			<h1 class={pageTitleClass}>{title}</h1>
			{#if subtitle}
				<p class={secondaryTextClass}>{subtitle}</p>
			{/if}
		</header>
	{/if}

	<slot />
</main>

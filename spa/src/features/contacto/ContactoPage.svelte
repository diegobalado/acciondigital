<script>
	import { onMount } from 'svelte';
	import { loadContactoContent } from './contactoApi';
	import {
		narrowPageShellClass,
		pageTitleClass,
		secondaryTextClass,
		spaciousPageHeaderClass,
		statusMessageClass
	} from '../../shared/ui/classes';

	export let loadContacto = loadContactoContent;

	let contacto = null;
	let status = 'loading';

	onMount(async () => {
		try {
			const result = await loadContacto();
			contacto = result.contacto;
			status = contacto ? 'ready' : 'empty';
		} catch {
			status = 'error';
		}
	});
</script>

<main class={narrowPageShellClass}>
	<header class={spaciousPageHeaderClass}>
		<h1 class={pageTitleClass}>Contacto</h1>
		<p class={secondaryTextClass}>Canales de contacto y formulario del sitio legacy.</p>
	</header>

	{#if status === 'loading'}
		<p class={statusMessageClass} data-testid="contacto-loading">Cargando informacion de contacto...</p>
	{:else if status === 'error'}
		<p class={statusMessageClass} data-testid="contacto-error">No se pudo cargar la seccion de contacto.</p>
	{:else if status === 'empty' || !contacto}
		<p class={statusMessageClass} data-testid="contacto-empty">No hay informacion de contacto disponible.</p>
	{:else}
		<section class="grid gap-4 md:grid-cols-2" data-testid="contacto-content">
			<article class="rounded-lg border border-zinc-200 bg-white p-4">
				<h2 class="m-0 text-lg font-semibold">{contacto.aboutTitle}</h2>
				<p class="mb-1 mt-2 text-sm text-zinc-700">{contacto.aboutDescription}</p>
				<p class="m-0 text-sm font-medium">{contacto.contactName}</p>
				<p class="m-0 mt-1 text-sm text-zinc-600">Telefono: {contacto.phone}</p>

				{#if contacto.socialLinks.length > 0}
					<h3 class="mb-1 mt-3 text-sm font-semibold uppercase tracking-wide text-zinc-600">Seguinos</h3>
					<ul class="m-0 grid list-none gap-1 p-0 text-sm">
						{#each contacto.socialLinks as link}
							<li>
								<a
									href={link.url}
									target={link.target}
									rel={link.target === '_blank' ? 'noreferrer noopener' : undefined}
									data-testid={`contacto-social-${link.id}`}
								>
									{link.name}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</article>

			<article class="rounded-lg border border-zinc-200 bg-white p-4">
				<h2 class="m-0 text-lg font-semibold">{contacto.contactTitle}</h2>
				<p class="mb-3 mt-2 text-sm text-zinc-700">
					Este formulario envia al endpoint legacy para mantener compatibilidad durante la migracion.
				</p>
				<form class="grid gap-2" action={contacto.formAction} method="post">
					<label class="grid gap-1 text-sm">
						<span>Nombre</span>
						<input class="input input-bordered" name="name" type="text" placeholder="Nombre" />
					</label>
					<label class="grid gap-1 text-sm">
						<span>Email</span>
						<input class="input input-bordered" name="email" type="email" placeholder="Email" required />
					</label>
					<label class="grid gap-1 text-sm">
						<span>Mensaje</span>
						<textarea class="textarea textarea-bordered" name="message" rows="5" placeholder="Mensaje"></textarea>
					</label>
					<button class="btn btn-ghost btn-sm w-fit" type="submit">Enviar</button>
				</form>
			</article>
		</section>
	{/if}
</main>

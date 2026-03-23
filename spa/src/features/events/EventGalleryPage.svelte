<script>
	import { onMount, tick } from 'svelte';
	import { ChevronLeft, ChevronRight, ChevronUp, X } from 'lucide-svelte';
	import { APP_TITLE } from '../../app/config/migration';
	import PageLayout from '../../shared/components/PageLayout.svelte';
	import {
		addItemToCart,
		cartItemsStore,
		cartTotalsStore,
	} from '../../services/cartStore';
	import { EVENT_GALLERY_PAGE_SIZE, loadEventGallery } from './eventGalleryApi';
	import {
		actionButtonClass,
		buttonClass,
		compactButtonClass,
		fieldLabelClass,
		formStackClass,
		pageSubtitleClass,
		pageTitleClass,
		photoCardClass,
		secondaryTextClass,
		statusMessageClass,
		subtleTextClass,
		summaryTextClass,
		textInputClass
	} from '../../shared/ui/classes';

	/** @type {any} */
	export let loadGallery = null;
	export let pageSize = EVENT_GALLERY_PAGE_SIZE;

	let status = 'loading';
	let eventData = null;
	let photos = [];
	let galleryQuery = '';
	let activeQuery = '';
	let isLoadingMore = false;
	let selectedPhotoIndex = -1;
	let lightboxElement = null;
	let isBackToTopVisible = false;
	let progressive = { nextPage: null, canLoadMore: false };
	let pagination = { page: 1, pageSize, totalItems: 0, totalPages: 1, hasPreviousPage: false, hasNextPage: false };
	$: selectedPhoto = selectedPhotoIndex >= 0 && selectedPhotoIndex < photos.length ? photos[selectedPhotoIndex] : null;
	$: gallerySummary = activeQuery
		? `Fotos filtradas por "${activeQuery}": ${pagination.totalItems}`
		: `Fotos: ${pagination.totalItems}`;
	$: if (selectedPhotoIndex >= photos.length) {
		selectedPhotoIndex = -1;
	}
	$: loadMoreLabel = isLoadingMore ? 'Cargando mas fotos...' : 'Desplazate para cargar mas fotos';

	function isPhotoAlreadyInCart(photo) {
		if (!photo) {
			return false;
		}

		return $cartItemsStore.some((item) => item.id === photo.id && item.event === (eventData?.id || getSelectedEventId()));
	}

	function getLocationSearch() {
		if (typeof window === 'undefined') {
			return '';
		}

		return window.location.search || '';
	}

	function getSelectedEventId() {
		if (typeof window === 'undefined') {
			return '';
		}

		const params = new URLSearchParams(window.location.search || '');
		return String(params.get('g') || params.get('id') || '').trim();
	}

	async function requestGallery(page = 1, append = false) {
		const galleryFn = loadGallery || loadEventGallery;
		const eventId = getSelectedEventId();

		if (!eventId) {
			status = 'empty';
			photos = [];
			eventData = null;
			return;
		}

		if (append) {
			if (isLoadingMore) {
				return;
			}
			isLoadingMore = true;
		} else {
			status = 'loading';
		}

		try {
			const result = await galleryFn({
				eventId,
				page,
				pageSize,
				query: activeQuery,
				search: getLocationSearch()
			});

			eventData = result.event;
			photos = append ? [...photos, ...result.photos] : result.photos;
			pagination = result.pagination;
			progressive = result.progressive;
			status = photos.length > 0 || result.photos.length > 0 || result.event ? 'ready' : 'empty';
		} catch {
			status = 'error';
		} finally {
			if (append) {
				isLoadingMore = false;
			}
		}
	}

	function toCartItem(photo) {
		return {
			id: photo.id,
			name: eventData?.title || 'Evento',
			summary: `foto_${photo.code}`,
			price: eventData?.price || 0,
			quantity: 1,
			image: photo.thumbnailUrl,
			event: eventData?.id || getSelectedEventId(),
			ph: eventData?.ph || '',
			type: 'Galeria'
		};
	}

	function addPhotoToCart(photo) {
		if (isPhotoAlreadyInCart(photo)) {
			return;
		}

		addItemToCart(toCartItem(photo));
	}

	async function openLightboxAt(index) {
		selectedPhotoIndex = index;
		await tick();
		lightboxElement?.focus();
	}

	function closeLightbox() {
		selectedPhotoIndex = -1;
	}

	function showPreviousPhoto() {
		if (!photos.length || selectedPhotoIndex < 0) {
			return;
		}

		selectedPhotoIndex = (selectedPhotoIndex - 1 + photos.length) % photos.length;
	}

	function showNextPhoto() {
		if (!photos.length || selectedPhotoIndex < 0) {
			return;
		}

		selectedPhotoIndex = (selectedPhotoIndex + 1) % photos.length;
	}

	function handleLightboxBackdropClick(event) {
		if (event.target === event.currentTarget) {
			closeLightbox();
		}
	}

	function handleLightboxKeydown(event) {
		if (!selectedPhoto) {
			return;
		}

		if (event.key === 'Escape') {
			closeLightbox();
			return;
		}

		if (event.key === 'ArrowLeft') {
			showPreviousPhoto();
			return;
		}

		if (event.key === 'ArrowRight') {
			showNextPhoto();
		}
	}

	function handleWindowScroll() {
		if (typeof window === 'undefined') {
			return;
		}

		isBackToTopVisible = window.scrollY > 720;
	}

	function scrollToTop() {
		if (typeof window === 'undefined') {
			return;
		}

		window.scrollTo({ top: 0, behavior: 'smooth' });
	}


	async function handleGallerySearch() {
		activeQuery = galleryQuery.trim();
		await requestGallery(1, false);
	}

	async function clearGallerySearch() {
		galleryQuery = '';
		activeQuery = '';
		await requestGallery(1, false);
	}

	async function loadMore() {
		if (!progressive.canLoadMore || !progressive.nextPage) {
			return;
		}

		await requestGallery(progressive.nextPage, true);
	}

	function onInfiniteScrollSentinel(node) {
		if (typeof IntersectionObserver !== 'function') {
			return {};
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const hasIntersectingEntry = entries.some((entry) => entry.isIntersecting);
				if (hasIntersectingEntry) {
					void loadMore();
				}
			},
			{ rootMargin: '220px 0px' }
		);

		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	onMount(async () => {
		await requestGallery(1, false);
		handleWindowScroll();
	});
</script>

<svelte:window on:scroll={handleWindowScroll} />

<PageLayout shell="wide" headerVariant="compact">
	<svelte:fragment slot="header">
		<h1 class={pageTitleClass}>{APP_TITLE}</h1>
		<h2 class={pageSubtitleClass}>{eventData?.title || 'Galeria del evento'}</h2>
		{#if eventData?.ph}
			<p class={secondaryTextClass}>Fotografo/a: {eventData.ph}</p>
		{/if}
	</svelte:fragment>

	<form class={formStackClass} on:submit|preventDefault={handleGallerySearch} data-testid="gallery-search-form">
		<label class={fieldLabelClass} for="gallery-search-input">Buscar foto por bib/numero</label>
		<div class="flex flex-wrap gap-2">
			<input
				class={textInputClass}
				id="gallery-search-input"
				type="search"
				bind:value={galleryQuery}
				placeholder="Ej: 145 o sin clasificar"
				data-testid="gallery-search-input"
			/>
			<button class={buttonClass} type="submit" data-testid="gallery-search-submit">Buscar</button>
			{#if activeQuery}
				<button class={buttonClass} type="button" on:click={clearGallerySearch} data-testid="gallery-search-clear">Limpiar</button>
			{/if}
		</div>
	</form>

	{#if status === 'loading'}
		<div class="mt-8 flex justify-center" data-testid="gallery-loading">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else if status === 'error'}
		<div class="alert alert-error mt-4" data-testid="gallery-error">No se pudo cargar la galeria del evento.</div>
	{:else if status === 'empty'}
		<div class="alert mt-4" data-testid="gallery-empty">No hay fotos disponibles para este evento o filtro.</div>
	{:else}
		<p class={summaryTextClass} data-testid="gallery-summary">{gallerySummary}</p>
		<ul
			class="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
			data-testid="gallery-list"
		>
			{#each photos as photo, photoIndex (photo.id)}
				<li class={`${photoCardClass} max-w-[340px] sm:max-w-none`}>
					<button
						type="button"
						class="block w-full cursor-zoom-in"
						on:click={() => openLightboxAt(photoIndex)}
						aria-label={`Ver foto ${photo.code}`}
					>
						<img class="block aspect-[4/3] w-full rounded-md object-cover" src={photo.thumbnailUrl} alt={`Miniatura ${photo.code}`} loading="lazy" />
					</button>
					<p class="mt-2 text-sm font-medium">{photo.code}</p>
					{#if photo.bibs.length > 0}
						<p class={`text-xs ${subtleTextClass}`}>Bib: {photo.bibs.join(', ')}</p>
					{:else}
						<p class={`text-xs ${subtleTextClass}`}>Sin clasificar</p>
					{/if}
					<button
						class={`mt-2 w-full ${actionButtonClass}`}
						type="button"
						on:click={() => addPhotoToCart(photo)}
						disabled={isPhotoAlreadyInCart(photo)}
						data-testid="gallery-add-to-cart"
					>
						{isPhotoAlreadyInCart(photo) ? 'Ya agregada' : 'Agregar al carrito'}
					</button>
				</li>
			{/each}
		</ul>
		{#if progressive.canLoadMore}
			<div class="mt-4 grid justify-items-center text-sm opacity-70" data-testid="gallery-infinite-status" aria-live="polite">
				<p>{loadMoreLabel}</p>
				<div class="h-px w-full" data-testid="gallery-infinite-sentinel" use:onInfiniteScrollSentinel></div>
			</div>
		{/if}
	{/if}
</PageLayout>

{#if isBackToTopVisible}
	<button
		type="button"
		class="btn btn-circle fixed bottom-4 right-4 z-40"
		on:click={scrollToTop}
		aria-label="Ir arriba"
		data-testid="gallery-back-to-top"
	>
		<ChevronUp size={18} aria-hidden="true" />
	</button>
{/if}

{#if selectedPhoto}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
		role="dialog"
		aria-modal="true"
		aria-label="Lightbox de foto"
		data-testid="gallery-lightbox"
		tabindex="0"
		bind:this={lightboxElement}
		on:click={handleLightboxBackdropClick}
		on:keydown={handleLightboxKeydown}
	>
		<div class="relative w-full max-w-5xl rounded-lg bg-base-100 p-3 shadow-2xl">
			<div class="mb-2 flex items-center justify-between">
				<p class="text-sm font-semibold" data-testid="gallery-lightbox-code">{selectedPhoto.code}</p>
				<button class={compactButtonClass} type="button" on:click={closeLightbox} aria-label="Cerrar lightbox">
					<X size={16} aria-hidden="true" />
					<span class="sr-only">Cerrar</span>
				</button>
			</div>
			<div class="grid grid-cols-[auto_1fr_auto] items-center gap-2">
				<button class="btn btn-circle btn-sm" type="button" on:click={showPreviousPhoto} data-testid="gallery-lightbox-prev" aria-label="Foto anterior">
					<ChevronLeft size={18} aria-hidden="true" />
				</button>
				<img class="max-h-[80vh] w-full rounded-md object-contain" src={selectedPhoto.fullImageUrl || selectedPhoto.thumbnailUrl} alt={`Foto ${selectedPhoto.code}`} />
				<button class="btn btn-circle btn-sm" type="button" on:click={showNextPhoto} data-testid="gallery-lightbox-next" aria-label="Foto siguiente">
					<ChevronRight size={18} aria-hidden="true" />
				</button>
			</div>
			<div class="mt-3 flex justify-end">
				<button
					type="button"
					class={actionButtonClass}
					on:click={() => addPhotoToCart(selectedPhoto)}
					disabled={isPhotoAlreadyInCart(selectedPhoto)}
					data-testid="gallery-lightbox-add-to-cart"
				>
					{isPhotoAlreadyInCart(selectedPhoto) ? 'Ya agregada' : 'Agregar al carrito'}
				</button>
			</div>
		</div>
	</div>
{/if}
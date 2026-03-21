function normalizeText(value) {
	return typeof value === 'string' ? value.trim() : '';
}

function buildMailHref(value) {
	const email = normalizeText(value);
	return email ? `mailto:${email}` : '';
}

function normalizeWebsite(value) {
	const website = normalizeText(value);
	return website || '#';
}

export function mapLegacyAmigo(item, index = 0) {
	const id =
		normalizeText(item?.id) ||
		normalizeText(item?.ID) ||
		normalizeText(item?.slug) ||
		`amigo_${index}`;
	const name = normalizeText(item?.name) || normalizeText(item?.title) || 'Pagina amiga';
	const subtitle = normalizeText(item?.subtitle) || normalizeText(item?.category) || normalizeText(item?.tagline);
	const location = normalizeText(item?.location) || normalizeText(item?.lugar);
	const websiteUrl = normalizeWebsite(item?.websiteUrl || item?.website || item?.href || item?.url);
	const email = normalizeText(item?.email) || normalizeText(item?.mail);
	const imageUrl =
		normalizeText(item?.imageUrl) ||
		normalizeText(item?.image) ||
		(id ? `/assets/images/amigos/${id}.jpg` : '');

	return {
		id,
		name,
		subtitle,
		location,
		websiteUrl,
		email,
		emailUrl: buildMailHref(email),
		imageUrl,
		target: websiteUrl === '#' ? '_self' : '_blank'
	};
}

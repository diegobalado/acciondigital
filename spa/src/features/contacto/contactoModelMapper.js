import { normalizeLegacyText } from '../../shared/models/legacyNormalization';

function normalizeUrl(value) {
	const url = normalizeLegacyText(value);
	return url || '#';
}

function normalizeSocialLink(link, index = 0) {
	const name = normalizeLegacyText(link?.name || link?.label || link?.network) || `Red ${index + 1}`;
	const url = normalizeUrl(link?.url || link?.href);
	return {
		id: normalizeLegacyText(link?.id) || `social_${index}`,
		name,
		url,
		target: url === '#' ? '_self' : '_blank'
	};
}

function normalizeEmails(value) {
	if (!Array.isArray(value)) {
		return [];
	}

	return value.map((email) => normalizeLegacyText(String(email))).filter(Boolean);
}

export function mapLegacyContactoContent(payload = {}) {
	const socialLinksInput = Array.isArray(payload?.socialLinks)
		? payload.socialLinks
		: Array.isArray(payload?.social)
			? payload.social
			: [];

	return {
		aboutTitle: normalizeLegacyText(payload?.aboutTitle || payload?.about?.title) || 'Nosotros',
		aboutDescription:
			normalizeLegacyText(payload?.aboutDescription || payload?.about?.description) ||
			'Fotografia de deportes',
		contactName: normalizeLegacyText(payload?.contactName || payload?.about?.name) || 'Javier Piva Flos',
		phone: normalizeLegacyText(payload?.phone || payload?.about?.phone) || '0249 450-3791',
		contactTitle: normalizeLegacyText(payload?.contactTitle || payload?.form?.title) || 'Contacto',
		formAction: normalizeLegacyText(payload?.formAction || payload?.form?.action) || '/contacto/index.php',
		recipientEmails: normalizeEmails(payload?.recipientEmails),
		socialLinks: socialLinksInput.map((link, index) => normalizeSocialLink(link, index))
	};
}

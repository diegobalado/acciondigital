import { normalizeLegacyText } from '../../shared/models/legacyNormalization';

function resolveFaqId(item, index) {
	return (
		normalizeLegacyText(item?.id) ||
		normalizeLegacyText(item?.ID) ||
		normalizeLegacyText(item?.slug) ||
		`faq_${index}`
	);
}

function resolveQuestion(item) {
	return normalizeLegacyText(item?.question || item?.pregunta || item?.title || item?.name);
}

function resolveAnswer(item) {
	const directAnswer = normalizeLegacyText(item?.answer || item?.respuesta || item?.content || item?.text);
	if (directAnswer) {
		return directAnswer;
	}

	if (Array.isArray(item?.steps)) {
		return item.steps
			.map((step) => normalizeLegacyText(String(step)))
			.filter(Boolean)
			.join(' ');
	}

	return '';
}

export function mapLegacyFaqItem(item, index = 0) {
	const id = resolveFaqId(item, index);
	const question = resolveQuestion(item) || 'Pregunta frecuente';
	const answer = resolveAnswer(item);

	return {
		id,
		question,
		answer
	};
}

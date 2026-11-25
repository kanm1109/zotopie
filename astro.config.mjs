// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { NOINDEX_SLUGS } from './src/data/noindex.mjs';

export default defineConfig({
	site: 'https://zotopie.com',
	integrations: [
		mdx(),
		sitemap({
			lastmod: new Date(),
			filter: (page) => {
				const noindexed =
					NOINDEX_SLUGS.some(
						(slug) =>
							page === `https://zotopie.com/reviews/${slug}/` ||
							page === `https://zotopie.com/alternatives/${slug}/`
					);
				return (
				!noindexed &&
				!page.includes('?') &&
				!page.includes('/go/') &&
				!page.endsWith('/search/') &&
				page !== 'https://zotopie.com/search/' &&
				page !== 'https://zotopie.com/stats/' &&
				!page.startsWith('https://zotopie.com/blog/') &&
				!page.startsWith('https://zotopie.com/threads/') &&
				!page.startsWith('https://zotopie.com/extensions/') &&
				!page.startsWith('https://zotopie.com/marketing/')
				);
			},
			serialize(item) {
				const url = item.url;
				// hreflang alternates for the EN ↔ ES ↔ PT-BR ↔ ID ↔ FR ↔ DE ↔ VI ↔ TH ↔ TR ↔ AR ↔ IT ↔ JA link-in-bio cluster
				const LOCALE_ALTERNATES = {
					'https://zotopie.com/best/link-in-bio-tools/': [
						{ url: 'https://zotopie.com/best/link-in-bio-tools/', lang: 'en' },
						{ url: 'https://zotopie.com/es/mejores-herramientas-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/melhores-ferramentas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/alat-link-di-bio-terbaik/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/meilleurs-outils-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/beste-link-in-bio-tools/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/cong-cu-link-bio-tot-nhat/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khrueang-mue-link-bio-thi-di-thisut/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/en-iyi-link-in-bio-araclari/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/afdhal-adawat-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/migliori-strumenti-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/besuto-rinku-in-baio-tsuru/', lang: 'ja' },
					],
					'https://zotopie.com/es/mejores-herramientas-link-en-bio/': [
						{ url: 'https://zotopie.com/best/link-in-bio-tools/', lang: 'en' },
						{ url: 'https://zotopie.com/es/mejores-herramientas-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/melhores-ferramentas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/alat-link-di-bio-terbaik/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/meilleurs-outils-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/beste-link-in-bio-tools/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/cong-cu-link-bio-tot-nhat/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khrueang-mue-link-bio-thi-di-thisut/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/en-iyi-link-in-bio-araclari/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/afdhal-adawat-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/migliori-strumenti-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/besuto-rinku-in-baio-tsuru/', lang: 'ja' },
					],
					'https://zotopie.com/pt-br/melhores-ferramentas-link-na-bio/': [
						{ url: 'https://zotopie.com/best/link-in-bio-tools/', lang: 'en' },
						{ url: 'https://zotopie.com/es/mejores-herramientas-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/melhores-ferramentas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/alat-link-di-bio-terbaik/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/meilleurs-outils-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/beste-link-in-bio-tools/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/cong-cu-link-bio-tot-nhat/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khrueang-mue-link-bio-thi-di-thisut/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/en-iyi-link-in-bio-araclari/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/afdhal-adawat-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/migliori-strumenti-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/besuto-rinku-in-baio-tsuru/', lang: 'ja' },
					],
					'https://zotopie.com/id/alat-link-di-bio-terbaik/': [
						{ url: 'https://zotopie.com/best/link-in-bio-tools/', lang: 'en' },
						{ url: 'https://zotopie.com/es/mejores-herramientas-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/melhores-ferramentas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/alat-link-di-bio-terbaik/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/meilleurs-outils-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/beste-link-in-bio-tools/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/cong-cu-link-bio-tot-nhat/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khrueang-mue-link-bio-thi-di-thisut/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/en-iyi-link-in-bio-araclari/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/afdhal-adawat-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/migliori-strumenti-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/besuto-rinku-in-baio-tsuru/', lang: 'ja' },
					],
					'https://zotopie.com/fr/meilleurs-outils-link-in-bio/': [
						{ url: 'https://zotopie.com/best/link-in-bio-tools/', lang: 'en' },
						{ url: 'https://zotopie.com/es/mejores-herramientas-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/melhores-ferramentas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/alat-link-di-bio-terbaik/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/meilleurs-outils-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/beste-link-in-bio-tools/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/cong-cu-link-bio-tot-nhat/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khrueang-mue-link-bio-thi-di-thisut/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/en-iyi-link-in-bio-araclari/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/afdhal-adawat-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/migliori-strumenti-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/besuto-rinku-in-baio-tsuru/', lang: 'ja' },
					],
					'https://zotopie.com/de/beste-link-in-bio-tools/': [
						{ url: 'https://zotopie.com/best/link-in-bio-tools/', lang: 'en' },
						{ url: 'https://zotopie.com/es/mejores-herramientas-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/melhores-ferramentas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/alat-link-di-bio-terbaik/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/meilleurs-outils-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/beste-link-in-bio-tools/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/cong-cu-link-bio-tot-nhat/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khrueang-mue-link-bio-thi-di-thisut/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/en-iyi-link-in-bio-araclari/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/afdhal-adawat-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/migliori-strumenti-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/besuto-rinku-in-baio-tsuru/', lang: 'ja' },
					],
					'https://zotopie.com/vi/cong-cu-link-bio-tot-nhat/': [
						{ url: 'https://zotopie.com/best/link-in-bio-tools/', lang: 'en' },
						{ url: 'https://zotopie.com/es/mejores-herramientas-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/melhores-ferramentas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/alat-link-di-bio-terbaik/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/meilleurs-outils-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/beste-link-in-bio-tools/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/cong-cu-link-bio-tot-nhat/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khrueang-mue-link-bio-thi-di-thisut/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/en-iyi-link-in-bio-araclari/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/afdhal-adawat-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/migliori-strumenti-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/besuto-rinku-in-baio-tsuru/', lang: 'ja' },
					],
					'https://zotopie.com/th/khrueang-mue-link-bio-thi-di-thisut/': [
						{ url: 'https://zotopie.com/best/link-in-bio-tools/', lang: 'en' },
						{ url: 'https://zotopie.com/es/mejores-herramientas-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/melhores-ferramentas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/alat-link-di-bio-terbaik/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/meilleurs-outils-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/beste-link-in-bio-tools/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/cong-cu-link-bio-tot-nhat/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khrueang-mue-link-bio-thi-di-thisut/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/en-iyi-link-in-bio-araclari/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/afdhal-adawat-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/migliori-strumenti-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/besuto-rinku-in-baio-tsuru/', lang: 'ja' },
					],
					'https://zotopie.com/tr/en-iyi-link-in-bio-araclari/': [
						{ url: 'https://zotopie.com/best/link-in-bio-tools/', lang: 'en' },
						{ url: 'https://zotopie.com/es/mejores-herramientas-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/melhores-ferramentas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/alat-link-di-bio-terbaik/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/meilleurs-outils-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/beste-link-in-bio-tools/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/cong-cu-link-bio-tot-nhat/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khrueang-mue-link-bio-thi-di-thisut/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/en-iyi-link-in-bio-araclari/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/afdhal-adawat-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/migliori-strumenti-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/besuto-rinku-in-baio-tsuru/', lang: 'ja' },
					],
					'https://zotopie.com/ar/afdhal-adawat-link-in-bio/': [
						{ url: 'https://zotopie.com/best/link-in-bio-tools/', lang: 'en' },
						{ url: 'https://zotopie.com/es/mejores-herramientas-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/melhores-ferramentas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/alat-link-di-bio-terbaik/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/meilleurs-outils-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/beste-link-in-bio-tools/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/cong-cu-link-bio-tot-nhat/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khrueang-mue-link-bio-thi-di-thisut/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/en-iyi-link-in-bio-araclari/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/afdhal-adawat-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/migliori-strumenti-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/besuto-rinku-in-baio-tsuru/', lang: 'ja' },
					],
					'https://zotopie.com/it/migliori-strumenti-link-in-bio/': [
						{ url: 'https://zotopie.com/best/link-in-bio-tools/', lang: 'en' },
						{ url: 'https://zotopie.com/es/mejores-herramientas-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/melhores-ferramentas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/alat-link-di-bio-terbaik/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/meilleurs-outils-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/beste-link-in-bio-tools/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/cong-cu-link-bio-tot-nhat/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khrueang-mue-link-bio-thi-di-thisut/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/en-iyi-link-in-bio-araclari/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/afdhal-adawat-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/migliori-strumenti-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/besuto-rinku-in-baio-tsuru/', lang: 'ja' },
					],
					'https://zotopie.com/ja/besuto-rinku-in-baio-tsuru/': [
						{ url: 'https://zotopie.com/best/link-in-bio-tools/', lang: 'en' },
						{ url: 'https://zotopie.com/es/mejores-herramientas-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/melhores-ferramentas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/alat-link-di-bio-terbaik/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/meilleurs-outils-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/beste-link-in-bio-tools/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/cong-cu-link-bio-tot-nhat/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khrueang-mue-link-bio-thi-di-thisut/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/en-iyi-link-in-bio-araclari/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/afdhal-adawat-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/migliori-strumenti-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/besuto-rinku-in-baio-tsuru/', lang: 'ja' },
					],
					'https://zotopie.com/tools/link-in-bio-fee-calculator/': [
						{ url: 'https://zotopie.com/tools/link-in-bio-fee-calculator/', lang: 'en' },
						{ url: 'https://zotopie.com/es/calculadora-comisiones-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/calculadora-taxas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/kalkulator-biaya-link-di-bio/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/calculateur-frais-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/link-in-bio-gebuehrenrechner/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/may-tinh-phi-link-bio/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khreuxng-khid-kha-thrrm-niym-link-bio/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/link-in-bio-ucret-hesaplayici/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/hasibat-rusum-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/calcolatore-commissioni-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/rinku-in-baio-tesuryo-keisanki/', lang: 'ja' },
					],
					'https://zotopie.com/es/calculadora-comisiones-link-en-bio/': [
						{ url: 'https://zotopie.com/tools/link-in-bio-fee-calculator/', lang: 'en' },
						{ url: 'https://zotopie.com/es/calculadora-comisiones-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/calculadora-taxas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/kalkulator-biaya-link-di-bio/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/calculateur-frais-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/link-in-bio-gebuehrenrechner/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/may-tinh-phi-link-bio/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khreuxng-khid-kha-thrrm-niym-link-bio/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/link-in-bio-ucret-hesaplayici/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/hasibat-rusum-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/calcolatore-commissioni-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/rinku-in-baio-tesuryo-keisanki/', lang: 'ja' },
					],
					'https://zotopie.com/pt-br/calculadora-taxas-link-na-bio/': [
						{ url: 'https://zotopie.com/tools/link-in-bio-fee-calculator/', lang: 'en' },
						{ url: 'https://zotopie.com/es/calculadora-comisiones-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/calculadora-taxas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/kalkulator-biaya-link-di-bio/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/calculateur-frais-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/link-in-bio-gebuehrenrechner/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/may-tinh-phi-link-bio/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khreuxng-khid-kha-thrrm-niym-link-bio/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/link-in-bio-ucret-hesaplayici/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/hasibat-rusum-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/calcolatore-commissioni-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/rinku-in-baio-tesuryo-keisanki/', lang: 'ja' },
					],
					'https://zotopie.com/id/kalkulator-biaya-link-di-bio/': [
						{ url: 'https://zotopie.com/tools/link-in-bio-fee-calculator/', lang: 'en' },
						{ url: 'https://zotopie.com/es/calculadora-comisiones-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/calculadora-taxas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/kalkulator-biaya-link-di-bio/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/calculateur-frais-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/link-in-bio-gebuehrenrechner/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/may-tinh-phi-link-bio/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khreuxng-khid-kha-thrrm-niym-link-bio/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/link-in-bio-ucret-hesaplayici/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/hasibat-rusum-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/calcolatore-commissioni-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/rinku-in-baio-tesuryo-keisanki/', lang: 'ja' },
					],
					'https://zotopie.com/fr/calculateur-frais-link-in-bio/': [
						{ url: 'https://zotopie.com/tools/link-in-bio-fee-calculator/', lang: 'en' },
						{ url: 'https://zotopie.com/es/calculadora-comisiones-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/calculadora-taxas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/kalkulator-biaya-link-di-bio/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/calculateur-frais-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/link-in-bio-gebuehrenrechner/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/may-tinh-phi-link-bio/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khreuxng-khid-kha-thrrm-niym-link-bio/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/link-in-bio-ucret-hesaplayici/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/hasibat-rusum-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/calcolatore-commissioni-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/rinku-in-baio-tesuryo-keisanki/', lang: 'ja' },
					],
					'https://zotopie.com/de/link-in-bio-gebuehrenrechner/': [
						{ url: 'https://zotopie.com/tools/link-in-bio-fee-calculator/', lang: 'en' },
						{ url: 'https://zotopie.com/es/calculadora-comisiones-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/calculadora-taxas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/kalkulator-biaya-link-di-bio/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/calculateur-frais-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/link-in-bio-gebuehrenrechner/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/may-tinh-phi-link-bio/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khreuxng-khid-kha-thrrm-niym-link-bio/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/link-in-bio-ucret-hesaplayici/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/hasibat-rusum-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/calcolatore-commissioni-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/rinku-in-baio-tesuryo-keisanki/', lang: 'ja' },
					],
					'https://zotopie.com/vi/may-tinh-phi-link-bio/': [
						{ url: 'https://zotopie.com/tools/link-in-bio-fee-calculator/', lang: 'en' },
						{ url: 'https://zotopie.com/es/calculadora-comisiones-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/calculadora-taxas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/kalkulator-biaya-link-di-bio/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/calculateur-frais-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/link-in-bio-gebuehrenrechner/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/may-tinh-phi-link-bio/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khreuxng-khid-kha-thrrm-niym-link-bio/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/link-in-bio-ucret-hesaplayici/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/hasibat-rusum-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/calcolatore-commissioni-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/rinku-in-baio-tesuryo-keisanki/', lang: 'ja' },
					],
					'https://zotopie.com/th/khreuxng-khid-kha-thrrm-niym-link-bio/': [
						{ url: 'https://zotopie.com/tools/link-in-bio-fee-calculator/', lang: 'en' },
						{ url: 'https://zotopie.com/es/calculadora-comisiones-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/calculadora-taxas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/kalkulator-biaya-link-di-bio/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/calculateur-frais-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/link-in-bio-gebuehrenrechner/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/may-tinh-phi-link-bio/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khreuxng-khid-kha-thrrm-niym-link-bio/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/link-in-bio-ucret-hesaplayici/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/hasibat-rusum-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/calcolatore-commissioni-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/rinku-in-baio-tesuryo-keisanki/', lang: 'ja' },
					],
					'https://zotopie.com/tr/link-in-bio-ucret-hesaplayici/': [
						{ url: 'https://zotopie.com/tools/link-in-bio-fee-calculator/', lang: 'en' },
						{ url: 'https://zotopie.com/es/calculadora-comisiones-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/calculadora-taxas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/kalkulator-biaya-link-di-bio/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/calculateur-frais-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/link-in-bio-gebuehrenrechner/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/may-tinh-phi-link-bio/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khreuxng-khid-kha-thrrm-niym-link-bio/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/link-in-bio-ucret-hesaplayici/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/hasibat-rusum-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/calcolatore-commissioni-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/rinku-in-baio-tesuryo-keisanki/', lang: 'ja' },
					],
					'https://zotopie.com/ar/hasibat-rusum-link-in-bio/': [
						{ url: 'https://zotopie.com/tools/link-in-bio-fee-calculator/', lang: 'en' },
						{ url: 'https://zotopie.com/es/calculadora-comisiones-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/calculadora-taxas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/kalkulator-biaya-link-di-bio/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/calculateur-frais-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/link-in-bio-gebuehrenrechner/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/may-tinh-phi-link-bio/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khreuxng-khid-kha-thrrm-niym-link-bio/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/link-in-bio-ucret-hesaplayici/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/hasibat-rusum-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/calcolatore-commissioni-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/rinku-in-baio-tesuryo-keisanki/', lang: 'ja' },
					],
					'https://zotopie.com/it/calcolatore-commissioni-link-in-bio/': [
						{ url: 'https://zotopie.com/tools/link-in-bio-fee-calculator/', lang: 'en' },
						{ url: 'https://zotopie.com/es/calculadora-comisiones-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/calculadora-taxas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/kalkulator-biaya-link-di-bio/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/calculateur-frais-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/link-in-bio-gebuehrenrechner/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/may-tinh-phi-link-bio/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khreuxng-khid-kha-thrrm-niym-link-bio/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/link-in-bio-ucret-hesaplayici/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/hasibat-rusum-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/calcolatore-commissioni-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/rinku-in-baio-tesuryo-keisanki/', lang: 'ja' },
					],
					'https://zotopie.com/ja/rinku-in-baio-tesuryo-keisanki/': [
						{ url: 'https://zotopie.com/tools/link-in-bio-fee-calculator/', lang: 'en' },
						{ url: 'https://zotopie.com/es/calculadora-comisiones-link-en-bio/', lang: 'es' },
						{ url: 'https://zotopie.com/pt-br/calculadora-taxas-link-na-bio/', lang: 'pt-BR' },
						{ url: 'https://zotopie.com/id/kalkulator-biaya-link-di-bio/', lang: 'id' },
						{ url: 'https://zotopie.com/fr/calculateur-frais-link-in-bio/', lang: 'fr' },
						{ url: 'https://zotopie.com/de/link-in-bio-gebuehrenrechner/', lang: 'de' },
						{ url: 'https://zotopie.com/vi/may-tinh-phi-link-bio/', lang: 'vi' },
						{ url: 'https://zotopie.com/th/khreuxng-khid-kha-thrrm-niym-link-bio/', lang: 'th' },
						{ url: 'https://zotopie.com/tr/link-in-bio-ucret-hesaplayici/', lang: 'tr' },
						{ url: 'https://zotopie.com/ar/hasibat-rusum-link-in-bio/', lang: 'ar' },
						{ url: 'https://zotopie.com/it/calcolatore-commissioni-link-in-bio/', lang: 'it' },
						{ url: 'https://zotopie.com/ja/rinku-in-baio-tesuryo-keisanki/', lang: 'ja' },
					],
				};
				const links = LOCALE_ALTERNATES[url];
				if (links) {
					return { ...item, changefreq: 'weekly', priority: 0.8, links };
				}
				if (url === 'https://zotopie.com/') {
					return { ...item, changefreq: 'daily',   priority: 1.0 };
				}
				if (url === 'https://zotopie.com/reviews/') {
					return { ...item, changefreq: 'weekly',  priority: 0.9 };
				}
				if (url.includes('/comparisons/')) {
					return { ...item, changefreq: 'monthly', priority: 0.8 };
				}
				if (url.includes('/category/')) {
					return { ...item, changefreq: 'weekly',  priority: 0.8 };
				}
				if (url.includes('/best/')) {
					return { ...item, changefreq: 'weekly',  priority: 0.8 };
				}
				if (url.includes('/reviews/')) {
					return { ...item, changefreq: 'monthly', priority: 0.7 };
				}
				if (url.includes('/alternatives/')) {
					return { ...item, changefreq: 'monthly', priority: 0.7 };
				}
				if (url.includes('/compare/')) {
					return { ...item, changefreq: 'monthly', priority: 0.7 };
				}
				if (url.includes('/search')) {
					return { ...item, changefreq: 'monthly', priority: 0.4 };
				}
				return { ...item, changefreq: 'monthly', priority: 0.5 };
			},
		}),
	],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});

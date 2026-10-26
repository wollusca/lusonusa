/* ═══════════════════════════════════════════════════════════════
   LUSONUSA — Author registry (single source of truth for /articles/)

   Articles reference authors ONLY by the stable id used as the key
   below (e.g. author: 'aditya-putra' in articles-data.js). Never copy a
   name or role into the data file.

   HOW TO ADD AN AUTHOR
   1. Add one entry below. The id is lowercase-hyphenated and never
      changes once used (it is also the JSON-LD @id fragment:
      https://www.lusonusa.agency/#<id>).
   2. Add a 96×96 avatar to /assets/articles/avatar-<first-name>-96.jpg
      (+ .webp), or point `avatar` at an existing image.
   3. `sameAs` is optional: public profile URLs (LinkedIn etc.).
   Nothing else needs to change for the hub; static article pages are
   edited by hand, see articles/README.md.

   HOW TO MARK AN ARTICLE AS UPDATED / REVIEWED
   In articles-data.js set any of these optional fields on the article:
     dateModified: 'YYYY-MM-DD',
     updatedBy:    '<author id>',
     reviewedBy:   '<author id>',
   then mirror them in the article's static header and JSON-LD
   (snippets in articles/README.md).
   ═══════════════════════════════════════════════════════════════ */

window.LUSONUSA_AUTHORS = {
  'aditya-putra': {
    name: 'Aditya Putra',
    role: 'Founder',
    title: 'Business & Bilateral Relations Lead',
    avatar: '/assets/articles/avatar-aditya-96.jpg',
    image: '/assets/aditya.jpg',
    bio: '9+ years living in Portugal, including 5 years in the Economic Section of the Embassy of the Republic of Indonesia in Lisbon. Focuses on cross-border business setup and administrative navigation.',
    sameAs: []
  },
  'mia-gomes': {
    name: 'Mia Gomes',
    role: 'Translation Specialist',
    title: 'Portuguese–Indonesian Translator & Interpreter',
    avatar: '/assets/articles/avatar-mia-96.jpg',
    image: '/assets/mia.jpg',
    // Neutral title/bio pending confirmation of further credentials by Mia Gomes. Never "sworn".
    bio: 'Portuguese–Indonesian translator and interpreter. Translations for use in Portugal are certified before a Portuguese notary.',
    sameAs: []
  },
  'joko-supriyanto': {
    name: 'Joko Supriyanto',
    role: 'Banking & Finance',
    title: 'Banking & Financial Advisory Specialist',
    avatar: '/assets/joko.jpg',
    image: '/assets/joko.jpg',
    bio: '7+ years living in Portugal, M.Sc. in Economics from ISEG Lisbon, working in the European banking sector.',
    sameAs: []
  },
  'nabela-huwaida': {
    name: 'Nabela Huwaida',
    role: 'Technology & AI',
    title: 'Digital Transformation & Innovation Specialist',
    avatar: '/assets/nabela.jpg',
    image: '/assets/nabela.jpg',
    bio: 'M.Sc. in Strategic Marketing, leading enterprise technology initiatives with a focus on digital workflows and business AI adoption.',
    sameAs: []
  }
};

/* Display label used in article headers: "<role> · <title>". */
window.lusonusaAuthorLabel = function (id) {
  const a = window.LUSONUSA_AUTHORS[id];
  return a ? `${a.role} · ${a.title}` : '';
};

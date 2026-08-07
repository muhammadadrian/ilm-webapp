/*
 * ============================================================================
 *  PLACEHOLDER SEED CONTENT — NOT SCHOLARLY-VERIFIED.
 *  Every entry must be reviewed and sourced by a qualified person before this
 *  app is used or published.
 * ----------------------------------------------------------------------------
 *  Ground rules followed in this file:
 *   - No fabricated hadith text is attributed to a collection (Bukhari/Muslim
 *     etc.) and no fake isnad or grading is written. Hadith cards carry only a
 *     paraphrased THEME plus a note to replace it with a sourced, graded text.
 *   - No invented tafsir is attributed to a named mufassir. Explanations are
 *     generic and labelled as placeholders pending a scholarly tafsir.
 *   - No invented words are put in a named/living scholar's mouth. Quote cards
 *     use anonymous framing and an "unverified" attribution.
 *   - Arabic script is included ONLY for short, common-knowledge verses / duas
 *     / single vocabulary words the author is confident are correct. Where
 *     unsure, Arabic is omitted and a note says it must be added after review.
 *   - Every card has needsReview: true and a sourceNote.
 * ============================================================================
 */

import type { Card } from '../types';

export const SEED_CARDS: Card[] = [
  // ─────────────────────────────── TAFSIR ───────────────────────────────
  {
    id: 'tafsir-1',
    category: 'tafsir',
    title: 'With hardship comes ease',
    body:
      'A short, oft-recited passage reminding the believer that difficulty is not permanent. The verse pairs hardship directly with ease, and repeats the promise for emphasis. A gentle reframing for hard days: relief is written alongside the struggle, not only after it.',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    transliteration: "Fa-inna ma'al-'usri yusra. Inna ma'al-'usri yusra.",
    translation: 'For indeed, with hardship comes ease. Indeed, with hardship comes ease.',
    reference: 'Quran 94:5-6 (Ash-Sharh)',
    needsReview: true,
    sourceNote:
      'Placeholder explanation — verify wording and meaning with a scholarly tafsir (e.g. Ibn Kathir, Tabari). Explanation is generic and not attributed to any mufassir.',
  },
  {
    id: 'tafsir-2',
    category: 'tafsir',
    title: 'In the name of God, the Most Merciful',
    body:
      'The opening formula recited before most chapters of the Quran and before everyday acts. It frames an action as begun in God’s name and invokes two facets of His mercy. A placeholder note on nuance: the two names for mercy are often said to differ in scope — confirm details with a proper tafsir.',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    transliteration: 'Bismillahi ar-Rahmani ar-Rahim',
    translation: 'In the name of God, the Most Gracious, the Most Merciful.',
    reference: 'Quran 1:1 (Al-Fatihah)',
    needsReview: true,
    sourceNote:
      'Placeholder explanation — verify the distinction between Ar-Rahman and Ar-Rahim with a scholarly tafsir. Not attributed to any mufassir.',
  },
  {
    id: 'tafsir-3',
    category: 'tafsir',
    title: 'The chapter of sincerity',
    body:
      'A very short chapter that many memorise first. It affirms the absolute oneness of God in a few words. Traditionally it is described as weighing heavily in reward for its brevity — treat that framing as a theme to confirm, not a quoted hadith.',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    transliteration: 'Qul huwa Allahu ahad',
    translation: 'Say: He is God, the One.',
    reference: 'Quran 112:1 (Al-Ikhlas)',
    needsReview: true,
    sourceNote:
      'Only the first verse is quoted. Placeholder explanation — verify the full chapter and its virtues with a scholarly tafsir and authenticated hadith.',
  },
  {
    id: 'tafsir-4',
    category: 'tafsir',
    title: 'The Living, the Sustainer',
    body:
      'The famous "Throne Verse" opens by naming God as the Ever-Living and the Sustainer of all existence. It is widely recited for reflection and protection. Only the opening line is shown here; read the full verse and its explanation in a reliable tafsir.',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    transliteration: 'Allahu la ilaha illa huwa al-Hayyu al-Qayyum',
    translation: 'God — there is no deity except Him, the Ever-Living, the Sustainer.',
    reference: 'Quran 2:255 (Ayat al-Kursi, opening)',
    needsReview: true,
    sourceNote:
      'Only the opening of the verse is quoted. Placeholder explanation — verify full text and meaning with a scholarly tafsir. Reported virtues need authenticated sourcing.',
  },

  // ─────────────────────────────── HADITH ───────────────────────────────
  {
    id: 'hadith-1',
    category: 'hadith',
    title: 'On kindness',
    body:
      'Theme: gentleness and kindness are praised, and kindness is described as beautifying whatever it touches. This card conveys a general theme only — no specific narration is quoted here.',
    reference: 'Theme only — no source cited yet',
    needsReview: true,
    sourceNote:
      '[Placeholder — replace with a sourced, authenticated hadith and grading.] Do not publish without an exact text, collection reference, and authentication (sahih/hasan/etc.).',
  },
  {
    id: 'hadith-2',
    category: 'hadith',
    title: 'On intentions',
    body:
      'Theme: deeds are weighed by the intention behind them, so the same outward act can differ greatly in meaning. Presented here as a theme to reflect on, not as a quoted narration.',
    reference: 'Theme only — no source cited yet',
    needsReview: true,
    sourceNote:
      '[Placeholder — replace with a sourced, authenticated hadith and grading.] The well-known wording must be quoted exactly and attributed to its collection after verification.',
  },
  {
    id: 'hadith-3',
    category: 'hadith',
    title: 'On good speech',
    body:
      'Theme: a person is encouraged to say what is good or else to stay silent. A simple daily filter for our words. Shared as a theme for reflection, without a quoted text.',
    reference: 'Theme only — no source cited yet',
    needsReview: true,
    sourceNote:
      '[Placeholder — replace with a sourced, authenticated hadith and grading.] No collection or grade is claimed here.',
  },
  {
    id: 'hadith-4',
    category: 'hadith',
    title: 'On a cheerful face',
    body:
      'Theme: meeting others with a cheerful, welcoming face is itself an act of goodness. Even the smallest kindness counts. Given as a theme only, pending a sourced narration.',
    reference: 'Theme only — no source cited yet',
    needsReview: true,
    sourceNote:
      '[Placeholder — replace with a sourced, authenticated hadith and grading.] No isnad or collection is asserted.',
  },

  // ─────────────────────────────── AQIDAH ───────────────────────────────
  {
    id: 'aqidah-1',
    category: 'aqidah',
    title: 'The oneness of God (Tawhid)',
    body:
      'The foundation of Islamic belief is that God is one, without partner or equal, and alone deserving of worship. Everything else in belief and practice is built on this. A neutral educational summary — confirm terminology and detail with a qualified teacher.',
    needsReview: true,
    sourceNote:
      'Neutral educational placeholder. Verify definitions and phrasing with reliable creed (aqidah) texts and a qualified teacher.',
  },
  {
    id: 'aqidah-2',
    category: 'aqidah',
    title: 'The six articles of faith',
    body:
      'Islamic belief is commonly summarised as faith in God, His angels, His books, His messengers, the Last Day, and divine decree (good and bad). This is a teaching outline; the exact framing and evidences should be checked in a creed text.',
    needsReview: true,
    sourceNote:
      'Neutral educational placeholder. Verify the list, order, and supporting evidences with a reliable aqidah source.',
  },
  {
    id: 'aqidah-3',
    category: 'aqidah',
    title: 'The beautiful names of God',
    body:
      'God is described in the Quran by many names and attributes — the Merciful, the Forgiving, the All-Knowing, and more. Reflecting on these names is a way of knowing Him. Confirm any specific count, list, or virtue with scholarly sources.',
    needsReview: true,
    sourceNote:
      'Neutral educational placeholder. Any specific number of names or reported virtue requires authenticated sourcing.',
  },
  {
    id: 'aqidah-4',
    category: 'aqidah',
    title: 'Belief in the Last Day',
    body:
      'Muslims believe this life is followed by accountability in the hereafter, where deeds are weighed. This belief shapes how a person treats their time, wealth, and others. A neutral summary — verify specifics with reliable texts.',
    needsReview: true,
    sourceNote:
      'Neutral educational placeholder. Verify eschatological detail with reliable creed sources and a qualified teacher.',
  },

  // ────────────────────────── ADAB / REMINDERS ──────────────────────────
  {
    id: 'adab-1',
    category: 'adab',
    title: 'Spread the greeting of peace',
    body:
      'Greeting others with "As-salamu alaykum" (peace be upon you) is a simple way to spread warmth and goodwill. It costs nothing and softens hearts. A gentle daily habit to keep alive.',
    arabic: 'السَّلَامُ عَلَيْكُمْ',
    transliteration: "As-salamu 'alaykum",
    translation: 'Peace be upon you.',
    needsReview: true,
    sourceNote:
      'Neutral educational placeholder. The greeting itself is common knowledge; any linked virtues need authenticated sourcing.',
  },
  {
    id: 'adab-2',
    category: 'adab',
    title: 'A posture of gratitude',
    body:
      'Noticing small blessings — a meal, health, a kind word — trains the heart toward contentment. Try naming three things you are grateful for before sleeping. A practical reminder, not a ruling.',
    needsReview: true,
    sourceNote:
      'Neutral educational placeholder. General self-improvement framing; verify any attached textual evidence separately.',
  },
  {
    id: 'adab-3',
    category: 'adab',
    title: 'Guard your gaze and your words',
    body:
      'Much of good character is restraint: lowering the gaze from what harms the heart, and holding the tongue from gossip and harshness. Small acts of self-control compound over time.',
    needsReview: true,
    sourceNote:
      'Neutral educational placeholder. Verify any specific textual basis with reliable sources before publishing.',
  },
  {
    id: 'adab-4',
    category: 'adab',
    title: 'Patience in small moments',
    body:
      'Patience is not only for great trials — it shows in traffic, in a slow queue, in a difficult conversation. Each small pause before reacting is practice for the larger tests of life.',
    needsReview: true,
    sourceNote:
      'Neutral educational placeholder. General reminder; verify any linked verse or narration separately.',
  },

  // ─────────────────────────────── DUAS ───────────────────────────────
  {
    id: 'dua-1',
    category: 'dua',
    title: 'Good in this life and the next',
    body:
      'A short, comprehensive supplication asking for goodness in both worlds and protection from the Fire. Easy to memorise and often repeated. Drawn from the Quran itself.',
    arabic:
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration:
      "Rabbana atina fid-dunya hasanah, wa fil-akhirati hasanah, wa qina 'adhab an-nar",
    translation:
      'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    reference: 'Quran 2:201 (Al-Baqarah)',
    needsReview: true,
    sourceNote:
      'Quranic supplication (common knowledge). Still tagged for review — confirm Arabic text and reference against a printed mushaf.',
  },
  {
    id: 'dua-2',
    category: 'dua',
    title: 'Seeking forgiveness',
    body:
      'A brief phrase of repentance repeated throughout the day to return the heart to God. Simple enough to say while walking, working, or waiting.',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from God.',
    needsReview: true,
    sourceNote:
      'Common-knowledge phrase of istighfar. Verify Arabic spelling and any specific reported virtues/counts with authenticated sources.',
  },
  {
    id: 'dua-3',
    category: 'dua',
    title: 'A prayer for more knowledge',
    body:
      'A short Quranic supplication asking God to increase one’s knowledge — fitting to say before study or reading. Small words, a large aspiration.',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: "Rabbi zidni 'ilma",
    translation: 'My Lord, increase me in knowledge.',
    reference: 'Quran 20:114 (Ta-Ha)',
    needsReview: true,
    sourceNote:
      'Quranic supplication (common knowledge). Confirm Arabic text and reference against a printed mushaf.',
  },
  {
    id: 'dua-4',
    category: 'dua',
    title: 'Words of remembrance',
    body:
      'Three short phrases of remembrance often repeated together: glorifying God, praising Him, and declaring His greatness. Light on the tongue, and a calm anchor for the day.',
    arabic: 'سُبْحَانَ اللَّهِ ۝ الْحَمْدُ لِلَّهِ ۝ اللَّهُ أَكْبَرُ',
    transliteration: 'SubhanAllah, Alhamdulillah, Allahu akbar',
    translation: 'Glory be to God. Praise be to God. God is the Greatest.',
    needsReview: true,
    sourceNote:
      'Common-knowledge remembrance phrases. Verify Arabic spelling and any specific counts/virtues (e.g. after prayer) with authenticated sources.',
  },

  // ─────────────────────────────── SEERAH ───────────────────────────────
  {
    id: 'seerah-1',
    category: 'seerah',
    title: 'A trustworthy reputation',
    body:
      'Before his prophethood, the Prophet Muhammad was known among his people for honesty and reliability, earning a reputation as trustworthy. A reminder that good character is noticed long before words. Verify specific details with a reliable biography.',
    needsReview: true,
    sourceNote:
      'Neutral educational placeholder. Verify all biographical detail against reliable seerah works (e.g. Ibn Hisham, and modern vetted biographies).',
  },
  {
    id: 'seerah-2',
    category: 'seerah',
    title: 'The first revelation',
    body:
      'The beginning of revelation is traditionally described as occurring during periods of solitude and reflection near Makkah. A moment that changed history. Dates, places, and wording should be confirmed with vetted sources.',
    needsReview: true,
    sourceNote:
      'Neutral educational placeholder. Verify chronology and detail against reliable seerah works.',
  },
  {
    id: 'seerah-3',
    category: 'seerah',
    title: 'The migration to Madinah',
    body:
      'The early Muslim community migrated from Makkah to Madinah, a turning point that later marked the start of the Islamic calendar. A story of trust, sacrifice, and building community. Confirm specifics with reliable sources.',
    needsReview: true,
    sourceNote:
      'Neutral educational placeholder. Verify names, dates, and events against reliable seerah works.',
  },
  {
    id: 'seerah-4',
    category: 'seerah',
    title: 'Gentleness with others',
    body:
      'The Prophet’s biography is widely described as marked by gentleness, patience, and care for the vulnerable — the young, the poor, and the traveller. A model of character to study slowly. Verify individual episodes with vetted sources.',
    needsReview: true,
    sourceNote:
      'Neutral educational placeholder. Any specific episode or quotation requires authenticated sourcing from reliable seerah works.',
  },

  // ────────────────────────── ARABIC VOCABULARY ──────────────────────────
  {
    id: 'vocab-1',
    category: 'vocab',
    title: "'Ilm — knowledge",
    body:
      'A central word in Islamic tradition. It covers both sacred and worldly learning, and the pursuit of it is highly honoured. Notice how many related words share the same root, such as "aalim" (one who knows).',
    arabic: 'عِلْم',
    transliteration: "'ilm",
    translation: 'knowledge',
    needsReview: true,
    sourceNote:
      'Single-word vocabulary. Verify vowelling and root explanation with an Arabic language reference.',
  },
  {
    id: 'vocab-2',
    category: 'vocab',
    title: 'Sabr — patience',
    body:
      'More than passive waiting, this word carries the sense of steady, dignified endurance through difficulty. It also means perseverance in doing good. A word worth sitting with.',
    arabic: 'صَبْر',
    transliteration: 'sabr',
    translation: 'patience, steadfast endurance',
    needsReview: true,
    sourceNote:
      'Single-word vocabulary. Verify vowelling and nuance with an Arabic language reference.',
  },
  {
    id: 'vocab-3',
    category: 'vocab',
    title: 'Shukr — gratitude',
    body:
      'Thankfulness — recognising a blessing and responding with acknowledgement and use of it in good ways. Often paired in meaning with contentment and remembrance.',
    arabic: 'شُكْر',
    transliteration: 'shukr',
    translation: 'gratitude, thankfulness',
    needsReview: true,
    sourceNote:
      'Single-word vocabulary. Verify vowelling and nuance with an Arabic language reference.',
  },
  {
    id: 'vocab-4',
    category: 'vocab',
    title: 'Rahmah — mercy',
    body:
      'A word for tenderness, compassion, and mercy. It shares its root with two of the most repeated names of God. A small window into how central mercy is to the tradition.',
    arabic: 'رَحْمَة',
    transliteration: 'rahmah',
    translation: 'mercy, compassion',
    needsReview: true,
    sourceNote:
      'Single-word vocabulary. Verify vowelling and root relationship with an Arabic language reference.',
  },

  // ─────────────────────────────── FIQH ───────────────────────────────
  {
    id: 'fiqh-1',
    category: 'fiqh',
    title: 'The ablution (wudu), in brief',
    body:
      'Before prayer, Muslims perform a ritual washing of specific parts of the body. The general idea is cleanliness and readiness for worship. The exact steps, what invalidates it, and finer points differ by school.',
    needsReview: true,
    sourceNote:
      'Rulings differ by madhhab and must be verified. This is a neutral overview only — confirm the exact method and conditions with a qualified scholar for your school.',
  },
  {
    id: 'fiqh-2',
    category: 'fiqh',
    title: 'The five daily prayers',
    body:
      'The daily prayers are a cornerstone of practice, performed at set times through the day and night. Times, conditions, and specifics can vary in detail. Learn the practical method from a reliable teacher.',
    needsReview: true,
    sourceNote:
      'Rulings and prayer-time calculations differ by madhhab and locality and must be verified with a qualified scholar.',
  },
  {
    id: 'fiqh-3',
    category: 'fiqh',
    title: 'Zakat, in brief',
    body:
      'Zakat is an obligatory charity on qualifying wealth held over a period, distributed to eligible recipients. The thresholds, rates, and categories are technical. Always calculate with proper guidance.',
    needsReview: true,
    sourceNote:
      'Rulings, thresholds (nisab), and rates differ by madhhab and asset type and must be verified with a qualified scholar.',
  },
  {
    id: 'fiqh-4',
    category: 'fiqh',
    title: 'Fasting in Ramadan, in brief',
    body:
      'During Ramadan, Muslims fast from dawn to sunset — abstaining from food, drink, and other things. There are exemptions and detailed rules for travel, illness, and more. Confirm your situation with a scholar.',
    needsReview: true,
    sourceNote:
      'Rulings, exemptions, and make-up/expiation rules differ by madhhab and circumstance and must be verified with a qualified scholar.',
  },

  // ──────────────────────────── SCHOLAR QUOTES ────────────────────────────
  {
    id: 'quote-1',
    category: 'quote',
    title: 'On seeking knowledge',
    body:
      'A teacher once said that the one who walks a path seeking knowledge should walk it with humility, for the more one learns, the more one sees how much remains unknown.',
    attribution: 'Unverified — needs source',
    needsReview: true,
    sourceNote:
      '[Attributed quote — source needs verification.] Anonymous framing used deliberately; do not attach a named scholar without a verified reference.',
  },
  {
    id: 'quote-2',
    category: 'quote',
    title: 'On humility',
    body:
      'It is often said that true humility is not thinking less of yourself, but thinking of yourself less. A useful reminder — but attribution is uncertain and should be checked.',
    attribution: 'Unverified — needs source',
    needsReview: true,
    sourceNote:
      '[Attributed quote — source needs verification.] Widely circulated saying with disputed origin; confirm before attributing to anyone.',
  },
  {
    id: 'quote-3',
    category: 'quote',
    title: 'On the value of time',
    body:
      'A teacher once remarked that time is the one wealth we all spend equally and can never earn back — so guard it as carefully as you would guard gold.',
    attribution: 'Unverified — needs source',
    needsReview: true,
    sourceNote:
      '[Attributed quote — source needs verification.] Anonymous framing used deliberately; do not attach a named scholar without a verified reference.',
  },
  {
    id: 'quote-4',
    category: 'quote',
    title: 'On sincerity',
    body:
      'It has been said that the smallest deed done sincerely for God can outweigh a mountain of deeds done for the eyes of people. Confirm the wording and source before quoting.',
    attribution: 'Unverified — needs source',
    needsReview: true,
    sourceNote:
      '[Attributed quote — source needs verification.] Do not attach a named scholar or claim a hadith status without a verified reference.',
  },

  // ─────────────────────────────── REFLECTIONS ───────────────────────────────
  {
    id: 'reflection-1',
    category: 'reflection',
    title: 'One minute a day',
    body:
      'You do not need an hour to reconnect. A single minute — one verse, one phrase of remembrance, one grateful thought — repeated daily, quietly reshapes a life. Consistency beats intensity.',
    needsReview: true,
    sourceNote:
      'Original reflective writing (placeholder). No textual claims made; review tone and framing before publishing.',
  },
  {
    id: 'reflection-2',
    category: 'reflection',
    title: 'The heart and remembrance',
    body:
      'Hearts, like everything else, gather dust with neglect and clarity with attention. A few moments of remembrance are less about ritual and more about turning back toward what matters.',
    needsReview: true,
    sourceNote:
      'Original reflective writing (placeholder). Any implied textual basis should be sourced separately before publishing.',
  },
  {
    id: 'reflection-3',
    category: 'reflection',
    title: 'Small, steady deeds',
    body:
      'A small good deed you can keep doing is better than a grand one you abandon. Pick something tiny — two minutes of reading, one extra prayer of gratitude — and protect it.',
    needsReview: true,
    sourceNote:
      'Original reflective writing (placeholder). The "steady deeds" theme echoes a known narration — source it properly if quoted.',
  },
  {
    id: 'reflection-4',
    category: 'reflection',
    title: 'Enough for today',
    body:
      'Anxiety often lives in tomorrow. Bring your attention back to this hour: the task in front of you, the person beside you, the breath you are taking now. Do the next small right thing.',
    needsReview: true,
    sourceNote:
      'Original reflective writing (placeholder). Review tone and framing before publishing.',
  },
];

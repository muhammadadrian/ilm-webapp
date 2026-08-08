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
 *   - Each card also carries a topic THEME slug (see types.ts `Theme`),
 *     a life-topic dimension separate from its content-type category.
 * ============================================================================
 */

import type { Card, Category, Difficulty } from '../types';

/**
 * Raw seed cards (without a difficulty). Difficulty is attached below by a
 * sensible content-type mapping plus a handful of per-card overrides, keeping
 * the difficulty assignment in the seed data while avoiding noise on every
 * object literal.
 */
const RAW_CARDS: Omit<Card, 'difficulty'>[] = [
  // ─────────────────────────────── TAFSIR ───────────────────────────────
  {
    id: 'tafsir-1',
    category: 'tafsir',
    theme: 'stress-sabr',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'stress-sabr',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'business-ethics',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'stress-sabr',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'productivity',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'general',
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
    theme: 'productivity',
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
    theme: 'stress-sabr',
    title: 'Enough for today',
    body:
      'Anxiety often lives in tomorrow. Bring your attention back to this hour: the task in front of you, the person beside you, the breath you are taking now. Do the next small right thing.',
    needsReview: true,
    sourceNote:
      'Original reflective writing (placeholder). Review tone and framing before publishing.',
  },

  // ==========================================================================
  //  TOPIC-THEME PLACEHOLDER CARDS (added programmatically).
  //  ~80 cards across 8 life-topic themes. Same rules apply: every card is
  //  needsReview:true placeholder content pending qualified scholarly review.
  // ==========================================================================

  // ─────────── THEME: Stress & sabr (stress-sabr) ───────────
  {
    id: 'stress-sabr-tafsir',
    category: 'tafsir',
    theme: 'stress-sabr',
    title: 'Patience Through Trials — Surah Al-Baqarah 2:155-157',
    arabic: 'وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنْفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ',
    translation: 'And We will surely test you with something of fear and hunger and a loss of wealth, lives, and fruits, but give good tidings to the patient.',
    reference: 'Quran 2:155-157',
    body: 'This well-known passage tells believers that fear, hunger, and loss of wealth, life, or provision are to be expected as tests of faith — not signs of Allah\'s displeasure. Those who respond with patience (sabr) are given glad tidings, and the verses go on to describe them as those who, when struck by hardship, say words affirming that they and everything around them belong to Allah and will return to Him. The takeaway for daily stress is simple: hardship is part of the design of this life, and how we respond to it — not whether we face it — is what is being tested.',
    needsReview: true,
    sourceNote: 'Placeholder explanation only — this is a generic, non-scholarly summary. Before publishing, have a qualified reviewer verify the Arabic text and translation, and add a proper tafsir summary drawn from a recognized commentary (e.g., Ibn Kathir or al-Tabari) rather than this generic paraphrase.',
  },
  {
    id: 'stress-sabr-hadith',
    category: 'hadith',
    theme: 'stress-sabr',
    title: 'Ease After Hardship — A Hadith Theme',
    body: 'A recurring theme found in the hadith literature is that no fatigue, illness, sorrow, harm, or distress befalls a believer — not even the prick of a thorn — without Allah using it to remove some of their sins, if they respond with patience. This idea reframes stress and hardship not as pure loss, but as something that can carry unseen benefit for a believer who bears it well, without despair or complaint against Allah\'s decree. It is a comforting theme repeated across multiple traditions about illness, grief, and hardship in general.',
    needsReview: true,
    sourceNote: 'This is a paraphrased theme, not a quoted hadith — no specific wording, collection, or grading is claimed. Before publishing, replace this with an actual sourced hadith text, including the exact collection (e.g., Sahih al-Bukhari, Sahih Muslim) and authenticity grading, verified by a qualified hadith scholar.',
  },
  {
    id: 'stress-sabr-dua',
    category: 'dua',
    theme: 'stress-sabr',
    title: 'The Dua of Prophet Yunus (AS) in Distress',
    arabic: 'لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'Lā ilāha illā anta, subḥānaka, innī kuntu minaẕ-ẕālimīn',
    translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    reference: 'Quran 21:87',
    body: 'When Prophet Yunus (AS) found himself in the darkness of the whale\'s belly — a moment of extreme physical and emotional distress — he did not despair. Instead, he turned to Allah with humility, acknowledging his own shortcoming and affirming Allah\'s oneness. Many Muslims recite this dua during moments of anxiety, hardship, or feeling trapped, as a way of combining tawakkul (trust in Allah) with sincere self-reflection. It is short enough to repeat quietly in a stressful moment.',
    needsReview: true,
    sourceNote: 'Verify the Arabic text, diacritics, transliteration, and translation against a reliable Quran source. If any specific virtues or hadith about reciting this dua in distress are included in future versions, they must be separately verified for authenticity before publishing.',
  },
  {
    id: 'stress-sabr-aqidah',
    category: 'aqidah',
    theme: 'stress-sabr',
    title: 'A Test Is Not the Same as Punishment',
    body: 'A core belief in Islamic aqidah is that hardship in this life is not necessarily a sign of Allah\'s anger or a punishment for sin — it can equally be a test for someone Allah loves, meant to raise their rank, purify them, or draw them closer to Him. This belief works alongside trust in qadar (divine decree): everything that happens, including stressful events, occurs within Allah\'s knowledge and wisdom, even when the reason is not visible to us. Holding both ideas together — that Allah is All-Wise and that hardship can be a test rather than a rejection — is part of what makes sabr possible instead of despair.',
    needsReview: true,
    sourceNote: 'Have an aqidah-qualified scholar review this framing (tests vs. punishment, and its relationship to qadar) to confirm it accurately reflects mainstream Sunni aqidah sources before this is treated as doctrinally reliable content.',
  },
  {
    id: 'stress-sabr-fiqh',
    category: 'fiqh',
    theme: 'stress-sabr',
    title: 'Seeking Help for Anxiety — Does It Conflict with Tawakkul?',
    body: 'A common concern is whether seeking medical or psychological help for stress and anxiety conflicts with tawakkul (trust in Allah). The general position among many contemporary scholars is that it does not — tawakkul is trusting Allah while still taking permissible means, similar to eating when hungry or seeking treatment when ill. Combining dua, sabr, and professional support (therapy, medication where appropriate, community support) is generally seen as consistent with, not opposed to, reliance on Allah. That said, specific questions — such as particular treatments, therapy methods, or medications — can carry more detailed rulings that differ between scholars.',
    needsReview: true,
    sourceNote: 'This is a general orientation, not a fatwa. Rulings on specific treatments, therapies, or medications can differ by madhhab and by contemporary fiqh councils — verify with a qualified scholar or local fatwa body before presenting this as authoritative guidance.',
  },
  {
    id: 'stress-sabr-quote',
    category: 'quote',
    theme: 'stress-sabr',
    title: 'Patience Is Not the Absence of Feeling',
    attribution: 'Unverified — needs source.',
    body: 'A teacher once said: "Sabr does not mean pretending you feel nothing — it means choosing not to let what you feel push you into words or actions that displease Allah." This distinction matters for stress and anxiety: sabr is not suppression or denial of real emotional pain, but a disciplined response to it — continuing to pray, to hope, to speak kindly, and to trust Allah\'s plan even while the feeling of stress is still present.',
    needsReview: true,
    sourceNote: 'This quote is an anonymized placeholder, not a verified statement from any named scholar or teacher. Before publishing, either replace it with a properly sourced and attributed quote, or keep the anonymous framing explicit and clearly labeled as illustrative only.',
  },
  {
    id: 'stress-sabr-vocab',
    category: 'vocab',
    theme: 'stress-sabr',
    title: 'Key Terms: Sabr and Tawakkul',
    arabic: 'الصَّبْر / التَّوَكُّل',
    transliteration: 'Ṣabr / Tawakkul',
    body: 'Sabr is often translated as \'patience,\' but its scope is broader — it includes perseverance in obedience, restraint from sin, and steady endurance through hardship without complaint or despair. Tawakkul is \'trust\' or \'reliance\' — specifically, relying on Allah\'s plan and provision after having done what is within one\'s own effort and means. The two concepts work together: sabr is the steady endurance during difficulty, while tawakkul is the underlying trust that Allah\'s decree, even when it involves stress or hardship, is ultimately wise and good.',
    needsReview: true,
    sourceNote: 'Verify these definitions and the Arabic root meanings against a reputable Arabic lexicon (e.g., Lane\'s Lexicon) or an established Islamic studies reference before treating them as authoritative.',
  },
  {
    id: 'stress-sabr-seerah',
    category: 'seerah',
    theme: 'stress-sabr',
    title: 'The Prophet\'s Patience After Ta\'if',
    body: 'According to early biographical accounts, the Prophet ﷺ once traveled to the town of Ta\'if seeking support for his message and was met with rejection and physical harm from its people. Tradition holds that he was offered a chance to call down punishment on them, yet instead responded with a prayer asking for guidance for his people rather than their destruction. This episode is often cited as a model of sabr under intense emotional and physical stress — responding to hostility with restraint, dua, and hope rather than despair or vengeance.',
    needsReview: true,
    sourceNote: 'Verify the details of this incident, including the exact wording of any quoted dua, against a reliable seerah source (e.g., Ibn Hisham\'s or Ibn Ishaq\'s biography) with a qualified reviewer before publishing as historical fact.',
  },
  {
    id: 'stress-sabr-reflection',
    category: 'reflection',
    theme: 'stress-sabr',
    title: 'When Stress Feels Heavier Than Usual',
    body: 'Some days, stress builds up from many small things at once — work, family, health, uncertainty about the future — until it feels like too much to carry. It can help to remember that feeling overwhelmed is not a failure of faith; it is a human response that even the righteous have experienced. What sabr asks of us in that moment is not to feel nothing, but to keep turning back to Allah — through a short dua, a pause for wudu and prayer, or simply sitting quietly and remembering that this feeling, like all things, will pass. Small, repeated returns to Allah during stressful stretches often matter more than one dramatic moment of resolve.',
    needsReview: true,
    sourceNote: 'This is original reflective writing, not a scholarly text. A qualified reviewer should confirm the framing of sabr and emotional struggle here is consistent with sound Islamic guidance before wider use.',
  },
  {
    id: 'stress-sabr-adab',
    category: 'adab',
    theme: 'stress-sabr',
    title: 'The Adab of Directing Your Complaint to Allah',
    body: 'A quiet etiquette that many scholars highlight is the difference between describing one\'s hardship and complaining about it. It is natural and permitted to explain what one is going through — to a doctor, a friend, or a family member — especially when seeking real help. The adab of sabr is in where the complaint itself goes: directing frustration, grief, or anxiety primarily to Allah in dua, rather than habitually complaining about one\'s situation or about Allah\'s decree to other people. This does not mean silence or isolation — it means keeping one\'s inner posture toward Allah one of trust, even while outwardly seeking support.',
    needsReview: true,
    sourceNote: 'Verify this adab guidance (the distinction between describing hardship to seek help versus habitual complaint) against recognized adab/akhlaq literature with a qualified scholar before presenting it as settled guidance.',
  },

  // ─────────── THEME: Marriage (marriage) ───────────
  {
    id: 'marriage-tafsir',
    category: 'tafsir',
    theme: 'marriage',
    title: 'Sakinah, Mawaddah, and Rahmah',
    arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنْفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    translation: 'And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He placed between you love and mercy.',
    reference: 'Quran 30:21',
    body: 'Surah Ar-Rum (30:21) describes spouses as a sign of God\'s wisdom: He placed \'tranquility\' (sakinah), \'love\' (mawaddah), and \'mercy\' (rahmah) between husband and wife. This verse is often cited as a Quranic foundation for viewing marriage as a source of emotional calm and compassion, not merely a contract. The explanation here is a general, non-scholarly placeholder — the verse\'s fuller meaning and linguistic nuance require a proper tafsir.',
    needsReview: true,
    sourceNote: 'NEEDS REVIEW: This is a generic placeholder summary, not a scholarly tafsir. Replace/verify with an established tafsir (e.g. Ibn Kathir or al-Tabari) before publishing.',
  },
  {
    id: 'marriage-hadith',
    category: 'hadith',
    theme: 'marriage',
    title: 'Kindness to One\'s Spouse',
    body: 'A well-known theme in the hadith literature holds that a person\'s character is measured in part by how gently and patiently they treat their spouse at home. This card only paraphrases that general theme in neutral terms — no specific wording, collection, or grading is asserted here, since presenting an unverified hadith text as authentic would be inappropriate for a learning app.',
    needsReview: true,
    sourceNote: 'NEEDS REVIEW: Replace with a specific, sourced, and authenticated hadith, including its collection (e.g. Bukhari, Muslim, Abu Dawud, Tirmidhi) and grading, verified by a qualified scholar.',
  },
  {
    id: 'marriage-reflection',
    category: 'reflection',
    theme: 'marriage',
    title: 'Marriage as Mutual Mercy',
    body: 'Marriage, in this framing, is not one partner holding power over the other but two people entrusted with each other\'s wellbeing. Rights and duties flow in both directions: patience when the other is tired, forgiveness when words are harsh, support when life is difficult. Reflecting on marriage as a shared trust, rather than a transaction, can reshape how everyday friction is handled at home.',
    needsReview: true,
    sourceNote: 'NEEDS REVIEW: General reflection only; a qualified reviewer should confirm it aligns with mainstream scholarly understanding of spousal rights and does not overstate or understate them.',
  },
  {
    id: 'marriage-adab',
    category: 'adab',
    theme: 'marriage',
    title: 'Gentle Speech at Home',
    body: 'Adab (etiquette) toward a spouse includes small, consistent habits: greeting warmly, listening without interrupting, avoiding harsh sarcasm, and thanking them for ordinary things. Many teachers note that how a person speaks to those closest to them — not to strangers — is a truer test of character. Practicing gentle speech at home, especially during disagreements, is a practical expression of good manners in marriage.',
    needsReview: true,
    sourceNote: 'NEEDS REVIEW: General adab guidance; should be checked against classical adab literature and scholarly sources for accuracy and completeness.',
  },
  {
    id: 'marriage-dua',
    category: 'dua',
    theme: 'marriage',
    title: 'A Dua for a Righteous Family',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    transliteration: 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a\'yunin wa-j\'alna lil-muttaqina imama',
    translation: 'Our Lord, grant us from among our spouses and offspring comfort to our eyes, and make us an example for the righteous.',
    reference: 'Quran 25:74',
    body: 'This is one of the more widely known Quranic duas, asking for a spouse and family that bring peace and become a means of righteousness for the wider community. It is commonly recited by those seeking a blessed marriage or family life.',
    needsReview: true,
    sourceNote: 'NEEDS REVIEW: Verify Arabic diacritics, transliteration, and translation accuracy against a trusted Quran source before publishing.',
  },
  {
    id: 'marriage-aqidah',
    category: 'aqidah',
    theme: 'marriage',
    title: 'Marriage as a Solemn Covenant',
    arabic: 'وَأَخَذْنَ مِنكُم مِّيثَاقًا غَلِيظًا',
    translation: '...and they have taken from you a solemn covenant.',
    reference: 'Quran 4:21',
    body: 'The Quran describes the marital bond using the phrase \'mithaqan ghalizan\' — a solemn, weighty covenant, a term used elsewhere for covenants with the prophets. This framing places marriage within a belief-centered view of commitments: not merely a social arrangement, but a trust taken before God, carrying real accountability for how each spouse is treated.',
    needsReview: true,
    sourceNote: 'NEEDS REVIEW: Confirm translation and the theological framing of \'mithaqan ghalizan\' with a qualified scholar; avoid overstating doctrinal claims.',
  },
  {
    id: 'marriage-fiqh',
    category: 'fiqh',
    theme: 'marriage',
    title: 'Mahr and Mutual Rights',
    body: 'Islamic law generally requires a mahr (a gift from husband to wife at marriage) and recognizes rights and responsibilities for both spouses, such as financial maintenance, companionship, and fair treatment. Specific details — the amount of mahr, the exact scope of maintenance, and how rights are balanced — differ across madhahib (schools of jurisprudence) and are shaped by local custom and mutual agreement.',
    needsReview: true,
    sourceNote: 'NEEDS REVIEW: Fiqh rulings vary by madhhab and context; consult a qualified scholar or local fatwa council before treating any specific ruling as definitive.',
  },
  {
    id: 'marriage-quote',
    category: 'quote',
    theme: 'marriage',
    title: 'A Garden That Needs Tending',
    attribution: 'Unverified — needs source.',
    body: 'A teacher once said that a marriage is like a garden: it does not stay green just because it was once planted well — it needs regular watering through kind words, patience, and small acts of care. This saying is offered as a general, illustrative reflection, not a verified quotation from any specific named scholar.',
    needsReview: true,
    sourceNote: 'NEEDS REVIEW: This is an anonymized, illustrative saying. Do not attribute it to any real named scholar unless a verified source is located.',
  },
  {
    id: 'marriage-vocab',
    category: 'vocab',
    theme: 'marriage',
    title: 'Vocabulary: Sakinah',
    arabic: 'سكينة',
    transliteration: 'Sakinah',
    translation: 'Tranquility / peaceful settledness',
    reference: 'Related usage: Quran 30:21',
    body: '\'Sakinah\' is an Arabic term often translated as tranquility, calm, or peaceful settledness. In the context of marriage, it describes the ease and rest spouses can find in one another — referenced in Quran 30:21 alongside \'mawaddah\' (love) and \'rahmah\' (mercy). Understanding this term helps frame marriage as a source of emotional stability, not only obligation.',
    needsReview: true,
    sourceNote: 'NEEDS REVIEW: Confirm the linguistic definition and Quranic usage with an Arabic-language or tafsir specialist.',
  },
  {
    id: 'marriage-seerah',
    category: 'seerah',
    theme: 'marriage',
    title: 'An Example of Household Kindness',
    body: 'Various accounts describe the Prophet Muhammad (peace be upon him) as attentive and helpful within his own household — assisting with chores and treating those closest to him with warmth. This card intentionally avoids citing a specific narration or exact wording, since presenting seerah details without a verified source risks inaccuracy in a learning context.',
    needsReview: true,
    sourceNote: 'NEEDS REVIEW: Replace with specific, sourced seerah accounts (with citations) verified by a qualified scholar before publishing; avoid unsourced narrative claims.',
  },

  // ─────────── THEME: Rizq (rizq) ───────────
  {
    id: 'rizq-tafsir',
    category: 'tafsir',
    theme: 'rizq',
    title: 'Rizq Is Guaranteed for Every Creature',
    arabic: 'وَمَا مِن دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا',
    transliteration: 'Wa maa min daabbatin fil-ardi illaa \'alallaahi rizquhaa',
    translation: 'And there is no creature on earth but that its provision is due from Allah.',
    reference: 'Surah Hud 11:6',
    body: 'This verse reminds us that every living being\'s sustenance is guaranteed by Allah, from the smallest insect to every human. It is often reflected on as a call to trust Allah\'s plan for our provision while still working diligently through permissible means. (Placeholder explanation only — not a scholarly tafsir.)',
    needsReview: true,
    sourceNote: '[NEEDS REVIEW] This is a generic placeholder explanation, not a verified tafsir. A qualified scholar must check the Arabic text, translation, and replace the explanation with an authentic tafsir reference (e.g., Ibn Kathir, al-Tabari) before publishing.',
  },
  {
    id: 'rizq-hadith',
    category: 'hadith',
    theme: 'rizq',
    title: 'Trust Paired with Effort',
    body: 'There is a well-known hadith theme comparing a bird that leaves its nest hungry in the morning and returns full in the evening — illustrating that relying on Allah (tawakkul) for one\'s provision goes hand in hand with going out and making effort, not sitting idle. This placeholder only describes the theme, not the actual hadith wording.',
    needsReview: true,
    sourceNote: '[NEEDS REVIEW] Do not treat this as an actual hadith quotation. A qualified person must replace this with the precise, authenticated hadith text, its collection (e.g., Sunan al-Tirmidhi), and its grading.',
  },
  {
    id: 'rizq-aqidah',
    category: 'aqidah',
    theme: 'rizq',
    title: 'Allah Is Ar-Razzaq, The Provider',
    body: 'Among Allah\'s beautiful names is Ar-Razzaq, \'The Provider.\' Believing in this name means trusting that all provision — wealth, food, health, family, knowledge, and opportunities — ultimately comes from Allah alone, even when it reaches us through our own effort or other people. This belief shapes how a believer works, saves, and gives without arrogance or despair.',
    needsReview: true,
    sourceNote: '[NEEDS REVIEW] Verify the theological framing of the divine name Ar-Razzaq and the scope of \'rizq\' against a recognized aqidah text with a qualified scholar.',
  },
  {
    id: 'rizq-adab',
    category: 'adab',
    theme: 'rizq',
    title: 'Manners in Seeking a Livelihood',
    body: 'Etiquette around earning includes: beginning the day with dua before starting work, being diligent and honest in one\'s trade, not neglecting prayer for the sake of income, avoiding excessive anxiety about the future, and remembering to thank Allah after receiving provision. These small habits are meant to keep work grounded in faith rather than becoming an end in itself.',
    needsReview: true,
    sourceNote: '[NEEDS REVIEW] This is general adab guidance assembled as a placeholder. A knowledgeable teacher should confirm these practices are commonly taught and attach supporting evidence.',
  },
  {
    id: 'rizq-dua',
    category: 'dua',
    theme: 'rizq',
    title: 'Musa\'s Dua for Provision',
    arabic: 'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
    transliteration: 'Rabbi innee limaa anzalta ilayya min khayrin faqeer',
    translation: 'My Lord, indeed I am in need of whatever good You send down to me.',
    reference: 'Surah Al-Qasas 28:24',
    body: 'After fleeing his city, exhausted and without resources, Prophet Musa (peace be upon him) made this simple, humble dua asking Allah for whatever good He would provide. Many recite it today when seeking sustenance, help, or relief in difficult circumstances.',
    needsReview: true,
    sourceNote: '[NEEDS REVIEW] Confirm the Arabic text, transliteration, and translation against a reliable Quran source, and verify the contextual description with a tafsir before publishing.',
  },
  {
    id: 'rizq-fiqh',
    category: 'fiqh',
    theme: 'rizq',
    title: 'Is This Income Halal? Basics to Check',
    body: 'Common principles used when evaluating whether an income source is permissible include avoiding riba (interest), gambling-like transactions, deception, and dealing in prohibited goods, and ensuring contracts are transparent. Modern cases like stock investing, cryptocurrency, and gig-platform work involve details that scholars assess differently. This is only a starting checklist, not a ruling.',
    needsReview: true,
    sourceNote: '[NEEDS REVIEW] Fiqh rulings on earning and specific transactions differ by madhhab and by the details of each case. A qualified fiqh scholar must review this and cite applicable positions and sources before publishing.',
  },
  {
    id: 'rizq-quote',
    category: 'quote',
    theme: 'rizq',
    title: 'On Contentment with What Is Given',
    attribution: 'Unverified — needs source.',
    body: 'A teacher once said: \'True richness is not in having plenty, but in a heart content with what it has been given.\' This idea of qana\'ah (contentment) is often taught as the inner companion to working for one\'s rizq — striving outwardly while remaining at peace inwardly with the outcome.',
    needsReview: true,
    sourceNote: '[NEEDS REVIEW] This quote is an unattributed placeholder, not verified to any real named scholar. Replace with a properly sourced quote or clearly-labeled anonymous wisdom, verified before publishing.',
  },
  {
    id: 'rizq-vocab',
    category: 'vocab',
    theme: 'rizq',
    title: 'Word Study: Rizq',
    arabic: 'رِزْق',
    transliteration: 'Rizq',
    translation: 'Provision, sustenance',
    body: 'Rizq comes from the Arabic root ر-ز-ق (r-z-q), meaning \'to provide\' or \'to sustain.\' While often used for money or food, in Islamic usage rizq is broader — it can include health, knowledge, family, time, and even beneficial opportunities. Everything that sustains a person\'s life is considered a form of rizq from Allah.',
    needsReview: true,
    sourceNote: '[NEEDS REVIEW] Verify the root derivation and the full scope of meaning against a reliable Arabic lexicon (e.g., Lane\'s Lexicon) or a qualified Arabic teacher.',
  },
  {
    id: 'rizq-seerah',
    category: 'seerah',
    theme: 'rizq',
    title: 'An Example of Honest Trade',
    body: 'Before his prophethood, Muhammad (peace be upon him) was known among his people as trustworthy in business, including trading journeys such as those associated with Khadijah\'s caravans to Syria. This reputation for honesty in earning a livelihood is often highlighted as an early model of ethical trade and reliable dealing with others.',
    needsReview: true,
    sourceNote: '[NEEDS REVIEW] This is a general historical reference assembled as a placeholder. A qualified teacher must verify the specific seerah details and cite proper sources (e.g., Ibn Hisham, Ibn Ishaq) before publishing.',
  },
  {
    id: 'rizq-reflection',
    category: 'reflection',
    theme: 'rizq',
    title: 'Gratitude Multiplies Provision',
    reference: 'cf. Surah Ibrahim 14:7',
    body: 'There\'s a recurring Quranic theme that gratitude (shukr) is connected to an increase in blessings, echoing the idea in Surah Ibrahim 14:7 that thankfulness leads to more. A moment to reflect: when provision feels scarce, has gratitude for what is already present been part of the response, or has focus stayed only on what is missing?',
    needsReview: true,
    sourceNote: '[NEEDS REVIEW] This reflection references the general theme of Surah Ibrahim 14:7. Verify the exact translation and its application against a scholarly tafsir before publishing.',
  },

  // ─────────── THEME: Productivity in Islam (productivity) ───────────
  {
    id: 'productivity-tafsir',
    category: 'tafsir',
    theme: 'productivity',
    title: 'Time as a Sworn Witness — Surah al-\'Asr',
    arabic: 'وَالْعَصْرِ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
    transliteration: 'Wal-\'asr(i), innal-insana lafi khusr(in), illal-ladhina amanu wa \'amilus-salihati wa tawasaw bil-haqqi wa tawasaw bis-sabr',
    translation: 'By time! Truly mankind is in loss, except those who believe, do righteous deeds, enjoin truth upon one another, and enjoin patience upon one another.',
    reference: 'Qur\'an 103:1-3',
    body: 'Allah opens this short surah by swearing an oath by time itself — a sign of how significant it is. The general theme is that time slips away and is easily wasted unless a person anchors their days in faith, righteous action, honest speech with others, and patience. Scholars have written extensively on what \'loss\' and each condition mean in depth; the short summary here is only a starting point for reflection, not a substitute for real study.',
    needsReview: true,
    sourceNote: 'Placeholder only — the explanation above is a neutral generic summary and must be replaced with verified tafsir (e.g. Ibn Kathir, al-Tabari, or another accepted commentary) reviewed by a qualified scholar before publishing. Also verify the Arabic text, transliteration, and translation against a trusted Quran source.',
  },
  {
    id: 'productivity-hadith',
    category: 'hadith',
    theme: 'productivity',
    title: 'Hadith Theme: Two Blessings Often Undervalued',
    body: 'Hadith literature is widely known to describe certain blessings — often mentioned alongside free time and good health — as gifts many people take for granted until they are gone. The broader theme is a call to make deliberate, productive use of the time and capacity Allah has given us, rather than assuming it will always be available. This card only paraphrases a general theme; no specific hadith wording, collection, or grading is asserted here.',
    needsReview: true,
    sourceNote: 'This is a paraphrased theme, not a hadith quotation. Before publishing, replace it with a specific, authenticated hadith — including the collection (e.g. Bukhari, Muslim, or another recognized source) and its grading — verified by a qualified hadith scholar.',
  },
  {
    id: 'productivity-aqidah',
    category: 'aqidah',
    theme: 'productivity',
    title: 'Qadar and Effort Work Together',
    body: 'A core belief in Islam is that Allah has decreed all outcomes (qadar), yet believers are still commanded to strive, plan, and work diligently. Productivity in Islam isn\'t fatalism (\'whatever happens, happens\') nor is it self-reliance that forgets Allah. It sits between the two: put in sincere effort and sound planning, then place trust (tawakkul) in Allah for the result. Understanding this balance correctly protects against both laziness and anxious overwork.',
    needsReview: true,
    sourceNote: 'This is a simplified placeholder summary of a nuanced aqidah topic (qadar and tawakkul). Verify the wording and balance against a qualified aqidah text or scholar before publishing, to avoid misrepresenting either extreme.',
  },
  {
    id: 'productivity-adab',
    category: 'adab',
    theme: 'productivity',
    title: 'Beginning Work with Intention',
    body: 'A simple productivity habit rooted in adab is to pause before starting a task: say \'Bismillah,\' and renew your intention (niyyah) that the work is for Allah\'s sake — whether it\'s study, a job, or housework. Being organized, punctual, and tidy in one\'s affairs is also widely regarded as good character (husn al-khuluq) rather than a purely secular skill. Small, consistent habits like these are meant to turn ordinary tasks into acts of worship.',
    needsReview: true,
    sourceNote: 'General adab guidance placeholder — verify the recommendations against classical adab literature and confirm practical applications with a knowledgeable teacher before publishing.',
  },
  {
    id: 'productivity-dua',
    category: 'dua',
    theme: 'productivity',
    title: 'Dua for Ease in a Difficult Task',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    transliteration: 'Rabbi ashrah li sadri wa yassir li amri',
    translation: 'My Lord, expand for me my chest (grant me calm and capacity), and ease my task for me.',
    reference: 'Qur\'an 20:25-26',
    body: 'Before undertaking a daunting mission, Musa (peace be upon him) asked Allah for two things: an expanded, steady heart and genuine ease in the task ahead. Many people recite this dua before a big project, exam, or responsibility, asking Allah to remove unnecessary difficulty and grant clarity and capacity to carry it through — a reminder that productivity begins with seeking Allah\'s help, not willpower alone.',
    needsReview: true,
    sourceNote: 'Verify the Arabic diacritics, transliteration, and translation against a trusted Quran text, and confirm the context notes about when/how it\'s used with a qualified teacher before publishing.',
  },
  {
    id: 'productivity-seerah',
    category: 'seerah',
    theme: 'productivity',
    title: 'Organizing Time and Tasks — A Seerah Theme',
    body: 'Seerah accounts are generally understood to describe the Prophet ﷺ as someone who organized his time deliberately — balancing worship, family, community responsibilities, and delegating tasks to capable companions rather than doing everything himself. This is presented here only as a general theme drawn broadly from his biography, not as a specific narrated incident, and should be treated as an illustrative starting point rather than a settled historical detail.',
    needsReview: true,
    sourceNote: 'This is a generic seerah theme, not a specific narration. Replace with a verified account from a reliable seerah source (e.g. Ibn Hisham or another recognized biography, cross-checked with authenticated hadith where relevant) reviewed by a qualified scholar before publishing.',
  },
  {
    id: 'productivity-vocab',
    category: 'vocab',
    theme: 'productivity',
    title: 'Vocab: Barakah (بركة)',
    arabic: 'بركة',
    transliteration: 'Barakah',
    translation: 'Blessing; an increase or benefit granted by Allah that goes beyond what effort or time alone would normally produce.',
    body: 'In everyday use, barakah describes getting more good, benefit, or result out of something than its size or duration would suggest — a short but focused work session that accomplishes more than hours of distracted effort, for example. In discussions of productivity, people often say sincerity, remembrance of Allah, and avoiding wastefulness are ways to seek barakah in one\'s time and work, rather than relying on sheer hours put in.',
    needsReview: true,
    sourceNote: 'This definition is a general placeholder — verify the precise linguistic and scholarly definition and its usage with an Arabic-language reference or qualified scholar before publishing.',
  },
  {
    id: 'productivity-fiqh',
    category: 'fiqh',
    theme: 'productivity',
    title: 'Fiqh Note: Fulfilling Work Agreements on Time',
    body: 'Islamic legal tradition places strong emphasis on honoring contracts, paying wages promptly, and not wasting other people\'s time or resources through delay or negligence. This has direct relevance to productivity: showing up on time, meeting deadlines, and delivering on commitments are treated as matters of justice (\'adl), not just professional etiquette. That said, the exact obligations of an employer or employee, permissible breaks, and related details can differ across schools of law.',
    needsReview: true,
    sourceNote: 'Fiqh placeholder — specific rulings vary by madhhab (Hanafi, Shafi\'i, Maliki, Hanbali) and by local custom/contract terms. Verify specifics with a qualified fiqh scholar or a reliable fiqh reference before publishing.',
  },
  {
    id: 'productivity-quote',
    category: 'quote',
    theme: 'productivity',
    title: 'A Teacher Once Said: On Wasted Hours',
    attribution: 'Unverified — needs source.',
    body: 'A teacher once said something along the lines of: \'A person who guards their wealth but lets their hours slip away carelessly has protected the lesser treasure and lost the greater one.\' Sayings like this circulate widely in reminders about productivity and time, but the exact wording and original speaker are often unclear or unverifiable online.',
    needsReview: true,
    sourceNote: 'This is an anonymous placeholder quote. Do not attribute it to any named scholar unless a genuine, sourced quotation is located and verified — otherwise keep the attribution anonymous or replace the quote entirely.',
  },
  {
    id: 'productivity-reflection',
    category: 'reflection',
    theme: 'productivity',
    title: 'Reflection: Guarding Against Israf of Time',
    body: 'Israf usually comes up in discussions of wasting food, water, or money — but the same principle can be applied to time. A day scrolled away without intention, or hours spent on nothing of benefit, may be a quieter form of the same waste the Quran warns against elsewhere. Take a moment today to ask: where did my last few hours actually go, and would I be comfortable if that were a habit for the rest of my life?',
    needsReview: true,
    sourceNote: 'General reflection placeholder — verify that the analogy drawn between financial/material israf and \'wasted time\' aligns with accepted scholarly understanding before publishing, rather than presenting it as an established ruling.',
  },

  // ─────────── THEME: Parenting (parenting) ───────────
  {
    id: 'parenting-reflection',
    category: 'reflection',
    theme: 'parenting',
    title: 'Children Are a Trust (Amanah)',
    body: 'In Islamic thought, children are often described as an amanah (trust) placed in a parent\'s care rather than a possession. This framing invites reflection: every child arrives with their own fitrah (innate disposition), and the parent\'s role is to nurture, protect, and guide rather than to control. Sitting with this idea for a moment can reshape how a difficult parenting moment feels — less like a battle to win, and more like a trust to honor with patience and gentleness.',
    needsReview: true,
    sourceNote: 'General reflection prompt, not a specific ruling or hadith. If tying this to a particular verse or hadith about amanah and children, have a qualified teacher verify the exact reference before publishing.',
  },
  {
    id: 'parenting-adab',
    category: 'adab',
    theme: 'parenting',
    title: 'Gentleness With Little Ones',
    body: 'Islamic adab (etiquette) toward children emphasizes softness in tone, patience with repetition, and treating a child\'s mistakes as part of learning rather than defiance. Practical adab includes greeting children warmly, listening when they speak, and correcting privately rather than shaming in front of others — manners the earliest Muslim community is remembered for showing toward the young among them.',
    needsReview: true,
    sourceNote: 'Placeholder adab summary. Needs a qualified reviewer to confirm the content and, if a supporting hadith is added, to verify its collection and grading.',
  },
  {
    id: 'parenting-dua',
    category: 'dua',
    theme: 'parenting',
    title: 'A Prayer for Righteous Children',
    arabic: 'رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ',
    transliteration: 'Rabbi hab lī min aṣ-ṣāliḥīn',
    translation: 'My Lord, grant me [offspring] from among the righteous.',
    reference: 'Quran 37:100 (see also similar prayers in 3:38 and 25:74)',
    body: 'This is one of several well-known Quranic prayers for righteous offspring. Reciting it is a simple way to turn a parent\'s hopes for their child into a moment of remembrance and supplication to God.',
    needsReview: true,
    sourceNote: 'Common-knowledge Quranic dua. Verify the Arabic text, diacritics, transliteration, and translation against a trusted Quran edition before publishing.',
  },
  {
    id: 'parenting-tafsir',
    category: 'tafsir',
    theme: 'parenting',
    title: 'Wealth and Children as Adornment',
    arabic: 'الْمَالُ وَالْبَنُونَ زِينَةُ الْحَيَاةِ الدُّنْيَا',
    translation: 'Wealth and children are the adornment of worldly life...',
    reference: 'Quran 18:46',
    body: 'This verse names children among the adornments of this life, while the remainder of the verse points to lasting good deeds as what truly endures. A generic, commonly repeated reading is that this is not a condemnation of loving one\'s children, but a reminder to raise them toward lasting good rather than mere worldly attachment. The fuller meaning should come from a proper tafsir, not from this placeholder.',
    needsReview: true,
    sourceNote: 'Placeholder tafsir note only — the explanation given here is generic and unattributed. Verify against a recognized tafsir (e.g., Ibn Kathir, al-Tabari, al-Qurtubi) for accurate meaning and context before publishing.',
  },
  {
    id: 'parenting-hadith',
    category: 'hadith',
    theme: 'parenting',
    title: 'Mercy Toward Children',
    body: 'A recurring theme in accounts of the Prophet\'s ﷺ character is mercy toward children — being affectionate with them, including children who were not his own, and remaining patient with their interruptions even during serious moments. The general theme repeated across multiple narrations is that gentleness with children reflects good character rather than a lapse in seriousness.',
    needsReview: true,
    sourceNote: 'This is a paraphrased theme, not a direct hadith quotation, and carries no claimed collection or grading. Replace with a specific, sourced, authenticated hadith (collection name and grading) before publishing.',
  },
  {
    id: 'parenting-aqidah',
    category: 'aqidah',
    theme: 'parenting',
    title: 'Every Child Is Born on the Fitrah',
    body: 'A foundational belief in Islamic tradition is that every child is born with a natural inclination (fitrah) toward recognizing God, and that upbringing and environment shape which direction that inclination is nurtured toward. This carries a significant implication for parents: the home is often the first and strongest shaper of a child\'s later belief and character.',
    needsReview: true,
    sourceNote: 'This touches a well-known concept (fitrah) associated with hadith literature. The underlying hadith wording, collection, and grading must be verified by a qualified reviewer before publishing.',
  },
  {
    id: 'parenting-fiqh',
    category: 'fiqh',
    theme: 'parenting',
    title: 'When Do Children Begin Learning to Pray?',
    body: 'Many scholars discuss encouraging children to begin practicing prayer around age seven, with more consistent expectation by around age ten, while children are not held religiously accountable (mukallaf) until puberty. Exact ages, methods of encouragement, and supporting details differ across the madhhabs and between individual scholars, so this should be read as a general orientation rather than a fixed ruling.',
    needsReview: true,
    sourceNote: 'Fiqh positions vary by madhhab and scholar. Verify exact ages, conditions, and supporting evidence with a qualified teacher of fiqh before treating this as a ruling.',
  },
  {
    id: 'parenting-quote',
    category: 'quote',
    theme: 'parenting',
    title: 'A Teacher on Patience',
    attribution: 'Unverified — needs source.',
    body: '"A teacher once said: \'The child who tests your patience the most is often the one teaching you the most about yourself.\'" Reflections like this are commonly shared in parenting advice circles, though this exact wording and its original source are unclear.',
    needsReview: true,
    sourceNote: 'Anonymous, unattributed quote used only as a placeholder. Do not attribute this to any named scholar or figure unless a genuine, verifiable source is located.',
  },
  {
    id: 'parenting-vocab',
    category: 'vocab',
    theme: 'parenting',
    title: 'Tarbiyah — Nurturing Upbringing',
    arabic: 'تربية',
    transliteration: 'Tarbiyah',
    translation: 'Upbringing / nurturing development',
    body: 'Tarbiyah is an Arabic term often translated as \'upbringing\' or \'nurturing education,\' but it carries a broader sense of cultivating a person gradually — like tending a growing plant — across character, faith, and habits, not academic knowledge alone. In parenting contexts, tarbiyah describes the patient, holistic process of raising a child.',
    needsReview: true,
    sourceNote: 'General vocabulary definition. Verify linguistic nuance and any specific Quranic or hadith usage citation with a qualified Arabic/Islamic studies teacher before publishing.',
  },
  {
    id: 'parenting-seerah',
    category: 'seerah',
    theme: 'parenting',
    title: 'Playful Moments With Children',
    body: 'Seerah accounts describe the Prophet ﷺ engaging warmly with children in daily life — greeting them individually, letting them climb on him, and pausing to check on a child\'s wellbeing. These remembered moments are often cited as a model for combining dignity with approachability when relating to the young.',
    needsReview: true,
    sourceNote: 'General seerah theme paraphrased for placeholder use, with no specific narration cited. Any specific account added later must be checked for authenticity, correct wording, and source (biographical work or hadith collection) before publishing.',
  },

  // ─────────── THEME: Youth (youth) ───────────
  {
    id: 'youth-reflection',
    category: 'reflection',
    theme: 'youth',
    title: 'Youth Is Not a Waiting Room',
    body: 'It\'s easy to treat youth as a rehearsal for \'real life\' — as if nothing you do now truly counts yet. But the energy, curiosity, and physical strength you have right now are themselves a trust (amanah). Every good habit you build, every act of courage to do the right thing, every hour spent learning or serving others is being recorded, not postponed for later. Many of the people who accomplished the most for this community did so while still young. A simple question worth sitting with: what is one good habit you could start today, while you still have this energy, instead of waiting for a \'better\' season of life that may never arrive the way you imagine?',
    needsReview: true,
    sourceNote: 'General reflective content, not a direct scriptural citation. Have a qualified reviewer confirm the framing is balanced, accurate in tone, and not overly moralizing before publishing.',
  },
  {
    id: 'youth-adab',
    category: 'adab',
    theme: 'youth',
    title: 'Manners With Those Older Than You',
    body: 'Islamic adab places real weight on how young people treat elders — parents, teachers, and community members. In practice this can look like: lowering your voice when an elder is speaking, not correcting them sharply in front of others, offering your seat, greeting them first, and listening fully before jumping in with your own opinion. This isn\'t about young voices being silenced; it\'s about earning trust and wisdom by first learning to listen well. Confidence and good adab aren\'t opposites — some of the most respected young people are those who combine a clear sense of self with real humility toward those who came before them.',
    needsReview: true,
    sourceNote: 'General etiquette summary. Verify these specific points against an established adab text or curriculum (e.g. a reviewed treatment of adab literature) with a qualified teacher before publishing.',
  },
  {
    id: 'youth-dua',
    category: 'dua',
    theme: 'youth',
    title: 'A Prophet\'s Dua for Wisdom',
    arabic: 'رَبِّ هَبْ لِي حُكْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ',
    transliteration: 'Rabbi hab lee hukman wa alhiqnee bis-saaliheen',
    translation: 'My Lord, grant me sound judgement and join me with the righteous.',
    reference: 'Quran 26:83',
    body: 'This is part of a dua attributed to Prophet Ibrahim (peace be upon him) in the Quran. It\'s a fitting dua for a young person navigating big decisions: it doesn\'t ask for ease or status, but for wisdom — the judgment to make good choices — and for good company, since who you surround yourself with shapes who you become. Consider making this dua your own during moments of uncertainty about direction, friendships, or purpose.',
    needsReview: true,
    sourceNote: 'Verify the Arabic text, transliteration, and translation wording against a trusted published Quran translation (e.g. Saheeh International or a comparable reviewed edition) before publishing.',
  },
  {
    id: 'youth-tafsir',
    category: 'tafsir',
    theme: 'youth',
    title: 'The Youths Who Believed',
    arabic: 'إِنَّهُمْ فِتْيَةٌ آمَنُوا بِرَبِّهِمْ وَزِدْنَاهُمْ هُدًى',
    transliteration: 'Innahum fityatun aamanoo bi Rabbihim wa zidnaahum hudaa',
    translation: 'Indeed, they were youths who believed in their Lord, and We increased them in guidance.',
    reference: 'Quran 18:13',
    body: 'This verse introduces the young people of the well-known story often called \'the Companions of the Cave,\' who held firmly to their belief despite pressure from their society. The verse links two things directly: their youthful faith, and Allah increasing their guidance in response. [Placeholder note: a full explanation of this verse\'s context, the identity of these youths, and the lessons scholars draw from it requires a proper tafsir and is not given here.]',
    needsReview: true,
    sourceNote: 'The explanation above is a generic placeholder only. Must be replaced with an accurate, properly cited summary drawn from a recognized tafsir (e.g. Ibn Kathir, al-Tabari, or al-Qurtubi) by a qualified reviewer before publishing.',
  },
  {
    id: 'youth-hadith',
    category: 'hadith',
    theme: 'youth',
    title: 'The Weight of a Youth\'s Worship',
    body: 'There is a well-known theme in the hadith literature describing certain people who receive special honor from Allah on a day when most people will be in great need of relief — among them is a young person who directed their energy toward the remembrance and worship of Allah rather than drifting into heedlessness. Youth is often exactly when bad habits are easiest to pick up and good ones are easiest to build, since there\'s usually more free time, fewer responsibilities, and more raw energy than at any other stage of life. [This is a paraphrase of a general hadith theme, not a direct quotation.]',
    needsReview: true,
    sourceNote: 'This is a paraphrased theme only, not a verified hadith text or citation. Must be replaced with an authenticated hadith including its full collection reference and grading (e.g. via Bukhari, Muslim, or another recognized source) verified by a qualified scholar before publishing.',
  },
  {
    id: 'youth-aqidah',
    category: 'aqidah',
    theme: 'youth',
    title: 'Seen Even When No One Else Is Watching',
    body: 'A foundational belief in Islam is that Allah is constantly aware — nothing is hidden from Him, whether it happens in a crowded room or completely alone. For a young person navigating private choices (what you watch, what you say in a group chat, how you act when no adult is around), this belief is meant to function less like surveillance and more like grounding: your integrity doesn\'t depend on whether anyone else finds out. Living consistently, whether seen or unseen, is part of what it means to take this belief seriously rather than just recite it.',
    needsReview: true,
    sourceNote: 'Verify the theological framing here — including how Allah\'s attributes of awareness and watchfulness are properly described — against a standard aqidah text with a qualified teacher before publishing.',
  },
  {
    id: 'youth-fiqh',
    category: 'fiqh',
    theme: 'youth',
    title: 'When Do Religious Obligations Begin?',
    body: 'In Islamic law, reaching puberty (bulugh) is generally the point at which a person becomes religiously accountable (mukallaf) for obligations like prayer and fasting, though the exact physical and age-based signs, and how they\'re applied, can differ between scholars and schools of thought. Some young people reach this stage earlier or later than peers, which is completely normal and not something to feel anxious about. If you\'re unsure where you stand or how a specific ruling applies to you, the right move is always to ask a knowledgeable teacher directly rather than guess or rely on assumptions from friends.',
    needsReview: true,
    sourceNote: 'Fiqh positions on bulugh and the onset of taklif differ across madhahib and specific scholarly opinions. Verify the details and note which school(s), if any, are being represented with a qualified fiqh teacher before publishing.',
  },
  {
    id: 'youth-quote',
    category: 'quote',
    theme: 'youth',
    title: 'A Teacher Once Said…',
    attribution: 'Unverified — needs source.',
    body: '"Your youth is a loan, not a gift — one day you\'ll be asked what you did with it." A saying like this circulates in different forms in various communities, often attributed loosely to unnamed teachers or elders. Whether or not the exact wording can be traced to one person, the sentiment reflects a widely shared idea: youth passes quickly, and how it\'s spent tends to shape the decades that follow.',
    needsReview: true,
    sourceNote: 'This quote is anonymized placeholder text and is not attributed to any real, named scholar. Verify its authenticity and correct attribution, or replace it entirely with a properly sourced quote, before publishing.',
  },
  {
    id: 'youth-vocab',
    category: 'vocab',
    theme: 'youth',
    title: 'Word of the Day: Shabab',
    arabic: 'شَبَاب',
    transliteration: 'shabāb',
    translation: 'youth / young people',
    body: 'The Arabic word \'shabab\' (شباب) refers to youth or young people, drawn from a root associated with vigor and freshness — the same general root family relates to ideas of youthful strength. You\'ll hear it used across the Muslim world both casually (\'the shabab are meeting at the masjid\') and in more formal religious discussion about the specific virtues and responsibilities associated with this stage of life.',
    needsReview: true,
    sourceNote: 'Verify the Arabic root, morphology, and usage notes with a qualified Arabic language instructor before publishing.',
  },
  {
    id: 'youth-seerah',
    category: 'seerah',
    theme: 'youth',
    title: 'Young Companions Who Shaped History',
    body: 'Early Muslim history includes a number of young companions who took on serious responsibility well before what might be expected today — some accepted Islam as teenagers despite social risk, and others were entrusted with teaching, leading, or representing the early Muslim community at a young age. Their stories are often used to illustrate that capability and sincerity were valued over age alone in the early community, and that being young was never treated as a disqualification from contributing meaningfully. Specific names, ages, and incidents vary in detail across sources and deserve careful, sourced study rather than casual retelling.',
    needsReview: true,
    sourceNote: 'Historical specifics (names, ages, and particular incidents) must be verified against reliable seerah and early Islamic history sources by a qualified reviewer before publishing, to avoid repeating popular but unverified claims.',
  },

  // ─────────── THEME: Business ethics (business-ethics) ───────────
  {
    id: 'business-ethics-reflection',
    category: 'reflection',
    theme: 'business-ethics',
    title: 'Trade as a Mirror of Character',
    body: 'Every sale, every negotiation, is a small test. Do you describe the item honestly? Do you take only what was agreed? Islamic teaching frames the marketplace not as separate from faith but as one of its proving grounds — how a person treats a stranger over a few dollars often reveals more about character than how they act in worship. Honesty in trade is treated as a form of worship in its own right, and cheating a customer is treated as, in a sense, cheating one\'s own soul.',
    needsReview: true,
    sourceNote: 'This is a general reflective framing, not a direct translation or citation of a specific text. Have a knowledgeable reviewer confirm it aligns with mainstream teaching before publishing.',
  },
  {
    id: 'business-ethics-adab',
    category: 'adab',
    theme: 'business-ethics',
    title: 'Adab of Buying and Selling',
    body: 'Classical adab for tradespeople includes: describe goods accurately and disclose known defects; settle on a price plainly rather than through pressure tactics; avoid excessive oaths to \'guarantee\' a sale; be lenient with a buyer who is short on cash or wishes to return an item; and weigh or measure generously rather than at the bare minimum. These manners aim to build a marketplace resting on trust rather than pressure or trickery.',
    needsReview: true,
    sourceNote: 'This is a placeholder summary of etiquette themes; verify each point against classical adab/muamalat literature before publishing.',
  },
  {
    id: 'business-ethics-dua',
    category: 'dua',
    theme: 'business-ethics',
    title: 'Dua for Lawful Sustenance',
    arabic: 'اللَّهُمَّ اكْفِنِي بِحَلاَلِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    transliteration: 'Allāhumma-kfinī bi-ḥalālika \'an ḥarāmika, wa aghninī bi-faḍlika \'amman siwāk',
    translation: 'O Allah, suffice me with what You have made lawful, in place of what You have made unlawful, and enrich me by Your bounty so that I need no one besides You.',
    reference: 'A commonly cited supplication associated with seeking lawful provision, often quoted in hadith literature.',
    body: 'In business, the temptation to cut corners for extra profit is real. This supplication asks Allah to make lawful earnings sufficient, removing the felt need to reach for shortcuts, deception, or forbidden income. Reciting it before starting work or closing a deal is a way of reorienting intention toward halal effort rather than mere outcome.',
    needsReview: true,
    sourceNote: 'Verify the exact wording, chain, and grading of this dua with a qualified source before publishing; do not present any grading claim until confirmed.',
  },
  {
    id: 'business-ethics-tafsir',
    category: 'tafsir',
    theme: 'business-ethics',
    title: 'Give Full Measure: Qur\'an 17:35',
    arabic: 'وَأَوْفُوا الْكَيْلَ إِذَا كِلْتُمْ وَزِنُوا بِالْقِسْطَاسِ الْمُسْتَقِيمِ ۚ ذَٰلِكَ خَيْرٌ وَأَحْسَنُ تَأْوِيلًا',
    translation: 'And give full measure when you measure, and weigh with an even balance. That is best and gives the fairest result. (generic paraphrase)',
    reference: 'Qur\'an, Al-Isra 17:35',
    body: 'This verse commands fairness at the most basic level of trade: the scale itself. Shortchanging a buyer through a rigged measure is condemned repeatedly in the Qur\'an, tying commercial honesty directly to a person\'s standing before Allah. It is often read alongside Surah Al-Mutaffifin, which opens with a warning to those who demand full measure for themselves but give less to others.',
    needsReview: true,
    sourceNote: 'The translation above is a generic paraphrase, not a specific scholar\'s or translator\'s exact wording, and the explanation is a neutral placeholder. Replace with verified tafsir (e.g., Ibn Kathir, Tabari, or another recognized source) before publishing.',
  },
  {
    id: 'business-ethics-hadith',
    category: 'hadith',
    theme: 'business-ethics',
    title: 'The Honest Merchant (Hadith Theme)',
    body: 'A well-known hadith theme describes the truthful, trustworthy trader as being in the company of the prophets, the truthful, and the martyrs on the Day of Judgment — a striking honor for something as ordinary as buying and selling honestly. The theme underscores that commerce conducted with integrity is not a minor virtue but one that can elevate a person\'s standing in the next life.',
    needsReview: true,
    sourceNote: 'This is a paraphrase of a widely known hadith theme, not a verbatim quotation, collection reference, or grading. Replace with a properly sourced and authenticated hadith, including collection and grading (e.g., verified against Tirmidhi or another recognized compilation), before publishing.',
  },
  {
    id: 'business-ethics-aqidah',
    category: 'aqidah',
    theme: 'business-ethics',
    title: 'Allah Witnesses Every Transaction',
    body: 'A foundational belief shaping Islamic business ethics is that no sale, negotiation, or contract escapes divine awareness — Allah is described as watching over every transaction, however small. This awareness of being watched (often discussed under muraqabah, or God-consciousness) is meant to function like an internal auditor: even when no customer would notice a shortcut or a hidden defect, the believer restrains themselves because ultimate accountability rests with Allah, not the marketplace.',
    needsReview: true,
    sourceNote: 'General aqidah framing; verify theological terminology (e.g., muraqabah) and phrasing with a qualified aqidah teacher before publishing.',
  },
  {
    id: 'business-ethics-fiqh',
    category: 'fiqh',
    theme: 'business-ethics',
    title: 'Contracts, Consent, and Riba — Fiqh Basics',
    body: 'Islamic commercial law generally requires that a sale involve mutual consent, a clearly known item and price, and a seller\'s real ability to deliver what is sold. Riba (unlawful interest or excess in certain exchanges) is prohibited, as is gharar (excessive ambiguity or deception) in contracts. However, exact conditions — such as when a buyer may cancel a deal, permissible installment structures, or how modern financial instruments are classified — differ across the Hanafi, Shafi\'i, Maliki, and Hanbali schools, and among contemporary scholars.',
    needsReview: true,
    sourceNote: 'Fiqh details vary by madhhab and by contemporary scholarly council rulings (e.g., on modern banking and finance); verify specifics with a qualified fiqh scholar before publishing.',
  },
  {
    id: 'business-ethics-quote',
    category: 'quote',
    theme: 'business-ethics',
    title: 'On Trust as Capital',
    attribution: 'Unverified — needs source.',
    body: 'A teacher once said: \'A merchant who cheats has not gained a sale — he has spent his trustworthiness, which is far harder to earn back than the money he took.\' The saying captures a recurring theme in Islamic business ethics: reputation and honesty function like a form of capital, one that compounds over a lifetime of fair dealing or is wiped out in a single act of deception.',
    needsReview: true,
    sourceNote: 'This quote is illustrative and composed for this placeholder; it is not attributed to any real, named scholar. Replace with a genuine, properly sourced quotation, or clearly mark as an original composition, before publishing.',
  },
  {
    id: 'business-ethics-vocab',
    category: 'vocab',
    theme: 'business-ethics',
    title: 'Vocab: Riba',
    arabic: 'الرِّبَا',
    transliteration: 'Ribā',
    translation: 'Unlawful interest or excess in certain transactions; often rendered \'usury.\'',
    reference: 'See Qur\'an 2:275-279 for the general prohibition.',
    body: 'Riba refers to certain kinds of unjustified increase in a financial exchange, most famously interest charged on loans, which the Qur\'an condemns in strong terms. Classical fiqh also discusses it in the context of unequal exchanges of the same commodity (e.g., gold for gold, dates for dates). It sits at the center of Islamic business ethics because it is seen as extracting gain without corresponding risk, effort, or a genuinely fair exchange.',
    needsReview: true,
    sourceNote: 'Definition simplified for a placeholder card; verify the precise scope, categories (e.g., riba al-fadl vs riba al-nasi\'ah), and Quranic references with a qualified scholar before publishing.',
  },
  {
    id: 'business-ethics-seerah',
    category: 'seerah',
    theme: 'business-ethics',
    title: 'A Reputation Built Before Prophethood',
    body: 'Long before he began receiving revelation, Muhammad (peace be upon him) was known in Mecca as \'al-Amin\' — the Trustworthy — largely because of how he conducted himself in trade, including caravan journeys undertaken on behalf of others. This reputation for honest dealing is often cited as part of why people, including his future wife Khadijah, entrusted him with goods and responsibility. It is presented as an early, practical demonstration that ethical business conduct and personal integrity are inseparable in the Islamic tradition.',
    needsReview: true,
    sourceNote: 'General seerah summary; verify specific details, dates, and sources (e.g., early biographical works such as those of Ibn Hisham or Ibn Ishaq) with a qualified seerah teacher before publishing.',
  },

  // ─────────── THEME: Quranic healing (quranic-healing) ───────────
  {
    id: 'quranic-healing-tafsir',
    category: 'tafsir',
    theme: 'quranic-healing',
    title: 'The Quran Names Itself a Healing',
    arabic: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ',
    transliteration: 'Wa nunazzilu minal-Qur\'āni mā huwa shifā\'un wa raḥmatun lil-mu\'minīn',
    translation: 'And We send down of the Quran that which is healing and mercy for the believers.',
    reference: 'Quran 17:82',
    body: 'In Surah Al-Isra, the Quran describes itself as containing \'shifa\' (healing) and mercy for believers. Classical scholarship discusses this healing as primarily spiritual and moral — guidance that soothes the heart, corrects wrong belief, and removes spiritual sickness like doubt, despair, or heedlessness. Some scholars extend this to physical benefit through recitation and dua, though views on scope differ. This card offers only a generic overview, not a scholarly ruling on what \'healing\' fully entails here.',
    needsReview: true,
    sourceNote: 'This card is a placeholder needing review: verify the Arabic text and translation against a reliable Quran edition, and replace the explanation with an authentic tafsir (e.g., Ibn Kathir or al-Tabari) rather than this generic summary.',
  },
  {
    id: 'quranic-healing-reflection',
    category: 'reflection',
    theme: 'quranic-healing',
    title: 'Hearts Find Rest in Remembrance',
    reference: 'Quran 13:28 (paraphrase)',
    body: 'The Quran links tranquility of heart to the remembrance (dhikr) of Allah — describing believers whose hearts find comfort when they recall Him. In moments of anxiety, grief, or uncertainty, this points to a simple practice: pausing to remember Allah through short phrases of praise, gratitude, or supplication. It is not a claim that remembrance replaces medical or practical help, but a reminder that spiritual grounding is part of how the Quran frames emotional steadiness.',
    needsReview: true,
    sourceNote: 'Placeholder reflection — needs review: confirm the verse translation, ensure the reflection matches mainstream scholarly understanding of this ayah, and cite a proper tafsir source if further explanation is added.',
  },
  {
    id: 'quranic-healing-adab',
    category: 'adab',
    theme: 'quranic-healing',
    title: 'Adab of Turning to the Quran in Distress',
    body: 'Islamic etiquette around seeking comfort from the Quran generally emphasizes: sincerity of intention, a calm and respectful state (many prefer being in a state of purity/wudu though it is not always required), reciting with reflection rather than rushing, and pairing recitation with sincere dua. The Quran is approached as guidance and mercy, not a magical formula, and its use for comfort is understood alongside — not instead of — seeking appropriate medical or practical help.',
    needsReview: true,
    sourceNote: 'General adab placeholder — needs review by a qualified teacher to confirm these etiquette points, correct any inaccuracies, and add supporting textual references.',
  },
  {
    id: 'quranic-healing-dua',
    category: 'dua',
    theme: 'quranic-healing',
    title: 'The Dua of Prophet Ayyub in Hardship',
    arabic: 'أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ',
    transliteration: 'Annī massaniyad-ḍurru wa anta arḥamur-rāḥimīn',
    translation: 'Indeed, adversity has touched me, and You are the Most Merciful of the merciful.',
    reference: 'Quran 21:83',
    body: 'Prophet Ayyub (Job), tested with prolonged illness, is recorded in the Quran making a brief, humble supplication acknowledging his suffering while affirming Allah\'s mercy. It is often cited as a model dua for anyone facing sickness or hardship — combining honest acknowledgment of pain with complete trust in Allah\'s care, rather than despair.',
    needsReview: true,
    sourceNote: 'Placeholder dua card — needs review: verify Arabic diacritics and translation against a reliable Quran text, and confirm the contextual note against accepted tafsir before publishing.',
  },
  {
    id: 'quranic-healing-vocab',
    category: 'vocab',
    theme: 'quranic-healing',
    title: 'Key Term: Ruqyah',
    body: '\'Ruqyah\' refers to the practice of reciting Quranic verses and supplications for protection, comfort, and healing — for oneself or others. It has been practiced since the earliest generations of Muslims and is generally distinguished from superstition or magic, since it relies on Quran and legitimate dua rather than charms or unclear invocations. Scholars differ on some specific forms and conditions of valid ruqyah, so details should not be assumed uniform.',
    needsReview: true,
    sourceNote: 'Vocabulary placeholder — needs review by a knowledgeable teacher to sharpen this definition, clarify permissible vs. impermissible forms, and correct any oversimplification.',
  },
  {
    id: 'quranic-healing-hadith',
    category: 'hadith',
    theme: 'quranic-healing',
    title: 'A Cure Exists for Every Illness (General Theme)',
    body: 'There is a well-known theme in hadith literature — paraphrased here, not quoted verbatim — that Allah has placed a cure for every ailment except old age and death itself, and that believers are encouraged to seek treatment while trusting Allah\'s decree. This card intentionally avoids citing a specific wording, collection, or grading, since that requires proper verification.',
    needsReview: true,
    sourceNote: 'This is a paraphrased theme only, not an authenticated hadith quotation. Needs review: replace with a properly sourced, authenticated hadith including its collection (e.g., Bukhari, Muslim, Abu Dawud) and grading, confirmed by a qualified scholar.',
  },
  {
    id: 'quranic-healing-aqidah',
    category: 'aqidah',
    theme: 'quranic-healing',
    title: 'Belief: Ultimate Healing Comes From Allah',
    arabic: 'وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ',
    transliteration: 'Wa idhā mariḍtu fahuwa yashfīn',
    translation: 'And when I am ill, it is He who cures me.',
    reference: 'Quran 26:80',
    body: 'In the Quran, Prophet Ibrahim states that when he becomes ill, it is Allah who cures him. This reflects a core belief: while doctors, medicine, and remedies are real, permissible means that Muslims are encouraged to use, the ultimate cause of healing — spiritual or physical — is attributed to Allah. Using means and trusting Allah are held together, not seen as contradictory.',
    needsReview: true,
    sourceNote: 'Placeholder aqidah card — needs review: verify translation accuracy and have a qualified teacher confirm the \'means vs. ultimate cause\' framing is presented correctly.',
  },
  {
    id: 'quranic-healing-fiqh',
    category: 'fiqh',
    theme: 'quranic-healing',
    title: 'Fiqh Notes: Practicing Ruqyah Correctly',
    body: 'Scholars across schools of thought generally permit ruqyah using Quran and authentic dua, but differ on specifics: whether unfamiliar or non-Arabic phrases are allowed, whether charging a fee for performing ruqyah is acceptable, and how to handle claims of possession or the \'evil eye\' responsibly. Because rulings vary by madhhab and by scholar, this overview is illustrative only, not a fatwa.',
    needsReview: true,
    sourceNote: 'General fiqh sketch — not a ruling. Needs review: consult a qualified scholar of the relevant madhhab for precise, current rulings before acting on any ruqyah-related practice.',
  },
  {
    id: 'quranic-healing-quote',
    category: 'quote',
    theme: 'quranic-healing',
    title: 'A Teacher Once Said...',
    attribution: 'Unverified — needs source.',
    body: 'A teacher once said that the Quran is like water offered to a thirsty soul — it does not force itself in, but whoever turns to it in sincerity will find something in it to hold onto. Sayings like this circulate widely in teaching circles, often without a clear original source, so it is presented here purely as reflective folk wisdom, not as a scholar\'s documented statement.',
    needsReview: true,
    sourceNote: 'This quote is anonymous and unverified. Needs review: either trace it to a real, properly cited source, or keep it clearly labeled as unattributed reflective wisdom rather than a scholar\'s quote.',
  },
  {
    id: 'quranic-healing-seerah',
    category: 'seerah',
    theme: 'quranic-healing',
    title: 'Seerah Glimpse: Comfort in Illness',
    body: 'Seerah literature broadly describes the Prophet ﷺ and his companions turning to Quranic recitation and sincere dua for comfort during times of sickness and hardship, alongside whatever medical knowledge and remedies were available to them at the time. This is presented only as a general historical impression, without citing a specific narration, since precise wording and authenticity require checking against reliable sources.',
    needsReview: true,
    sourceNote: 'General seerah impression, not a cited narration. Needs review: verify against authentic seerah and hadith sources, and add a specific citation once confirmed by a qualified scholar before presenting as historical fact.',
  },
];

/**
 * Difficulty by content type (the default for a card of that category):
 *  - beginner:     reflections, adab/reminders, duas, short vocabulary
 *  - intermediate: tafsir, hadith-theme, aqidah, seerah, scholar quotes
 *  - advanced:     fiqh (rulings, madhhab nuance)
 */
const DIFFICULTY_BY_CATEGORY: Record<Category, Difficulty> = {
  reflection: 'beginner',
  adab: 'beginner',
  dua: 'beginner',
  vocab: 'beginner',
  tafsir: 'intermediate',
  hadith: 'intermediate',
  aqidah: 'intermediate',
  seerah: 'intermediate',
  quote: 'intermediate',
  fiqh: 'advanced',
};

/**
 * Per-card overrides where a card clearly fits a different level than its
 * category default — so the assignment isn't purely mechanical.
 */
const DIFFICULTY_OVERRIDES: Record<string, Difficulty> = {
  // Denser theology / nuanced rulings → advanced
  'aqidah-3': 'advanced', // the beautiful names of God (deep)
  'tafsir-4': 'advanced', // the Throne Verse — heavy aqidah content
  'productivity-aqidah': 'advanced', // qadar & effort together
  // Accessible fiqh basics → intermediate
  'fiqh-1': 'intermediate', // wudu, in brief
  'fiqh-2': 'intermediate', // the five daily prayers
  'parenting-fiqh': 'intermediate', // when children begin to pray
  // Denser beginner-category cards → intermediate
  'productivity-reflection': 'intermediate', // israf of time
  'business-ethics-adab': 'intermediate', // adab of buying and selling
  // Very short, accessible intermediate-category cards → beginner
  'hadith-1': 'beginner', // on kindness
  'hadith-4': 'beginner', // on a cheerful face
  'quote-1': 'beginner', // on seeking knowledge
  'quote-2': 'beginner', // on humility
  'seerah-1': 'beginner', // a trustworthy reputation
};

export const SEED_CARDS: Card[] = RAW_CARDS.map((c) => ({
  ...c,
  difficulty:
    DIFFICULTY_OVERRIDES[c.id] ?? DIFFICULTY_BY_CATEGORY[c.category],
}));

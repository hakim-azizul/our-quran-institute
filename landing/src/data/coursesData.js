// Official Course Catalog for Our Quran Institute
// Curated 6 Essential Programs requested by Institute Leadership
export const COURSE_CATEGORIES = [
  { id: 'all', label: 'All 6 Programs' },
  { id: 'quran', label: 'Quran Hifz' },
  { id: 'kids', label: 'For Kids' },
  { id: 'arabic', label: 'Arabic Studies' },
  { id: 'akida', label: 'Akida & Creed' }
];

export const COURSES_DATA = [
  {
    id: 'quran-hifz',
    title: 'Quran Hifz Course',
    arabicTitle: 'دورة حفظ القرآن الكريم مع الإتقان والسند',
    category: 'quran',
    categoryLabel: 'Quran Hifz',
    badge: 'Flagship Sanad Track',
    badgeColor: '#FFDF85',
    level: 'All Levels (Beginner to Advanced)',
    duration: 'Self-Paced (1 – 3 Years)',
    hoursPerWeek: '2 – 5 Sessions / Week',
    format: '1-on-1 Private Live Lessons with Ijazah Scholar',
    certification: 'Official Sanad / Ijazah Connected to Prophet ﷺ',
    shortDesc: 'Structured Quran memorization with deep retention, daily revision rhythms, Tajweed perfection, and connected Sanad certification.',
    description: 'Our flagship Hifz program combines ancient classical memorization methodology with modern spaced-repetition science. Guided 1-on-1 by certified scholars from Al-Azhar, students cultivate strong retention, phonetic beauty, and spiritual connection page by page.',
    highlights: [
      'Personalized memorization schedule tailored to work and family',
      'Daily 3-tier revision system (New Lesson, Recent Retention, Grand Review)',
      'Direct Sanad transmission upon completion with connected chain',
      'Flexible time slots across all global time zones'
    ],
    curriculum: [
      { phase: 'Phase 1: Foundation & Tajweed Calibration', focus: 'Juz 30 (Amma) & Juz 29 (Tabarak) with phonetic verification' },
      { phase: 'Phase 2: Rhythmic Memorization Routine', focus: 'Surah Al-Baqarah through Surah Al-Kahf with weekly retention circles' },
      { phase: 'Phase 3: The Intermediate Horizon', focus: 'Surah Maryam through Surah Fatir with cumulative spaced reviews' },
      { phase: 'Phase 4: Consolidation & Khatm', focus: 'Full 30 Juz revision cycles, continuous recitation testing' },
      { phase: 'Phase 5: Ijazah Examination & Sanad Conferment', focus: 'Full recitation from memory before a Sanad committee' }
    ],
    targetAudience: 'Adults, youth, and motivated children. Separate certified male and female scholars available.'
  },
  {
    id: 'quran-kids',
    title: 'Quran for Kids',
    arabicTitle: 'برنامج القرآن الكريم وتأسيس القراءة للأطفال',
    category: 'kids',
    categoryLabel: 'Quran for Kids',
    badge: 'Ages 4 - 14',
    badgeColor: '#34D399',
    level: 'Beginner to Intermediate',
    duration: '3 – 6 Months per Level',
    hoursPerWeek: '2 – 4 Sessions / Week',
    format: '1-on-1 Gentle Child-Centered Mentorship',
    certification: 'Junior Quran Reciter Certificate',
    shortDesc: 'A joyful, encouraging program for children to master Noorani Qaida, correct Quranic pronunciation, and memorize Juz Amma with love.',
    description: 'Designed specifically for children to foster a lifelong love for the Holy Quran. Guided by patient scholars experienced with young learners, students progress from letter recognition in Noorani Qaida to fluent reading and joyful memorization of short Surahs.',
    highlights: [
      'Patient scholars trained in child psychology and engaging pedagogy',
      'Noorani Qaida foundation leading to direct Mushaf reading',
      'Memorization of short daily Surahs with meanings and virtues',
      'Interactive games, digital rewards, and monthly parent reports'
    ],
    curriculum: [
      { phase: 'Step 1: Arabic Alphabet & Sounds', focus: 'Letter shapes (isolated, initial, medial, final) with native Arabic sounds' },
      { phase: 'Step 2: Vowels & Joining (Noorani Qaida)', focus: 'Short vowels (Fatha, Kasra, Damma) and smooth word joining drills' },
      { phase: 'Step 3: Advanced Phonics & Sukoon', focus: 'Madd rules, Tanween, Shaddah, and gentle introductory Tajweed rules' },
      { phase: 'Step 4: Fluent Mushaf Reading', focus: 'Direct reading of Juz Amma with rhythmic recitation confidence' },
      { phase: 'Step 5: Kids Hifz & Reflection', focus: 'Memorization of Surah Al-Fatiha through Surah Al-Ala with kid-friendly stories' }
    ],
    targetAudience: 'Boys and girls ages 4 to 14 from zero reading ability to emerging young reciters.'
  },
  {
    id: 'arabic-language',
    title: 'Arabic Language',
    arabicTitle: 'تعليم اللغة العربية الفصحى للناطقين بغيرها',
    category: 'arabic',
    categoryLabel: 'Arabic Language',
    badge: 'Practical & Foundational',
    badgeColor: '#FDE68A',
    level: 'Beginner to Intermediate',
    duration: '6 – 9 Months',
    hoursPerWeek: '2 – 3 Sessions / Week',
    format: '1-on-1 Interactive Language Sessions',
    certification: 'Standard Arabic Proficiency Diploma',
    shortDesc: 'Learn to speak, read, and write modern and classical Arabic (Fusha) with practical conversation, grammar essentials, and vocabulary.',
    description: 'Step into the Arabic language with ease and confidence. This program provides an intuitive pathway to understanding conversations, reading authentic Islamic literature, and developing conversational fluency guided by native Egyptian linguists.',
    highlights: [
      'Step-by-step conversational fluency in everyday and Islamic situations',
      'Essential Arabic grammar (Nahw) and sentence structures simplified',
      'Comprehend standard spoken Arabic, Friday sermons, and books',
      'Native Al-Azhar Arabic instructors fluent in English explanation'
    ],
    curriculum: [
      { phase: 'Level 1: Daily Conversation & Vocabulary', focus: 'Greetings, introductions, family, shopping, directions, and numbers' },
      { phase: 'Level 2: Sentence Architecture (Nahw Basics)', focus: 'Nominal vs verbal sentences, pronouns, prepositions, and adjectives' },
      { phase: 'Level 3: Verb Conjugation & Tenses', focus: 'Past, present, future, and imperative conjugations with common roots' },
      { phase: 'Level 4: Reading & Comprehension', focus: 'Short stories, classical parables, and understanding authentic speech' }
    ],
    targetAudience: 'Students, professionals, and reverts wanting to speak and comprehend standard Arabic.'
  },
  {
    id: 'akida-course',
    title: 'Akida Course',
    arabicTitle: 'دورة العقيدة الإسلامية الصحيحة والمعتقد الصافي',
    category: 'akida',
    categoryLabel: 'Akida & Creed',
    badge: 'Pillar of Faith',
    badgeColor: '#10B981',
    level: 'All Ages & Backgrounds',
    duration: '4 – 6 Months',
    hoursPerWeek: '1 – 2 Sessions / Week',
    format: '1-on-1 Guided Thematic Study',
    certification: 'Islamic Creed Foundation Certificate',
    shortDesc: 'Authentic Islamic Creed (Aqeedah) based on the Quran and Sunnah, strengthening faith, certainty, and understanding of the 6 pillars of Iman.',
    description: 'Build an unshakeable foundation of faith based on orthodox Islamic scholarship. This course clarifies the core beliefs of Islam, the oneness of Allah, the reality of the unseen, and answers contemporary intellectual questions with compassionate scholarly clarity.',
    highlights: [
      'In-depth study of the 6 Pillars of Iman with clear scriptural proofs',
      'Understanding Tawheed (Oneness of Allah) and Divine Names & Attributes',
      'Clearing contemporary doubts and building unshakable certainty',
      'Overview of classical texts like Aqeedah at-Tahawiyyah and Wasitiyyah'
    ],
    curriculum: [
      { phase: 'Pillar 1: Meaning and Necessity of Aqeedah', focus: 'Faith, reason, the preservation of orthodoxy, and spiritual certainty' },
      { phase: 'Pillar 2: Tawheed (The Oneness of God)', focus: 'Tawheed of Lordship, Worship, and the Exalted Divine Names & Attributes' },
      { phase: 'Pillar 3: The Unseen & Prophethood', focus: 'Belief in the Angels, Revealed Scriptures, and the seal of Prophets ﷺ' },
      { phase: 'Pillar 4: Eschatology (The Last Day)', focus: 'Signs of the Hour, the Barzakh, Resurrection, and the eternal abode' },
      { phase: 'Pillar 5: Qadar (Divine Decree)', focus: 'Understanding Divine Will, human responsibility, and contentment' }
    ],
    targetAudience: 'Youth, adults, and new Muslims seeking clarity, spiritual grounding, and deep conviction.'
  },
  {
    id: 'islamic-studies-kids',
    title: 'Islamic Studies for Kids',
    arabicTitle: 'الدراسات الإسلامية والآداب النبوية للأطفال',
    category: 'kids',
    categoryLabel: 'Islamic Studies for Kids',
    badge: 'Character & Faith',
    badgeColor: '#6EE7B7',
    level: 'Kids Ages 5 - 15',
    duration: '6 – 12 Months',
    hoursPerWeek: '1 – 2 Sessions / Week',
    format: '1-on-1 Interactive Visual Storytelling',
    certification: 'Young Muslim Heritage Certificate',
    shortDesc: 'Inspiring, child-tailored curriculum covering stories of the Prophets, daily Duas, Islamic etiquette (Akhlaq), and practical Salah training.',
    description: 'Nurture a proud, knowledgeable young Muslim. This vibrant course brings Islamic history and character to life through illustrated storytelling of the Prophets, hands-on Salah and Wudu mastery, daily morning and evening Adhkar, and moral ethics.',
    highlights: [
      'Captivating chronological stories of the Prophets and noble Companions',
      'Step-by-step practical Salah and Wudu training with live demonstrations',
      'Daily prophetic manners (Adab with parents, teachers, and elders)',
      'Memorization of essential everyday Duas from Hisn al-Muslim'
    ],
    curriculum: [
      { phase: 'Unit 1: Stories of the Great Prophets', focus: 'Adam, Nuh, Ibrahim, Musa, Isa, and the life of Muhammad ﷺ' },
      { phase: 'Unit 2: Practical Worship (Wudu & Salah)', focus: 'Conditions, steps, words recited in prayer, and love for the mosque' },
      { phase: 'Unit 3: Prophetic Manners & Character', focus: 'Honesty, kindness to parents, respecting elders, and good companionship' },
      { phase: 'Unit 4: Daily Duas & Halal Habits', focus: 'Eating, sleeping, entering home, traveling, and gratitude supplications' },
      { phase: 'Unit 5: Muslim Heroes & Islamic Holidays', focus: 'The Sahabah, Ramadan traditions, Eid celebration adab, and charity' }
    ],
    targetAudience: 'Young Muslim boys and girls ages 5 to 15 wanting an uplifting, beautiful Islamic foundation.'
  },
  {
    id: 'advance-arabic',
    title: 'Advance Arabic Language',
    arabicTitle: 'اللغة العربية المتقدمة: نحو، صرف، وبلاغة',
    category: 'arabic',
    categoryLabel: 'Advance Arabic Language',
    badge: 'Scholastic Track',
    badgeColor: '#C5A45A',
    level: 'Intermediate to Advanced',
    duration: '6 – 12 Months',
    hoursPerWeek: '2 – 3 Sessions / Week',
    format: '1-on-1 Advanced Classical Seminar',
    certification: 'Advanced Arabic Scholastic Diploma',
    shortDesc: 'Deep dive into classical Arabic grammar (Nahw), morphology (Sarf), Balaghah (rhetoric), and linguistic analysis of the Quran.',
    description: 'Designed for serious students of sacred knowledge and Arabic literature. Under the tutelage of senior Al-Azhar grammarians, students dissect classical treatises, master complex grammatical parsing (I’rab), explore subtle morphological roots, and uncover the rhetorical secrets of Quranic Balaghah.',
    highlights: [
      'Rigorous analysis of classical texts (Ajrumiyyah, Qatr an-Nada, Alfiya)',
      'Comprehensive morphology (Sarf): 10 Verb forms and derived noun patterns',
      'Quranic Balaghah (Rhetoric: Ma’ani, Bayan, Badi\')',
      'Word-by-word I\'rab (grammatical breakdown) of complex Quranic verses'
    ],
    curriculum: [
      { phase: 'Mastery 1: Advanced Syntax (Nahw)', focus: 'Governing agents, hidden pronouns, appositives, and irregular I\'rab cases' },
      { phase: 'Mastery 2: Classical Morphology (Sarf)', focus: 'The 10 verbal paradigms (Awzan), weak verbs, and semantic shifts' },
      { phase: 'Mastery 3: Ilm al-Balaghah (Rhetoric)', focus: 'Metaphor (Isti\'arah), brevity (Ijaz), emphasis (Qasr), and aesthetics' },
      { phase: 'Mastery 4: Quranic Linguistic Exegesis', focus: 'Word-by-word structural & rhetorical breakdown of select Surahs' }
    ],
    targetAudience: 'Imams, teachers, advanced students, and seekers of sacred classical Arabic comprehension.'
  }
];

// Comprehensive SaaS Database for Our Quran Institute
// Manages: Users, Courses, Modules, Lessons, Enrollments, Quizzes & Student Mistake Annotations

import { QURAN_SURAHS } from './quranData.js';

// 1. Initial Seed Users (Admin, Teachers, Students)
const initialUsers = [
  {
    id: 'QI-ADM-001',
    name: 'Sheikh Dr. Ibrahim Al-Mansoor',
    email: 'admin@quraninstitute.org',
    password: 'admin123',
    role: 'admin',
    title: 'Director of Academic Affairs & System Controller',
    department: 'Institute Governing Council',
    avatar: '👑',
    status: 'Active',
    registeredAt: '2024-01-01T00:00:00Z',
    permissions: ['all_access', 'database_manage', 'faculty_verify', 'system_audit'],
    isDatabaseProvisionedOnly: true,
  },
  {
    id: 'QI-FAC-014',
    name: 'Dr. Sheikh Ahmad Al-Azhari',
    email: 'dr.ahmad@quraninstitute.org',
    password: 'password123',
    role: 'teacher',
    status: 'Verified Scholar',
    sanadCertification: '10 Qira’at Mutawatirah with Connected Chain (Al-Azhar Al-Sharif)',
    specialization: 'Qira’at, Tajweed Sanad & Advanced Hifz',
    yearsExperience: '14+ years',
    studentsCount: 18,
    nextSession: 'Today at 5:00 PM with Tariq Al-Mansoor',
    avatar: '🕌',
    registeredAt: '2024-01-10T08:30:00Z',
  },
  {
    id: 'QI-FAC-028',
    name: 'Ustadh Mahmoud Al-Misri',
    email: 'mahmoud.teacher@quraninstitute.org',
    password: 'password123',
    role: 'teacher',
    status: 'Verified Scholar',
    sanadCertification: 'Ijazah in Warsh ‘an Nafi’ & Hafs (Madinah University)',
    specialization: 'Tajweed Rules & Arabic Makharij',
    yearsExperience: '9 years',
    studentsCount: 12,
    nextSession: 'Thursday at 4:30 PM',
    avatar: '🕌',
    registeredAt: '2024-06-18T14:15:00Z',
  },
  {
    id: 'QI-STU-8842',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.student@quraninstitute.org',
    password: 'password123',
    role: 'student',
    status: 'Enrolled',
    assignedTeacherId: 'QI-FAC-014',
    mentor: 'Dr. Sheikh Ahmad Al-Azhari',
    nextSession: 'Today at 6:30 PM (in 45 mins)',
    memorizedJuz: 12,
    totalJuz: 30,
    avatar: '🎓',
    registeredAt: '2025-09-15T10:00:00Z',
  },
  {
    id: 'QI-STU-9904',
    name: 'Maryam Al-Qasim',
    email: 'maryam.student@quraninstitute.org',
    password: 'password123',
    role: 'student',
    status: 'Enrolled',
    assignedTeacherId: 'QI-FAC-014',
    mentor: 'Dr. Sheikh Ahmad Al-Azhari',
    nextSession: 'Tomorrow at 10:00 AM',
    memorizedJuz: 28,
    totalJuz: 30,
    avatar: '🎓',
    registeredAt: '2025-10-02T11:20:00Z',
  },
];
globalThis.__QURAN_USERS__ = globalThis.__QURAN_USERS__ || initialUsers;
const users = globalThis.__QURAN_USERS__;

// 2. Initial Flagship Course: How to Read the Quran / Quran Reading Mastery
const initialCourses = [
  {
    id: 'QI-CRS-001',
    title: 'Quran Reading Foundation & Tajweed Mastery: How to Read the Quran',
    arabicTitle: 'تَعَلُّمُ قِرَاءَةِ القُرْآنِ الكَرِيمِ وَأَحْكَامِ التَّجْوِيدِ',
    slug: 'how-to-read-quran',
    level: 'Beginner to Fluent',
    authorId: 'QI-ADM-001',
    assignedTeacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    thumbnail: '/assets/hero_stand_book.png',
    description:
      'A structured, step-by-step masterclass taking students from isolated Arabic letters and Noorani Qaida pronunciation to fluent, error-free recitation of the Holy Quran with authentic Tajweed rules.',
    totalDuration: '12 Weeks • 6 Modules • 18 Lessons • 6 Exams',
    passingGrade: 80,
    status: 'published',
    modules: [
      {
        id: 'mod-1',
        moduleNumber: 1,
        title: 'The Sacred Alphabet & Points of Articulation (Makharij)',
        arabicTitle: 'حُرُوفُ الهِجَاءِ وَمَخَارِجُ الحُرُوفِ',
        description:
          'Mastering the 28 Arabic letters with correct tongue, throat, and lip positions according to classical Imam Al-Jazari standards.',
        lessons: [
          {
            id: 'les-1-1',
            title: 'Lesson 1.1: Isolated Letters & Throat Letters (أ، هـ، ع، ح، غ، خ)',
            duration: '25 mins',
            content:
              'Understanding the 6 Throat Letters (حروف الحلق) divided into deep throat (أدنى الحلق), middle throat (وسط الحلق), and upper throat (أقصى الحلق).',
            practiceText: 'ءَ - هـَ - عَ - حَ - غَ - خَ',
          },
          {
            id: 'les-1-2',
            title: 'Lesson 1.2: The Heavy Letters (Tafkheem: خ، ص، ض، غ، ط، ق، ظ)',
            duration: '30 mins',
            content:
              'Distinguishing heavy, elevated letters (حروف الاستعلاء) from light letters (حروف الاستفال) to prevent altering the meaning.',
            practiceText: 'خَصَّ ضَغْطٍ قِظْ',
          },
          {
            id: 'les-1-3',
            title: 'Lesson 1.3: Connecting Letter Shapes in Words',
            duration: '20 mins',
            content:
              'Recognizing letters in initial, medial, and final positions as written in the Holy Quran Mushaf.',
            practiceText: 'كَتَبَ - نَظَرَ - جَعَلَ - سَمِعَ',
          },
        ],
        quizId: 'quiz-mod-1',
      },
      {
        id: 'mod-2',
        moduleNumber: 2,
        title: 'The Short Vowels (Harakat) & 3-Letter Word Blending',
        arabicTitle: 'الحَرَكَاتُ الثَّلَاثُ (الفَتْحَة، الكَسْرَة، الضَّمَّة)',
        description:
          'Learning the exact duration of the 3 short vowels and training the ear to transition smoothly between them.',
        lessons: [
          {
            id: 'les-2-1',
            title: 'Lesson 2.1: The Fathah (ـَ) and Vertical Fathah',
            duration: '25 mins',
            content:
              'Opening the mouth vertically without exaggeration. Perfecting short vowel duration of 1 harakah.',
            practiceText: 'ضَرَبَ - ذَهَبَ - خَلَقَ - رَزَقَ',
          },
          {
            id: 'les-2-2',
            title: 'Lesson 2.2: The Kasrah (ـِ) and Dammah (ـُ)',
            duration: '30 mins',
            content:
              'Lowering the jaw for Kasrah and rounding the lips completely for Dammah without nasality.',
            practiceText: 'رُسُلُ - عُمُرُ - قُرِئَ - سُئِلَ',
          },
        ],
        quizId: 'quiz-mod-2',
      },
      {
        id: 'mod-3',
        moduleNumber: 3,
        title: 'Sukoon, Tanween & The Qalqalah Mechanism (Echoing)',
        arabicTitle: 'السُّكُونُ وَالتَّنْوِينُ وَحُرُوفُ القَلْقَلَةِ',
        description:
          'Understanding vowel-less letters (Sukoon) and the 5 echoing letters (ق، ط، ب، ج، د) when stopping.',
        lessons: [
          {
            id: 'les-3-1',
            title: 'Lesson 3.1: The Double Vowels (Tanween: ـً ـٍ ـٌ)',
            duration: '25 mins',
            content:
              'The hidden Noon sound in Tanween and how it changes at the end of Quranic words.',
            practiceText: 'كِتَابًا - حَكِيمٌ - عَلِيمٍ',
          },
          {
            id: 'les-3-2',
            title: 'Lesson 3.2: The Five Qalqalah Letters (قُطْبُ جَدٍّ)',
            duration: '35 mins',
            content:
              'Pronouncing the minor (Sughra) and major (Kubra) echoing sound without adding an extra vowel.',
            practiceText: 'يَجْعَلُونَ - يُطْعِمُونَ - الفَلَقْ - كَسَبْ',
          },
        ],
        quizId: 'quiz-mod-3',
      },
      {
        id: 'mod-4',
        moduleNumber: 4,
        title: 'The Rules of Madd (Elongation & Durations)',
        arabicTitle: 'أَحْكَامُ المَدِّ (الطَّبِيعِيّ، المُتَّصِل، المُنْفَصِل، اللَّازِم)',
        description:
          'Mastering the 3 letters of Madd (ا، و، ي) and their exact duration counts (2, 4, 5, and 6 Harakat).',
        lessons: [
          {
            id: 'les-4-1',
            title: 'Lesson 4.1: Natural Madd (Madd Asli - 2 Counts)',
            duration: '20 mins',
            content:
              'Holding vowel length for 2 counts without exceeding or shortening. The foundation of rhythmic recitation.',
            practiceText: 'قَالَ - يَقُولُ - قِيلَ',
          },
          {
            id: 'les-4-2',
            title: 'Lesson 4.2: Connected & Disconnected Madd (Muttasil & Munfasil)',
            duration: '35 mins',
            content:
              'When Hamzah meets Madd within one word (Muttasil - 4-5 counts) vs across two words (Munfasil - 4-5 counts).',
            practiceText: 'جَآءَ - السَّمَآءَ - بِمَآ أُنزِلَ - قُوٓا أَنفُسَكُمْ',
          },
          {
            id: 'les-4-3',
            title: 'Lesson 4.3: Compulsory Madd (Madd Lazim - 6 Counts)',
            duration: '30 mins',
            content:
              'Madd followed by a Sukoon or Shaddah. Mandatory 6 counts elongation in words like الضَّالِّينَ.',
            practiceText: 'الصَّآخَّةُ - الطَّآمَّةُ - وَلَا الضَّآلِّينَ',
          },
        ],
        quizId: 'quiz-mod-4',
      },
      {
        id: 'mod-5',
        moduleNumber: 5,
        title: 'Rules of Noon Sakinah & Tanween (Izhar, Idgham, Iqlab, Ikhfa)',
        arabicTitle: 'أَحْكَامُ النُّونِ السَّاكِنَةِ وَالتَّنْوِينِ',
        description:
          'The core pillar of Tajweed: how Noon Sakinah transforms when meeting any of the 28 Arabic letters.',
        lessons: [
          {
            id: 'les-5-1',
            title: 'Lesson 5.1: Izhar Halqi (Clear Pronunciation)',
            duration: '25 mins',
            content:
              'Pronouncing Noon clearly with no extra nasal sound when followed by the 6 throat letters.',
            practiceText: 'مَنْ ءَامَنَ - أَنْعَمْتَ - كُفُوًا أَحَدٌ',
          },
          {
            id: 'les-5-2',
            title: 'Lesson 5.2: Idgham (Merging) With and Without Ghunnah',
            duration: '35 mins',
            content:
              'Merging into يَرْمَلُونَ letters: 4 with nasal sound (ي، ن، م، و) and 2 without (ل، ر).',
            practiceText: 'مَن يَقُولُ - مِن مَّالٍ - مِن رَّبِّهِمْ - غَفُورٌ رَّحِيمٌ',
          },
          {
            id: 'les-5-3',
            title: 'Lesson 5.3: Iqlab & Ikhfa Haqiqi (Hiding with Ghunnah)',
            duration: '40 mins',
            content:
              'Turning Noon into Meem before Baa (Iqlab), and hiding the tongue position before the 15 Ikhfa letters.',
            practiceText: 'مِنۢ بَعْدِ - أَن بُورِكَ - كُنتُمْ - مِن قَبْلِكُمْ',
          },
        ],
        quizId: 'quiz-mod-5',
      },
      {
        id: 'mod-6',
        moduleNumber: 6,
        title: 'Rules of Stopping (Waqf) & Practical Surah Al-Fatiha Recitation',
        arabicTitle: 'أَحْكَامُ الوَقْفِ وَالابْتِدَاءِ وَتَطْبِيقُ سُورَةِ الفَاتِحَةِ',
        description:
          'Knowing where to breathe, pause, and stop in the Quran, followed by complete graded recitation of Surah Al-Fatiha.',
        lessons: [
          {
            id: 'les-6-1',
            title: 'Lesson 6.1: The Waqf Symbols in the Holy Mushaf (م، قلى، صلى، ج، لا)',
            duration: '30 mins',
            content:
              'Understanding obligatory, preferred, permissible, and forbidden stopping signs.',
            practiceText: 'عَلَيْهِمْ م - رَبِّ الْعَالَمِينَ - مُسْتَقِيمٍ',
          },
          {
            id: 'les-6-2',
            title: 'Lesson 6.2: Practical Mastery of Surah Al-Fatiha',
            duration: '45 mins',
            content:
              'Verse-by-verse recitation with Sheikh Ahmad applying all makharij, Madd, and Waqf rules.',
            practiceText: 'سُورَةُ الفَاتِحَةِ (كُلُّهَا)',
          },
        ],
        quizId: 'quiz-mod-6',
      },
    ],
  },
];
globalThis.__QURAN_COURSES__ = globalThis.__QURAN_COURSES__ || initialCourses;
const courses = globalThis.__QURAN_COURSES__;

export function ensureCourseHasModules(c) {
  if (!c) return c;
  if (!c.modules || !Array.isArray(c.modules) || c.modules.length === 0) {
    const cid = c.id || 'CRS';
    c.modules = [
      {
        id: `mod-${cid}-1`,
        moduleNumber: 1,
        title: 'Foundational Introduction & Orientation',
        arabicTitle: 'المُقَدِّمَةُ وَالتَّأْسِيسُ',
        description: `Comprehensive syllabus roadmap, sacred intentions, and core learning objectives for ${c.title || 'this course'}.`,
        lessons: [
          {
            id: `les-${cid}-1-1`,
            title: 'Lesson 1.1: Sacred Intentions & Recitation Etiquette',
            duration: '20 mins',
            content: `Mastering the proper adab (etiquette), sincerity of intention, and spiritual preparation for recitation.`,
            practiceText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
          },
          {
            id: `les-${cid}-1-2`,
            title: 'Lesson 1.2: Core Phonetic Principles & Articulation',
            duration: '35 mins',
            content: 'Foundational rules of Quranic phonetics, vowel length, and sound production.',
            practiceText: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا',
          },
        ],
        quizId: null,
      },
    ];
  }
  return c;
}

courses.forEach(ensureCourseHasModules);

// 3. Quizzes Dataset for the Course
const initialQuizzes = [
  {
    id: 'quiz-mod-1',
    moduleId: 'mod-1',
    title: 'Module 1 Assessment: Makharij & Letter Identification',
    timeLimitMinutes: 15,
    passingScore: 80,
    questions: [
      {
        id: 'q1-1',
        prompt: 'Which of the following is one of the 6 Throat Letters (حروف الحلق)?',
        options: ['Letter ب (Baa)', 'Letter ع (‘Ayn)', 'Letter س (Seen)', 'Letter ف (Faa)'],
        correctIndex: 1,
        explanation: 'The six throat letters are: ء (Hamzah), هـ (Haa), ع (‘Ayn), ح (Haa), غ (Ghayn), and خ (Khaa).',
      },
      {
        id: 'q1-2',
        prompt: 'What happens if you pronounce the heavy letter ط (Taa) lightly without elevation (Tafkheem)?',
        options: [
          'It turns into the letter ت (Taa), which can completely alter the sacred Quranic meaning.',
          'It is perfectly acceptable.',
          'It becomes a Madd letter.',
          'It creates a Qalqalah.',
        ],
        correctIndex: 0,
        explanation: 'Failing to elevate (Istila) the letter Taa makes it sound like Taa ت, which is a Major Recitation Slip (Lahn Jaliyy).',
      },
      {
        id: 'q1-3',
        prompt: 'How many letters are in the Arabic alphabet?',
        options: ['24', '28 (or 29 counting Hamzah)', '32', '20'],
        correctIndex: 1,
        explanation: 'The classical Arabic alphabet consists of 28 consonants, or 29 when counting Hamzah as distinct from Alif.',
      },
    ],
  },
  {
    id: 'quiz-mod-2',
    moduleId: 'mod-2',
    title: 'Module 2 Assessment: Harakat & Pronunciation Precision',
    timeLimitMinutes: 15,
    passingScore: 80,
    questions: [
      {
        id: 'q2-1',
        prompt: 'What is the correct physical mouth shape for the Dammah vowel (ـُ)?',
        options: [
          'Leaving the mouth flat',
          'Complete rounding of both lips like a circle',
          'Dropping the lower jaw',
          'Breathing from the nose',
        ],
        correctIndex: 1,
        explanation: 'Every Dammah requires complete circling and rounding of the lips (ضم الشفتين) without nasal tone.',
      },
      {
        id: 'q2-2',
        prompt: 'What is the duration of a single Harakah (Fathah, Kasrah, or Dammah)?',
        options: ['1 count (half a second)', '4 counts', '6 counts', '2 counts'],
        correctIndex: 0,
        explanation: 'A short vowel is 1 count, roughly the time it takes to close or open a finger at a moderate pace.',
      },
    ],
  },
  {
    id: 'quiz-mod-3',
    moduleId: 'mod-3',
    title: 'Module 3 Assessment: Qalqalah & Sukoon Rules',
    timeLimitMinutes: 15,
    passingScore: 80,
    questions: [
      {
        id: 'q3-1',
        prompt: 'Which phrase collects the five letters of Qalqalah (Echoing)?',
        options: ['يَرْمَلُونَ (Yarmaloon)', 'قُطْبُ جَدٍّ (Qutb Jadd)', 'خَصَّ ضَغْطٍ (Khassa Dhaght)', 'حُرُوفُ المَدِّ (Huroof al-Madd)'],
        correctIndex: 1,
        explanation: 'The five letters of Qalqalah are collected in the mnemonic: قُطْبُ جَدٍّ (ق، ط، ب، ج، د).',
      },
      {
        id: 'q3-2',
        prompt: 'When is Qalqalah triggered on a letter?',
        options: [
          'Only when it has Fathah',
          'When it carries Sukoon or when stopping on it with an implied Sukoon',
          'Whenever it has Shaddah only',
          'When followed by Alif',
        ],
        correctIndex: 1,
        explanation: 'Qalqalah occurs when one of the five letters is Saakin (carrying Sukoon) or when stopping upon it at the end of a verse.',
      },
    ],
  },
  {
    id: 'quiz-mod-4',
    moduleId: 'mod-4',
    title: 'Module 4 Assessment: Madd Rules & Durations',
    timeLimitMinutes: 20,
    passingScore: 80,
    questions: [
      {
        id: 'q4-1',
        prompt: 'In the word "وَلَا الضَّالِّينَ", what type of Madd is applied to the Alif, and how many counts must it be held?',
        options: [
          'Madd Asli — 2 counts',
          'Madd Lazim Kalimi Muthaqqal — 6 mandatory counts',
          'Madd Munfasil — 4 counts',
          'Madd Iwad — 2 counts',
        ],
        correctIndex: 1,
        explanation: 'Because the letter of Madd is immediately followed by a Shaddah (لّ) in the same word, it is Madd Lazim and must be held for 6 full counts.',
      },
      {
        id: 'q4-2',
        prompt: 'What distinguishes Madd Muttasil from Madd Munfasil?',
        options: [
          'Muttasil has the Madd letter and Hamzah in the SAME word; Munfasil has them in SEPARATE words.',
          'Muttasil is only 2 counts.',
          'Munfasil cannot be elongated.',
          'There is no difference.',
        ],
        correctIndex: 0,
        explanation: 'Muttasil means "Connected" (within the same word like جَآءَ), whereas Munfasil means "Disconnected" across two words like بِمَآ أُنزِلَ.',
      },
    ],
  },
  {
    id: 'quiz-mod-5',
    moduleId: 'mod-5',
    title: 'Module 5 Assessment: Noon Sakinah & Tanween',
    timeLimitMinutes: 20,
    passingScore: 80,
    questions: [
      {
        id: 'q5-1',
        prompt: 'What Tajweed rule applies to the Noon in "مِن رَّبِّهِمْ"?',
        options: [
          'Izhar',
          'Idgham without Ghunnah (Bilā Ghunnah)',
          'Ikhfa',
          'Iqlab',
        ],
        correctIndex: 1,
        explanation: 'When Noon Sakinah meets the letter Raa (ر) or Laam (ل), it merges completely with NO nasal sound (Idgham Bilā Ghunnah).',
      },
      {
        id: 'q5-2',
        prompt: 'What rule applies to "مِنۢ بَعْدِ"?',
        options: [
          'Iqlab (converting Noon into a hidden Meem with Ghunnah)',
          'Izhar Halqi',
          'Madd Lazim',
          'Qalqalah',
        ],
        correctIndex: 0,
        explanation: 'When Noon Sakinah meets the letter Baa (ب), it converts into a light Meem sound held with 2 counts of Ghunnah (Iqlab).',
      },
    ],
  },
  {
    id: 'quiz-mod-6',
    moduleId: 'mod-6',
    title: 'Module 6 Final Exam: Recitation Mastery & Stopping Rules',
    timeLimitMinutes: 30,
    passingScore: 80,
    questions: [
      {
        id: 'q6-1',
        prompt: 'What does the stopping mark (مـ) indicate in the Holy Quran?',
        options: [
          'Permissible to continue or stop',
          'Compulsory Stop (Waqf Lazim) — stopping is mandatory to avoid distorting the theological meaning',
          'Forbidden to stop',
          'Preferred to continue',
        ],
        correctIndex: 1,
        explanation: 'The small horizontal Meem indicates Waqf Lazim (Obligatory Stop). Continuing may connect incompatible sentences.',
      },
      {
        id: 'q6-2',
        prompt: 'In Surah Al-Fatiha, how should the word "الصِّرَاطَ" be pronounced?',
        options: [
          'With a heavy, whistling Saad ص and heavy Taa ط',
          'With a light Seen س and light Taa ت',
          'Without any vowel',
          'With a nasal humming sound',
        ],
        correctIndex: 0,
        explanation: 'Both Saad ص and Taa ط are emphatic elevated letters (Mufakhkham) and must not be softened into Seen or Taa.',
      },
    ],
  },
];
globalThis.__QURAN_QUIZZES__ = globalThis.__QURAN_QUIZZES__ || initialQuizzes;
const quizzes = globalThis.__QURAN_QUIZZES__;

// 4. Enrollments Database
const initialEnrollments = [
  {
    id: 'QI-ENR-01',
    studentId: 'QI-STU-8842',
    studentName: 'Tariq Al-Mansoor',
    courseId: 'QI-CRS-001',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    enrolledAt: '2025-09-15T10:00:00Z',
    progressPercent: 65,
    completedLessons: ['les-1-1', 'les-1-2', 'les-1-3', 'les-2-1', 'les-2-2', 'les-3-1', 'les-3-2'],
    completedQuizzes: [
      { quizId: 'quiz-mod-1', score: 100, passed: true, date: '2025-09-22T14:00:00Z' },
      { quizId: 'quiz-mod-2', score: 90, passed: true, date: '2025-09-29T14:00:00Z' },
      { quizId: 'quiz-mod-3', score: 95, passed: true, date: '2025-10-06T14:00:00Z' },
    ],
    status: 'active',
  },
  {
    id: 'QI-ENR-02',
    studentId: 'QI-STU-9904',
    studentName: 'Maryam Al-Qasim',
    courseId: 'QI-CRS-001',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    enrolledAt: '2025-10-01T09:00:00Z',
    progressPercent: 90,
    completedLessons: [
      'les-1-1', 'les-1-2', 'les-1-3',
      'les-2-1', 'les-2-2',
      'les-3-1', 'les-3-2',
      'les-4-1', 'les-4-2', 'les-4-3',
      'les-5-1', 'les-5-2',
    ],
    completedQuizzes: [
      { quizId: 'quiz-mod-1', score: 100, passed: true, date: '2025-10-03T14:00:00Z' },
      { quizId: 'quiz-mod-2', score: 100, passed: true, date: '2025-10-08T14:00:00Z' },
      { quizId: 'quiz-mod-3', score: 100, passed: true, date: '2025-10-12T14:00:00Z' },
      { quizId: 'quiz-mod-4', score: 95, passed: true, date: '2025-10-15T14:00:00Z' },
    ],
    status: 'active',
  },
];
globalThis.__QURAN_ENROLLMENTS__ = globalThis.__QURAN_ENROLLMENTS__ || initialEnrollments;
const enrollments = globalThis.__QURAN_ENROLLMENTS__;

// 5. Student-by-Student Interactive Quran Mistake Annotations
// Used by teachers to highlight specific words/ayahs where a student slipped, and withdraw/resolve when corrected!
const initialMistakes = [
  {
    id: 'MSTK-001',
    studentId: 'QI-STU-8842',
    studentName: 'Tariq Al-Mansoor',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    surahNumber: 1,
    surahName: 'Al-Fatihah',
    ayahNumber: 7,
    wordIndex: 9,
    wordText: 'الضَّالِّينَ',
    mistakeCategory: 'tajweed_rule',
    categoryLabel: 'Madd Lazim Duration Too Short',
    severity: 'major', // 'major' | 'minor' | 'info'
    correctionNote:
      'Tariq held the Madd for only 3 counts. It must be extended to 6 full counts (Madd Lazim Kalimi Muthaqqal) before closing on the Shaddah.',
    status: 'active', // 'active' (needs revision) | 'resolved' (cleared/passed)
    flaggedAt: '2026-10-08T18:35:00Z',
    resolvedAt: null,
    resolvedNote: '',
  },
  {
    id: 'MSTK-002',
    studentId: 'QI-STU-8842',
    studentName: 'Tariq Al-Mansoor',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    surahNumber: 1,
    surahName: 'Al-Fatihah',
    ayahNumber: 2,
    wordIndex: 3,
    wordText: 'رَبِّ',
    mistakeCategory: 'harakah_jaliyy',
    categoryLabel: 'Kasrah Shaddah Weakness',
    severity: 'minor',
    correctionNote:
      'Emphasize the Shaddah on the Baa with full contact and sharp Kasrah without adding a silent pause.',
    status: 'active',
    flaggedAt: '2026-10-08T18:30:00Z',
    resolvedAt: null,
    resolvedNote: '',
  },
  {
    id: 'MSTK-003',
    studentId: 'QI-STU-8842',
    studentName: 'Tariq Al-Mansoor',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    surahNumber: 112,
    surahName: 'Al-Ikhlas',
    ayahNumber: 3,
    wordIndex: 2,
    wordText: 'يَلِدْ',
    mistakeCategory: 'makhraj_letter',
    categoryLabel: 'Qalqalah Sughra Missing on Daal',
    severity: 'minor',
    correctionNote:
      'Qalqalah on the Daal was muffled. Allow the tongue to bounce naturally off the gum ridge.',
    status: 'resolved', // Cleared by teacher!
    flaggedAt: '2026-10-01T17:10:00Z',
    resolvedAt: '2026-10-05T18:40:00Z',
    resolvedNote:
      'Cleared: Tariq perfected the Daal Qalqalah bounce in live classroom. Excellent adjustment!',
  },
  {
    id: 'MSTK-004',
    studentId: 'QI-STU-9904',
    studentName: 'Maryam Al-Qasim',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    surahNumber: 113,
    surahName: 'Al-Falaq',
    ayahNumber: 4,
    wordIndex: 3,
    wordText: 'النَّفَّاثَاتِ',
    mistakeCategory: 'tajweed_rule',
    categoryLabel: 'Noon Mushaddadah Ghunnah Duration',
    severity: 'minor',
    correctionNote:
      'Ensure the Ghunnah on the Noon with Shaddah is held for a full 2 counts before continuing to the Faa.',
    status: 'active',
    flaggedAt: '2026-10-07T10:15:00Z',
    resolvedAt: null,
    resolvedNote: '',
  },
];
globalThis.__QURAN_MISTAKES__ = globalThis.__QURAN_MISTAKES__ || initialMistakes;
const studentMistakes = globalThis.__QURAN_MISTAKES__;

// ==========================================
// 6. Database Queries & Mutations
// ==========================================

// --- USER OPERATIONS ---
export function findUserByEmail(email) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();
  return (
    users.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.id.toLowerCase() === cleanEmail
    ) || null
  );
}

export function findUserById(id) {
  if (!id) return null;
  return users.find((u) => u.id === id) || null;
}

export function createUser(userData) {
  if (userData.role === 'admin' || (typeof userData.role === 'string' && userData.role.toLowerCase() === 'admin')) {
    throw new Error(
      'DATABASE SECURITY POLICY: Admin accounts cannot be created via application APIs. Admin access is strictly configured via database provisioning only.'
    );
  }

  if (userData.role !== 'student' && userData.role !== 'teacher') {
    throw new Error('Invalid user role. Only Student and Teacher accounts may be registered.');
  }

  const rolePrefix = userData.role === 'teacher' ? 'FAC' : 'STU';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `QI-${rolePrefix}-${randomNum}`;

  const newUser = {
    id: newId,
    status: userData.role === 'teacher' ? 'Pending Credential Verification' : 'Enrolled',
    avatar: userData.role === 'teacher' ? '🕌' : '🎓',
    registeredAt: new Date().toISOString(),
    ...userData,
  };

  users.push(newUser);
  return newUser;
}

export function getAllUsers() {
  return users.map(({ password: _, ...safeUser }) => safeUser);
}

export function getAllTeachers() {
  return users
    .filter(
      (u) =>
        u.role === 'teacher' &&
        (u.status === 'Verified Scholar' || u.status === 'Active')
    )
    .map(({ password: _, ...safeUser }) => safeUser);
}

export function updateUserProfile(userId, updates) {
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error('User not found');

  const { id, role, password, isDatabaseProvisionedOnly, ...allowedUpdates } = updates;
  Object.assign(user, allowedUpdates);

  const { password: _, ...safeUser } = user;
  return safeUser;
}

export function getInstituteStats() {
  const students = users.filter((u) => u.role === 'student');
  const teachers = users.filter((u) => u.role === 'teacher');
  const verifiedTeachers = teachers.filter(
    (u) => u.status === 'Verified Scholar' || u.status === 'Active'
  );
  const pendingTeachers = teachers.filter(
    (u) => u.status !== 'Verified Scholar' && u.status !== 'Active' && u.status !== 'Suspended'
  );
  const admins = users.filter((u) => u.role === 'admin');
  const totalMemorizedJuz = students.reduce((acc, curr) => acc + (curr.memorizedJuz || 0), 0);

  return {
    totalStudents: students.length,
    totalTeachers: verifiedTeachers.length,
    pendingTeachers: pendingTeachers.length,
    totalAdmins: admins.length,
    totalUsers: users.length,
    totalMemorizedJuz,
    totalCourses: courses.length,
    totalActiveMistakeFlags: studentMistakes.filter((m) => m.status === 'active').length,
    totalResolvedMistakes: studentMistakes.filter((m) => m.status === 'resolved').length,
    verifiedSanadsCount: verifiedTeachers.length + 3,
    activeLiveSessionsToday: 6,
  };
}

export function approveTeacher(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error('User not found');
  if (user.role !== 'teacher') throw new Error('User is not a teacher');

  user.status = 'Verified Scholar';
  const { password: _, ...safeUser } = user;
  return safeUser;
}

export function rejectTeacher(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error('User not found');
  if (user.role !== 'teacher') throw new Error('User is not a teacher');

  user.status = 'Rejected';
  const { password: _, ...safeUser } = user;
  return safeUser;
}

export function toggleUserStatus(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return null;
  if (user.role === 'admin') {
    throw new Error('Admin status cannot be modified via user controls.');
  }
  user.status =
    user.status === 'Active' || user.status === 'Enrolled' || user.status === 'Verified Scholar'
      ? 'Suspended'
      : user.role === 'teacher'
      ? 'Verified Scholar'
      : 'Enrolled';
  const { password: _, ...safeUser } = user;
  return safeUser;
}

// --- COURSE OPERATIONS ---
export function getAllCourses() {
  courses.forEach(ensureCourseHasModules);
  return courses;
}

export function getCourseById(courseId) {
  const course = courses.find((c) => c.id === courseId) || null;
  if (course) ensureCourseHasModules(course);
  return course;
}

// Admin only: create a course
export function createCourse(courseData, creatorId) {
  const randomNum = Math.floor(100 + Math.random() * 900);
  const newCourseId = `QI-CRS-${randomNum}`;

  const defaultInitialModules = [
    {
      id: `mod-${newCourseId}-1`,
      moduleNumber: 1,
      title: 'Foundational Introduction & Orientation',
      arabicTitle: 'المُقَدِّمَةُ وَالتَّأْسِيسُ',
      description: `Comprehensive syllabus roadmap, sacred intentions, and core learning objectives for ${courseData.title || 'this course'}.`,
      lessons: [
        {
          id: `les-${newCourseId}-1-1`,
          title: 'Lesson 1.1: Sacred Intentions & Recitation Etiquette',
          duration: '20 mins',
          content: 'Mastering the proper adab, sincerity, and spiritual preparation before recitation.',
          practiceText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
        },
        {
          id: `les-${newCourseId}-1-2`,
          title: 'Lesson 1.2: Core Phonetic Principles & Articulation',
          duration: '35 mins',
          content: 'Foundational rules of Quranic phonetics, vowel length, and sound production.',
          practiceText: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا',
        },
      ],
      quizId: null,
    },
  ];

  const newCourse = {
    id: newCourseId,
    title: courseData.title || 'Untitled Quran Course',
    arabicTitle: courseData.arabicTitle || '',
    slug: courseData.title ? courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `course-${newCourseId}`,
    level: courseData.level || 'Beginner',
    authorId: creatorId,
    assignedTeacherId: courseData.assignedTeacherId || 'QI-FAC-014',
    teacherName: courseData.teacherName || 'Dr. Sheikh Ahmad Al-Azhari',
    thumbnail: courseData.thumbnail || '/assets/hero_stand_book.png',
    description: courseData.description || 'Comprehensive Islamic Studies & Quran course.',
    totalDuration: courseData.totalDuration || '8 Weeks',
    passingGrade: 80,
    status: 'published',
    modules:
      courseData.modules && Array.isArray(courseData.modules) && courseData.modules.length > 0
        ? courseData.modules
        : defaultInitialModules,
    createdAt: new Date().toISOString(),
  };

  courses.push(newCourse);
  return newCourse;
}

// Teacher or Admin: add a new module to an existing course
export function addCourseModule(courseId, newModuleData, updaterRole, updaterId) {
  const course = courses.find((c) => c.id === courseId);
  if (!course) throw new Error('Course not found');

  if (updaterRole !== 'admin' && course.assignedTeacherId !== updaterId) {
    throw new Error('Unauthorized: Only Admin or the assigned Teacher can update this course curriculum.');
  }

  course.modules = course.modules || [];
  const nextModuleNum = course.modules.length + 1;
  const newModule = {
    id: newModuleData.id || `mod-${course.id}-${nextModuleNum}`,
    moduleNumber: nextModuleNum,
    title: newModuleData.title || `Module ${nextModuleNum}: Advanced Studies`,
    arabicTitle: newModuleData.arabicTitle || '',
    description: newModuleData.description || 'Module learning objectives and scholarly guidance.',
    lessons: newModuleData.lessons || [
      {
        id: `les-${course.id}-${nextModuleNum}-1`,
        title: `Lesson ${nextModuleNum}.1: Introductory Principles`,
        duration: '25 mins',
        content: 'Detailed scholarly commentary and guided recitation notes.',
        practiceText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
      },
    ],
    quizId: newModuleData.quizId || null,
    createdAt: new Date().toISOString(),
    createdBy: updaterId,
  };

  course.modules.push(newModule);
  return newModule;
}

// Teacher or Admin: update an existing module or lesson
export function updateCourseModule(courseId, moduleId, updatedModuleData, updaterRole, updaterId) {
  const course = courses.find((c) => c.id === courseId);
  if (!course) throw new Error('Course not found');

  // Verify permission: Must be Admin OR the assigned Teacher
  if (updaterRole !== 'admin' && course.assignedTeacherId !== updaterId) {
    throw new Error('Unauthorized: Only Admin or the assigned Teacher can update this course curriculum.');
  }

  course.modules = course.modules || [];
  const moduleIndex = course.modules.findIndex((m) => m.id === moduleId);
  if (moduleIndex === -1) {
    throw new Error('Module not found in this course.');
  }

  course.modules[moduleIndex] = {
    ...course.modules[moduleIndex],
    ...updatedModuleData,
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: updaterId,
  };

  return course.modules[moduleIndex];
}

// --- ENROLLMENT OPERATIONS ---
export function getEnrollmentsForStudent(studentId) {
  return enrollments.filter((e) => e.studentId === studentId);
}

export function getEnrollmentsForTeacher(teacherId) {
  return enrollments
    .filter((e) => e.teacherId === teacherId)
    .map((e) => {
      const studentUser = findUserById(e.studentId);
      const studentMistakesList = getMistakesForStudent(e.studentId);
      return {
        ...e,
        studentEmail: studentUser?.email || '',
        studentAvatar: studentUser?.avatar || '🎓',
        memorizedJuz: studentUser?.memorizedJuz || 0,
        totalJuz: studentUser?.totalJuz || 30,
        tajweedLevel: studentUser?.tajweedLevel || 'Intermediate',
        targetGoal: studentUser?.targetGoal || 'Hifz & Tajweed Mastery',
        nextSession: studentUser?.nextSession || 'Weekly 1-on-1 Sanctuary Class',
        mistakesCount: studentMistakesList.length,
        activeMistakesCount: studentMistakesList.filter((m) => m.status === 'active').length,
        resolvedMistakesCount: studentMistakesList.filter((m) => m.status === 'resolved').length,
        teacherNotes: e.teacherNotes || '',
      };
    });
}

export function enrollStudentInCourse(studentId, courseId, teacherId) {
  const student = findUserById(studentId);
  const course = getCourseById(courseId);
  const teacher = findUserById(teacherId || course?.assignedTeacherId);

  if (!student) throw new Error('Student not found');
  if (!course) throw new Error('Course not found');
  if (!teacher) throw new Error('Assigned teacher not found');

  const existing = enrollments.find((e) => e.studentId === studentId && e.courseId === courseId);
  if (existing) return existing;

  const newEnrollment = {
    id: `QI-ENR-${Math.floor(1000 + Math.random() * 9000)}`,
    studentId,
    studentName: student.name,
    courseId,
    teacherId: teacher.id,
    teacherName: teacher.name,
    enrolledAt: new Date().toISOString(),
    progressPercent: 0,
    completedLessons: [],
    completedQuizzes: [],
    status: 'active',
    teacherNotes: '',
  };

  enrollments.push(newEnrollment);
  return newEnrollment;
}

export function unenrollStudentFromCourse(studentId, courseId) {
  const index = enrollments.findIndex(
    (e) => e.studentId === studentId && (courseId ? e.courseId === courseId : true)
  );
  if (index !== -1) {
    const removed = enrollments.splice(index, 1);
    return removed[0];
  }
  return null;
}

export function markLessonCompleted(enrollmentId, lessonId, action = 'complete') {
  const enrollment = enrollments.find((e) => e.id === enrollmentId);
  if (!enrollment) throw new Error('Enrollment not found');

  if (action === 'toggle') {
    const idx = enrollment.completedLessons.indexOf(lessonId);
    if (idx !== -1) {
      enrollment.completedLessons.splice(idx, 1);
    } else {
      enrollment.completedLessons.push(lessonId);
    }
  } else if (action === 'uncomplete') {
    const idx = enrollment.completedLessons.indexOf(lessonId);
    if (idx !== -1) {
      enrollment.completedLessons.splice(idx, 1);
    }
  } else {
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
  }

  // Calculate progress
  const course = getCourseById(enrollment.courseId);
  if (course) {
    const totalLessons = course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
    if (totalLessons > 0) {
      enrollment.progressPercent = Math.min(
        100,
        Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      );
    }
  }

  return enrollment;
}

export function updateEnrollmentNotes(enrollmentId, notes) {
  const enrollment = enrollments.find((e) => e.id === enrollmentId);
  if (!enrollment) throw new Error('Enrollment not found');
  enrollment.teacherNotes = notes;
  return enrollment;
}

// --- STUDENT MISTAKE ANNOTATION OPERATIONS (The Core Customization Feature) ---
export function getMistakesForStudent(studentId) {
  return studentMistakes.filter((m) => m.studentId === studentId);
}

export function getMistakesByTeacher(teacherId) {
  return studentMistakes.filter((m) => m.teacherId === teacherId);
}

// Teacher adds a recitation mistake flag on a specific Ayah/Word for a student
export function addStudentMistake({
  studentId,
  teacherId,
  surahNumber,
  ayahNumber,
  wordIndex,
  wordText,
  mistakeCategory,
  categoryLabel,
  severity = 'major',
  correctionNote,
}) {
  const student = findUserById(studentId);
  const teacher = findUserById(teacherId);

  if (!student) throw new Error('Student record not found');
  if (!teacher) throw new Error('Teacher record not found');

  const surahInfo = QURAN_SURAHS.find((s) => s.number === Number(surahNumber));

  const newMistake = {
    id: `MSTK-${Math.floor(1000 + Math.random() * 9000)}`,
    studentId,
    studentName: student.name,
    teacherId,
    teacherName: teacher.name,
    surahNumber: Number(surahNumber),
    surahName: surahInfo?.name || `Surah ${surahNumber}`,
    ayahNumber: Number(ayahNumber),
    wordIndex: wordIndex !== undefined ? Number(wordIndex) : null,
    wordText: wordText || '',
    mistakeCategory: mistakeCategory || 'tajweed_rule',
    categoryLabel: categoryLabel || 'Recitation Slip',
    severity: severity || 'major',
    correctionNote: correctionNote || '',
    status: 'active',
    flaggedAt: new Date().toISOString(),
    resolvedAt: null,
    resolvedNote: '',
  };

  studentMistakes.push(newMistake);
  return newMistake;
}

// Teacher resolves/withdraws mistake after student recites correctly
export function resolveStudentMistake(mistakeId, teacherId, resolutionNote = '') {
  const mistake = studentMistakes.find((m) => m.id === mistakeId);
  if (!mistake) throw new Error('Mistake record not found');

  mistake.status = 'resolved';
  mistake.resolvedAt = new Date().toISOString();
  mistake.resolvedNote =
    resolutionNote || `Recited correctly & cleared by ${mistake.teacherName}.`;

  return mistake;
}

// Teacher can withdraw/delete mistake flag completely
export function deleteStudentMistake(mistakeId) {
  const index = studentMistakes.findIndex((m) => m.id === mistakeId);
  if (index === -1) throw new Error('Mistake record not found');
  const removed = studentMistakes.splice(index, 1);
  return removed[0];
}

// --- QUIZ & EXAM OPERATIONS ---
export function getQuizByModuleId(moduleId) {
  return quizzes.find((q) => q.moduleId === moduleId) || null;
}

export function submitQuizAnswers(enrollmentId, quizId, answers) {
  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) throw new Error('Quiz not found');

  const enrollment = enrollments.find((e) => e.id === enrollmentId);
  if (!enrollment) throw new Error('Enrollment not found');

  let correctCount = 0;
  quiz.questions.forEach((q, idx) => {
    let userAnswer = undefined;
    if (Array.isArray(answers)) {
      userAnswer = answers[idx];
    } else if (typeof answers === 'object' && answers !== null) {
      userAnswer = answers[idx] !== undefined ? answers[idx] : answers[q.id];
    }
    if (userAnswer === q.correctIndex) {
      correctCount++;
    }
  });

  const percentageScore = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = percentageScore >= (quiz.passingScore || 80);

  const existingAttempt = enrollment.completedQuizzes.find((cq) => cq.quizId === quizId);
  if (existingAttempt) {
    existingAttempt.score = Math.max(existingAttempt.score, percentageScore);
    existingAttempt.passed = existingAttempt.passed || passed;
    existingAttempt.lastAttemptDate = new Date().toISOString();
  } else {
    enrollment.completedQuizzes.push({
      quizId,
      score: percentageScore,
      passed,
      date: new Date().toISOString(),
    });
  }

  return {
    score: percentageScore,
    passed,
    correctCount,
    totalQuestions: quiz.questions.length,
    passingScore: quiz.passingScore,
  };
}

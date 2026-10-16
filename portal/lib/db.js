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
    department: 'Institute Administration',
    avatar: 'admin',
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
    hourlyRate: 30,
    studentsCount: 18,
    nextSession: 'Today at 5:00 PM with Tariq Al-Mansoor',
    avatar: 'scholar',
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
    hourlyRate: 25,
    studentsCount: 12,
    nextSession: 'Thursday at 4:30 PM',
    avatar: 'scholar',
    registeredAt: '2024-06-18T14:15:00Z',
  },
  {
    id: 'QI-FAC-035',
    name: 'Ustadh Bilal Al-Hashemi',
    email: 'bilal.teacher@quraninstitute.org',
    password: 'password123',
    role: 'teacher',
    status: 'Pending Credential Verification',
    sanadCertification: 'Ijaza in Qaloon & Hafs from University of Jordan',
    specialization: 'Hifz Revision & Tajweed Application',
    yearsExperience: '5 years',
    hourlyRate: 25,
    studentsCount: 0,
    nextSession: 'Faculty Onboarding Interview (Upcoming)',
    avatar: 'scholar',
    registeredAt: '2026-10-12T14:00:00Z',
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
    parentId: 'QI-PAR-101',
    parentName: 'Hajji Mansoor Rahman',
    nextSession: 'Today at 6:30 PM (in 45 mins)',
    memorizedJuz: 12,
    totalJuz: 30,
    avatar: 'student',
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
    parentId: 'QI-PAR-102',
    parentName: 'Dr. Fatima Al-Qasim',
    nextSession: 'Tomorrow at 10:00 AM',
    memorizedJuz: 28,
    totalJuz: 30,
    avatar: 'student',
    registeredAt: '2025-10-02T11:20:00Z',
  },
  {
    id: 'QI-STU-7721',
    name: 'Zaid bin Harith',
    email: 'zaid.student@quraninstitute.org',
    password: 'password123',
    role: 'student',
    status: 'Enrolled',
    assignedTeacherId: 'QI-FAC-028',
    mentor: 'Ustadh Mahmoud Al-Misri',
    parentId: 'QI-PAR-101',
    parentName: 'Hajji Mansoor Rahman',
    nextSession: 'Wednesday at 5:00 PM',
    memorizedJuz: 6,
    totalJuz: 30,
    avatar: 'student',
    registeredAt: '2025-11-01T09:00:00Z',
  },
  {
    id: 'QI-STU-6512',
    name: 'Amina Khan',
    email: 'amina.student@quraninstitute.org',
    password: 'password123',
    role: 'student',
    status: 'Pending Approval',
    assignedTeacherId: null,
    mentor: 'Pending Scholar Assignment',
    parentId: 'QI-PAR-103',
    parentName: 'Kamrul Hasan',
    memorizedJuz: 1,
    totalJuz: 30,
    avatar: 'student',
    registeredAt: '2026-10-14T11:00:00Z',
  },
  {
    id: 'QI-PAR-101',
    name: 'Hajji Mansoor Rahman',
    email: 'parent@quraninstitute.org',
    password: 'password123',
    role: 'parent',
    status: 'Active',
    childrenIds: ['QI-STU-8842', 'QI-STU-7721'],
    phone: '+880 1711-223344',
    avatar: 'parent',
    registeredAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'QI-PAR-102',
    name: 'Dr. Fatima Al-Qasim',
    email: 'fatima.parent@quraninstitute.org',
    password: 'password123',
    role: 'parent',
    status: 'Active',
    childrenIds: ['QI-STU-9904'],
    phone: '+880 1711-556677',
    avatar: 'parent',
    registeredAt: '2024-02-01T11:00:00Z',
  },
  {
    id: 'QI-PAR-103',
    name: 'Kamrul Hasan',
    email: 'kamrul.parent@quraninstitute.org',
    password: 'password123',
    role: 'parent',
    status: 'Pending Approval',
    childrenIds: ['QI-STU-6512'],
    phone: '+880 1711-889900',
    avatar: 'parent',
    registeredAt: '2024-10-10T09:30:00Z',
  },
];
globalThis.__QURAN_USERS__ = globalThis.__QURAN_USERS__ || initialUsers;
// Synchronize new initialUsers into global cache if not present
initialUsers.forEach((u) => {
  if (!globalThis.__QURAN_USERS__.some((existing) => existing.id === u.id)) {
    globalThis.__QURAN_USERS__.push(u);
  }
});
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
  {
    id: 'QI-ENR-03',
    studentId: 'QI-STU-7721',
    studentName: 'Zaid bin Harith',
    courseId: 'QI-CRS-001',
    teacherId: 'QI-FAC-028',
    teacherName: 'Ustadh Mahmoud Al-Misri',
    enrolledAt: '2025-11-01T09:00:00Z',
    progressPercent: 45,
    completedLessons: ['les-1-1', 'les-1-2', 'les-1-3', 'les-2-1'],
    completedQuizzes: [
      { quizId: 'quiz-mod-1', score: 90, passed: true, date: '2025-11-10T14:00:00Z' },
    ],
    status: 'active',
  },
];
globalThis.__QURAN_ENROLLMENTS__ = globalThis.__QURAN_ENROLLMENTS__ || initialEnrollments;
initialEnrollments.forEach((e) => {
  if (!globalThis.__QURAN_ENROLLMENTS__.some((existing) => existing.id === e.id)) {
    globalThis.__QURAN_ENROLLMENTS__.push(e);
  }
});
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

  const roleLower = String(userData.role || '').toLowerCase();
  if (roleLower !== 'student' && roleLower !== 'teacher' && roleLower !== 'parent') {
    throw new Error('Invalid user role. Only Student, Teacher, and Parent accounts may be registered.');
  }

  const rolePrefix = roleLower === 'teacher' ? 'FAC' : roleLower === 'parent' ? 'PAR' : 'STU';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `QI-${rolePrefix}-${randomNum}`;

  const defaultStatus =
    roleLower === 'teacher'
      ? 'Pending Credential Verification'
      : roleLower === 'parent'
      ? 'Active'
      : 'Enrolled';

  const defaultAvatar = roleLower === 'teacher' ? 'scholar' : roleLower === 'parent' ? 'parent' : roleLower === 'admin' ? 'admin' : 'student';

  const newUser = {
    id: newId,
    status: defaultStatus,
    avatar: defaultAvatar,
    registeredAt: new Date().toISOString(),
    ...userData,
    role: roleLower,
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

export function getAllParents() {
  return users
    .filter((u) => u.role === 'parent')
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
  const parents = users.filter((u) => u.role === 'parent');
  const verifiedTeachers = teachers.filter(
    (u) => u.status === 'Verified Scholar' || u.status === 'Active'
  );
  const pendingTeachers = teachers.filter(
    (u) => u.status !== 'Verified Scholar' && u.status !== 'Active' && u.status !== 'Suspended' && u.status !== 'Rejected'
  );
  const pendingStudents = students.filter(
    (u) => u.status === 'Pending Approval' || u.status === 'Pending Credential Verification'
  );
  const pendingParents = parents.filter(
    (u) => u.status === 'Pending Approval'
  );
  const admins = users.filter((u) => u.role === 'admin');
  const totalMemorizedJuz = students.reduce((acc, curr) => acc + (curr.memorizedJuz || 0), 0);

  // Calculate overall attendance rate
  const allAtt = globalThis.__QURAN_ATTENDANCE__ || [];
  const presentCount = allAtt.filter((a) => a.status === 'present').length;
  const lateCount = allAtt.filter((a) => a.status === 'late').length;
  const attendanceRate = allAtt.length > 0
    ? Math.round(((presentCount + lateCount * 0.8) / allAtt.length) * 100)
    : 96;

  // Calculate monthly revenue and payroll
  const invoicesList = globalThis.__QURAN_INVOICES__ || [];
  const monthlyRevenue = invoicesList
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const pendingRevenue = invoicesList
    .filter((inv) => inv.status !== 'Paid')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const salariesList = globalThis.__QURAN_TEACHER_SALARIES__ || [];
  const monthlyPayroll = salariesList.reduce((sum, s) => sum + (s.totalPayable || 0), 0);
  const totalHoursTaught = salariesList.reduce((sum, s) => sum + (s.totalHoursTaught || 0), 0);

  return {
    totalStudents: students.length,
    totalTeachers: verifiedTeachers.length,
    pendingTeachers: pendingTeachers.length,
    totalParents: parents.length,
    pendingStudents: pendingStudents.length,
    pendingParents: pendingParents.length,
    pendingUsersTotal: pendingTeachers.length + pendingStudents.length + pendingParents.length,
    totalAdmins: admins.length,
    totalUsers: users.length,
    totalMemorizedJuz,
    totalCourses: courses.length,
    totalActiveMistakeFlags: studentMistakes.filter((m) => m.status === 'active').length,
    totalResolvedMistakes: studentMistakes.filter((m) => m.status === 'resolved').length,
    verifiedSanadsCount: verifiedTeachers.length + 3,
    activeLiveSessionsToday: 6,
    attendanceRate,
    monthlyRevenue,
    pendingRevenue,
    monthlyPayroll,
    totalHoursTaught,
  };
}

export function approveTeacher(userId) {
  return approveUser(userId);
}

export function rejectTeacher(userId) {
  return rejectUser(userId);
}

export function approveUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error('User not found');

  if (user.role === 'teacher') {
    user.status = 'Verified Scholar';
  } else if (user.role === 'student') {
    user.status = 'Enrolled';
  } else if (user.role === 'parent') {
    user.status = 'Active';
  } else {
    user.status = 'Active';
  }

  const { password: _, ...safeUser } = user;
  return safeUser;
}

export function rejectUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error('User not found');

  user.status = 'Rejected';
  const { password: _, ...safeUser } = user;
  return safeUser;
}

export function assignTeacherToStudent(studentId, teacherId) {
  const student = users.find((u) => u.id === studentId);
  if (!student) throw new Error('Student record not found');
  const teacher = users.find((u) => u.id === teacherId);
  if (!teacher) throw new Error('Teacher record not found');

  student.assignedTeacherId = teacher.id;
  student.mentor = teacher.name;

  // Synchronize enrollments
  enrollments.forEach((e) => {
    if (e.studentId === studentId) {
      e.teacherId = teacher.id;
      e.teacherName = teacher.name;
    }
  });

  // Update teacher studentsCount
  const count = users.filter((u) => u.assignedTeacherId === teacher.id).length;
  teacher.studentsCount = count;

  const { password: _p1, ...safeStudent } = student;
  const { password: _p2, ...safeTeacher } = teacher;
  return { student: safeStudent, teacher: safeTeacher };
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
      : user.role === 'parent'
      ? 'Active'
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
        studentAvatar: studentUser?.avatar || 'student',
        memorizedJuz: studentUser?.memorizedJuz || 0,
        totalJuz: studentUser?.totalJuz || 30,
        tajweedLevel: studentUser?.tajweedLevel || 'Intermediate',
        targetGoal: studentUser?.targetGoal || 'Hifz & Tajweed Mastery',
        nextSession: studentUser?.nextSession || 'Weekly 1-on-1 Class',
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

// =========================================================================
// 7. ATTENDANCE SYSTEM
// =========================================================================
const initialAttendance = [
  {
    id: 'ATT-20261016-01',
    studentId: 'QI-STU-8842',
    studentName: 'Tariq Al-Mansoor',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    courseId: 'QI-CRS-001',
    date: '2026-10-16',
    status: 'present', // 'present' | 'absent' | 'late' | 'excused'
    note: 'Joined session on time with complete Wudhu and active focus.',
    timestamp: '2026-10-16T10:00:00Z',
  },
  {
    id: 'ATT-20261016-02',
    studentId: 'QI-STU-9904',
    studentName: 'Maryam Al-Qasim',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    courseId: 'QI-CRS-001',
    date: '2026-10-16',
    status: 'present',
    note: 'Excellent punctuality and clear recitation of Surah Al-Baqarah.',
    timestamp: '2026-10-16T11:15:00Z',
  },
  {
    id: 'ATT-20261015-01',
    studentId: 'QI-STU-8842',
    studentName: 'Tariq Al-Mansoor',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    courseId: 'QI-CRS-001',
    date: '2026-10-15',
    status: 'present',
    note: 'Full attendance. Recited 1.5 pages of new Sabaq.',
    timestamp: '2026-10-15T10:00:00Z',
  },
  {
    id: 'ATT-20261015-02',
    studentId: 'QI-STU-7721',
    studentName: 'Zaid bin Harith',
    teacherId: 'QI-FAC-028',
    teacherName: 'Ustadh Mahmoud Al-Misri',
    courseId: 'QI-CRS-001',
    date: '2026-10-15',
    status: 'late',
    note: 'Joined 8 minutes late due to prayer at mosque.',
    timestamp: '2026-10-15T15:08:00Z',
  },
  {
    id: 'ATT-20261014-01',
    studentId: 'QI-STU-8842',
    studentName: 'Tariq Al-Mansoor',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    courseId: 'QI-CRS-001',
    date: '2026-10-14',
    status: 'present',
    note: 'Punctual attendance.',
    timestamp: '2026-10-14T10:00:00Z',
  },
  {
    id: 'ATT-20261014-02',
    studentId: 'QI-STU-9904',
    studentName: 'Maryam Al-Qasim',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    courseId: 'QI-CRS-001',
    date: '2026-10-14',
    status: 'present',
    note: 'Present and recited 2 Juz revision.',
    timestamp: '2026-10-14T11:00:00Z',
  },
  {
    id: 'ATT-20261013-01',
    studentId: 'QI-STU-8842',
    studentName: 'Tariq Al-Mansoor',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    courseId: 'QI-CRS-001',
    date: '2026-10-13',
    status: 'present',
    note: 'Present and engaged.',
    timestamp: '2026-10-13T10:00:00Z',
  },
];
globalThis.__QURAN_ATTENDANCE__ = globalThis.__QURAN_ATTENDANCE__ || initialAttendance;
const attendance = globalThis.__QURAN_ATTENDANCE__;

export function recordAttendance({
  studentId,
  teacherId,
  courseId = 'QI-CRS-001',
  date = new Date().toISOString().split('T')[0],
  status = 'present',
  note = '',
}) {
  const student = findUserById(studentId);
  const teacher = findUserById(teacherId);
  if (!student) throw new Error('Student not found');
  if (!teacher) throw new Error('Teacher not found');

  // Check if attendance already recorded today for this student & teacher
  const existingIndex = attendance.findIndex(
    (a) => a.studentId === studentId && a.date === date
  );

  const record = {
    id: existingIndex !== -1 ? attendance[existingIndex].id : `ATT-${date.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
    studentId,
    studentName: student.name,
    teacherId,
    teacherName: teacher.name,
    courseId,
    date,
    status,
    note,
    timestamp: new Date().toISOString(),
  };

  if (existingIndex !== -1) {
    attendance[existingIndex] = record;
  } else {
    attendance.unshift(record);
  }

  return record;
}

export function getAttendanceForStudent(studentId) {
  return attendance.filter((a) => a.studentId === studentId);
}

export function getAttendanceForTeacher(teacherId, date = null) {
  return attendance.filter((a) => {
    if (a.teacherId !== teacherId) return false;
    if (date && a.date !== date) return false;
    return true;
  });
}

export function getInstituteAttendanceAnalytics() {
  const total = attendance.length;
  if (total === 0) {
    return {
      rate: 96,
      present: 0,
      late: 0,
      absent: 0,
      excused: 0,
      total: 0,
      recentRecords: [],
    };
  }

  const present = attendance.filter((a) => a.status === 'present').length;
  const late = attendance.filter((a) => a.status === 'late').length;
  const absent = attendance.filter((a) => a.status === 'absent').length;
  const excused = attendance.filter((a) => a.status === 'excused').length;
  const rate = Math.round(((present + late * 0.8) / total) * 100);

  return {
    rate,
    present,
    late,
    absent,
    excused,
    total,
    recentRecords: attendance.slice(0, 10),
  };
}

// =========================================================================
// 8. DAILY SABAQ, SABQI, MANZIL & TARBIYAH
// =========================================================================
const initialDailyProgress = [
  {
    id: 'PRG-1001',
    studentId: 'QI-STU-8842',
    studentName: 'Tariq Al-Mansoor',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    date: '2026-10-16',
    sabaq: {
      para: 12,
      surah: 'Yusuf (يُوسُف)',
      startAyah: 1,
      endAyah: 22,
      grade: 'Mumtaz (ممتاز - 98%)',
      pages: 1.5,
      notes: 'Exceptional Tajweed with pristine Madd Lazim & Makharij.',
    },
    sabqi: {
      para: 11,
      surahs: 'Hud 50 - 123',
      accuracy: '96%',
      grade: 'Jayyid Jiddan (جيد جداً)',
    },
    manzil: 'Para 1 to 3 Complete Revision',
    tarbiyah: {
      salatAttendance: '5/5 In Congregation',
      adabScore: 'Outstanding (10/10)',
      sunnahHabit: 'Morning and Evening Adhkar recited with mindfulness',
      teacherGuidance: 'Advised Tariq to listen to Sheikh Al-Husary for slow Tartil cadence.',
    },
    teacherFeedback: 'MashaAllah, Tariq was thoroughly prepared today. He has mastered the throat letters and his voice projection is magnificent. Keep up this noble journey!',
    timestamp: '2026-10-16T10:45:00Z',
  },
  {
    id: 'PRG-1002',
    studentId: 'QI-STU-8842',
    studentName: 'Tariq Al-Mansoor',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    date: '2026-10-15',
    sabaq: {
      para: 11,
      surah: 'Hud (هُود)',
      startAyah: 80,
      endAyah: 115,
      grade: 'Jayyid Jiddan (جيد جداً - 92%)',
      pages: 1.0,
      notes: 'Corrected Qalqalah on Daal. Recited smoothly afterwards.',
    },
    sabqi: {
      para: 11,
      surahs: 'Yunus 50 - Hud 40',
      accuracy: '94%',
      grade: 'Jayyid Jiddan (جيد جداً)',
    },
    manzil: 'Para 1 to 2 Revision',
    tarbiyah: {
      salatAttendance: '5/5 In Congregation',
      adabScore: 'Very Good (9/10)',
      sunnahHabit: 'Tahajjud & Quran reading after Fajr',
      teacherGuidance: 'Encouraged humility and consistent review before sleeping.',
    },
    teacherFeedback: 'Great progress on Surah Hud. Parents are requested to ensure 30 minutes of listening practice before tomorrow’s lesson.',
    timestamp: '2026-10-15T10:30:00Z',
  },
  {
    id: 'PRG-1003',
    studentId: 'QI-STU-9904',
    studentName: 'Maryam Al-Qasim',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    date: '2026-10-16',
    sabaq: {
      para: 28,
      surah: 'Al-Mumtahanah (المُمْتَحَنَة)',
      startAyah: 1,
      endAyah: 13,
      grade: 'Mumtaz (ممتاز - 99%)',
      pages: 2.0,
      notes: 'Flawless recitation with connected sanad standard.',
    },
    sabqi: {
      para: 27,
      surahs: 'Ar-Rahman, Al-Waqi’ah, Al-Hadid',
      accuracy: '98%',
      grade: 'Mumtaz (ممتاز)',
    },
    manzil: 'Para 1 to 5',
    tarbiyah: {
      salatAttendance: '5/5 Jama’ah',
      adabScore: 'Exemplary (10/10)',
      sunnahHabit: 'Helping younger siblings with Noorani Qaida',
      teacherGuidance: 'Preparing for Sanad test in November.',
    },
    teacherFeedback: 'Maryam is on track to complete her Khatm and Ijazah within two months. SubhanAllah, her dedication is an inspiration to the entire institute.',
    timestamp: '2026-10-16T11:45:00Z',
  },
  {
    id: 'PRG-1004',
    studentId: 'QI-STU-7721',
    studentName: 'Zaid bin Harith',
    teacherId: 'QI-FAC-028',
    teacherName: 'Ustadh Mahmoud Al-Misri',
    date: '2026-10-15',
    sabaq: {
      para: 6,
      surah: 'An-Nisa (النِّسَاء)',
      startAyah: 148,
      endAyah: 165,
      grade: 'Jayyid (جيد - 85%)',
      pages: 1.0,
      notes: 'Focus on holding Ghunnah for 2 counts on Noon Mushaddadah.',
    },
    sabqi: {
      para: 5,
      surahs: 'An-Nisa 24 - 100',
      accuracy: '88%',
      grade: 'Jayyid (جيد)',
    },
    manzil: 'Para 1 Revision',
    tarbiyah: {
      salatAttendance: '5/5 On Time',
      adabScore: 'Good (8.5/10)',
      sunnahHabit: 'Reciting Ayat al-Kursi after every fardh prayer',
      teacherGuidance: 'Advised repetition of Ayahs 150-155 three times at home.',
    },
    teacherFeedback: 'Zaid worked hard today. With extra revision on the heavy letters (Khaa and Saad), he will reach Mumtaz level soon inshaAllah.',
    timestamp: '2026-10-15T15:45:00Z',
  },
];
globalThis.__QURAN_DAILY_PROGRESS__ = globalThis.__QURAN_DAILY_PROGRESS__ || initialDailyProgress;
const dailyProgress = globalThis.__QURAN_DAILY_PROGRESS__;

export function recordDailyProgress({
  studentId,
  teacherId,
  date = new Date().toISOString().split('T')[0],
  sabaq = {},
  sabqi = {},
  manzil = '',
  tarbiyah = {},
  teacherFeedback = '',
}) {
  const student = findUserById(studentId);
  const teacher = findUserById(teacherId);
  if (!student) throw new Error('Student not found');
  if (!teacher) throw new Error('Teacher not found');

  const newEntry = {
    id: `PRG-${Math.floor(1000 + Math.random() * 9000)}`,
    studentId,
    studentName: student.name,
    teacherId,
    teacherName: teacher.name,
    date,
    sabaq: {
      para: sabaq.para || student.memorizedJuz || 1,
      surah: sabaq.surah || 'Al-Fatihah',
      startAyah: Number(sabaq.startAyah) || 1,
      endAyah: Number(sabaq.endAyah) || 10,
      grade: sabaq.grade || 'Mumtaz (ممتاز)',
      pages: Number(sabaq.pages) || 1.0,
      notes: sabaq.notes || '',
    },
    sabqi: {
      para: sabqi.para || Math.max(1, (sabaq.para || 1) - 1),
      surahs: sabqi.surahs || 'Previous lessons revision',
      accuracy: sabqi.accuracy || '95%',
      grade: sabqi.grade || 'Jayyid Jiddan (جيد جداً)',
    },
    manzil: manzil || 'Assigned Para Revision',
    tarbiyah: {
      salatAttendance: tarbiyah.salatAttendance || '5/5 Jama’ah',
      adabScore: tarbiyah.adabScore || 'Outstanding (10/10)',
      sunnahHabit: tarbiyah.sunnahHabit || 'Daily Morning and Evening Adhkar',
      teacherGuidance: tarbiyah.teacherGuidance || '',
    },
    teacherFeedback: teacherFeedback || 'Well done in today’s recitation session.',
    timestamp: new Date().toISOString(),
  };

  dailyProgress.unshift(newEntry);
  return newEntry;
}

export function getDailyProgressForStudent(studentId) {
  return dailyProgress.filter((p) => p.studentId === studentId);
}

export function getDailyProgressForTeacher(teacherId) {
  return dailyProgress.filter((p) => p.teacherId === teacherId);
}

// =========================================================================
// 9. DIGITAL QURAN SCREEN TIME & READING TRACKER
// =========================================================================
const initialScreenTime = [
  {
    id: 'ST-001',
    studentId: 'QI-STU-8842',
    surahNumber: 1,
    surahName: 'Al-Fatihah',
    durationSeconds: 1200, // 20 mins
    date: '2026-10-16',
    timestamp: '2026-10-16T08:20:00Z',
  },
  {
    id: 'ST-002',
    studentId: 'QI-STU-8842',
    surahNumber: 112,
    surahName: 'Al-Ikhlas',
    durationSeconds: 900, // 15 mins
    date: '2026-10-15',
    timestamp: '2026-10-15T19:00:00Z',
  },
  {
    id: 'ST-003',
    studentId: 'QI-STU-9904',
    surahNumber: 113,
    surahName: 'Al-Falaq',
    durationSeconds: 2400, // 40 mins
    date: '2026-10-16',
    timestamp: '2026-10-16T09:00:00Z',
  },
];
globalThis.__QURAN_SCREENTIME__ = globalThis.__QURAN_SCREENTIME__ || initialScreenTime;
const screenTimeRecords = globalThis.__QURAN_SCREENTIME__;

export function recordQuranReadingSession({
  studentId,
  surahNumber,
  surahName,
  durationSeconds,
  date = new Date().toISOString().split('T')[0],
}) {
  const newSession = {
    id: `ST-${Math.floor(1000 + Math.random() * 9000)}`,
    studentId,
    surahNumber: Number(surahNumber) || 1,
    surahName: surahName || `Surah ${surahNumber}`,
    durationSeconds: Math.max(1, Number(durationSeconds) || 60),
    date,
    timestamp: new Date().toISOString(),
  };

  screenTimeRecords.unshift(newSession);
  return newSession;
}

export function getQuranScreenTimeStats(studentId) {
  const studentSessions = screenTimeRecords.filter((s) => s.studentId === studentId);
  const today = new Date().toISOString().split('T')[0];

  const todaySeconds = studentSessions
    .filter((s) => s.date === today)
    .reduce((sum, s) => sum + s.durationSeconds, 0);

  const totalSeconds = studentSessions.reduce((sum, s) => sum + s.durationSeconds, 0);

  return {
    todaySeconds,
    todayMinutes: Math.round(todaySeconds / 60),
    totalSeconds,
    totalMinutes: Math.round(totalSeconds / 60),
    totalHours: (totalSeconds / 3600).toFixed(1),
    sessionsCount: studentSessions.length,
    recentSessions: studentSessions.slice(0, 5),
  };
}

// =========================================================================
// 10. PARENTAL REVIEWS & TEACHER RATINGS
// =========================================================================
const initialReviews = [
  {
    id: 'REV-001',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    parentId: 'QI-PAR-101',
    parentName: 'Hajji Mansoor Rahman',
    studentId: 'QI-STU-8842',
    studentName: 'Tariq Al-Mansoor',
    rating: 5,
    categories: {
      punctuality: 5,
      tajweedExcellence: 5,
      patienceWithChild: 5,
      tarbiyahFocus: 5,
    },
    reviewText: 'Dr. Sheikh Ahmad Al-Azhari is truly a blessing for our family. His patient methodology, profound mastery of the Ten Qira’at, and spiritual warmth have inspired my son Tariq to love reciting the Holy Quran every morning.',
    month: 'October 2026',
    createdAt: '2026-10-10T14:30:00Z',
    verified: true,
  },
  {
    id: 'REV-002',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    parentId: 'QI-PAR-102',
    parentName: 'Dr. Fatima Al-Qasim',
    studentId: 'QI-STU-9904',
    studentName: 'Maryam Al-Qasim',
    rating: 5,
    categories: {
      punctuality: 5,
      tajweedExcellence: 5,
      patienceWithChild: 5,
      tarbiyahFocus: 5,
    },
    reviewText: 'Outstanding guidance for Maryam’s Hifz Khatm and Ijazah preparation. The teacher notes provided after each session are meticulous and actionable.',
    month: 'October 2026',
    createdAt: '2026-10-12T16:00:00Z',
    verified: true,
  },
  {
    id: 'REV-003',
    teacherId: 'QI-FAC-028',
    teacherName: 'Ustadh Mahmoud Al-Misri',
    parentId: 'QI-PAR-101',
    parentName: 'Hajji Mansoor Rahman',
    studentId: 'QI-STU-7721',
    studentName: 'Zaid bin Harith',
    rating: 5,
    categories: {
      punctuality: 5,
      tajweedExcellence: 5,
      patienceWithChild: 4,
      tarbiyahFocus: 5,
    },
    reviewText: 'Ustadh Mahmoud is firm yet kind, ensuring Zaid develops accurate Arabic phonetics without feeling rushed. Highly recommended for young boys.',
    month: 'September 2026',
    createdAt: '2026-09-28T18:00:00Z',
    verified: true,
  },
];
globalThis.__QURAN_REVIEWS__ = globalThis.__QURAN_REVIEWS__ || initialReviews;
const reviews = globalThis.__QURAN_REVIEWS__;

export function submitTeacherReview({
  teacherId,
  parentId,
  studentId,
  rating = 5,
  categories = {},
  reviewText = '',
  month = 'October 2026',
}) {
  const teacher = findUserById(teacherId);
  const parent = findUserById(parentId);
  const student = findUserById(studentId);
  if (!teacher) throw new Error('Teacher record not found');

  const newReview = {
    id: `REV-${Math.floor(1000 + Math.random() * 9000)}`,
    teacherId,
    teacherName: teacher.name,
    parentId: parentId || 'QI-PAR-101',
    parentName: parent?.name || 'Parent Guardian',
    studentId: studentId || 'QI-STU-8842',
    studentName: student?.name || 'Enrolled Student',
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    categories: {
      punctuality: categories.punctuality || 5,
      tajweedExcellence: categories.tajweedExcellence || 5,
      patienceWithChild: categories.patienceWithChild || 5,
      tarbiyahFocus: categories.tarbiyahFocus || 5,
    },
    reviewText: reviewText.trim() || 'Alhamdulillah, excellent instruction and tarbiyah.',
    month,
    createdAt: new Date().toISOString(),
    verified: true,
  };

  reviews.unshift(newReview);
  return newReview;
}

export function getReviewsForTeacher(teacherId) {
  return reviews.filter((r) => r.teacherId === teacherId);
}

export function getAllReviews() {
  return reviews;
}

// =========================================================================
// 11. FINANCIALS: TUITION INVOICES & TEACHER SALARIES
// =========================================================================
const initialInvoices = [
  {
    id: 'INV-2026-1001',
    studentId: 'QI-STU-8842',
    studentName: 'Tariq Al-Mansoor',
    parentId: 'QI-PAR-101',
    parentName: 'Hajji Mansoor Rahman',
    month: 'October 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    amount: 65.0,
    currency: 'USD',
    amountBDT: 7500,
    status: 'Paid', // 'Paid' | 'Due' | 'Overdue'
    paymentMethod: 'bKash Merchant Pay',
    transactionId: 'BK-9921448102',
    paidAt: '2026-10-05T14:20:00Z',
    items: [
      { desc: 'Monthly Intensive 1-on-1 Hifz & Tajweed Program', amount: 55.0 },
      { desc: 'Digital Quran & Online Platform Access', amount: 10.0 },
    ],
  },
  {
    id: 'INV-2026-1002',
    studentId: 'QI-STU-7721',
    studentName: 'Zaid bin Harith',
    parentId: 'QI-PAR-101',
    parentName: 'Hajji Mansoor Rahman',
    month: 'October 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    amount: 55.0,
    currency: 'USD',
    amountBDT: 6500,
    status: 'Due',
    paymentMethod: null,
    transactionId: null,
    paidAt: null,
    items: [
      { desc: 'Standard 1-on-1 Quran Reading & Tajweed Tuition', amount: 55.0 },
    ],
  },
  {
    id: 'INV-2026-1003',
    studentId: 'QI-STU-9904',
    studentName: 'Maryam Al-Qasim',
    parentId: 'QI-PAR-102',
    parentName: 'Dr. Fatima Al-Qasim',
    month: 'October 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    amount: 75.0,
    currency: 'USD',
    amountBDT: 8800,
    status: 'Paid',
    paymentMethod: 'Visa Card •••• 4242',
    transactionId: 'TX-CARD-773199',
    paidAt: '2026-10-02T09:15:00Z',
    items: [
      { desc: 'Advanced Quran Memorization & Ijazah Program', amount: 75.0 },
    ],
  },
  {
    id: 'INV-2026-0901',
    studentId: 'QI-STU-8842',
    studentName: 'Tariq Al-Mansoor',
    parentId: 'QI-PAR-101',
    parentName: 'Hajji Mansoor Rahman',
    month: 'September 2026',
    issueDate: '2026-09-01',
    dueDate: '2026-09-10',
    amount: 65.0,
    currency: 'USD',
    amountBDT: 7500,
    status: 'Paid',
    paymentMethod: 'bKash Merchant Pay',
    transactionId: 'BK-8819203911',
    paidAt: '2026-09-04T12:00:00Z',
    items: [
      { desc: 'Monthly Intensive 1-on-1 Hifz & Tajweed Program', amount: 65.0 },
    ],
  },
];
globalThis.__QURAN_INVOICES__ = globalThis.__QURAN_INVOICES__ || initialInvoices;
const invoices = globalThis.__QURAN_INVOICES__;

const initialTeacherSalaries = [
  {
    id: 'SAL-202610-01',
    teacherId: 'QI-FAC-014',
    teacherName: 'Dr. Sheikh Ahmad Al-Azhari',
    month: 'October 2026',
    hourlyRate: 30.0,
    totalHoursTaught: 38.5,
    calculatedSalary: 1155.0,
    bonus: 50.0,
    totalPayable: 1205.0,
    sessionsCount: 26,
    status: 'Approved', // 'Pending Approval' | 'Approved' | 'Disbursed'
    approvedBy: 'QI-ADM-001',
    approvedAt: '2026-10-15T12:00:00Z',
    disbursedAt: null,
    notes: 'Approved for outstanding faculty performance and perfect attendance.',
  },
  {
    id: 'SAL-202610-02',
    teacherId: 'QI-FAC-028',
    teacherName: 'Ustadh Mahmoud Al-Misri',
    month: 'October 2026',
    hourlyRate: 25.0,
    totalHoursTaught: 30.0,
    calculatedSalary: 750.0,
    bonus: 0.0,
    totalPayable: 750.0,
    sessionsCount: 20,
    status: 'Pending Approval',
    approvedBy: null,
    approvedAt: null,
    disbursedAt: null,
    notes: 'Regular faculty payroll under administrative review.',
  },
];
globalThis.__QURAN_TEACHER_SALARIES__ = globalThis.__QURAN_TEACHER_SALARIES__ || initialTeacherSalaries;
const teacherSalaries = globalThis.__QURAN_TEACHER_SALARIES__;

export function getAllInvoices() {
  return invoices;
}

export function getInvoicesForUser(userId, role) {
  if (role === 'parent') {
    const parent = findUserById(userId);
    const childIds = parent?.childrenIds || [];
    return invoices.filter(
      (inv) => inv.parentId === userId || childIds.includes(inv.studentId)
    );
  }
  // Student
  return invoices.filter((inv) => inv.studentId === userId);
}

export function markInvoicePaid(invoiceId, paymentMethod = 'bKash Merchant Pay', transactionId = null) {
  const invoice = invoices.find((inv) => inv.id === invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  invoice.status = 'Paid';
  invoice.paymentMethod = paymentMethod;
  invoice.transactionId = transactionId || `TX-${Math.floor(100000 + Math.random() * 900000)}`;
  invoice.paidAt = new Date().toISOString();

  return invoice;
}

export function getAllTeacherSalaries() {
  return teacherSalaries;
}

export function getTeacherSalary(teacherId, month = 'October 2026') {
  return teacherSalaries.find((s) => s.teacherId === teacherId && s.month === month) || null;
}

export function approveTeacherSalary(salaryId, adminId = 'QI-ADM-001') {
  const salary = teacherSalaries.find((s) => s.id === salaryId);
  if (!salary) throw new Error('Salary record not found');

  salary.status = 'Approved';
  salary.approvedBy = adminId;
  salary.approvedAt = new Date().toISOString();

  return salary;
}

export function disburseTeacherSalary(salaryId, adminId = 'QI-ADM-001') {
  const salary = teacherSalaries.find((s) => s.id === salaryId);
  if (!salary) throw new Error('Salary record not found');

  salary.status = 'Disbursed';
  salary.disbursedAt = new Date().toISOString();

  return salary;
}

export function getFinancialAnalytics() {
  const totalRevenue = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingTuition = invoices
    .filter((inv) => inv.status !== 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPayroll = teacherSalaries.reduce((sum, s) => sum + s.totalPayable, 0);
  const netMargin = totalRevenue - totalPayroll;

  return {
    totalRevenue,
    pendingTuition,
    totalPayroll,
    netMargin,
    totalInvoicesCount: invoices.length,
    paidInvoicesCount: invoices.filter((i) => i.status === 'Paid').length,
    dueInvoicesCount: invoices.filter((i) => i.status !== 'Paid').length,
    salaries: teacherSalaries,
    invoices: invoices.slice(0, 10),
  };
}

// =========================================================================
// 12. SYSTEM SETTINGS & GLOBAL NOTIFICATIONS
// =========================================================================
const initialSystemSettings = {
  instituteName: 'Our Quran Institute',
  academicYear: '1447-1448 AH (2026-2027 Academic Session)',
  term: 'Fall Intensive Hifz & Tajweed Trimester',
  defaultLanguage: 'en', // 'en' | 'ar'
  timezone: 'Asia/Dhaka (GMT+6)',
  contactEmail: 'academics@quraninstitute.org',
  contactPhone: '+880 1711-223344 / +1 (800) 555-QURAN',
  tuitionFeeStandard: 65.0,
  directorSignature: 'Dr. Sheikh Ibrahim Al-Mansoor, Academic Director',
  notificationsEnabled: true,
  allowStudentQuranScreenTimer: true,
  systemStatus: 'Operational & Connected to Sanad Registry',
};
globalThis.__QURAN_SYSTEM_SETTINGS__ = globalThis.__QURAN_SYSTEM_SETTINGS__ || initialSystemSettings;
const systemSettings = globalThis.__QURAN_SYSTEM_SETTINGS__;

const initialAnnouncements = [
  {
    id: 'ANN-001',
    title: 'Quarterly Hifz Evaluation & Parent-Teacher Conference',
    arabicTitle: 'الاخْتِبَارُ الفَصْلِيُّ لِحِفْظِ القُرْآنِ الكَرِيمِ',
    message: 'On October 24th, the institute will host quarterly Hifz recitation reviews and live parent-teacher conferences. All guardians are respectfully requested to attend their scheduled session.',
    targetAudience: 'all', // 'all' | 'teachers' | 'students' | 'parents'
    priority: 'urgent', // 'urgent' | 'normal' | 'info'
    date: '2026-10-14',
    author: 'Director of Academic Affairs',
  },
  {
    id: 'ANN-002',
    title: 'New Digital Tajweed Dictionary Tool Launched for Faculty',
    arabicTitle: 'إِطْلَاقُ مُعْجَمِ التَّجْوِيدِ لِلأَسَاتِذَةِ',
    message: 'Scholars can now access the instant Tajweed terminology and classroom Arabic glossary directly inside their Dynamic Action Board.',
    targetAudience: 'teachers',
    priority: 'normal',
    date: '2026-10-12',
    author: 'Institute IT Division',
  },
];
globalThis.__QURAN_ANNOUNCEMENTS__ = globalThis.__QURAN_ANNOUNCEMENTS__ || initialAnnouncements;
const announcements = globalThis.__QURAN_ANNOUNCEMENTS__;

export function getSystemSettings() {
  return systemSettings;
}

export function updateSystemSettings(updates) {
  Object.assign(systemSettings, updates);
  return systemSettings;
}

export function getAnnouncements(targetAudience = 'all') {
  if (targetAudience === 'all') return announcements;
  return announcements.filter(
    (a) => a.targetAudience === 'all' || a.targetAudience === targetAudience
  );
}

export function createAnnouncement({
  title,
  arabicTitle = '',
  message,
  targetAudience = 'all',
  priority = 'normal',
  author = 'Administration',
}) {
  const newAnn = {
    id: `ANN-${Math.floor(100 + Math.random() * 900)}`,
    title,
    arabicTitle,
    message,
    targetAudience,
    priority,
    date: new Date().toISOString().split('T')[0],
    author,
  };

  announcements.unshift(newAnn);
  return newAnn;
}

export function deleteAnnouncement(announcementId) {
  const idx = announcements.findIndex((a) => a.id === announcementId);
  if (idx !== -1) {
    return announcements.splice(idx, 1)[0];
  }
  return null;
}

// =========================================================================
// 13. DIGITAL TOOLS: TAJWEED & QURANIC TERMINOLOGY DICTIONARY
// =========================================================================
const initialDictionary = [
  {
    id: 'DIC-001',
    termArabic: 'مَخَارِجُ الحُرُوفِ',
    termTranslit: 'Makharij Al-Huroof',
    termEnglish: 'Points of Articulation',
    category: 'makharij',
    definition: 'The 17 specific anatomical points in the throat, tongue, lips, nasal cavity, and chest from which Arabic letters originate.',
    example: 'حروف الحلق (ء، هـ، ع، ح، غ، خ)',
  },
  {
    id: 'DIC-002',
    termArabic: 'القَلْقَلَة',
    termTranslit: 'Al-Qalqalah',
    termEnglish: 'Echoing / Bouncing Sound',
    category: 'sifaat',
    definition: 'A vibration or echoing release produced when pronouncing the five letters (ق، ط، ب، ج، د) when they carry a Sukoon.',
    example: 'الفَلَقْ - كَسَبْ - مَسَدْ',
  },
  {
    id: 'DIC-003',
    termArabic: 'إِظْهَار حَلْقِيّ',
    termTranslit: 'Izhar Halqi',
    termEnglish: 'Clear Throat Pronunciation',
    category: 'noon_tanween',
    definition: 'Pronouncing Noon Sakinah or Tanween distinctly without extra nasalization when followed by the 6 throat letters.',
    example: 'مَنْ ءَامَنَ - أَنْعَمْتَ',
  },
  {
    id: 'DIC-004',
    termArabic: 'إِدْغَام بِغُنَّة',
    termTranslit: 'Idgham bi-Ghunnah',
    termEnglish: 'Merging With Nasalization',
    category: 'noon_tanween',
    definition: 'Merging Noon Sakinah or Tanween into one of the four letters (ي، ن، م، و) while retaining a 2-count nasal humming sound.',
    example: 'مَن يَقُولُ - مِن مَّالٍ',
  },
  {
    id: 'DIC-005',
    termArabic: 'إِقْلَاب',
    termTranslit: 'Iqlab',
    termEnglish: 'Conversion into Meem',
    category: 'noon_tanween',
    definition: 'Transforming the Noon Sakinah or Tanween into a concealed Meem with Ghunnah when meeting the letter Baa (ب).',
    example: 'مِنۢ بَعْدِ - أَنۢبِئْهُم',
  },
  {
    id: 'DIC-006',
    termArabic: 'إِخْفَاء حَقِيقِيّ',
    termTranslit: 'Ikhfa Haqiqi',
    termEnglish: 'Concealment of Noon',
    category: 'noon_tanween',
    definition: 'Pronouncing the Noon sound between Izhar and Idgham with continuous Ghunnah across the 15 Ikhfa letters.',
    example: 'مِن قَبْلُ - كُنتُمْ',
  },
  {
    id: 'DIC-007',
    termArabic: 'مَدّ لَازِم',
    termTranslit: 'Madd Lazim',
    termEnglish: 'Compulsory 6-Count Elongation',
    category: 'madd',
    definition: 'Obligatory elongation for 6 full counts caused by an original Sukoon or Shaddah following a Madd letter in the same word.',
    example: 'وَلَا الضَّآلِّينَ - الحَآقَّةُ',
  },
  {
    id: 'DIC-008',
    termArabic: 'وَقْف لَازِم (مـ)',
    termTranslit: 'Waqf Lazim',
    termEnglish: 'Mandatory Stop Sign',
    category: 'waqf',
    definition: 'A stop mark indicating that stopping recitation is mandatory to preserve correct theological meaning and grammar.',
    example: 'إِنَّمَا يَسْتَجِيبُ الَّذِينَ يَسْمَعُونَ ۘ وَالْمَوْتَىٰ يَبْعَثُهُمُ اللَّهُ',
  },
  {
    id: 'DIC-009',
    termArabic: 'أَعِدْ مِنَ البِدَايَةِ',
    termTranslit: "A'id min al-bidayah",
    termEnglish: 'Recite again from the beginning of the Ayah',
    category: 'classroom',
    definition: 'Scholar classroom instruction used when a student loses breath or makes a recitation slip midway.',
    example: 'Used during live 1-on-1 recitation correction.',
  },
  {
    id: 'DIC-010',
    termArabic: 'احْرِصْ عَلَى الغُنَّةِ',
    termTranslit: "Ihriz 'ala al-ghunnah",
    termEnglish: 'Pay strict attention to the 2-count Ghunnah duration',
    category: 'classroom',
    definition: 'Teacher feedback prompt reminding students not to rush past Noon or Meem Mushaddadah.',
    example: 'Correction note on Noon Mushaddadah in Surah An-Nas.',
  },
];
globalThis.__QURAN_DICTIONARY__ = globalThis.__QURAN_DICTIONARY__ || initialDictionary;
const dictionary = globalThis.__QURAN_DICTIONARY__;

export function getDictionaryEntries(category = 'all', search = '') {
  return dictionary.filter((item) => {
    if (category && category !== 'all' && item.category !== category) return false;
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      return (
        item.termArabic.toLowerCase().includes(q) ||
        item.termTranslit.toLowerCase().includes(q) ||
        item.termEnglish.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q)
      );
    }
    return true;
  });
}


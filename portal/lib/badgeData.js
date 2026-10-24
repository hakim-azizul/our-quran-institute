// Comprehensive Gamified Reward & Badge System for Our Quran Institute
// Tracks Juz 1-30 milestones, 10-Juz special certificates, and Tajweed micro-badges.

import { MUSHAF_JUZ_DATA } from './mushafData';

export const SPECIAL_10_JUZ_MILESTONES = [
  {
    id: 'SPECIAL-10J',
    juzThreshold: 10,
    title: 'প্রথম ১০ পারা সমাপ্তি সনদ ব্যাজ',
    titleEn: '10-Juz Master Hafiz Crest',
    tier: 'Gold Milestone',
    color: '#D4AF37',
    badgeIcon: 'award',
    desc: 'Awarded for completing the memorization of 10 Holy Juz with Tajweed accuracy.',
    certificate: {
      id: 'QI-SANAD-10J-8842',
      titleArabic: 'شَهَادَةُ حِفْظِ عَشَرَةِ أَجْزَاءٍ مِنَ القُرْآنِ الكَرِيمِ',
      titleEnglish: 'Certificate of Quranic Memorization Excellence',
      titleBangla: '১০ পারা পবিত্র কোরআন হিফজ সমাপ্তি সনদ',
      juzRange: 'Juz 1 to 10 (পারা ১ থেকে ১০)',
      standing: 'Mumtaz (Top Scholar Standing • ৯৬% গড় স্কোর)',
      mentor: 'Dr. Sheikh Ahmad Al-Masri',
      date: '12 October 2026',
      verificationHash: 'QI-VERIFY-10J-MUMTAZ',
    },
  },
  {
    id: 'SPECIAL-20J',
    juzThreshold: 20,
    title: '২০ পারা সমাপ্তি প্লাটিনাম পদক',
    titleEn: '20-Juz Elite Hafiz Crest',
    tier: 'Platinum Milestone',
    color: '#0D4A38',
    badgeIcon: 'star',
    desc: 'Awarded for completing the memorization of 20 Holy Juz with Tajweed fluency.',
    certificate: {
      id: 'QI-SANAD-20J-8842',
      titleArabic: 'شَهَادَةُ حِفْظِ عِشْرِينَ جُزْءًا مِنَ القُرْآنِ الكَرِيمِ',
      titleEnglish: 'Certificate of Advanced Quranic Memorization',
      titleBangla: '২০ পারা পবিত্র কোরআন হিফজ সমাপ্তি সনদ',
      juzRange: 'Juz 1 to 20 (পারা ১ থেকে ২০)',
      standing: 'Jayyid Jiddan (Distinction)',
      mentor: 'Dr. Sheikh Ahmad Al-Masri',
      date: 'Pending Completion (Currently at 12 Juz)',
      verificationHash: 'QI-VERIFY-20J-PENDING',
    },
  },
  {
    id: 'SPECIAL-30J',
    juzThreshold: 30,
    title: 'সম্পূর্ণ ৩০ পারা খতম ও সনদ',
    titleEn: 'Grand Khatm Al-Quran Sanad',
    tier: 'Diamond Sanad Seal',
    color: '#B8860B',
    badgeIcon: 'shield',
    desc: 'The ultimate honor of completing the entire 30 Juz Holy Quran with Ijazah pathway.',
    certificate: {
      id: 'QI-SANAD-30J-8842',
      titleArabic: 'إِجَازَةُ خَتْمِ القُرْآنِ الكَرِيمِ كَامِلاً',
      titleEnglish: 'Grand Sanad of Holy Quran Completion (Khatm)',
      titleBangla: 'সম্পূর্ণ ৩০ পারা পবিত্র কোরআন হিফজ খতম সনদ',
      juzRange: 'Complete 30 Juz (সম্পূর্ণ কোরআন)',
      standing: 'Hafiz Al-Quran',
      mentor: 'Faculty of Senior Scholars',
      date: 'Upcoming Graduation Milestone',
      verificationHash: 'QI-VERIFY-30J-SANAD',
    },
  },
];

export const TAJWEED_MICRO_BADGES = [
  {
    id: 'badge-noon-tanween',
    nameBangla: 'নূন সাকিন ও তানভীন পারদর্শী',
    nameArabic: 'أَحْكَامُ النُّونِ السَّاكِنَةِ وَالتَّنْوِينِ',
    nameEnglish: 'Noon Sakinah & Tanween Master',
    category: 'Noon & Tanween',
    rulesSummary: 'Izhar Halqi, Idgham with/without Ghunnah, Iqlab, and Ikhfa Haqiqi.',
    icon: 'disc',
    color: '#0D4A38',
    defaultUnlocked: true,
    unlockedDate: '18 Sep 2026',
    endorsedBy: 'Sheikh Ahmad Al-Masri',
  },
  {
    id: 'badge-makharij',
    nameBangla: 'মাখরাজ ও উচ্চারণ নির্ভুলতা',
    nameArabic: 'مَخَارِجُ الحُرُوفِ الدَّقِيقَة',
    nameEnglish: 'Makharij & Articulation Authority',
    category: 'Makharij',
    rulesSummary: 'Mastery of all 17 specific articulation points across the 5 primary organs.',
    icon: 'mic',
    color: '#D4AF37',
    defaultUnlocked: true,
    unlockedDate: '25 Sep 2026',
    endorsedBy: 'Sheikh Ahmad Al-Masri',
  },
  {
    id: 'badge-madd-timing',
    nameBangla: 'মদ্দের পরিমাণ ও গতি নিয়ন্ত্রণ',
    nameArabic: 'مَقَادِيرُ المَدِّ وَالمِيزَان',
    nameEnglish: 'Madd Elongation Cadence',
    category: 'Madd Rules',
    rulesSummary: 'Accurate differentiation of 2, 4, 5, and compulsory 6 Harakat Madd Lazim.',
    icon: 'trending-up',
    color: '#15664F',
    defaultUnlocked: true,
    unlockedDate: '02 Oct 2026',
    endorsedBy: 'Sheikh Ahmad Al-Masri',
  },
  {
    id: 'badge-qalqalah',
    nameBangla: 'কলকলাহ ও ধ্বনি প্রতিধ্বনি',
    nameArabic: 'القَلْقَلَةُ الصُّغْرَى وَالكُبْرَى',
    nameEnglish: 'Qalqalah Echo Precision',
    category: 'Qalqalah',
    rulesSummary: 'Crisp bouncing on Qaf, Taa, Baa, Jeem, Daal without adding extra vowel sounds.',
    icon: 'award',
    color: '#B8860B',
    defaultUnlocked: true,
    unlockedDate: '09 Oct 2026',
    endorsedBy: 'Sheikh Ahmad Al-Masri',
  },
  {
    id: 'badge-ghunnah',
    nameBangla: 'নাসাধ্বনি ও গুন্নাহ মাধুর্য',
    nameArabic: 'الغُنَّةُ الكَامِلَةُ وَالأَكْمَل',
    nameEnglish: 'Ghunnah Melodic Control',
    category: 'Ghunnah',
    rulesSummary: 'Pure 2-count nasal resonance from Al-Khayshum on Noon & Meem Mushaddadah.',
    icon: 'volume-2',
    color: '#0D4A38',
    defaultUnlocked: true,
    unlockedDate: '16 Oct 2026',
    endorsedBy: 'Sheikh Ahmad Al-Masri',
  },
  {
    id: 'badge-waqf',
    nameBangla: 'ওয়াকফ ও বিরতি শৃঙ্খলা',
    nameArabic: 'الوَقْفُ وَالابْتِدَاءُ الصَّحِيح',
    nameEnglish: 'Waqf & Stopping Signs Specialist',
    category: 'Waqf Signs',
    rulesSummary: 'Discipline in observing Meem Lazim, Jeem Ja’iz, Qif, and avoiding Waqf Mamnu’ (Laa).',
    icon: 'alert-circle',
    color: '#D4AF37',
    defaultUnlocked: true,
    unlockedDate: '22 Oct 2026',
    endorsedBy: 'Sheikh Ahmad Al-Masri',
  },
  {
    id: 'badge-meem-sakinah',
    nameBangla: 'মীম সাকিনার বিধান',
    nameArabic: 'أَحْكَامُ المِيمِ السَّاكِنَة',
    nameEnglish: 'Meem Sakinah Rules',
    category: 'Meem Sakinah',
    rulesSummary: 'Ikhfa Shafawi (before Baa), Idgham Mithlayn (before Meem), and Izhar Shafawi.',
    icon: 'layers',
    color: '#8C6819',
    defaultUnlocked: false,
    unlockedDate: null,
    endorsedBy: null,
  },
  {
    id: 'badge-sifaat-tarteel',
    nameBangla: 'সিফাত ও তারতীল সৌন্দর্য',
    nameArabic: 'صِفَاتُ الحُرُوفِ وَالتَّرْتِيل',
    nameEnglish: 'Sifaat & Tarteel Fluency',
    category: 'Sifaat & Tarteel',
    rulesSummary: 'Fluency in whisper (Hams), firmness (Shiddah), elevation (Isti’la), and softness (Leen).',
    icon: 'book-open',
    color: '#15664F',
    defaultUnlocked: false,
    unlockedDate: null,
    endorsedBy: null,
  },
];

// Helper to compute full student badge portfolio
export function getStudentBadgePortfolio(studentId = 'QI-STU-8842', memorizedJuz = 12) {
  const isSecondStudent = studentId === 'QI-STU-7721' || memorizedJuz < 10;
  const juzCount = isSecondStudent ? 6 : memorizedJuz;

  // 1. Build all 30 Juz Milestone Badges
  const juzBadges = MUSHAF_JUZ_DATA.map((juzItem) => {
    const isUnlocked = juzItem.number <= juzCount;
    const isInProgress = juzItem.number === juzCount + 1;

    // Realistic milestone completion dates
    const dateOffset = (juzCount - juzItem.number) * 14;
    const completionDate = new Date(Date.now() - dateOffset * 86400000);
    const dateStr = isUnlocked
      ? completionDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : null;

    return {
      juzNumber: juzItem.number,
      nameArabic: juzItem.nameArabic,
      nameBangla: juzItem.nameBangla,
      nameEnglish: juzItem.nameEnglish,
      startPage: juzItem.startPage,
      startSurah: juzItem.startSurah,
      isUnlocked,
      isInProgress,
      isLocked: !isUnlocked && !isInProgress,
      unlockedDate: dateStr,
      badgeTitle: `পারা ${juzItem.number} ব্যাজ`,
      badgeTitleEn: `Juz ${juzItem.number} Milestone`,
      points: 150,
      icon: isUnlocked ? 'award' : isInProgress ? 'trending-up' : 'lock',
    };
  });

  // 2. Build 10-Juz Special Milestone Badges & Certificates
  const specialMilestones = SPECIAL_10_JUZ_MILESTONES.map((m) => {
    const isAchieved = juzCount >= m.juzThreshold;
    const isInProgress = juzCount < m.juzThreshold && juzCount >= m.juzThreshold - 10;

    return {
      ...m,
      isAchieved,
      isInProgress,
      currentProgressJuz: isAchieved ? m.juzThreshold : Math.max(0, juzCount - (m.juzThreshold - 10)),
      totalTargetJuz: 10,
    };
  });

  // 3. Tajweed Micro-Badges
  const tajweedBadges = TAJWEED_MICRO_BADGES.map((b) => ({
    ...b,
    isUnlocked: isSecondStudent ? b.id === 'badge-noon-tanween' || b.id === 'badge-makharij' : b.defaultUnlocked,
  }));

  const totalUnlockedJuz = juzBadges.filter((b) => b.isUnlocked).length;
  const totalUnlockedTajweed = tajweedBadges.filter((b) => b.isUnlocked).length;
  const totalSpecialAchieved = specialMilestones.filter((m) => m.isAchieved).length;
  const totalBadgesEarned = totalUnlockedJuz + totalUnlockedTajweed + totalSpecialAchieved;
  const totalPossibleBadges = 30 + TAJWEED_MICRO_BADGES.length + SPECIAL_10_JUZ_MILESTONES.length;

  return {
    studentId,
    memorizedJuz: juzCount,
    totalBadgesEarned,
    totalPossibleBadges,
    totalPoints: totalBadgesEarned * 150 + totalSpecialAchieved * 1000,
    juzBadges,
    specialMilestones,
    tajweedBadges,
    has10JuzCertificate: juzCount >= 10,
    activeCertificate: juzCount >= 10 ? specialMilestones[0].certificate : null,
  };
}

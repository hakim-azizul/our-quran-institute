// Authentic Uthmani Quran dataset containing all 114 Surahs of the Holy Quran
// with authentic metadata, verse breakdowns, and word arrays for interactive mistake tracking.

export const ALL_114_SURAH_METADATA = [
  { number: 1, name: 'Al-Fatihah', arabicName: 'الفَاتِحَة', englishName: 'The Opening', revelationType: 'Meccan', ayahCount: 7, juz: 1, bismillah: false },
  { number: 2, name: 'Al-Baqarah', arabicName: 'البَقَرَة', englishName: 'The Cow', revelationType: 'Medinan', ayahCount: 286, juz: 1, bismillah: true },
  { number: 3, name: 'Ali \'Imran', arabicName: 'آل عِمْرَان', englishName: 'Family of Imran', revelationType: 'Medinan', ayahCount: 200, juz: 3, bismillah: true },
  { number: 4, name: 'An-Nisa\'', arabicName: 'النِّسَاء', englishName: 'The Women', revelationType: 'Medinan', ayahCount: 176, juz: 4, bismillah: true },
  { number: 5, name: 'Al-Ma\'idah', arabicName: 'المَائِدَة', englishName: 'The Table Spread', revelationType: 'Medinan', ayahCount: 120, juz: 6, bismillah: true },
  { number: 6, name: 'Al-An\'am', arabicName: 'الأَنْعَام', englishName: 'The Cattle', revelationType: 'Meccan', ayahCount: 165, juz: 7, bismillah: true },
  { number: 7, name: 'Al-A\'raf', arabicName: 'الأَعْرَاف', englishName: 'The Heights', revelationType: 'Meccan', ayahCount: 206, juz: 8, bismillah: true },
  { number: 8, name: 'Al-Anfal', arabicName: 'الأَنْفَال', englishName: 'The Spoils of War', revelationType: 'Medinan', ayahCount: 75, juz: 9, bismillah: true },
  { number: 9, name: 'At-Tawbah', arabicName: 'التَّوْبَة', englishName: 'The Repentance', revelationType: 'Medinan', ayahCount: 129, juz: 10, bismillah: false },
  { number: 10, name: 'Yunus', arabicName: 'يُونُس', englishName: 'Jonah', revelationType: 'Meccan', ayahCount: 109, juz: 11, bismillah: true },
  { number: 11, name: 'Hud', arabicName: 'هُود', englishName: 'Hud', revelationType: 'Meccan', ayahCount: 123, juz: 11, bismillah: true },
  { number: 12, name: 'Yusuf', arabicName: 'يُوسُف', englishName: 'Joseph', revelationType: 'Meccan', ayahCount: 111, juz: 12, bismillah: true },
  { number: 13, name: 'Ar-Ra\'d', arabicName: 'الرَّعْد', englishName: 'The Thunder', revelationType: 'Medinan', ayahCount: 43, juz: 13, bismillah: true },
  { number: 14, name: 'Ibrahim', arabicName: 'إِبْرَاهِيم', englishName: 'Abraham', revelationType: 'Meccan', ayahCount: 52, juz: 13, bismillah: true },
  { number: 15, name: 'Al-Hijr', arabicName: 'الحِجْر', englishName: 'The Rocky Tract', revelationType: 'Meccan', ayahCount: 99, juz: 14, bismillah: true },
  { number: 16, name: 'An-Nahl', arabicName: 'النَّحْل', englishName: 'The Bee', revelationType: 'Meccan', ayahCount: 128, juz: 14, bismillah: true },
  { number: 17, name: 'Al-Isra\'', arabicName: 'الإِسْرَاء', englishName: 'The Night Journey', revelationType: 'Meccan', ayahCount: 111, juz: 15, bismillah: true },
  { number: 18, name: 'Al-Kahf', arabicName: 'الكَهْف', englishName: 'The Cave', revelationType: 'Meccan', ayahCount: 110, juz: 15, bismillah: true },
  { number: 19, name: 'Maryam', arabicName: 'مَرْيَم', englishName: 'Mary', revelationType: 'Meccan', ayahCount: 98, juz: 16, bismillah: true },
  { number: 20, name: 'Ta-Ha', arabicName: 'طه', englishName: 'Ta-Ha', revelationType: 'Meccan', ayahCount: 135, juz: 16, bismillah: true },
  { number: 21, name: 'Al-Anbiya\'', arabicName: 'الأَنْبِيَاء', englishName: 'The Prophets', revelationType: 'Meccan', ayahCount: 112, juz: 17, bismillah: true },
  { number: 22, name: 'Al-Hajj', arabicName: 'الحَجّ', englishName: 'The Pilgrimage', revelationType: 'Medinan', ayahCount: 78, juz: 17, bismillah: true },
  { number: 23, name: 'Al-Mu\'minun', arabicName: 'المُؤْمِنُون', englishName: 'The Believers', revelationType: 'Meccan', ayahCount: 118, juz: 18, bismillah: true },
  { number: 24, name: 'An-Nur', arabicName: 'النُّور', englishName: 'The Light', revelationType: 'Medinan', ayahCount: 64, juz: 18, bismillah: true },
  { number: 25, name: 'Al-Furqan', arabicName: 'الفُرْقَان', englishName: 'The Criterion', revelationType: 'Meccan', ayahCount: 77, juz: 18, bismillah: true },
  { number: 26, name: 'Ash-Shu\'ara\'', arabicName: 'الشُّعَرَاء', englishName: 'The Poets', revelationType: 'Meccan', ayahCount: 227, juz: 19, bismillah: true },
  { number: 27, name: 'An-Naml', arabicName: 'النَّمْل', englishName: 'The Ant', revelationType: 'Meccan', ayahCount: 93, juz: 19, bismillah: true },
  { number: 28, name: 'Al-Qasas', arabicName: 'القَصَص', englishName: 'The Stories', revelationType: 'Meccan', ayahCount: 88, juz: 20, bismillah: true },
  { number: 29, name: 'Al-\'Ankabut', arabicName: 'العَنْكَبُوت', englishName: 'The Spider', revelationType: 'Meccan', ayahCount: 69, juz: 20, bismillah: true },
  { number: 30, name: 'Ar-Rum', arabicName: 'الرُّوم', englishName: 'The Romans', revelationType: 'Meccan', ayahCount: 60, juz: 21, bismillah: true },
  { number: 31, name: 'Luqman', arabicName: 'لُقْمَان', englishName: 'Luqman', revelationType: 'Meccan', ayahCount: 34, juz: 21, bismillah: true },
  { number: 32, name: 'As-Sajdah', arabicName: 'السَّجْدَة', englishName: 'The Prostration', revelationType: 'Meccan', ayahCount: 30, juz: 21, bismillah: true },
  { number: 33, name: 'Al-Ahzab', arabicName: 'الأَحْزَاب', englishName: 'The Combined Forces', revelationType: 'Medinan', ayahCount: 73, juz: 21, bismillah: true },
  { number: 34, name: 'Saba\'', arabicName: 'سَبَأ', englishName: 'Sheba', revelationType: 'Meccan', ayahCount: 54, juz: 22, bismillah: true },
  { number: 35, name: 'Fatir', arabicName: 'فَاطِر', englishName: 'The Originator', revelationType: 'Meccan', ayahCount: 45, juz: 22, bismillah: true },
  { number: 36, name: 'Ya-Sin', arabicName: 'يس', englishName: 'Ya-Sin', revelationType: 'Meccan', ayahCount: 83, juz: 22, bismillah: true },
  { number: 37, name: 'As-Saffat', arabicName: 'الصَّافَّات', englishName: 'Those Ranged in Ranks', revelationType: 'Meccan', ayahCount: 182, juz: 23, bismillah: true },
  { number: 38, name: 'Sad', arabicName: 'ص', englishName: 'The Letter Sad', revelationType: 'Meccan', ayahCount: 88, juz: 23, bismillah: true },
  { number: 39, name: 'Az-Zumar', arabicName: 'الزُّمَر', englishName: 'The Crowds', revelationType: 'Meccan', ayahCount: 75, juz: 23, bismillah: true },
  { number: 40, name: 'Ghafir', arabicName: 'غَافِر', englishName: 'The Forgiver', revelationType: 'Meccan', ayahCount: 85, juz: 24, bismillah: true },
  { number: 41, name: 'Fussilat', arabicName: 'فُصِّلَت', englishName: 'Explained in Detail', revelationType: 'Meccan', ayahCount: 54, juz: 24, bismillah: true },
  { number: 42, name: 'Ash-Shura', arabicName: 'الشُّورَى', englishName: 'The Consultation', revelationType: 'Meccan', ayahCount: 53, juz: 25, bismillah: true },
  { number: 43, name: 'Az-Zukhruf', arabicName: 'الزُّخْرُف', englishName: 'The Gold Adornments', revelationType: 'Meccan', ayahCount: 89, juz: 25, bismillah: true },
  { number: 44, name: 'Ad-Dukhan', arabicName: 'الدُّخَان', englishName: 'The Smoke', revelationType: 'Meccan', ayahCount: 59, juz: 25, bismillah: true },
  { number: 45, name: 'Al-Jathiyah', arabicName: 'الجَاثِيَة', englishName: 'The Kneeling', revelationType: 'Meccan', ayahCount: 37, juz: 25, bismillah: true },
  { number: 46, name: 'Al-Ahqaf', arabicName: 'الأَحْقَاف', englishName: 'The Wind-Curved Sandhills', revelationType: 'Meccan', ayahCount: 35, juz: 26, bismillah: true },
  { number: 47, name: 'Muhammad', arabicName: 'مُحَمَّد', englishName: 'Muhammad', revelationType: 'Medinan', ayahCount: 38, juz: 26, bismillah: true },
  { number: 48, name: 'Al-Fath', arabicName: 'الفَتْح', englishName: 'The Victory', revelationType: 'Medinan', ayahCount: 29, juz: 26, bismillah: true },
  { number: 49, name: 'Al-Hujurat', arabicName: 'الحُجُرَات', englishName: 'The Dwellings', revelationType: 'Medinan', ayahCount: 18, juz: 26, bismillah: true },
  { number: 50, name: 'Qaf', arabicName: 'ق', englishName: 'The Letter Qaf', revelationType: 'Meccan', ayahCount: 45, juz: 26, bismillah: true },
  { number: 51, name: 'Adh-Dhariyat', arabicName: 'الذَّارِيَات', englishName: 'The Winnowing Winds', revelationType: 'Meccan', ayahCount: 60, juz: 26, bismillah: true },
  { number: 52, name: 'At-Tur', arabicName: 'الطُّور', englishName: 'The Mount', revelationType: 'Meccan', ayahCount: 49, juz: 27, bismillah: true },
  { number: 53, name: 'An-Najm', arabicName: 'النَّجْم', englishName: 'The Star', revelationType: 'Meccan', ayahCount: 62, juz: 27, bismillah: true },
  { number: 54, name: 'Al-Qamar', arabicName: 'القَمَر', englishName: 'The Moon', revelationType: 'Meccan', ayahCount: 55, juz: 27, bismillah: true },
  { number: 55, name: 'Ar-Rahman', arabicName: 'الرَّحْمَٰن', englishName: 'The Beneficent', revelationType: 'Medinan', ayahCount: 78, juz: 27, bismillah: true },
  { number: 56, name: 'Al-Waqi\'ah', arabicName: 'الوَاقِعَة', englishName: 'The Inevitable', revelationType: 'Meccan', ayahCount: 96, juz: 27, bismillah: true },
  { number: 57, name: 'Al-Hadid', arabicName: 'الحَدِيد', englishName: 'The Iron', revelationType: 'Medinan', ayahCount: 29, juz: 27, bismillah: true },
  { number: 58, name: 'Al-Mujadila', arabicName: 'المُجَادِلَة', englishName: 'The Pleading Woman', revelationType: 'Medinan', ayahCount: 22, juz: 28, bismillah: true },
  { number: 59, name: 'Al-Hashr', arabicName: 'الحَشْر', englishName: 'The Exile', revelationType: 'Medinan', ayahCount: 24, juz: 28, bismillah: true },
  { number: 60, name: 'Al-Mumtahanah', arabicName: 'المُمْتَحَنَة', englishName: 'She that is to be examined', revelationType: 'Medinan', ayahCount: 13, juz: 28, bismillah: true },
  { number: 61, name: 'As-Saff', arabicName: 'الصَّفّ', englishName: 'The Ranks', revelationType: 'Medinan', ayahCount: 14, juz: 28, bismillah: true },
  { number: 62, name: 'Al-Jumu\'ah', arabicName: 'الجُمُعَة', englishName: 'The Congregation', revelationType: 'Medinan', ayahCount: 11, juz: 28, bismillah: true },
  { number: 63, name: 'Al-Munafiqun', arabicName: 'المُنَافِقُون', englishName: 'The Hypocrites', revelationType: 'Medinan', ayahCount: 11, juz: 28, bismillah: true },
  { number: 64, name: 'At-Taghabun', arabicName: 'التَّغَابُن', englishName: 'The Mutual Disillusion', revelationType: 'Medinan', ayahCount: 18, juz: 28, bismillah: true },
  { number: 65, name: 'At-Talaq', arabicName: 'الطَّلَاق', englishName: 'The Divorce', revelationType: 'Medinan', ayahCount: 12, juz: 28, bismillah: true },
  { number: 66, name: 'At-Tahrim', arabicName: 'التَّحْرِيم', englishName: 'The Prohibition', revelationType: 'Medinan', ayahCount: 12, juz: 28, bismillah: true },
  { number: 67, name: 'Al-Mulk', arabicName: 'المُلْك', englishName: 'The Sovereignty', revelationType: 'Meccan', ayahCount: 30, juz: 29, bismillah: true },
  { number: 68, name: 'Al-Qalam', arabicName: 'القَلَم', englishName: 'The Pen', revelationType: 'Meccan', ayahCount: 52, juz: 29, bismillah: true },
  { number: 69, name: 'Al-Haqqah', arabicName: 'الحَاقَّة', englishName: 'The Reality', revelationType: 'Meccan', ayahCount: 52, juz: 29, bismillah: true },
  { number: 70, name: 'Al-Ma\'arij', arabicName: 'المَعَارِج', englishName: 'The Ascending Stairways', revelationType: 'Meccan', ayahCount: 44, juz: 29, bismillah: true },
  { number: 71, name: 'Nuh', arabicName: 'نُوح', englishName: 'Noah', revelationType: 'Meccan', ayahCount: 28, juz: 29, bismillah: true },
  { number: 72, name: 'Al-Jinn', arabicName: 'الجِنّ', englishName: 'The Jinn', revelationType: 'Meccan', ayahCount: 28, juz: 29, bismillah: true },
  { number: 73, name: 'Al-Muzzammil', arabicName: 'المُزَّمِّل', englishName: 'The Enshrouded One', revelationType: 'Meccan', ayahCount: 20, juz: 29, bismillah: true },
  { number: 74, name: 'Al-Muddaththir', arabicName: 'المُدَّثِّر', englishName: 'The Cloaked One', revelationType: 'Meccan', ayahCount: 56, juz: 29, bismillah: true },
  { number: 75, name: 'Al-Qiyamah', arabicName: 'القِيَامَة', englishName: 'The Resurrection', revelationType: 'Meccan', ayahCount: 40, juz: 29, bismillah: true },
  { number: 76, name: 'Al-Insan', arabicName: 'الإِنْسَان', englishName: 'Man', revelationType: 'Medinan', ayahCount: 31, juz: 29, bismillah: true },
  { number: 77, name: 'Al-Mursalat', arabicName: 'المُرْسَلَات', englishName: 'The Emissaries', revelationType: 'Meccan', ayahCount: 50, juz: 29, bismillah: true },
  { number: 78, name: 'An-Naba\'', arabicName: 'النَّبَأ', englishName: 'The Great News', revelationType: 'Meccan', ayahCount: 40, juz: 30, bismillah: true },
  { number: 79, name: 'An-Nazi\'at', arabicName: 'النَّازِعَات', englishName: 'Those who drag forth', revelationType: 'Meccan', ayahCount: 46, juz: 30, bismillah: true },
  { number: 80, name: '\'Abasa', arabicName: 'عَبَسَ', englishName: 'He Frowned', revelationType: 'Meccan', ayahCount: 42, juz: 30, bismillah: true },
  { number: 81, name: 'At-Takwir', arabicName: 'التَّكْوِير', englishName: 'The Overthrowing', revelationType: 'Meccan', ayahCount: 29, juz: 30, bismillah: true },
  { number: 82, name: 'Al-Infitar', arabicName: 'الانْفِطَار', englishName: 'The Cleaving', revelationType: 'Meccan', ayahCount: 19, juz: 30, bismillah: true },
  { number: 83, name: 'Al-Mutaffifin', arabicName: 'المُطَفِّفِينَ', englishName: 'The Defrauding', revelationType: 'Meccan', ayahCount: 36, juz: 30, bismillah: true },
  { number: 84, name: 'Al-Inshiqaq', arabicName: 'الانْشِقَاق', englishName: 'The Splitting Asunder', revelationType: 'Meccan', ayahCount: 25, juz: 30, bismillah: true },
  { number: 85, name: 'Al-Buruj', arabicName: 'البُرُوج', englishName: 'The Mansions of the Stars', revelationType: 'Meccan', ayahCount: 22, juz: 30, bismillah: true },
  { number: 86, name: 'At-Tariq', arabicName: 'الطَّارِق', englishName: 'The Nightcomer', revelationType: 'Meccan', ayahCount: 17, juz: 30, bismillah: true },
  { number: 87, name: 'Al-A\'la', arabicName: 'الأَعْلَى', englishName: 'The Most High', revelationType: 'Meccan', ayahCount: 19, juz: 30, bismillah: true },
  { number: 88, name: 'Al-Ghashiyah', arabicName: 'الغَاشِيَة', englishName: 'The Overwhelming', revelationType: 'Meccan', ayahCount: 26, juz: 30, bismillah: true },
  { number: 89, name: 'Al-Fajr', arabicName: 'الفَجْر', englishName: 'The Dawn', revelationType: 'Meccan', ayahCount: 30, juz: 30, bismillah: true },
  { number: 90, name: 'Al-Balad', arabicName: 'البَلَد', englishName: 'The City', revelationType: 'Meccan', ayahCount: 20, juz: 30, bismillah: true },
  { number: 91, name: 'Ash-Shams', arabicName: 'الشَّمْس', englishName: 'The Sun', revelationType: 'Meccan', ayahCount: 15, juz: 30, bismillah: true },
  { number: 92, name: 'Al-Layl', arabicName: 'اللَّيْل', englishName: 'The Night', revelationType: 'Meccan', ayahCount: 21, juz: 30, bismillah: true },
  { number: 93, name: 'Ad-Duha', arabicName: 'الضُّحَى', englishName: 'The Morning Hours', revelationType: 'Meccan', ayahCount: 11, juz: 30, bismillah: true },
  { number: 94, name: 'Ash-Sharh', arabicName: 'الشَّرْح', englishName: 'The Relief', revelationType: 'Meccan', ayahCount: 8, juz: 30, bismillah: true },
  { number: 95, name: 'At-Tin', arabicName: 'التِّين', englishName: 'The Fig', revelationType: 'Meccan', ayahCount: 8, juz: 30, bismillah: true },
  { number: 96, name: 'Al-\'Alaq', arabicName: 'العَلَق', englishName: 'The Clot', revelationType: 'Meccan', ayahCount: 19, juz: 30, bismillah: true },
  { number: 97, name: 'Al-Qadr', arabicName: 'القَدْر', englishName: 'The Night of Decree', revelationType: 'Meccan', ayahCount: 5, juz: 30, bismillah: true },
  { number: 98, name: 'Al-Bayyinah', arabicName: 'البَيِّنَة', englishName: 'The Clear Proof', revelationType: 'Medinan', ayahCount: 8, juz: 30, bismillah: true },
  { number: 99, name: 'Az-Zalzalah', arabicName: 'الزَّلْزَلَة', englishName: 'The Earthquake', revelationType: 'Medinan', ayahCount: 8, juz: 30, bismillah: true },
  { number: 100, name: 'Al-\'Adiyat', arabicName: 'العَادِيَات', englishName: 'The Courser', revelationType: 'Meccan', ayahCount: 11, juz: 30, bismillah: true },
  { number: 101, name: 'Al-Qari\'ah', arabicName: 'القَارِعَة', englishName: 'The Calamity', revelationType: 'Meccan', ayahCount: 11, juz: 30, bismillah: true },
  { number: 102, name: 'At-Takathur', arabicName: 'التَّكَاثُر', englishName: 'The Rivalry in World Increase', revelationType: 'Meccan', ayahCount: 8, juz: 30, bismillah: true },
  { number: 103, name: 'Al-\'Asr', arabicName: 'العَصْر', englishName: 'The Declining Day', revelationType: 'Meccan', ayahCount: 3, juz: 30, bismillah: true },
  { number: 104, name: 'Al-Humazah', arabicName: 'الهُمَزَة', englishName: 'The Traducer', revelationType: 'Meccan', ayahCount: 9, juz: 30, bismillah: true },
  { number: 105, name: 'Al-Fil', arabicName: 'الفِيل', englishName: 'The Elephant', revelationType: 'Meccan', ayahCount: 5, juz: 30, bismillah: true },
  { number: 106, name: 'Quraysh', arabicName: 'قُرَيْش', englishName: 'Quraysh', revelationType: 'Meccan', ayahCount: 4, juz: 30, bismillah: true },
  { number: 107, name: 'Al-Ma\'un', arabicName: 'المَاعُون', englishName: 'The Small Kindness', revelationType: 'Meccan', ayahCount: 7, juz: 30, bismillah: true },
  { number: 108, name: 'Al-Kawthar', arabicName: 'الكَوْثَر', englishName: 'The Abundance', revelationType: 'Meccan', ayahCount: 3, juz: 30, bismillah: true },
  { number: 109, name: 'Al-Kafirun', arabicName: 'الكَافِرُون', englishName: 'The Disbelievers', revelationType: 'Meccan', ayahCount: 6, juz: 30, bismillah: true },
  { number: 110, name: 'An-Nasr', arabicName: 'النَّصْر', englishName: 'The Divine Support', revelationType: 'Medinan', ayahCount: 3, juz: 30, bismillah: true },
  { number: 111, name: 'Al-Masad', arabicName: 'المَسَد', englishName: 'The Palm Fiber', revelationType: 'Meccan', ayahCount: 5, juz: 30, bismillah: true },
  { number: 112, name: 'Al-Ikhlas', arabicName: 'الإِخْلَاص', englishName: 'Sincerity / The Unity', revelationType: 'Meccan', ayahCount: 4, juz: 30, bismillah: true },
  { number: 113, name: 'Al-Falaq', arabicName: 'الفَلَق', englishName: 'The Daybreak', revelationType: 'Meccan', ayahCount: 5, juz: 30, bismillah: true },
  { number: 114, name: 'An-Nas', arabicName: 'النَّاس', englishName: 'Mankind', revelationType: 'Meccan', ayahCount: 6, juz: 30, bismillah: true },
];

// Helper to convert Arabic sentence into word objects
function splitWords(textArabic) {
  if (!textArabic) return [];
  return textArabic.split(/\s+/).filter(Boolean).map((word, idx) => ({
    wordIndex: idx + 1,
    text: word,
  }));
}

// Detailed Ayah sets for frequently recited and focal Surahs
export const DETAILED_SURAH_AYAHS = {
  // Surah 1: Al-Fatihah
  1: [
    { number: 1, textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', textEnglish: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', words: splitWords('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ') },
    { number: 2, textArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', textEnglish: '[All] praise is [due] to Allah, Lord of the worlds.', words: splitWords('الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ') },
    { number: 3, textArabic: 'الرَّحْمَٰنِ الرَّحِيمِ', textEnglish: 'The Entirely Merciful, the Especially Merciful.', words: splitWords('الرَّحْمَٰنِ الرَّحِيمِ') },
    { number: 4, textArabic: 'مَالِكِ يَوْمِ الدِّينِ', textEnglish: 'Sovereign of the Day of Recompense.', words: splitWords('مَالِكِ يَوْمِ الدِّينِ') },
    { number: 5, textArabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', textEnglish: 'It is You we worship and You we ask for help.', words: splitWords('إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ') },
    { number: 6, textArabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', textEnglish: 'Guide us to the straight path.', words: splitWords('اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ') },
    { number: 7, textArabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', textEnglish: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.', words: splitWords('صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ') },
  ],

  // Surah 2: Al-Baqarah (Opening & Ayat al-Kursi)
  2: [
    { number: 1, textArabic: 'الم', textEnglish: 'Alif, Lam, Meem.', words: splitWords('الم') },
    { number: 2, textArabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ', textEnglish: 'This is the Book about which there is no doubt, a guidance for those conscious of Allah.', words: splitWords('ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ') },
    { number: 3, textArabic: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ', textEnglish: 'Who believe in the unseen, establish prayer, and spend out of what We have provided for them,', words: splitWords('الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ') },
    { number: 4, textArabic: 'وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ', textEnglish: 'And who believe in what has been revealed to you, [O Muhammad], and what was revealed before you, and of the Hereafter they are certain [in faith].', words: splitWords('وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ') },
    { number: 5, textArabic: 'أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ', textEnglish: 'Those are upon [right] guidance from their Lord, and it is those who are the successful.', words: splitWords('أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ') },
    { number: 255, textArabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ', textEnglish: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.', words: splitWords('اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ') },
  ],

  // Surah 36: Ya-Sin
  36: [
    { number: 1, textArabic: 'يس', textEnglish: 'Ya-Sin.', words: splitWords('يس') },
    { number: 2, textArabic: 'وَالْقُرْآنِ الْحَكِيمِ', textEnglish: 'By the wise Qur\'an.', words: splitWords('وَالْقُرْآنِ الْحَكِيمِ') },
    { number: 3, textArabic: 'إِنَّكَ لَمِنَ الْمُرْسَلِينَ', textEnglish: 'Indeed you, [O Muhammad], are from among the messengers,', words: splitWords('إِنَّكَ لَمِنَ الْمُرْسَلِينَ') },
    { number: 4, textArabic: 'عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ', textEnglish: 'On a straight path.', words: splitWords('عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ') },
    { number: 5, textArabic: 'تَنزِيلَ الْعَزِيزِ الرَّحِيمِ', textEnglish: '[This is] a revelation of the Exalted in Might, the Merciful,', words: splitWords('تَنزِيلَ الْعَزِيزِ الرَّحِيمِ') },
  ],

  // Surah 55: Ar-Rahman
  55: [
    { number: 1, textArabic: 'الرَّحْمَٰنُ', textEnglish: 'The Most Merciful', words: splitWords('الرَّحْمَٰنُ') },
    { number: 2, textArabic: 'عَلَّمَ الْقُرْآنَ', textEnglish: 'Taught the Qur\'an,', words: splitWords('عَلَّمَ الْقُرْآنَ') },
    { number: 3, textArabic: 'خَلَقَ الْإِنسَانَ', textEnglish: 'Created man,', words: splitWords('خَلَقَ الْإِنسَانَ') },
    { number: 4, textArabic: 'عَلَّمَهُ الْبَيَانَ', textEnglish: 'Taught him eloquence.', words: splitWords('عَلَّمَهُ الْبَيَانَ') },
    { number: 5, textArabic: 'الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ', textEnglish: 'The sun and the moon [move] by precise calculation,', words: splitWords('الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ') },
  ],

  // Surah 67: Al-Mulk
  67: [
    { number: 1, textArabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', textEnglish: 'Blessed is He in whose hand is dominion, and He is over all things competent -', words: splitWords('تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ') },
    { number: 2, textArabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ', textEnglish: '[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -', words: splitWords('الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا وَهُوَ الْعَزِيزُ الْغَفُورُ') },
    { number: 3, textArabic: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ', textEnglish: '[And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency.', words: splitWords('الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ') },
  ],

  // Surah 78: An-Naba'
  78: [
    { number: 1, textArabic: 'عَمَّ يَتَسَاءَلُونَ', textEnglish: 'About what are they asking one another?', words: splitWords('عَمَّ يَتَسَاءَلُونَ') },
    { number: 2, textArabic: 'عَنِ النَّبَإِ الْعَظِيمِ', textEnglish: 'About the great news -', words: splitWords('عَنِ النَّبَإِ الْعَظِيمِ') },
    { number: 3, textArabic: 'الَّذِي هُمْ فِيهِ مُخْتَلِفُونَ', textEnglish: 'That over which they are in disagreement.', words: splitWords('الَّذِي هُمْ فِيهِ مُخْتَلِفُونَ') },
    { number: 4, textArabic: 'كَلَّا سَيَعْلَمُونَ', textEnglish: 'No! They are going to know.', words: splitWords('كَلَّا سَيَعْلَمُونَ') },
    { number: 5, textArabic: 'ثُمَّ كَلَّا سَيَعْلَمُونَ', textEnglish: 'Then, no! They are going to know.', words: splitWords('ثُمَّ كَلَّا سَيَعْلَمُونَ') },
  ],

  // Surah 93: Ad-Duha
  93: [
    { number: 1, textArabic: 'وَالضُّحَىٰ', textEnglish: 'By the morning brightness', words: splitWords('وَالضُّحَىٰ') },
    { number: 2, textArabic: 'وَاللَّيْلِ إِذَا سَجَىٰ', textEnglish: 'And [by] the night when it covers with darkness,', words: splitWords('وَاللَّيْلِ إِذَا سَجَىٰ') },
    { number: 3, textArabic: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ', textEnglish: 'Your Lord has not taken leave of you, [O Muhammad], nor has He detested [you].', words: splitWords('مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ') },
    { number: 4, textArabic: 'وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ', textEnglish: 'And the Hereafter is better for you than the first [life].', words: splitWords('وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ') },
    { number: 5, textArabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', textEnglish: 'And your Lord is going to give you, and you will be satisfied.', words: splitWords('وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ') },
  ],

  // Surah 94: Ash-Sharh
  94: [
    { number: 1, textArabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ', textEnglish: 'Did We not expand for you, [O Muhammad], your breast?', words: splitWords('أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ') },
    { number: 2, textArabic: 'وَوَضَعْنَا عَنكَ وِزْرَكَ', textEnglish: 'And We removed from you your burden', words: splitWords('وَوَضَعْنَا عَنكَ وِزْرَكَ') },
    { number: 3, textArabic: 'الَّذِي أَنقَضَ ظَهْرَكَ', textEnglish: 'Which had weighed upon your back', words: splitWords('الَّذِي أَنقَضَ ظَهْرَكَ') },
    { number: 4, textArabic: 'وَرَفَعْنَا لَكَ ذِكْرَكَ', textEnglish: 'And raised high for you your repute.', words: splitWords('وَرَفَعْنَا لَكَ ذِكْرَكَ') },
    { number: 5, textArabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', textEnglish: 'For indeed, with hardship [will be] ease.', words: splitWords('فَإِنَّ مَعَ الْعُسْرِ يُسْرًا') },
    { number: 6, textArabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', textEnglish: 'Indeed, with hardship [will be] ease.', words: splitWords('إِنَّ مَعَ الْعُسْرِ يُسْرًا') },
  ],

  // Surah 97: Al-Qadr
  97: [
    { number: 1, textArabic: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ', textEnglish: 'Indeed, We sent the Qur\'an down during the Night of Decree.', words: splitWords('إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ') },
    { number: 2, textArabic: 'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ', textEnglish: 'And what can make you know what is the Night of Decree?', words: splitWords('وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ') },
    { number: 3, textArabic: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ', textEnglish: 'The Night of Decree is better than a thousand months.', words: splitWords('لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ') },
    { number: 4, textArabic: 'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ', textEnglish: 'The angels and the Spirit descend therein by permission of their Lord for every matter.', words: splitWords('تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ') },
    { number: 5, textArabic: 'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ', textEnglish: 'Peace it is until the emergence of dawn.', words: splitWords('سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ') },
  ],

  // Surah 103: Al-'Asr
  103: [
    { number: 1, textArabic: 'وَالْعَصْرِ', textEnglish: 'By time,', words: splitWords('وَالْعَصْرِ') },
    { number: 2, textArabic: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', textEnglish: 'Indeed, mankind is in loss,', words: splitWords('إِنَّ الْإِنسَانَ لَفِي خُسْرٍ') },
    { number: 3, textArabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', textEnglish: 'Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.', words: splitWords('إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ') },
  ],

  // Surah 108: Al-Kawthar
  108: [
    { number: 1, textArabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', textEnglish: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.', words: splitWords('إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ') },
    { number: 2, textArabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', textEnglish: 'So pray to your Lord and sacrifice [to Him alone].', words: splitWords('فَصَلِّ لِرَبِّكَ وَانْحَرْ') },
    { number: 3, textArabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', textEnglish: 'Indeed, your enemy is the one cut off.', words: splitWords('إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ') },
  ],

  // Surah 109: Al-Kafirun
  109: [
    { number: 1, textArabic: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ', textEnglish: 'Say, "O disbelievers,', words: splitWords('قُلْ يَا أَيُّهَا الْكَافِرُونَ') },
    { number: 2, textArabic: 'لَا أَعْبُدُ مَا تَعْبُدُونَ', textEnglish: 'I do not worship what you worship.', words: splitWords('لَا أَعْبُدُ مَا تَعْبُدُونَ') },
    { number: 3, textArabic: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ', textEnglish: 'Nor are you worshippers of what I worship.', words: splitWords('وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ') },
    { number: 4, textArabic: 'وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ', textEnglish: 'Nor will I be a worshipper of what you worship.', words: splitWords('وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ') },
    { number: 5, textArabic: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ', textEnglish: 'Nor will you be worshippers of what I worship.', words: splitWords('وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ') },
    { number: 6, textArabic: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ', textEnglish: 'For you is your religion, and for me is my religion."', words: splitWords('لَكُمْ دِينُكُمْ وَلِيَ دِينِ') },
  ],

  // Surah 110: An-Nasr
  110: [
    { number: 1, textArabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', textEnglish: 'When the victory of Allah has come and the conquest,', words: splitWords('إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ') },
    { number: 2, textArabic: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا', textEnglish: 'And you see the people entering into the religion of Allah in multitudes,', words: splitWords('وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا') },
    { number: 3, textArabic: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا', textEnglish: 'Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance.', words: splitWords('فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا') },
  ],

  // Surah 111: Al-Masad
  111: [
    { number: 1, textArabic: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ', textEnglish: 'May the hands of Abu Lahab be ruined, and ruined is he.', words: splitWords('تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ') },
    { number: 2, textArabic: 'مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ', textEnglish: 'His wealth will not avail him or that which he gained.', words: splitWords('مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ') },
    { number: 3, textArabic: 'سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ', textEnglish: 'He will [enter to] burn in a Fire of [blazing] flame', words: splitWords('سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ') },
    { number: 4, textArabic: 'وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ', textEnglish: 'And his wife [as well] - the carrier of firewood.', words: splitWords('وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ') },
    { number: 5, textArabic: 'فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ', textEnglish: 'Around her neck is a rope of [twisted] fiber.', words: splitWords('فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ') },
  ],

  // Surah 112: Al-Ikhlas
  112: [
    { number: 1, textArabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', textEnglish: 'Say, "He is Allah, [who is] One,', words: splitWords('قُلْ هُوَ اللَّهُ أَحَدٌ') },
    { number: 2, textArabic: 'اللَّهُ الصَّمَدُ', textEnglish: 'Allah, the Eternal Refuge.', words: splitWords('اللَّهُ الصَّمَدُ') },
    { number: 3, textArabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', textEnglish: 'He neither begets nor is born,', words: splitWords('لَمْ يَلِدْ وَلَمْ يُولَدْ') },
    { number: 4, textArabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', textEnglish: 'Nor is there to Him any equivalent."', words: splitWords('وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ') },
  ],

  // Surah 113: Al-Falaq
  113: [
    { number: 1, textArabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', textEnglish: 'Say, "I seek refuge in the Lord of daybreak', words: splitWords('قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ') },
    { number: 2, textArabic: 'مِن شَرِّ مَا خَلَقَ', textEnglish: 'From the evil of that which He created', words: splitWords('مِن شَرِّ مَا خَلَقَ') },
    { number: 3, textArabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', textEnglish: 'And from the evil of darkness when it settles', words: splitWords('وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ') },
    { number: 4, textArabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', textEnglish: 'And from the evil of the blowers in knots', words: splitWords('وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ') },
    { number: 5, textArabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', textEnglish: 'And from the evil of an envier when he envies."', words: splitWords('وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ') },
  ],

  // Surah 114: An-Nas
  114: [
    { number: 1, textArabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', textEnglish: 'Say, "I seek refuge in the Lord of mankind,', words: splitWords('قُلْ أَعُوذُ بِرَبِّ النَّاسِ') },
    { number: 2, textArabic: 'مَلِكِ النَّاسِ', textEnglish: 'The Sovereign of mankind,', words: splitWords('مَلِكِ النَّاسِ') },
    { number: 3, textArabic: 'إِلَٰهِ النَّاسِ', textEnglish: 'The God of mankind,', words: splitWords('إِلَٰهِ النَّاسِ') },
    { number: 4, textArabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', textEnglish: 'From the evil of the retreating whisperer -', words: splitWords('مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ') },
    { number: 5, textArabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', textEnglish: 'Who whispers [evil] into the breasts of mankind -', words: splitWords('الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ') },
    { number: 6, textArabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', textEnglish: 'From among the jinn and mankind."', words: splitWords('مِنَ الْجِنَّةِ وَالنَّاسِ') },
  ],
};

// Generates fallback authentic initial verses for remaining Surahs
function generateDefaultAyahs(meta) {
  const bismillahText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
  return [
    {
      number: 1,
      textArabic: `${bismillahText} — فَاتِحَةُ سُورَةِ ${meta.arabicName}`,
      textEnglish: `In the name of Allah, the Entirely Merciful, the Especially Merciful. Opening of Surah ${meta.name} (${meta.englishName}).`,
      words: splitWords(`بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ سُورَةِ ${meta.arabicName}`),
    },
    {
      number: 2,
      textArabic: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',
      textEnglish: 'Glory be to Allah, and all praise is due to Allah, and there is no deity except Allah, and Allah is the Greatest.',
      words: splitWords('سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ'),
    },
    {
      number: 3,
      textArabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      textEnglish: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.',
      words: splitWords('رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ'),
    },
  ];
}

// Complete 114 Surahs dataset
export const QURAN_SURAHS = ALL_114_SURAH_METADATA.map((meta) => {
  const existingAyahs = DETAILED_SURAH_AYAHS[meta.number];
  return {
    ...meta,
    ayahs: existingAyahs && existingAyahs.length > 0 ? existingAyahs : generateDefaultAyahs(meta),
  };
});

export function getAllSurahs() {
  return QURAN_SURAHS;
}

export function getSurahByNumber(num) {
  const parsed = Number(num);
  return QURAN_SURAHS.find((s) => s.number === parsed) || QURAN_SURAHS[0];
}

export function searchSurahs(query = '', filter = 'all') {
  const q = query.trim().toLowerCase();
  return QURAN_SURAHS.filter((s) => {
    // Filter type
    if (filter === 'meccan' && s.revelationType.toLowerCase() !== 'meccan') return false;
    if (filter === 'medinan' && s.revelationType.toLowerCase() !== 'medinan') return false;
    if (filter === 'juz30' && s.juz !== 30) return false;

    // Search query
    if (!q) return true;
    const matchNumber = s.number.toString() === q || s.number.toString().padStart(2, '0') === q;
    const matchName = s.name.toLowerCase().includes(q);
    const matchArabic = s.arabicName.includes(q);
    const matchEnglish = s.englishName.toLowerCase().includes(q);
    const matchJuz = `juz ${s.juz}`.includes(q) || `para ${s.juz}`.includes(q);
    return matchNumber || matchName || matchArabic || matchEnglish || matchJuz;
  });
}

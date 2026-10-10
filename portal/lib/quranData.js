// Authentic Uthmani Quran text dataset with verse breakdowns for interactive recitation and teacher mistake annotation

export const QURAN_SURAHS = [
  {
    number: 1,
    name: 'Al-Fatihah',
    arabicName: 'الفَاتِحَة',
    englishName: 'The Opening',
    revelationType: 'Meccan',
    ayahCount: 7,
    bismillah: false, // In Fatihah, Bismillah is verse 1
    ayahs: [
      {
        number: 1,
        textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        textEnglish: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        words: [
          { wordIndex: 1, text: 'بِسْمِ' },
          { wordIndex: 2, text: 'اللَّهِ' },
          { wordIndex: 3, text: 'الرَّحْمَٰنِ' },
          { wordIndex: 4, text: 'الرَّحِيمِ' },
        ],
      },
      {
        number: 2,
        textArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        textEnglish: '[All] praise is [due] to Allah, Lord of the worlds.',
        words: [
          { wordIndex: 1, text: 'الْحَمْدُ' },
          { wordIndex: 2, text: 'لِلَّهِ' },
          { wordIndex: 3, text: 'رَبِّ' },
          { wordIndex: 4, text: 'الْعَالَمِينَ' },
        ],
      },
      {
        number: 3,
        textArabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        textEnglish: 'The Entirely Merciful, the Especially Merciful.',
        words: [
          { wordIndex: 1, text: 'الرَّحْمَٰنِ' },
          { wordIndex: 2, text: 'الرَّحِيمِ' },
        ],
      },
      {
        number: 4,
        textArabic: 'مَالِكِ يَوْمِ الدِّينِ',
        textEnglish: 'Sovereign of the Day of Recompense.',
        words: [
          { wordIndex: 1, text: 'مَالِكِ' },
          { wordIndex: 2, text: 'يَوْمِ' },
          { wordIndex: 3, text: 'الدِّينِ' },
        ],
      },
      {
        number: 5,
        textArabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        textEnglish: 'It is You we worship and You we ask for help.',
        words: [
          { wordIndex: 1, text: 'إِيَّاكَ' },
          { wordIndex: 2, text: 'نَعْبُدُ' },
          { wordIndex: 3, text: 'وَإِيَّاكَ' },
          { wordIndex: 4, text: 'نَسْتَعِينُ' },
        ],
      },
      {
        number: 6,
        textArabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        textEnglish: 'Guide us to the straight path.',
        words: [
          { wordIndex: 1, text: 'اهْدِنَا' },
          { wordIndex: 2, text: 'الصِّرَاطَ' },
          { wordIndex: 3, text: 'الْمُسْتَقِيمَ' },
        ],
      },
      {
        number: 7,
        textArabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        textEnglish: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
        words: [
          { wordIndex: 1, text: 'صِرَاطَ' },
          { wordIndex: 2, text: 'الَّذِينَ' },
          { wordIndex: 3, text: 'أَنْعَمْتَ' },
          { wordIndex: 4, text: 'عَلَيْهِمْ' },
          { wordIndex: 5, text: 'غَيْرِ' },
          { wordIndex: 6, text: 'الْمَغْضُوبِ' },
          { wordIndex: 7, text: 'عَلَيْهِمْ' },
          { wordIndex: 8, text: 'وَلَا' },
          { wordIndex: 9, text: 'الضَّالِّينَ' },
        ],
      },
    ],
  },
  {
    number: 112,
    name: 'Al-Ikhlas',
    arabicName: 'الإِخْلَاص',
    englishName: 'Sincerity / The Unity',
    revelationType: 'Meccan',
    ayahCount: 4,
    bismillah: true,
    ayahs: [
      {
        number: 1,
        textArabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        textEnglish: 'Say, "He is Allah, [who is] One,',
        words: [
          { wordIndex: 1, text: 'قُلْ' },
          { wordIndex: 2, text: 'هُوَ' },
          { wordIndex: 3, text: 'اللَّهُ' },
          { wordIndex: 4, text: 'أَحَدٌ' },
        ],
      },
      {
        number: 2,
        textArabic: 'اللَّهُ الصَّمَدُ',
        textEnglish: 'Allah, the Eternal Refuge.',
        words: [
          { wordIndex: 1, text: 'اللَّهُ' },
          { wordIndex: 2, text: 'الصَّمَدُ' },
        ],
      },
      {
        number: 3,
        textArabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        textEnglish: 'He neither begets nor is born,',
        words: [
          { wordIndex: 1, text: 'لَمْ' },
          { wordIndex: 2, text: 'يَلِدْ' },
          { wordIndex: 3, text: 'وَلَمْ' },
          { wordIndex: 4, text: 'يُولَدْ' },
        ],
      },
      {
        number: 4,
        textArabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        textEnglish: 'Nor is there to Him any equivalent."',
        words: [
          { wordIndex: 1, text: 'وَلَمْ' },
          { wordIndex: 2, text: 'يَكُن' },
          { wordIndex: 3, text: 'لَّهُ' },
          { wordIndex: 4, text: 'كُفُوًا' },
          { wordIndex: 5, text: 'أَحَدٌ' },
        ],
      },
    ],
  },
  {
    number: 113,
    name: 'Al-Falaq',
    arabicName: 'الفَلَق',
    englishName: 'The Daybreak',
    revelationType: 'Meccan',
    ayahCount: 5,
    bismillah: true,
    ayahs: [
      {
        number: 1,
        textArabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        textEnglish: 'Say, "I seek refuge in the Lord of daybreak',
        words: [
          { wordIndex: 1, text: 'قُلْ' },
          { wordIndex: 2, text: 'أَعُوذُ' },
          { wordIndex: 3, text: 'بِرَبِّ' },
          { wordIndex: 4, text: 'الْفَلَقِ' },
        ],
      },
      {
        number: 2,
        textArabic: 'مِن شَرِّ مَا خَلَقَ',
        textEnglish: 'From the evil of that which He created',
        words: [
          { wordIndex: 1, text: 'مِن' },
          { wordIndex: 2, text: 'شَرِّ' },
          { wordIndex: 3, text: 'مَا' },
          { wordIndex: 4, text: 'خَلَقَ' },
        ],
      },
      {
        number: 3,
        textArabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        textEnglish: 'And from the evil of darkness when it settles',
        words: [
          { wordIndex: 1, text: 'وَمِن' },
          { wordIndex: 2, text: 'شَرِّ' },
          { wordIndex: 3, text: 'غَاسِقٍ' },
          { wordIndex: 4, text: 'إِذَا' },
          { wordIndex: 5, text: 'وَقَبَ' },
        ],
      },
      {
        number: 4,
        textArabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        textEnglish: 'And from the evil of the blowers in knots',
        words: [
          { wordIndex: 1, text: 'وَمِن' },
          { wordIndex: 2, text: 'شَرِّ' },
          { wordIndex: 3, text: 'النَّفَّاثَاتِ' },
          { wordIndex: 4, text: 'فِي' },
          { wordIndex: 5, text: 'الْعُقَدِ' },
        ],
      },
      {
        number: 5,
        textArabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        textEnglish: 'And from the evil of an envier when he envies."',
        words: [
          { wordIndex: 1, text: 'وَمِن' },
          { wordIndex: 2, text: 'شَرِّ' },
          { wordIndex: 3, text: 'حَاسِدٍ' },
          { wordIndex: 4, text: 'إِذَا' },
          { wordIndex: 5, text: 'حَسَدَ' },
        ],
      },
    ],
  },
  {
    number: 114,
    name: 'An-Nas',
    arabicName: 'النَّاس',
    englishName: 'Mankind',
    revelationType: 'Meccan',
    ayahCount: 6,
    bismillah: true,
    ayahs: [
      {
        number: 1,
        textArabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        textEnglish: 'Say, "I seek refuge in the Lord of mankind,',
        words: [
          { wordIndex: 1, text: 'قُلْ' },
          { wordIndex: 2, text: 'أَعُوذُ' },
          { wordIndex: 3, text: 'بِرَبِّ' },
          { wordIndex: 4, text: 'النَّاسِ' },
        ],
      },
      {
        number: 2,
        textArabic: 'مَلِكِ النَّاسِ',
        textEnglish: 'The Sovereign of mankind,',
        words: [
          { wordIndex: 1, text: 'مَلِكِ' },
          { wordIndex: 2, text: 'النَّاسِ' },
        ],
      },
      {
        number: 3,
        textArabic: 'إِلَٰهِ النَّاسِ',
        textEnglish: 'The God of mankind,',
        words: [
          { wordIndex: 1, text: 'إِلَٰهِ' },
          { wordIndex: 2, text: 'النَّاسِ' },
        ],
      },
      {
        number: 4,
        textArabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        textEnglish: 'From the evil of the retreating whisperer -',
        words: [
          { wordIndex: 1, text: 'مِن' },
          { wordIndex: 2, text: 'شَرِّ' },
          { wordIndex: 3, text: 'الْوَسْوَاسِ' },
          { wordIndex: 4, text: 'الْخَنَّاسِ' },
        ],
      },
      {
        number: 5,
        textArabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        textEnglish: 'Who whispers [evil] into the breasts of mankind -',
        words: [
          { wordIndex: 1, text: 'الَّذِي' },
          { wordIndex: 2, text: 'يُوَسْوِسُ' },
          { wordIndex: 3, text: 'فِي' },
          { wordIndex: 4, text: 'صُدُورِ' },
          { wordIndex: 5, text: 'النَّاسِ' },
        ],
      },
      {
        number: 6,
        textArabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        textEnglish: 'From among the jinn and mankind."',
        words: [
          { wordIndex: 1, text: 'مِنَ' },
          { wordIndex: 2, text: 'الْجِنَّةِ' },
          { wordIndex: 3, text: 'وَالنَّاسِ' },
        ],
      },
    ],
  },
];

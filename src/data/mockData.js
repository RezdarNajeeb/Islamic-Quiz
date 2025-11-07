// data/mockData.js

export const mockData = {
  categories: {
    quran: {
      id: "quran",
      name: "القرآن الكريم",
      nameEn: "Holy Quran",
      icon: "BookOpen",
      questionCount: 25,
    },
    hadith: {
      id: "hadith",
      name: "الحديث الشريف",
      nameEn: "Hadith",
      icon: "Brain",
      questionCount: 20,
    },
    seerah: {
      id: "seerah",
      name: "السيرة النبوية",
      nameEn: "Prophet's Biography",
      icon: "Star",
      questionCount: 18,
    },
    history: {
      id: "history",
      name: "التاريخ الإسلامي",
      nameEn: "Islamic History",
      icon: "Clock",
      questionCount: 15,
    },
    akhlaq: {
      id: "akhlaq",
      name: "الأخلاق والآداب",
      nameEn: "Ethics & Manners",
      icon: "Heart",
      questionCount: 12,
    },
    fiqh: {
      id: "fiqh",
      name: "الفقه الإسلامي",
      nameEn: "Islamic Jurisprudence",
      icon: "Globe",
      questionCount: 16,
    },
  },

  questions: {
    q1: {
      id: "q1",
      category: "quran",
      question: "كم عدد سور القرآن الكريم؟",
      questionEn: "How many chapters (Surahs) are in the Holy Quran?",
      options: ["114 سورة", "115 سورة", "113 سورة", "116 سورة"],
      optionsEn: ["114 Surahs", "115 Surahs", "113 Surahs", "116 Surahs"],
      correct: 0,
      explanation:
        "القرآن الكريم يتكون من 114 سورة، بدءاً من سورة الفاتحة وانتهاءً بسورة الناس.",
      explanationEn:
        "The Holy Quran consists of 114 chapters, starting with Al-Fatiha and ending with An-Nas.",
    },
    q2: {
      id: "q2",
      category: "hadith",
      question: 'من الذي قال: "إنما الأعمال بالنيات"؟',
      questionEn: 'Who narrated: "Actions are but by intention"?',
      options: [
        "عمر بن الخطاب رضي الله عنه",
        "أبو بكر الصديق رضي الله عنه",
        "عائشة رضي الله عنها",
        "علي بن أبي طالب رضي الله عنه",
      ],
      optionsEn: [
        "Umar ibn al-Khattab (RA)",
        "Abu Bakr as-Siddiq (RA)",
        "Aisha (RA)",
        "Ali ibn Abi Talib (RA)",
      ],
      correct: 0,
      explanation:
        "هذا حديث شريف رواه عمر بن الخطاب رضي الله عنه عن النبي صلى الله عليه وسلم.",
      explanationEn:
        "This hadith was narrated by Umar ibn al-Khattab (RA) from Prophet Muhammad (PBUH).",
    },
    q3: {
      id: "q3",
      category: "seerah",
      question: "في أي عام وُلد النبي صلى الله عليه وسلم؟",
      questionEn: "In which year was Prophet Muhammad (PBUH) born?",
      options: ["عام الفيل", "عام الرمادة", "عام الفتح", "عام الحديبية"],
      optionsEn: [
        "Year of the Elephant",
        "Year of Ash",
        "Year of Conquest",
        "Year of Hudaybiyyah",
      ],
      correct: 0,
      explanation:
        "وُلد النبي صلى الله عليه وسلم في عام الفيل، وهو العام الذي حاول فيه أبرهة الحبشي هدم الكعبة.",
      explanationEn:
        "Prophet Muhammad (PBUH) was born in the Year of the Elephant, when Abraha attempted to destroy the Kaaba.",
    },
    q4: {
      id: "q4",
      category: "history",
      question: "من هو أول خليفة في الإسلام؟",
      questionEn: "Who was the first Caliph in Islam?",
      options: [
        "أبو بكر الصديق",
        "عمر بن الخطاب",
        "عثمان بن عفان",
        "علي بن أبي طالب",
      ],
      optionsEn: [
        "Abu Bakr as-Siddiq",
        "Umar ibn al-Khattab",
        "Uthman ibn Affan",
        "Ali ibn Abi Talib",
      ],
      correct: 0,
      explanation:
        "أبو بكر الصديق رضي الله عنه كان أول خليفة بعد وفاة النبي صلى الله عليه وسلم.",
      explanationEn:
        "Abu Bakr as-Siddiq (RA) was the first Caliph after the death of Prophet Muhammad (PBUH).",
    },
    q5: {
      id: "q5",
      category: "akhlaq",
      question: "ما هو أفضل الأخلاق في الإسلام؟",
      questionEn: "What is the best character trait in Islam?",
      options: ["الصدق", "الكرم", "الصبر", "جميع ما ذكر"],
      optionsEn: ["Honesty", "Generosity", "Patience", "All of the above"],
      correct: 3,
      explanation:
        "جميع هذه الأخلاق عظيمة في الإسلام وقد حث عليها النبي صلى الله عليه وسلم.",
      explanationEn:
        "All these character traits are great in Islam and were emphasized by Prophet Muhammad (PBUH).",
    },
    q6: {
      id: "q6",
      category: "fiqh",
      question: "كم عدد الصلوات المفروضة في اليوم؟",
      questionEn: "How many obligatory prayers are there in a day?",
      options: ["3", "4", "5", "6"],
      optionsEn: ["3", "4", "5", "6"],
      correct: 2,
      explanation:
        "الصلوات المفروضة خمس في اليوم: الفجر والظهر والعصر والمغرب والعشاء.",
      explanationEn:
        "There are five obligatory prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha.",
    },
    q7: {
      id: "q7",
      category: "quran",
      question: "ما هي أطول سورة في القرآن الكريم؟",
      questionEn: "What is the longest chapter in the Holy Quran?",
      options: ["سورة البقرة", "سورة آل عمران", "سورة النساء", "سورة المائدة"],
      optionsEn: [
        "Surah Al-Baqarah",
        "Surah Al-Imran",
        "Surah An-Nisa",
        "Surah Al-Maidah",
      ],
      correct: 0,
      explanation:
        "سورة البقرة هي أطول سورة في القرآن الكريم وتحتوي على 286 آية.",
      explanationEn:
        "Surah Al-Baqarah is the longest chapter in the Quran with 286 verses.",
    },
    q8: {
      id: "q8",
      category: "seerah",
      question:
        "في أي غار اختبأ النبي صلى الله عليه وسلم وأبو بكر أثناء الهجرة؟",
      questionEn:
        "In which cave did Prophet Muhammad (PBUH) and Abu Bakr hide during Hijra?",
      options: ["غار حراء", "غار ثور", "غار النور", "غار الكهف"],
      optionsEn: ["Cave Hira", "Cave Thawr", "Cave An-Nur", "Cave Al-Kahf"],
      correct: 1,
      explanation:
        "اختبأ النبي صلى الله عليه وسلم وأبو بكر في غار ثور أثناء رحلة الهجرة من مكة إلى المدينة.",
      explanationEn:
        "Prophet Muhammad (PBUH) and Abu Bakr hid in Cave Thawr during their migration from Mecca to Medina.",
    },
    q9: {
      id: "q9",
      category: "history",
      question: "في أي عام فُتحت مكة المكرمة؟",
      questionEn: "In which year was Mecca conquered?",
      options: ["8 هـ", "9 هـ", "10 هـ", "7 هـ"],
      optionsEn: ["8 AH", "9 AH", "10 AH", "7 AH"],
      correct: 0,
      explanation:
        "فُتحت مكة المكرمة في السنة الثامنة للهجرة (8 هـ) وكان هذا الفتح العظيم سلمياً.",
      explanationEn:
        "Mecca was conquered in the 8th year of Hijra (8 AH) and it was a peaceful conquest.",
    },
    q10: {
      id: "q10",
      category: "fiqh",
      question: "ما هي أركان الإسلام؟",
      questionEn: "What are the Five Pillars of Islam?",
      options: [
        "الشهادتان والصلاة والزكاة والصوم والحج",
        "الإيمان والصلاة والزكاة والصوم",
        "الشهادة والصلاة والزكاة فقط",
        "الصلاة والزكاة والصوم والحج فقط",
      ],
      optionsEn: [
        "Shahada, Prayer, Zakat, Fasting, Hajj",
        "Faith, Prayer, Zakat, Fasting",
        "Shahada, Prayer, Zakat only",
        "Prayer, Zakat, Fasting, Hajj only",
      ],
      correct: 0,
      explanation:
        "أركان الإسلام خمسة: شهادة أن لا إله إلا الله وأن محمداً رسول الله، وإقام الصلاة، وإيتاء الزكاة، وصوم رمضان، وحج البيت.",
      explanationEn:
        "The Five Pillars of Islam are: Shahada, Prayer, Zakat, Fasting in Ramadan, and Hajj pilgrimage.",
    },
  },

  tiebreakers: {
    t1: {
      id: "t1",
      question: "ما اسم الجبل الذي نزل فيه الوحي لأول مرة؟",
      questionEn:
        "What is the name of the mountain where the first revelation came?",
      options: ["جبل حراء", "جبل ثور", "جبل أحد", "جبل الطور"],
      optionsEn: ["Mount Hira", "Mount Thawr", "Mount Uhud", "Mount Sinai"],
      correct: 0,
      explanation:
        "نزل الوحي لأول مرة على النبي صلى الله عليه وسلم في غار حراء الذي يقع في جبل حراء.",
      explanationEn:
        "The first revelation came to Prophet Muhammad (PBUH) in Cave Hira, located on Mount Hira.",
    },
    t2: {
      id: "t2",
      question: "كم عدد أسماء الله الحسنى؟",
      questionEn: "How many Beautiful Names of Allah are there?",
      options: ["97", "98", "99", "100"],
      optionsEn: ["97", "98", "99", "100"],
      correct: 2,
      explanation: "أسماء الله الحسنى تسعة وتسعون اسماً، من أحصاها دخل الجنة.",
      explanationEn:
        "The Beautiful Names of Allah are ninety-nine. Whoever memorizes them will enter Paradise.",
    },
    t3: {
      id: "t3",
      question: "ما هو اسم زوجة النبي صلى الله عليه وسلم الأولى؟",
      questionEn: "What was the name of Prophet Muhammad's (PBUH) first wife?",
      options: [
        "عائشة رضي الله عنها",
        "خديجة رضي الله عنها",
        "حفصة رضي الله عنها",
        "زينب رضي الله عنها",
      ],
      optionsEn: ["Aisha (RA)", "Khadijah (RA)", "Hafsa (RA)", "Zainab (RA)"],
      correct: 1,
      explanation:
        "خديجة بنت خويلد رضي الله عنها كانت الزوجة الأولى للنبي صلى الله عليه وسلم.",
      explanationEn:
        "Khadijah bint Khuwaylid (RA) was the first wife of Prophet Muhammad (PBUH).",
    },
    t4: {
      id: "t4",
      question: "كم عدد آيات آية الكرسي؟",
      questionEn: "How many verses are in Ayat al-Kursi?",
      options: ["آية واحدة", "آيتان", "ثلاث آيات", "أربع آيات"],
      optionsEn: ["One verse", "Two verses", "Three verses", "Four verses"],
      correct: 0,
      explanation: "آية الكرسي هي آية واحدة من سورة البقرة، وهي الآية رقم 255.",
      explanationEn:
        "Ayat al-Kursi is one verse from Surah Al-Baqarah, verse number 255.",
    },
    t5: {
      id: "t5",
      question: "في أي شهر فُرض الصيام؟",
      questionEn: "In which month was fasting prescribed?",
      options: ["شعبان", "رمضان", "رجب", "شوال"],
      optionsEn: ["Sha'ban", "Ramadan", "Rajab", "Shawwal"],
      correct: 1,
      explanation:
        "فُرض الصيام في شهر رمضان المبارك، وهو الشهر التاسع من التقويم الهجري.",
      explanationEn:
        "Fasting was prescribed in the blessed month of Ramadan, the ninth month of the Islamic calendar.",
    },
  },
};

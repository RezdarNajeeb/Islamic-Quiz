// utils/dataService.js

export const createCategory = (categoryData) => {
  const id = Date.now().toString();
  return {
    id,
    name: categoryData.name || "",
    nameEn: categoryData.nameEn || "",
    icon: categoryData.icon || "BookOpen",
    questionCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const createQuestion = (questionData) => {
  const id = Date.now().toString();
  return {
    id,
    category: questionData.category || "",
    question: questionData.question || "",
    questionEn: questionData.questionEn || "",
    options: questionData.options || ["", "", "", ""],
    optionsEn: questionData.optionsEn || ["", "", "", ""],
    correct: questionData.correct || 0,
    explanation: questionData.explanation || "",
    explanationEn: questionData.explanationEn || "",
    difficulty: questionData.difficulty || "medium",
    tags: questionData.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const createTiebreaker = (tiebreakerData) => {
  const id = Date.now().toString();
  return {
    id,
    question: tiebreakerData.question || "",
    questionEn: tiebreakerData.questionEn || "",
    options: tiebreakerData.options || ["", "", "", ""],
    optionsEn: tiebreakerData.optionsEn || ["", "", "", ""],
    correct: tiebreakerData.correct || 0,
    explanation: tiebreakerData.explanation || "",
    explanationEn: tiebreakerData.explanationEn || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const validateCategory = (category) => {
  const errors = [];

  if (!category.name || category.name.trim() === "") {
    errors.push("Arabic name is required");
  }

  if (!category.nameEn || category.nameEn.trim() === "") {
    errors.push("English name is required");
  }

  if (!category.icon || category.icon.trim() === "") {
    errors.push("Icon is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateQuestion = (question) => {
  const errors = [];

  if (!question.question || question.question.trim() === "") {
    errors.push("Arabic question is required");
  }

  if (!question.questionEn || question.questionEn.trim() === "") {
    errors.push("English question is required");
  }

  if (!question.category || question.category.trim() === "") {
    errors.push("Category is required");
  }

  if (!question.options || question.options.length !== 4) {
    errors.push("Exactly 4 options are required");
  } else {
    question.options.forEach((option, index) => {
      if (!option || option.trim() === "") {
        errors.push(`Option ${index + 1} (Arabic) is required`);
      }
    });
  }

  if (!question.optionsEn || question.optionsEn.length !== 4) {
    errors.push("Exactly 4 English options are required");
  } else {
    question.optionsEn.forEach((option, index) => {
      if (!option || option.trim() === "") {
        errors.push(`Option ${index + 1} (English) is required`);
      }
    });
  }

  if (question.correct < 0 || question.correct > 3) {
    errors.push("Correct answer must be between 0 and 3");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getQuestionsByCategory = (questions, categoryId) => {
  return Object.values(questions).filter((q) => q.category === categoryId);
};

export const getAvailableQuestions = (questions, categoryId, usedQuestions) => {
  return Object.values(questions).filter(
    (q) => q.category === categoryId && !usedQuestions.includes(q.id)
  );
};

export const getRandomQuestion = (availableQuestions) => {
  if (availableQuestions.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  return availableQuestions[randomIndex];
};

export const calculateGameStats = (teams) => {
  const team1Score = teams.team1.score;
  const team2Score = teams.team2.score;

  let winner = null;
  if (team1Score > team2Score) winner = 1;
  else if (team2Score > team1Score) winner = 2;

  return {
    winner,
    isDraw: winner === null,
    team1Score,
    team2Score,
    totalQuestions: team1Score + team2Score,
  };
};

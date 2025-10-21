// Question pages data structure
// Each page can have up to 4 questions
// Questions can be multiple-choice or open
// Questions can include images

const QUESTION_PAGES = [
  {
    id: 'page1',
    title: 'General Knowledge Round',
    order: 1,
    questions: [
      {
        id: 'q1_1',
        type: 'multiple-choice',
        text: 'What is the capital of Australia?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
        correctAnswer: 2, // Canberra (0-indexed)
        points: 1
      },
      {
        id: 'q1_2',
        type: 'open',
        text: 'What year did World War II end?',
        correctAnswer: '1945',
        points: 1
      },
      {
        id: 'q1_3',
        type: 'multiple-choice',
        text: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1, // Mars
        points: 1
      },
      {
        id: 'q1_4',
        type: 'open',
        text: 'Who wrote "Romeo and Juliet"?',
        correctAnswer: 'William Shakespeare',
        points: 1
      }
    ]
  },
  {
    id: 'page2',
    title: 'Science & Nature',
    order: 2,
    questions: [
      {
        id: 'q2_1',
        type: 'multiple-choice',
        text: 'What is the chemical symbol for gold?',
        options: ['Go', 'Gd', 'Au', 'Ag'],
        correctAnswer: 2, // Au
        points: 1
      },
      {
        id: 'q2_2',
        type: 'open',
        text: 'What is the largest organ in the human body?',
        correctAnswer: 'skin',
        points: 1
      },
      {
        id: 'q2_3',
        type: 'multiple-choice',
        text: 'How many bones are in an adult human body?',
        options: ['206', '208', '210', '212'],
        correctAnswer: 0, // 206
        points: 1
      },
      {
        id: 'q2_4',
        type: 'open',
        text: 'What gas do plants absorb from the atmosphere?',
        correctAnswer: 'carbon dioxide',
        points: 1
      }
    ]
  },
  {
    id: 'page3',
    title: 'Sports & Entertainment',
    order: 3,
    questions: [
      {
        id: 'q3_1',
        type: 'multiple-choice',
        text: 'In which sport would you perform a slam dunk?',
        options: ['Tennis', 'Basketball', 'Volleyball', 'Badminton'],
        correctAnswer: 1, // Basketball
        points: 1
      },
      {
        id: 'q3_2',
        type: 'open',
        text: 'Which country won the FIFA World Cup in 2018?',
        correctAnswer: 'France',
        points: 1
      },
      {
        id: 'q3_3',
        type: 'multiple-choice',
        text: 'How many players are on a basketball team on the court at one time?',
        options: ['4', '5', '6', '7'],
        correctAnswer: 1, // 5
        points: 1
      },
      {
        id: 'q3_4',
        type: 'open',
        text: 'What is the highest-grossing film of all time?',
        correctAnswer: 'Avatar',
        points: 1
      }
    ]
  },
  {
    id: 'page4',
    title: 'Geography & History',
    order: 4,
    questions: [
      {
        id: 'q4_1',
        type: 'multiple-choice',
        text: 'Which river is the longest in the world?',
        options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'],
        correctAnswer: 1, // Nile
        points: 1
      },
      {
        id: 'q4_2',
        type: 'open',
        text: 'In which year did the Berlin Wall fall?',
        correctAnswer: '1989',
        points: 1
      },
      {
        id: 'q4_3',
        type: 'multiple-choice',
        text: 'Which country has the most natural lakes?',
        options: ['Russia', 'Canada', 'Finland', 'United States'],
        correctAnswer: 1, // Canada
        points: 1
      },
      {
        id: 'q4_4',
        type: 'open',
        text: 'Who was the first person to walk on the moon?',
        correctAnswer: 'Neil Armstrong',
        points: 1
      }
    ]
  }
];

// Helper functions
function getQuestionPageById(pageId) {
  return QUESTION_PAGES.find(page => page.id === pageId);
}

function getAllQuestionPages() {
  return QUESTION_PAGES.sort((a, b) => a.order - b.order);
}

function getQuestionById(questionId) {
  for (const page of QUESTION_PAGES) {
    const question = page.questions.find(q => q.id === questionId);
    if (question) {
      return { ...question, pageId: page.id, pageTitle: page.title };
    }
  }
  return null;
}

// Make functions available globally
window.QuestionPages = {
  getAll: getAllQuestionPages,
  getById: getQuestionPageById,
  getQuestionById: getQuestionById
};

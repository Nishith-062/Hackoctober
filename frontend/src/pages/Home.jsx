import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useApi } from "../api/useApi";
import Navbar from "../components/Navbar";
import React from "react";
import toast from "react-hot-toast";

// Dummy data for units, lessons, and questions (keep your existing data)
const practiceData = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Learn the basics of JavaScript programming",
    lessons: [
      {
        id: 1,
        title: "Variables and Data Types",
        questions: [
          {
            id: 1,
            question: "Which keyword is used to declare a variable in JavaScript?",
            options: ["var", "let", "const", "All of the above"],
            correctAnswer: 3,
            points: 5
          },
          {
            id: 2,
            question: "What is the data type of 'null' in JavaScript?",
            options: ["object", "null", "undefined", "string"],
            correctAnswer: 0,
            points: 5
          },
          {
            id: 3,
            question: "Which of these is a valid variable name?",
            options: ["2myVar", "my-var", "_myVar", "my var"],
            correctAnswer: 2,
            points: 5
          }
        ]
      },
      {
        id: 2,
        title: "Functions",
        questions: [
          {
            id: 1,
            question: "What is a pure function?",
            options: [
              "A function that doesn't take any parameters",
              "A function that always returns the same result for the same inputs",
              "A function that uses global variables",
              "A function that modifies external state"
            ],
            correctAnswer: 1,
            points: 5
          },
          {
            id: 2,
            question: "Which keyword is used to define a function in JavaScript?",
            options: ["function", "def", "func", "fn"],
            correctAnswer: 0,
            points: 5
          },
          {
            id: 3,
            question: "What does a function return by default if no return statement is specified?",
            options: ["null", "0", "undefined", "void"],
            correctAnswer: 2,
            points: 5
          }
        ]
      },
      {
        id: 3,
        title: "Arrays and Objects",
        questions: [
          {
            id: 1,
            question: "Which method adds an element to the end of an array?",
            options: ["push()", "pop()", "shift()", "unshift()"],
            correctAnswer: 0,
            points: 5
          },
          {
            id: 2,
            question: "How do you access object properties?",
            options: [
              "object.property or object['property']",
              "object->property",
              "object::property",
              "object.property only"
            ],
            correctAnswer: 0,
            points: 5
          },
          {
            id: 3,
            question: "Which method creates a new array with the results of calling a function on every element?",
            options: ["map()", "filter()", "reduce()", "forEach()"],
            correctAnswer: 0,
            points: 5
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "React Concepts",
    description: "Master React development concepts",
    lessons: [
      {
        id: 1,
        title: "Components and Props",
        questions: [
          {
            id: 1,
            question: "What are props in React?",
            options: [
              "Internal state of a component",
              "Functions that modify state",
              "Data passed from parent to child components",
              "Lifecycle methods"
            ],
            correctAnswer: 2,
            points: 5
          },
          {
            id: 2,
            question: "Which is the correct way to create a functional component?",
            options: [
              "function MyComponent() { return <div>Hello</div>; }",
              "class MyComponent extends React.Component { render() { return <div>Hello</div>; } }",
              "const MyComponent = () => { return <div>Hello</div>; }",
              "Both A and C"
            ],
            correctAnswer: 3,
            points: 5
          },
          {
            id: 3,
            question: "Can props be modified inside the child component?",
            options: [
              "Yes, always",
              "No, props are read-only",
              "Only if they are objects",
              "Only with special hooks"
            ],
            correctAnswer: 1,
            points: 5
          }
        ]
      },
      {
        id: 2,
        title: "Hooks",
        questions: [
          {
            id: 1,
            question: "What does the useState hook return?",
            options: [
              "The current state and a function to update it",
              "Just the current state",
              "Just the update function",
              "A component instance"
            ],
            correctAnswer: 0,
            points: 5
          },
          {
            id: 2,
            question: "When does useEffect run by default?",
            options: [
              "Only on component mount",
              "After every render",
              "Only when specific dependencies change",
              "Never runs by default"
            ],
            correctAnswer: 1,
            points: 5
          },
          {
            id: 3,
            question: "Which hook is used for performance optimization?",
            options: ["useMemo", "useEffect", "useState", "useContext"],
            correctAnswer: 0,
            points: 5
          }
        ]
      },
      {
        id: 3,
        title: "State Management",
        questions: [
          {
            id: 1,
            question: "What is the key difference between state and props?",
            options: [
              "State is mutable, props are immutable",
              "Props are mutable, state is immutable",
              "There is no difference",
              "State is only for class components"
            ],
            correctAnswer: 0,
            points: 5
          },
          {
            id: 2,
            question: "How do you update state based on previous state?",
            options: [
              "Using the callback pattern in setState",
              "Directly modifying the state variable",
              "Using the updateState method",
              "State cannot be updated based on previous state"
            ],
            correctAnswer: 0,
            points: 5
          },
          {
            id: 3,
            question: "When should you use useReducer instead of useState?",
            options: [
              "When state logic is complex",
              "When you have multiple sub-values",
              "When the next state depends on the previous one",
              "All of the above"
            ],
            correctAnswer: 3,
            points: 5
          }
        ]
      }
    ]
  }
];

export default function Home() {
  const { user } = useUser();
  const api = useApi();
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [totalEarnedPoints, setTotalEarnedPoints] = useState(0);

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
    setSelectedLesson(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setUserAnswers([]);
  };

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setUserAnswers([]);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const currentQ = selectedLesson.questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    
    if (isCorrect) {
      const newScore = score + currentQ.points;
      setScore(newScore);
      setTotalEarnedPoints(prev => prev + currentQ.points);
      toast.success(`+${currentQ.points} points! 🎉`, {
        duration: 2000,
        position: "top-right"
      });
    }

    setUserAnswers([...userAnswers, {
      questionId: currentQ.id,
      selectedAnswer,
      isCorrect,
      points: isCorrect ? currentQ.points : 0
    }]);

    if (currentQuestion < selectedLesson.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setSelectedLesson(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setUserAnswers([]);
  };

  const getProgressPercentage = () => {
    if (!selectedLesson) return 0;
    return ((currentQuestion + 1) / selectedLesson.questions.length) * 100;
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-base-content mb-4">
            Welcome, {user?.fullName}!
          </h1>
          <p className="text-xl text-base-content/80 mb-2">
            Practice Coding and Level Up Your Skills
          </p>
          <div className="bg-base-100 rounded-lg shadow-lg p-6 inline-block">
            <p className="text-lg font-semibold text-base-content">
              Total Points Earned Today: <span className="text-success">{totalEarnedPoints}</span>
            </p>
          </div>
        </div>

        {!selectedUnit ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {practiceData.map((unit) => (
              <div
                key={unit.id}
                className="bg-base-100 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleUnitSelect(unit)}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-content font-bold text-xl">
                    {unit.id}
                  </div>
                  <h2 className="text-2xl font-bold text-base-content ml-4">{unit.title}</h2>
                </div>
                <p className="text-base-content/80 mb-4">{unit.description}</p>
                <div className="flex items-center text-sm">
                  <span className="bg-info/10 text-info px-2 py-1 rounded font-medium">
                    {unit.lessons.length} Lessons
                  </span>
                  <span className="ml-2 bg-success/10 text-success px-2 py-1 rounded font-medium">
                    {unit.lessons.reduce((total, lesson) => total + lesson.questions.length, 0)} Questions
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : !selectedLesson ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-base-100 rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-base-content">{selectedUnit.title}</h2>
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="btn btn-outline btn-sm"
                >
                  ← Back to Units
                </button>
              </div>
              <p className="text-base-content/80 mb-8">{selectedUnit.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedUnit.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="border-2 border-base-300 rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                    onClick={() => handleLessonSelect(lesson)}
                  >
                    <h3 className="text-xl font-semibold text-base-content mb-3">
                      Lesson {lesson.id}: {lesson.title}
                    </h3>
                    <p className="text-base-content/80 mb-4">
                      {lesson.questions.length} questions • {lesson.questions.length * 5} total points
                    </p>
                    <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full inline-block">
                      Start Practice
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !showResult ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-base-100 rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="btn btn-outline btn-sm mb-2"
                  >
                    ← Back to Lessons
                  </button>
                  <h3 className="text-2xl font-bold text-base-content">
                    {selectedLesson.title}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-base-content">
                    Score: <span className="text-success">{score}</span>
                  </div>
                  <div className="text-sm text-base-content/70">
                    Question {currentQuestion + 1} of {selectedLesson.questions.length}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-base-300 rounded-full h-2 mb-8">
                <div
                  className="bg-success h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-base-content mb-6">
                  {selectedLesson.questions[currentQuestion].question}
                </h4>
                
                <div className="space-y-4">
                  {selectedLesson.questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedAnswer === index
                          ? 'border-primary bg-primary/10'
                          : 'border-base-300 hover:border-base-content/30 hover:bg-base-200'
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                          selectedAnswer === index
                            ? 'border-primary bg-primary text-primary-content'
                            : 'border-base-300'
                        }`}>
                          {selectedAnswer === index && '✓'}
                        </div>
                        <span className="text-base-content">{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-primary w-full"
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
              >
                {currentQuestion === selectedLesson.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-base-100 rounded-xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎉</span>
              </div>
              
              <h2 className="text-3xl font-bold text-base-content mb-4">Quiz Completed!</h2>
              <p className="text-xl text-base-content/80 mb-2">
                You scored <span className="font-bold text-success">{score}</span> out of{" "}
                <span className="font-bold">
                  {selectedLesson.questions.reduce((total, q) => total + q.points, 0)}
                </span> points
              </p>
              
              <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-200 my-6">
                <div className="stat">
                  <div className="stat-title">Correct Answers</div>
                  <div className="stat-value text-success">
                    {userAnswers.filter(answer => answer.isCorrect).length}
                  </div>
                  <div className="stat-desc">out of {selectedLesson.questions.length}</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Accuracy</div>
                  <div className="stat-value text-info">
                    {Math.round((userAnswers.filter(answer => answer.isCorrect).length / selectedLesson.questions.length) * 100)}%
                  </div>
                  <div className="stat-desc">Your performance</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Points Earned</div>
                  <div className="stat-value text-warning">{score}</div>
                  <div className="stat-desc">in this lesson</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center mt-8">
                <button
                  className="btn btn-outline"
                  onClick={() => setSelectedLesson(null)}
                >
                  Back to Lessons
                </button>
                <button
                  className="btn btn-primary"
                  onClick={resetQuiz}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
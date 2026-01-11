import { useState } from 'react';
import { CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';

function TakeQuizMode({ quiz, onFinish }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectAnswer = (questionId, answer) => {
    if (!showResults) {
      setSelectedAnswers({
        ...selectedAnswers,
        [questionId]: answer,
      });
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.quiz.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setCurrentQuestion(0);
  };

  const currentQ = quiz.quiz[currentQuestion];
  const isAnswered = selectedAnswers[currentQ.id] !== undefined;
  const isCorrect = selectedAnswers[currentQ.id] === currentQ.answer;
  const allAnswered = quiz.quiz.every((q) => selectedAnswers[q.id] !== undefined);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (showResults) {
    const percentage = Math.round((score / quiz.quiz.length) * 100);
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center">
          <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
          <div className={`text-6xl font-bold mb-4 ${getScoreColor(percentage)}`}>
            {percentage}%
          </div>
          <p className="text-xl text-gray-700 mb-6">
            You got <span className="font-bold text-primary-600">{score}</span> out of{' '}
            <span className="font-bold">{quiz.quiz.length}</span> questions correct
          </p>

          <div className="flex justify-center space-x-4">
            <button onClick={handleRetake} className="btn-primary flex items-center space-x-2">
              <RotateCcw className="w-5 h-5" />
              <span>Retake Quiz</span>
            </button>
            <button onClick={onFinish} className="btn-secondary">
              View Answers
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Review Your Answers</h3>
          {quiz.quiz.map((question, idx) => {
            const userAnswer = selectedAnswers[question.id];
            const correct = userAnswer === question.answer;

            return (
              <div key={question.id} className="card">
                <div className="flex items-start space-x-3 mb-4">
                  {correct ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-bold text-gray-900">Question {idx + 1}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium mb-3">{question.question}</p>
                    
                    <div className="space-y-2">
                      <div className={`p-3 rounded-lg ${correct ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
                        <span className="text-sm font-medium text-gray-700">Your answer: </span>
                        <span className={correct ? 'text-green-900 font-medium' : 'text-red-900 font-medium'}>
                          {userAnswer}
                        </span>
                      </div>
                      {!correct && (
                        <div className="p-3 bg-green-50 border-2 border-green-500 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Correct answer: </span>
                          <span className="text-green-900 font-medium">{question.answer}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-900">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Question {currentQuestion + 1} of {quiz.quiz.length}
        </div>
        <div className="text-sm font-medium text-gray-900">
          Answered: {Object.keys(selectedAnswers).length} / {quiz.quiz.length}
        </div>
      </div>

      <div className="mb-4 bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / quiz.quiz.length) * 100}%` }}
        ></div>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <span className="flex items-center justify-center w-10 h-10 bg-primary-600 text-white rounded-full font-bold">
            {currentQuestion + 1}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQ.difficulty)}`}>
            {currentQ.difficulty.toUpperCase()}
          </span>
          {currentQ.section_reference && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {currentQ.section_reference}
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">{currentQ.question}</h3>

        <div className="space-y-3 mb-6">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectAnswer(currentQ.id, option)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedAnswers[currentQ.id] === option
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-semibold text-gray-700">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 text-gray-900">{option}</span>
                {selectedAnswers[currentQ.id] === option && (
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="btn-secondary disabled:opacity-50"
          >
            ← Previous
          </button>

          {currentQuestion < quiz.quiz.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="btn-primary"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="btn-primary disabled:opacity-50"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-5 sm:grid-cols-10 gap-2">
        {quiz.quiz.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestion(idx)}
            className={`aspect-square rounded-lg font-medium text-sm transition-all ${
              idx === currentQuestion
                ? 'bg-primary-600 text-white ring-2 ring-primary-300'
                : selectedAnswers[q.id]
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TakeQuizMode;

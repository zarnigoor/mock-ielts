import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Location state dan ma'lumotlarni olish
  const { results, questions, userAnswers } = location.state || {};

  // Agar ma'lumotlar yo'q bo'lsa, bosh sahifaga yo'naltirish
  if (!results) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Results Not Found</h2>
        <p className="mb-6">Please take a test first to view results.</p>
        <Link 
          to="/"
          className="bg-current text-ivory dark:text-dark-slate px-6 py-2 rounded-lg inline-block"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const { totalQuestions, correctAnswers, score, details } = results;

  // Score ga qarab rang belgilash
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Score ga qarab xabar
  const getScoreMessage = () => {
    if (score >= 90) return 'Excellent! 🎉';
    if (score >= 80) return 'Very Good! 👏';
    if (score >= 70) return 'Good Result! 👍';
    if (score >= 60) return 'Average Score 📚';
    return 'Need More Practice 💪';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Natijalar sarlavhasi */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Test Results</h1>
        <div className="bg-white dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-10 rounded-lg p-8 border border-current border-opacity-20">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{totalQuestions}</div>
              <div className="opacity-80">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-green-500">{correctAnswers}</div>
              <div className="opacity-80">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor()}`}>
                {score}%
              </div>
              <div className="opacity-80">Score</div>
            </div>
          </div>
          
          <div className="text-xl font-semibold text-center">
            {getScoreMessage()}
          </div>
        </div>
      </div>

      {/* Batafsil natijalar */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Detailed Review</h2>
        
        <div className="space-y-4">
          {details.map((detail, index) => (
            <div
              key={detail.questionId}
              className={`bg-white dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-10 rounded-lg p-6 border-l-4 ${
                detail.isCorrect 
                  ? 'border-l-green-500' 
                  : 'border-l-red-500'
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-lg font-medium pr-4">
                  {index + 1}. {detail.questionText}
                </h3>
                <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  detail.isCorrect 
                    ? 'bg-green-500 bg-opacity-20 text-green-600 dark:text-green-400 border border-green-500 border-opacity-30'
                    : 'bg-red-500 bg-opacity-20 text-red-600 dark:text-red-400 border border-red-500 border-opacity-30'
                }`}>
                  {detail.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </div>
              </div>

              {/* Your Answer va Correct Answer ko'rsatish */}
              <div className="mb-4 p-4 bg-white dark:bg-gray-800 bg-opacity-5 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm opacity-70 mb-2">Your Answer:</h4>
                    {detail.selectedAnswer !== -1 ? (
                      <div className={`p-2 rounded border ${
                        detail.isCorrect 
                          ? 'border-green-500 bg-green-500 bg-opacity-10 text-green-600 dark:text-green-400'
                          : 'border-red-500 bg-red-500 bg-opacity-10 text-red-600 dark:text-red-400'
                      }`}>
                        {String.fromCharCode(65 + detail.selectedAnswer)}. {
                          questions?.find(q => q._id === detail.questionId)?.options[detail.selectedAnswer] || 'Unknown'
                        }
                      </div>
                    ) : (
                      <div className="p-2 rounded border border-red-500 bg-red-500 bg-opacity-10 text-red-600 dark:text-red-400 italic">
                        No answer provided
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm opacity-70 mb-2">Correct Answer:</h4>
                    <div className="p-2 rounded border border-green-500 bg-green-500 bg-opacity-10 text-green-600 dark:text-green-400">
                      {String.fromCharCode(65 + detail.correctAnswer)}. {
                        questions?.find(q => q._id === detail.questionId)?.options[detail.correctAnswer] || 'Unknown'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Harakatlar tugmalari */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/test"
          className="bg-current text-ivory dark:text-dark-slate px-8 py-3 rounded-lg text-center hover:opacity-90 transition-opacity"
        >
          Take Another Test
        </Link>
        <Link
          to="/"
          className="border border-current px-8 py-3 rounded-lg text-center hover:bg-current hover:text-ivory dark:hover:text-dark-slate transition-colors"
        >
          Back to Home
        </Link>
      </div>

      {/* Maslahat */}
      <div className="mt-12 bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
          💡 Recommendation
        </h3>
        <p className="opacity-90">
          {score >= 80 
            ? "Excellent result! You appear ready for IELTS Reading/Listening sections."
            : score >= 60
            ? "Good start! Practice more and expand your vocabulary."
            : "Focus more time on learning basic grammar and vocabulary."
          }
        </p>
      </div>
    </div>
  );
};

export default Results;
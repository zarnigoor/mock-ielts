import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../utils/api';
import Timer from '../components/Timer';

const TestPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const saved = localStorage.getItem('ielts_current_question');
    return saved ? parseInt(saved) : 0;
  });
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('ielts_test_answers');
    return saved ? JSON.parse(saved) : {};
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [testStarted, setTestStarted] = useState(() => {
    return localStorage.getItem('ielts_test_started') === 'true';
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getQuestions(10); // 10 ta savol
      setQuestions(response.data);
    } catch (err) {
      setError('Savollarni yuklashda xatolik yuz berdi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = () => {
    // Eski timer ma'lumotlarini tozalash
    localStorage.removeItem('ielts_test_timer');
    localStorage.removeItem('ielts_test_start_time');
    localStorage.setItem('ielts_test_started', 'true');
    setTestStarted(true);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    const newAnswers = {
      ...answers,
      [questionId]: answerIndex
    };
    setAnswers(newAnswers);
    localStorage.setItem('ielts_test_answers', JSON.stringify(newAnswers));
  };

  const handleTimeUp = () => {
    alert('Time is up! Test will finish automatically.');
    handleSubmitTest();
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    
    try {
      // Test ma'lumotlarini localStorage'dan tozalash
      localStorage.removeItem('ielts_test_timer');
      localStorage.removeItem('ielts_test_start_time');
      localStorage.removeItem('ielts_test_started');
      localStorage.removeItem('ielts_test_answers');
      localStorage.removeItem('ielts_current_question');

      // Javoblarni format qilish
      const formattedAnswers = questions.map(question => ({
        questionId: question._id,
        selectedAnswer: answers[question._id] !== undefined ? answers[question._id] : -1
      }));

      const response = await userAPI.submitAnswers(formattedAnswers);
      
      // Natijalarni Results sahifasiga o'tkazish
      navigate('/results', { 
        state: { 
          results: response.data,
          questions: questions,
          userAnswers: answers
        }
      });
    } catch (err) {
      setError('Error submitting answers');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      localStorage.setItem('ielts_current_question', newIndex.toString());
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      localStorage.setItem('ielts_current_question', newIndex.toString());
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    localStorage.setItem('ielts_current_question', index.toString());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading test...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={loadQuestions}
          className="bg-current text-ivory dark:text-dark-slate px-6 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
        <p className="mb-6">No questions have been added by the administrator yet.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-current text-ivory dark:text-dark-slate px-6 py-2 rounded-lg"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Test boshlanmagan bo'lsa
  if (!testStarted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">IELTS Mock Test</h1>
        
        <div className="bg-white dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-10 rounded-lg p-8 mb-8 border border-current border-opacity-20">
          <h2 className="text-xl font-semibold mb-4">Test Information:</h2>
          <div className="space-y-3 text-left">
            <p>✓ Number of Questions: <strong>{questions.length}</strong></p>
            <p>✓ Time Limit: <strong>10 minutes</strong></p>
            <p>✓ 4 options available for each question</p>
            <p>✓ Results will be shown after test completion</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-lg mb-4">Are you ready to start the test?</p>
          <button
            onClick={handleStartTest}
            className="bg-current text-ivory dark:text-dark-slate px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-10 rounded-lg p-4 border border-current border-opacity-20">
        <div>
          <h1 className="text-2xl font-bold">IELTS Mock Test</h1>
          <p className="opacity-80">
            Question {currentQuestionIndex + 1} / {questions.length} 
            • Answered: {getAnsweredCount()}
          </p>
        </div>
        <Timer 
          initialMinutes={10}
          onTimeUp={handleTimeUp}
          isActive={!submitting}
        />
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Question Navigation */}
        <div className="md:col-span-1">
          <div className="card sticky top-4">
            <h3 className="font-semibold mb-3">Questions</h3>
            <div className="question-nav">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`question-nav-item ${
                    index === currentQuestionIndex ? 'current' : ''
                  } ${
                    answers[questions[index]._id] !== undefined ? 'answered' : ''
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Question */}
        <div className="md:col-span-3">
          <div className="card mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm opacity-60">
                  Question {currentQuestionIndex + 1}
                </span>
                <div className="flex items-center gap-2">
                  {answers[currentQuestion._id] !== undefined && (
                    <span className="text-green-500 text-sm">
                      ✓ Answered
                    </span>
                  )}
                </div>
              </div>
              <h2 className="text-xl font-medium leading-relaxed">
                {currentQuestion.questionText}
              </h2>
            </div>

            <div>
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`question-option ${
                    answers[currentQuestion._id] === index ? 'selected' : ''
                  }`}
                  onClick={() => handleAnswerSelect(currentQuestion._id, index)}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion._id}`}
                    value={index}
                    checked={answers[currentQuestion._id] === index}
                    onChange={() => handleAnswerSelect(currentQuestion._id, index)}
                    className="sr-only"
                  />
                  <div className="radio-dot">
                    {answers[currentQuestion._id] === index && (
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                    )}
                  </div>
                  <span className="font-medium text-lg">{String.fromCharCode(65 + index)}</span>
                  <span className="flex-1">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex gap-4">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="bg-current text-ivory dark:text-dark-slate px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Previous
              </button>
              <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="bg-current text-ivory dark:text-dark-slate px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Next
              </button>
            </div>

            <button
              onClick={handleSubmitTest}
              disabled={submitting}
              className="bg-current text-ivory dark:text-dark-slate px-8 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Finish Test'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
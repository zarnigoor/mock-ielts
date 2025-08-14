import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-6">
          IELTS Mock Exam
        </h1>
        <p className="text-xl mb-8 opacity-80">
          Improve your IELTS skills with our interactive mock exam platform. 
          Practice with multiple-choice questions and get instant results.
        </p>
      </div>

      <div className="grid grid-2 mb-12">
        {/* User Section */}
        <div className="card">
          <div className="mb-6">
            <svg style={{width: '4rem', height: '4rem', margin: '0 auto 1rem'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <h2 className="text-2xl font-bold mb-3">Take the Test</h2>
            <p className="opacity-80 mb-6">
              Start your IELTS mock exam with randomized questions and a 10-minute timer.
            </p>
          </div>
          
          <Link to="/test" className="btn">
            Start Test
          </Link>
        </div>

        {/* Features Section */}
        <div className="card">
          <div className="mb-6">
            <svg style={{width: '4rem', height: '4rem', margin: '0 auto 1rem'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h2 className="text-2xl font-bold mb-3">Results</h2>
            <p className="opacity-80 mb-6">
              Get detailed results and analysis after completing your test.
            </p>
          </div>
          
          <Link to="/results" className="btn">
            View Results
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-3">
        <div className="text-center">
          <svg style={{width: '3rem', height: '3rem', margin: '0 auto 0.75rem'}} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <h3 className="text-lg font-semibold mb-2">Randomized Questions</h3>
          <p className="text-sm opacity-80">Get different questions each time you take the test</p>
        </div>
        
        <div className="text-center">
          <svg style={{width: '3rem', height: '3rem', margin: '0 auto 0.75rem'}} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
          <p className="text-sm opacity-80">Get your score and detailed feedback immediately</p>
        </div>
        
        <div className="text-center">
          <svg style={{width: '3rem', height: '3rem', margin: '0 auto 0.75rem'}} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8z"/>
          </svg>
          <h3 className="text-lg font-semibold mb-2">10-Minute Timer</h3>
          <p className="text-sm opacity-80">Practice with time constraints like the real exam</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
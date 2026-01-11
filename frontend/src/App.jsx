import { useState } from 'react';
import { BookOpen, History } from 'lucide-react';
import GenerateQuiz from './components/GenerateQuiz';
import QuizHistory from './components/QuizHistory';

function App() {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://deepklarity.ai/images/logo.png" 
                alt="DeepKlarity" 
                className="h-10 w-auto"
              />
              <div className="border-l border-gray-200 pl-4">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  AI Wiki Quiz Generator
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">Engineering Intelligence that Works</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === 'generate'
                    ? 'border-purple-600 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Generate Quiz</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === 'history'
                    ? 'border-purple-600 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <History className="w-5 h-5" />
                <span>Past Quizzes</span>
              </button>
            </nav>
          </div>

          <div className="p-6 bg-white/50">
            {activeTab === 'generate' ? <GenerateQuiz /> : <QuizHistory />}
          </div>
        </div>
      </div>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 text-sm border-t border-gray-200 mt-8">
        <p>© 2026 DeepKlarity Technologies. Engineering Intelligence that Works.</p>
        <p className="text-gray-500 text-xs mt-1">Built with React, FastAPI & Google Gemini AI</p>
      </footer>
    </div>
  );
}

export default App;

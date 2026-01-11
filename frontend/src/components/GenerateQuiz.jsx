import { useState } from 'react';
import { Link, Loader2, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { quizAPI } from '../services/api';
import QuizDisplay from './QuizDisplay';
import TakeQuizMode from './TakeQuizMode';

function GenerateQuiz() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('view');

  const handleValidateUrl = async () => {
    if (!url.trim()) {
      setError('Please enter a Wikipedia URL');
      return;
    }

    setValidating(true);
    setError(null);
    setValidation(null);

    try {
      const result = await quizAPI.validateUrl(url);
      setValidation(result);
      
      if (result.cached && result.quiz_id) {
        const cachedQuiz = await quizAPI.getQuizById(result.quiz_id);
        setQuiz(cachedQuiz);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to validate URL');
    } finally {
      setValidating(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (validation?.cached && validation?.quiz_id) {
      const cachedQuiz = await quizAPI.getQuizById(validation.quiz_id);
      setQuiz(cachedQuiz);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await quizAPI.generateQuiz(url);
      setQuiz(result);
      setMode('view');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setQuiz(null);
    setValidation(null);
    setError(null);
    setMode('view');
  };

  return (
    <div className="space-y-6">
      {!quiz ? (
        <div className="max-w-3xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate New Quiz</h2>
            <p className="text-gray-600 mb-6">
              Enter a Wikipedia article URL to generate an AI-powered quiz with questions, explanations, and related topics.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Wikipedia Article URL
                </label>
                <div className="flex space-x-2">
                  <input
                    id="url"
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setValidation(null);
                      setError(null);
                    }}
                    placeholder="https://en.wikipedia.org/wiki/Alan_Turing"
                    className="input-field flex-1"
                    disabled={loading || validating}
                  />
                  <button
                    onClick={handleValidateUrl}
                    disabled={validating || loading || !url.trim()}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    {validating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    <span>Validate</span>
                  </button>
                </div>
              </div>

              {validation && (
                <div className={`p-4 rounded-lg flex items-start space-x-3 ${
                  validation.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  {validation.valid ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${validation.valid ? 'text-green-900' : 'text-red-900'}`}>
                      {validation.title || 'Validation Result'}
                    </p>
                    <p className={`text-sm mt-1 ${validation.valid ? 'text-green-700' : 'text-red-700'}`}>
                      {validation.message}
                    </p>
                    {validation.cached && (
                      <p className="text-sm text-purple-600 mt-2 font-medium">
                        Quiz already exists in cache - instant retrieval available
                      </p>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={handleGenerateQuiz}
                disabled={loading || !validation?.valid}
                className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Quiz...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{validation?.cached ? 'Load Cached Quiz' : 'Generate Quiz'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">Example URLs:</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• https://en.wikipedia.org/wiki/Alan_Turing</li>
                <li>• https://en.wikipedia.org/wiki/Quiz</li>
                <li>• https://en.wikipedia.org/wiki/Marie_Curie</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button onClick={handleReset} className="btn-secondary">
                ← New Quiz
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => setMode('view')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    mode === 'view'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  View Mode
                </button>
                <button
                  onClick={() => setMode('take')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    mode === 'take'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  Take Quiz
                </button>
              </div>
            </div>
          </div>

          {mode === 'view' ? (
            <QuizDisplay quiz={quiz} />
          ) : (
            <TakeQuizMode quiz={quiz} onFinish={() => setMode('view')} />
          )}
        </div>
      )}
    </div>
  );
}

export default GenerateQuiz;

import { useState, useEffect } from 'react';
import { Calendar, FileText, Loader2, X, ExternalLink, Play } from 'lucide-react';
import { quizAPI } from '../services/api';
import QuizDisplay from './QuizDisplay';
import TakeQuizMode from './TakeQuizMode';

function QuizHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('view');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await quizAPI.getHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to load quiz history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (quizId) => {
    setLoadingQuiz(quizId);
    try {
      const quiz = await quizAPI.getQuizById(quizId);
      setSelectedQuiz(quiz);
    } catch (err) {
      setError('Failed to load quiz details');
    } finally {
      setLoadingQuiz(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600">{error}</p>
        <button onClick={fetchHistory} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="card text-center py-12">
        <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quizzes Yet</h3>
        <p className="text-gray-600">Generate your first quiz to see it here!</p>
      </div>
    );
  }

  return (
    <div>
      {!selectedQuiz ? (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quiz History</h2>
            <p className="text-gray-600 mt-1">View all previously generated quizzes</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                        {item.question_count} questions
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 flex items-center space-x-1 text-sm"
                      >
                        <span className="truncate max-w-xs">Wikipedia</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewDetails(item.id)}
                        className="btn-primary text-sm"
                        disabled={loadingQuiz === item.id}
                      >
                        {loadingQuiz === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'View Details'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                setSelectedQuiz(null);
                setMode('view');
              }}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Close Details</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMode('view')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  mode === 'view'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                View Quiz
              </button>
              <button
                onClick={() => setMode('take')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                  mode === 'take'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>Take Quiz</span>
              </button>
            </div>
          </div>
          
          {mode === 'view' ? (
            <QuizDisplay quiz={selectedQuiz} />
          ) : (
            <TakeQuizMode quiz={selectedQuiz} />
          )}
        </div>
      )}
    </div>
  );
}

export default QuizHistory;

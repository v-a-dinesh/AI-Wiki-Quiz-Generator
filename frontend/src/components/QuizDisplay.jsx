import { ExternalLink, Users, Building2, MapPin, BookMarked, Layers } from 'lucide-react';

function QuizDisplay({ quiz }) {
  const groupedQuestions = quiz.quiz.reduce((acc, question) => {
    const section = question.section_reference || 'General';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(question);
    return acc;
  }, {});

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h2>
            <a
              href={quiz.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 flex items-center space-x-1 text-sm"
            >
              <span>View Wikipedia Article</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Questions</div>
            <div className="text-3xl font-bold text-primary-600">{quiz.quiz.length}</div>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{quiz.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quiz.key_entities.people.length > 0 && (
          <div className="card">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">People</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {quiz.key_entities.people.map((person, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  {person}
                </span>
              ))}
            </div>
          </div>
        )}

        {quiz.key_entities.organizations.length > 0 && (
          <div className="card">
            <div className="flex items-center space-x-2 mb-3">
              <Building2 className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Organizations</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {quiz.key_entities.organizations.map((org, idx) => (
                <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                  {org}
                </span>
              ))}
            </div>
          </div>
        )}

        {quiz.key_entities.locations.length > 0 && (
          <div className="card">
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Locations</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {quiz.key_entities.locations.map((location, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  {location}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Layers className="w-5 h-5 text-primary-600" />
          <h3 className="text-xl font-bold text-gray-900">Article Sections</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {quiz.sections.map((section, idx) => (
            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
              {section}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <BookMarked className="w-6 h-6 text-primary-600" />
          <h3 className="text-2xl font-bold text-gray-900">Quiz Questions (Grouped by Section)</h3>
        </div>

        {Object.entries(groupedQuestions).map(([section, questions]) => (
          <div key={section} className="space-y-4">
            <div className="flex items-center space-x-2 pt-4">
              <div className="h-px flex-1 bg-gray-300"></div>
              <h4 className="text-lg font-semibold text-gray-700 px-4">{section}</h4>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            {questions.map((question, idx) => (
              <div key={question.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full font-bold text-sm">
                        {questions.slice(0, idx).length + quiz.quiz.slice(0, quiz.quiz.indexOf(question)).length + 1}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 ml-11">{question.question}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
                  {question.options.map((option, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        option === question.answer
                          ? 'bg-green-50 border-green-500'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className={option === question.answer ? 'font-medium text-green-900' : 'text-gray-700'}>
                          {option}
                        </span>
                        {option === question.answer && (
                          <span className="ml-auto text-green-600 font-bold">✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 ml-11 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                  <p className="text-sm text-blue-800">{question.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {quiz.related_topics.length > 0 && (
        <div className="card bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Related Topics for Further Reading</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {quiz.related_topics.map((topic, idx) => (
              <a
                key={idx}
                href={`https://en.wikipedia.org/wiki/${topic.replace(/ /g, '_')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-primary-200 group"
              >
                <ExternalLink className="w-4 h-4 text-primary-600 group-hover:text-primary-700" />
                <span className="text-gray-800 group-hover:text-primary-700 font-medium">{topic}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizDisplay;

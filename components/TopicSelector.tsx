import React from 'react';

interface TopicSelectorProps {
  onTopicSelect: (topic: string) => void;
}

const topics = [
  { name: 'Environment', icon: '🌍' },
  { name: 'Technology', icon: '🤖' },
  { name: 'History', icon: '🏛️' },
  { name: 'Science', icon: '🔬' },
];

const TopicSelector: React.FC<TopicSelectorProps> = ({ onTopicSelect }) => {
  return (
    <div className="text-center animate-fade-in py-16">
      <h2 className="text-4xl font-bold mb-2 text-gray-100">Welcome, Hana!</h2>
      <p className="text-lg text-gray-400 mb-12">
        Let's improve your reading skills together. Pick a topic to start.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((topic) => (
          <button
            key={topic.name}
            onClick={() => onTopicSelect(topic.name)}
            className="p-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-gray-900 bg-gray-800 hover:bg-gray-700"
          >
            <span className="text-5xl" role="img" aria-label={topic.name}>{topic.icon}</span>
            <h3 className="text-xl font-semibold mt-4 text-gray-100">{topic.name}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicSelector;
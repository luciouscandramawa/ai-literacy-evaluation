import React from 'react';

interface RoleSelectorProps {
  onSelectRole: (role: 'student' | 'instructor') => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="text-center animate-fade-in py-16">
      <h2 className="text-4xl font-bold mb-2 text-gray-100">Welcome!</h2>
      <p className="text-lg text-gray-400 mb-12">
        Please select your role to get started.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <button
          onClick={() => onSelectRole('student')}
          className="p-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-gray-900 bg-gray-800 hover:bg-gray-700"
        >
          <span className="text-6xl" role="img" aria-label="Student">🎓</span>
          <h3 className="text-2xl font-semibold mt-4 text-gray-100">I am a Student</h3>
          <p className="text-gray-400 mt-2">Start a reading session and test your skills.</p>
        </button>
        <button
          onClick={() => onSelectRole('instructor')}
          className="p-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-gray-900 bg-gray-800 hover:bg-gray-700"
        >
          <span className="text-6xl" role="img" aria-label="Instructor">🧑‍🏫</span>
          <h3 className="text-2xl font-semibold mt-4 text-gray-100">I am an Instructor</h3>
          <p className="text-gray-400 mt-2">Add new reading materials for your students.</p>
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;

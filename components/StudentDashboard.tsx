import React from 'react';
import { ReadingMaterial } from '../types';

interface StudentDashboardProps {
  materials: ReadingMaterial[];
  onSelectMaterial: (material: ReadingMaterial) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ materials, onSelectMaterial }) => {
  const getBadgeStyle = (type: string) => {
    switch(type) {
      case 'pdf': return 'bg-blue-900 text-blue-300';
      case 'file': return 'bg-indigo-900 text-indigo-300';
      case 'url': return 'bg-yellow-900 text-yellow-300';
      case 'text':
      default:
        return 'bg-green-900 text-green-300';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-2 text-gray-100">Choose an Article</h2>
        <p className="text-lg text-gray-400">Select a reading material to begin your session.</p>
      </div>
      {materials.length > 0 ? (
        <div className="space-y-4">
          {materials.map((material) => (
            <div
              key={material.id}
              className="bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className={`text-xs font-medium mr-4 px-2.5 py-1 rounded-full ${getBadgeStyle(material.content.type)}`}>
                  {material.content.type.toUpperCase()}
                </span>
                <h3 className="text-xl font-semibold text-gray-100">{material.title}</h3>
              </div>
              <button
                onClick={() => onSelectMaterial(material)}
                className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
              >
                Start Reading
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-gray-800 p-8 rounded-lg">
           <h3 className="text-xl font-semibold text-gray-100">No materials available yet.</h3>
           <p className="text-gray-400 mt-2">Please ask your instructor to add some reading content.</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
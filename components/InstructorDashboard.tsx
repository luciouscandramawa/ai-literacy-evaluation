import React from 'react';
import { ReadingMaterial, MaterialContent } from '../types';
import AddMaterialForm from './AddMaterialForm';

interface InstructorDashboardProps {
  materials: ReadingMaterial[];
  onAddMaterial: (title: string, content: MaterialContent) => void;
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ materials, onAddMaterial }) => {
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
    <div className="space-y-12 animate-fade-in">
      <AddMaterialForm onAddMaterial={onAddMaterial} />

      <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-100">Existing Materials</h2>
        {materials.length > 0 ? (
          <ul className="space-y-3">
            {materials.map(material => (
              <li key={material.id} className="p-4 bg-gray-700/50 rounded-md flex items-center justify-between">
                <span className="text-gray-200">{material.title}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getBadgeStyle(material.content.type)}`}>
                  {material.content.type.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No materials have been added yet.</p>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
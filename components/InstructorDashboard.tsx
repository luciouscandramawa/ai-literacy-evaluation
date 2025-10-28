import React from 'react';
import { ReadingMaterial, MaterialContent } from '../types';
import AddMaterialForm from './AddMaterialForm';
import { getBadgeStyle } from '../utils/styleUtils';

interface InstructorDashboardProps {
  materials: ReadingMaterial[];
  onAddMaterial: (title: string, content: MaterialContent) => void;
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ materials, onAddMaterial }) => {
  return (
    <div className="space-y-12 animate-fade-in">
      <AddMaterialForm onAddMaterial={onAddMaterial} />

      <div className="bg-brand-container p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-100">Existing Materials</h2>
        {materials.length > 0 ? (
          <ul className="space-y-3">
            {materials.map(material => (
              <li key={material.id} className="p-4 bg-brand-input-base/50 rounded-md flex items-center justify-between">
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
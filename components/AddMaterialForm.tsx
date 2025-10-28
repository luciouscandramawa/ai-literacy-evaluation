import React, { useState } from 'react';
import { MaterialContent } from '../types';

interface AddMaterialFormProps {
    onAddMaterial: (title: string, content: MaterialContent) => void;
}

type InputMode = 'text' | 'file' | 'url';

const AddMaterialForm: React.FC<AddMaterialFormProps> = ({ onAddMaterial }) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState('');
    const [mode, setMode] = useState<InputMode>('text');
    const [error, setError] = useState<string>('');

    const resetForm = () => {
        setTitle('');
        setText('');
        setFile(null);
        setUrl('');
        setError('');
    }

    const handleModeChange = (newMode: InputMode) => {
        setMode(newMode);
        setFile(null); // Reset file on tab change to prevent stale state
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Please provide a title.');
            return;
        }

        let materialContent: MaterialContent | null = null;

        if (mode === 'text' && text.trim()) {
            materialContent = { type: 'text', text };
        } else if (mode === 'file' && file) {
            const fileName = file.name.toLowerCase();
            if (fileName.endsWith('.pdf')) {
                materialContent = { type: 'pdf', file };
            } else if (fileName.endsWith('.docx')) {
                materialContent = { type: 'file', file };
            } else {
                setError('Unsupported file type. Please upload a PDF or DOCX file.');
                return;
            }
        } else if (mode === 'url' && url.trim()) {
             try {
                new URL(url); // Validate URL format
                materialContent = { type: 'url', url };
            } catch (_) {
                setError('Please enter a valid URL.');
                return;
            }
        } else {
            setError('Please provide content for the selected input type.');
            return;
        }
        
        if (materialContent) {
            onAddMaterial(title, materialContent);
            resetForm();
        }
    };

    const isContentMissing = () => {
        switch (mode) {
            case 'text':
                return !text.trim();
            case 'file':
                return !file;
            case 'url':
                return !url.trim();
            default:
                return true;
        }
    };

    const isSubmitDisabled = !title.trim() || isContentMissing();

    const renderTabs = () => (
        <div className="flex border-b border-gray-700 mb-6">
            <TabButton id="text" currentMode={mode} setMode={handleModeChange}>Paste Text</TabButton>
            <TabButton id="file" currentMode={mode} setMode={handleModeChange}>Upload File</TabButton>
            <TabButton id="url" currentMode={mode} setMode={handleModeChange}>From URL</TabButton>
        </div>
    );

    const renderContent = () => {
        switch (mode) {
            case 'text':
                return (
                    <textarea
                        id="content"
                        rows={8}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full p-3 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-text-accent focus:border-brand-text-accent transition bg-brand-input-base text-gray-200 placeholder-gray-500"
                        placeholder="Paste the full text of the article here..."
                    />
                );
            case 'file':
                return (
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-brand-input-base/50 hover:bg-brand-input-base">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                                {file ? (
                                    <>
                                        <p className="mb-2 text-sm text-green-400"><span className="font-semibold">File Selected:</span> {file.name}</p>
                                        <p className="text-xs text-gray-400">{Math.round(file.size / 1024)} KB</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-400">PDF or DOCX (MAX. 10MB)</p>
                                    </>
                                )}
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                        </label>
                    </div> 
                );
             case 'url':
                return (
                    <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full p-3 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-text-accent focus:border-brand-text-accent transition bg-brand-input-base text-gray-200 placeholder-gray-500"
                        placeholder="https://example.com/article"
                    />
                );
            default: return null;
        }
    };
    
    return (
        <div className="bg-brand-container p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-100">Add New Reading Material</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-text-accent focus:border-brand-text-accent transition bg-brand-input-base text-gray-200 placeholder-gray-500"
                        placeholder="e.g., The History of Space Exploration"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Content Source</label>
                    {renderTabs()}
                    <div className="mt-4">
                        {renderContent()}
                    </div>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="px-8 py-3 bg-brand-accent text-white font-bold rounded-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-text-accent focus:ring-offset-2 focus:ring-offset-brand-bg transition-colors disabled:bg-brand-accent-disabled disabled:cursor-not-allowed"
                    >
                        Add Material
                    </button>
                </div>
            </form>
        </div>
    );
};

interface TabButtonProps {
    id: InputMode;
    currentMode: InputMode;
    setMode: (mode: InputMode) => void;
    children: React.ReactNode;
    disabled?: boolean;
    tooltip?: string;
}

const TabButton: React.FC<TabButtonProps> = ({ id, currentMode, setMode, children, disabled, tooltip }) => (
    <div className="relative flex group">
        <button
            type="button"
            onClick={() => !disabled && setMode(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors
                ${currentMode === id ? 'border-brand-text-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-gray-200'}
                ${disabled ? 'cursor-not-allowed text-gray-600' : ''}
            `}
            disabled={disabled}
        >
            {children}
        </button>
        {disabled && tooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" role="tooltip">
                {tooltip}
            </div>
        )}
    </div>
);


export default AddMaterialForm;
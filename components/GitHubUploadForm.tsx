
import React, { useState } from 'react';
import type { Project } from '../types';
import { uploadToGitHub } from '../services/githubService';
import { exportToJsonString, exportToSvgString } from '../services/exportService';

interface GitHubUploadFormProps {
    project: Project;
    options: { 
        showLines: boolean, 
        showNumbers: boolean, 
        dotSize: number,
        lineStyle?: Project['lineStyle'],
        lineThickness?: number,
        dotColor?: string,
        lineColor?: string,
    };
}

const GitHubUploadForm: React.FC<GitHubUploadFormProps> = ({ project, options }) => {
    const [token, setToken] = useState('');
    const [repo, setRepo] = useState(''); // e.g., 'username/repo-name'
    const [path, setPath] = useState('dottodot/my-art.json');
    const [message, setMessage] = useState('feat: Add new dot-to-dot artwork');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setError('');

        const fileExtension = path.split('.').pop()?.toLowerCase();
        let content = '';

        if (fileExtension === 'json') {
            content = exportToJsonString(project);
        } else if (fileExtension === 'svg') {
            content = exportToSvgString(project, options);
        } else {
            setError('Unsupported file type. Please use .json or .svg.');
            setStatus('error');
            return;
        }

        try {
            await uploadToGitHub({
                token,
                repo,
                path,
                message,
                content
            });
            setStatus('success');
        } catch (err: any) {
            setStatus('error');
            setError(err.message);
        }
    };

    return (
        <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Upload to GitHub</h3>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md" role="alert">
                <p className="font-bold">Security Warning</p>
                <p>Pasting your Personal Access Token here is not secure in a production environment. This feature is for demonstration. A real app should use a secure backend proxy.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="token" className="block text-sm font-medium text-gray-700">GitHub Personal Access Token</label>
                    <input type="password" id="token" value={token} onChange={e => setToken(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="repo" className="block text-sm font-medium text-gray-700">Repository (e.g., username/repo)</label>
                    <input type="text" id="repo" value={repo} onChange={e => setRepo(e.target.value)} required placeholder="your-username/your-repo" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="path" className="block text-sm font-medium text-gray-700">File Path (e.g., art/drawing.json)</label>
                    <input type="text" id="path" value={path} onChange={e => setPath(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Commit Message</label>
                    <input type="text" id="message" value={message} onChange={e => setMessage(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <button type="submit" disabled={status === 'loading'} className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400">
                    {status === 'loading' ? 'Uploading...' : 'Upload to GitHub'}
                </button>
            </form>
            {status === 'success' && <p className="text-green-600 mt-2">Upload successful!</p>}
            {status === 'error' && <p className="text-red-600 mt-2">Error: {error}</p>}
        </div>
    );
};

export default GitHubUploadForm;

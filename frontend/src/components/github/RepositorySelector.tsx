'use client';

import { useState, useEffect } from 'react';
import { linkRepository, unlinkRepository, getTeamRepository, RepositoryLinkResponse } from '@/lib/api/github';

interface RepositorySelectorProps {
  teamId: number;
  isLeader: boolean;
  onLink?: () => void;
  onUnlink?: () => void;
}

export default function RepositorySelector({ teamId, isLeader, onLink, onUnlink }: RepositorySelectorProps) {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [currentRepo, setCurrentRepo] = useState<RepositoryLinkResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadRepository();
  }, [teamId]);

  const loadRepository = async () => {
    try {
      setLoading(true);
      const repo = await getTeamRepository(teamId);
      setCurrentRepo(repo);
      if (repo.repository_url) {
        setRepositoryUrl(repo.repository_url);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load repository');
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repositoryUrl.trim()) {
      setError('Please enter a repository URL');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const response = await linkRepository(teamId, repositoryUrl.trim());
      
      if (response.success) {
        setSuccess('Repository linked successfully!');
        setCurrentRepo(response);
        onLink?.();
      } else {
        setError(response.message || 'Failed to link repository');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link repository');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlink = async () => {
    if (!confirm('Are you sure you want to unlink this repository?')) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const response = await unlinkRepository(teamId);
      
      if (response.success) {
        setSuccess('Repository unlinked successfully');
        setRepositoryUrl('');
        setCurrentRepo(null);
        onUnlink?.();
      } else {
        setError('Failed to unlink repository');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlink repository');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      {currentRepo?.repository_url && currentRepo.repository_info ? (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentRepo.repository_info.full_name}
                </h3>
                {currentRepo.repository_info.private && (
                  <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded">
                    Private
                  </span>
                )}
              </div>
              
              {currentRepo.repository_info.description && (
                <p className="text-gray-600 text-sm mb-3">
                  {currentRepo.repository_info.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {currentRepo.repository_info.language && (
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                    {currentRepo.repository_info.language}
                  </span>
                )}
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {currentRepo.repository_info.stars}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {currentRepo.repository_info.forks}
                </span>
              </div>
              
              <a
                href={currentRepo.repository_info.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-3 text-sm text-blue-600 hover:text-blue-800"
              >
                View on GitHub
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            
            {isLeader && (
              <button
                onClick={handleUnlink}
                disabled={submitting}
                className="ml-4 px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                Unlink
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {isLeader ? (
            <form onSubmit={handleLink} className="space-y-4">
              <div>
                <label htmlFor="repository-url" className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  id="repository-url"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={submitting}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter the full URL of your team's GitHub repository
                </p>
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Linking...' : 'Link Repository'}
              </button>
            </form>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 text-sm">
                No repository linked yet. The team leader can link a repository.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

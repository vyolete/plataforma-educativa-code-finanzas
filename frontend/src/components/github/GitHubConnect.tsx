'use client';

import { useState, useEffect } from 'react';
import { connectGitHub, disconnectGitHub, getGitHubStatus, getGitHubAuthUrl, GitHubStatusResponse } from '@/lib/api/github';

interface GitHubConnectProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export default function GitHubConnect({ onConnect, onDisconnect }: GitHubConnectProps) {
  const [status, setStatus] = useState<GitHubStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    loadStatus();
    
    // Check for OAuth callback code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleOAuthCallback(code);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const statusData = await getGitHubStatus();
      setStatus(statusData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load GitHub status');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthCallback = async (code: string) => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const response = await connectGitHub(code);
      
      if (response.success) {
        await loadStatus();
        onConnect?.();
      } else {
        setError(response.message || 'Failed to connect GitHub account');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect GitHub account');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnect = () => {
    try {
      const redirectUri = `${window.location.origin}${window.location.pathname}`;
      const authUrl = getGitHubAuthUrl(redirectUri);
      window.location.href = authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate GitHub OAuth');
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your GitHub account?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await disconnectGitHub();
      
      if (response.success) {
        await loadStatus();
        onDisconnect?.();
      } else {
        setError('Failed to disconnect GitHub account');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect GitHub account');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isConnecting) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <p className="text-blue-800">Connecting to GitHub...</p>
        </div>
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

      {status?.connected ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {status.github_avatar && (
                <img
                  src={status.github_avatar}
                  alt={status.github_username}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="text-green-800 font-medium">
                  Connected to GitHub
                </p>
                <p className="text-green-600 text-sm">
                  @{status.github_username}
                  {status.github_name && ` (${status.github_name})`}
                </p>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-800 font-medium">
                Connect your GitHub account
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Link your GitHub account to connect repositories to your team
              </p>
            </div>
            <button
              onClick={handleConnect}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span>Connect GitHub</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

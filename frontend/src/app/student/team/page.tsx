'use client';

import { useState, useEffect } from 'react';
import { 
  getMyTeam, 
  createTeam, 
  inviteMember, 
  joinTeam, 
  removeMember, 
  updateTeam,
  getTeams,
  type TeamDetail,
  type Team
} from '@/lib/api/teams';
import GitHubConnect from '@/components/github/GitHubConnect';
import RepositorySelector from '@/components/github/RepositorySelector';

export default function TeamPage() {
  const [myTeam, setMyTeam] = useState<TeamDetail | null>(null);
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showRepositoryForm, setShowRepositoryForm] = useState(false);
  
  // Form states
  const [teamName, setTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get user's team
      try {
        const team = await getMyTeam();
        setMyTeam(team);
        setRepositoryUrl(team.repositoryUrl || '');
      } catch (err: any) {
        // User doesn't have a team yet
        if (err.message.includes('not a member')) {
          setMyTeam(null);
          // Load available teams to join
          const teams = await getTeams();
          setAvailableTeams(teams);
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error loading team data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      
      // Get user's semester ID from localStorage or context
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('User not found. Please log in again.');
      }
      const user = JSON.parse(userStr);
      
      if (!user.semester_id) {
        throw new Error('You are not enrolled in any semester');
      }

      const team = await createTeam({
        name: teamName,
        semesterId: user.semester_id
      });
      
      setMyTeam(team);
      setShowCreateForm(false);
      setTeamName('');
    } catch (err: any) {
      setError(err.message || 'Error creating team');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myTeam || !inviteEmail.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      
      const result = await inviteMember(myTeam.id, { email: inviteEmail });
      
      if (result.success) {
        alert(result.message);
        setShowInviteForm(false);
        setInviteEmail('');
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Error inviting member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinTeam = async (teamId: number) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const team = await joinTeam(teamId);
      setMyTeam(team);
      setAvailableTeams([]);
    } catch (err: any) {
      setError(err.message || 'Error joining team');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (userId: number, userName: string) => {
    if (!myTeam) return;
    
    if (!confirm(`Are you sure you want to remove ${userName} from the team?`)) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      await removeMember(myTeam.id, userId);
      await loadTeamData(); // Reload team data
    } catch (err: any) {
      setError(err.message || 'Error removing member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRepository = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myTeam) return;

    try {
      setSubmitting(true);
      setError(null);
      
      const updatedTeam = await updateTeam(myTeam.id, { repositoryUrl });
      setMyTeam(updatedTeam);
      setShowRepositoryForm(false);
      alert('Repository URL updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Error updating repository');
    } finally {
      setSubmitting(false);
    }
  };

  const isLeader = myTeam && myTeam.leaderId === JSON.parse(localStorage.getItem('user') || '{}').id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading team information...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Team Management</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {myTeam ? (
          <div className="space-y-6">
            {/* Team Info Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{myTeam.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {isLeader ? 'You are the team leader' : 'Team member'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {myTeam.memberCount ?? 0} / 4 members
                </span>
              </div>

              {/* Repository Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">GitHub Integration</h3>
                
                {/* GitHub Connection */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Connect GitHub Account</h4>
                  <GitHubConnect 
                    onConnect={() => loadTeamData()}
                    onDisconnect={() => loadTeamData()}
                  />
                </div>
                
                {/* Repository Linking */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Team Repository</h4>
                  <RepositorySelector
                    teamId={myTeam.id}
                    isLeader={!!isLeader}
                    onLink={() => loadTeamData()}
                    onUnlink={() => loadTeamData()}
                  />
                </div>
              </div>
            </div>

            {/* Team Members Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Team Members</h3>
                {isLeader && (myTeam.memberCount ?? 0) < 4 && (
                  <button
                    onClick={() => setShowInviteForm(!showInviteForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Invite Member
                  </button>
                )}
              </div>

              {showInviteForm && isLeader && (
                <form onSubmit={handleInviteMember} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Email (@correo.itm.edu.co)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="student@correo.itm.edu.co"
                      pattern="^[a-zA-Z0-9._%+-]+@correo\.itm\.edu\.co$"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? 'Inviting...' : 'Send Invite'}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {myTeam.members.map((member) => (
                  <div 
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{member.fullName}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      {member.userId === myTeam.leaderId && (
                        <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Leader
                        </span>
                      )}
                    </div>
                    {isLeader && member.userId !== myTeam.leaderId && (
                      <button
                        onClick={() => handleRemoveMember(member.userId, member.fullName)}
                        disabled={submitting}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {(myTeam.memberCount ?? 0) < 2 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                  ⚠️ Teams must have at least 2 members to submit projects
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Create Team Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create a Team</h2>
              <p className="text-gray-600 mb-4">
                You are not part of any team yet. Create a new team or join an existing one.
              </p>
              
              {showCreateForm ? (
                <form onSubmit={handleCreateTeam} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter team name"
                      minLength={3}
                      maxLength={100}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? 'Creating...' : 'Create Team'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create New Team
                </button>
              )}
            </div>

            {/* Available Teams Card */}
            {availableTeams.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Teams</h2>
                <p className="text-gray-600 mb-4">
                  Join an existing team in your semester
                </p>
                <div className="space-y-3">
                  {availableTeams.map((team) => (
                    <div 
                      key={team.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{team.name}</p>
                        <p className="text-sm text-gray-500">
                          {team.memberCount ?? 0} / 4 members
                        </p>
                      </div>
                      {(team.memberCount ?? 0) < 4 ? (
                        <button
                          onClick={() => handleJoinTeam(team.id)}
                          disabled={submitting}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          {submitting ? 'Joining...' : 'Join Team'}
                        </button>
                      ) : (
                        <span className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg">
                          Full
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

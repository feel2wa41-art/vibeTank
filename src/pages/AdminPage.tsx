import { useState, useRef } from 'react';
import { useData, type Goal } from '../context/DataContext';
import type { Project } from '../data/projects';

type TabType = 'profile' | 'projects' | 'goals' | 'scripts' | 'backup' | 'guide' | 'settings';

const CUSTOM_PASSWORD_KEY = 'vibetank_admin_password';

export default function AdminPage({ onBack }: { onBack: () => void }) {
  const {
    projects, setProjects,
    profileInfo, setProfileInfo,
    goals2026, setGoals2026,
    saveData, exportData, importData, resetToDefault,
    isLoading, isSaving, useSupabase, lastSaved
  } = useData();

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = async () => {
    try {
      await saveData();
      showMessage('success', useSupabase ? 'Saved to cloud!' : 'Saved to local storage!');
    } catch {
      showMessage('error', 'Failed to save data');
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibetank-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMessage('success', 'Data exported!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (importData(content)) {
        showMessage('success', 'Data imported successfully!');
      } else {
        showMessage('error', 'Failed to import data');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (confirm('Are you sure? This will reset all data to defaults.')) {
      await resetToDefault();
      showMessage('success', 'Data reset to defaults');
    }
  };

  // Profile handlers
  const updateProfile = (key: keyof typeof profileInfo, value: string | number) => {
    setProfileInfo({ ...profileInfo, [key]: value });
  };

  // Project handlers - updateProject removed, now using direct save in button handler

  const deleteProject = (id: number) => {
    if (confirm('Delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const addProject = () => {
    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    const newProject: Project = {
      id: newId,
      name: 'New Project',
      period: 'TBD',
      timeline: 'TBD',
      description: 'Project description',
      tags: ['New'],
      icon: '🆕',
      color: '#7cb342',
      startMonth: 0,
      endMonth: 0
    };
    setProjects([...projects, newProject]);
    setEditingProject(newProject);
  };

  // Goal handlers
  const updateGoal = (id: number, updates: Partial<Goal>) => {
    setGoals2026(goals2026.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = () => {
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'tank2025';
    const storedPassword = localStorage.getItem(CUSTOM_PASSWORD_KEY);
    const activePassword = storedPassword || envPassword;

    if (currentPassword !== activePassword) {
      showMessage('error', 'Current password is incorrect');
      return;
    }

    if (newPassword.length < 4) {
      showMessage('error', 'New password must be at least 4 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage('error', 'Passwords do not match');
      return;
    }

    localStorage.setItem(CUSTOM_PASSWORD_KEY, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showMessage('success', 'Password changed successfully!');
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'goals', label: '2026 Goals', icon: '🎯' },
    { id: 'scripts', label: 'Scripts', icon: '📜' },
    { id: 'backup', label: 'Backup', icon: '💾' },
    { id: 'guide', label: 'Guide', icon: '📚' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-military-950 text-white">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-military-950/90 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">⏳</div>
            <p className="mono-font text-military-500">Loading data...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-military-900/95 backdrop-blur border-b border-military-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="px-3 py-1 bg-military-800 border border-military-600 rounded hover:bg-military-700 transition mono-font text-sm"
            >
              ← Back
            </button>
            <h1 className="military-font text-xl text-military-500">ADMIN PANEL</h1>
            {/* Storage Status Indicator */}
            <div className={`px-2 py-1 rounded text-xs mono-font ${
              useSupabase ? 'bg-green-600/30 text-green-400 border border-green-600' : 'bg-yellow-600/30 text-yellow-400 border border-yellow-600'
            }`}>
              {useSupabase ? '☁️ Cloud' : '💾 Local'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastSaved && (
              <span className="mono-font text-xs text-military-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 rounded font-bold transition ${
                isSaving
                  ? 'bg-military-600 text-military-400 cursor-not-allowed'
                  : 'bg-military-500 text-military-950 hover:bg-military-400'
              }`}
            >
              {isSaving ? '⏳ Saving...' : '💾 Save All'}
            </button>
          </div>
        </div>
      </header>

      {/* Message Toast */}
      {message && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg font-bold ${
          message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {message.text}
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg mono-font text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-military-500 text-military-950'
                  : 'bg-military-800 border border-military-700 hover:bg-military-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-military-900 border border-military-700 rounded-xl p-6">
            <h2 className="military-font text-2xl text-military-500 mb-6">Profile Settings</h2>
            <div className="grid gap-4">
              <div>
                <label className="block mono-font text-sm text-military-400 mb-1">Name</label>
                <input
                  type="text"
                  value={profileInfo.name}
                  onChange={e => updateProfile('name', e.target.value)}
                  className="w-full px-3 py-2 bg-military-800 border border-military-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block mono-font text-sm text-military-400 mb-1">Role</label>
                <input
                  type="text"
                  value={profileInfo.role}
                  onChange={e => updateProfile('role', e.target.value)}
                  className="w-full px-3 py-2 bg-military-800 border border-military-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block mono-font text-sm text-military-400 mb-1">Year</label>
                <input
                  type="number"
                  value={profileInfo.year}
                  onChange={e => updateProfile('year', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-military-800 border border-military-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block mono-font text-sm text-military-400 mb-1">Tagline</label>
                <input
                  type="text"
                  value={profileInfo.tagline}
                  onChange={e => updateProfile('tagline', e.target.value)}
                  className="w-full px-3 py-2 bg-military-800 border border-military-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block mono-font text-sm text-military-400 mb-1">Footer</label>
                <input
                  type="text"
                  value={profileInfo.footer}
                  onChange={e => updateProfile('footer', e.target.value)}
                  className="w-full px-3 py-2 bg-military-800 border border-military-600 rounded text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="military-font text-2xl text-military-500">Projects</h2>
              <button
                onClick={addProject}
                className="px-4 py-2 bg-military-500 text-military-950 rounded font-bold hover:bg-military-400 transition"
              >
                + Add Project
              </button>
            </div>

            {projects.map(project => (
              <div key={project.id} className="bg-military-900 border border-military-700 rounded-xl p-4">
                {editingProject?.id === project.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mono-font text-xs text-military-400 mb-1">Name</label>
                        <input
                          type="text"
                          value={editingProject.name}
                          onChange={e => setEditingProject({ ...editingProject, name: e.target.value })}
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block mono-font text-xs text-military-400 mb-1">Icon (Emoji)</label>
                        <input
                          type="text"
                          value={editingProject.icon}
                          onChange={e => setEditingProject({ ...editingProject, icon: e.target.value })}
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block mono-font text-xs text-military-400 mb-1">Logo Image Path (optional)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingProject.iconImage || ''}
                            onChange={e => setEditingProject({ ...editingProject, iconImage: e.target.value || undefined })}
                            placeholder="/logos/project-logo.png"
                            className="flex-1 px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                          />
                          {editingProject.iconImage && (
                            <img
                              src={editingProject.iconImage}
                              alt="Preview"
                              className="w-8 h-8 object-contain bg-military-700 rounded"
                              onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                          )}
                        </div>
                        <p className="text-xs text-military-500 mt-1">
                          Put image files in public/logos/ folder. Path example: /logos/my-logo.png
                        </p>
                      </div>
                      <div className="col-span-2">
                        <label className="block mono-font text-xs text-military-400 mb-1">AI Generated Image Path (optional)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingProject.aiImage || ''}
                            onChange={e => setEditingProject({ ...editingProject, aiImage: e.target.value || undefined })}
                            placeholder="/ai-images/project-ai.png"
                            className="flex-1 px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                          />
                          {editingProject.aiImage && (
                            <img
                              src={editingProject.aiImage}
                              alt="AI Preview"
                              className="w-8 h-8 object-contain bg-military-700 rounded"
                              onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                          )}
                        </div>
                        <p className="text-xs text-military-500 mt-1">
                          AI TANK button will appear when this is set. Path example: /ai-images/my-ai-image.png
                        </p>
                      </div>
                      <div>
                        <label className="block mono-font text-xs text-military-400 mb-1">Period (Short)</label>
                        <input
                          type="text"
                          value={editingProject.period}
                          onChange={e => setEditingProject({ ...editingProject, period: e.target.value })}
                          placeholder="e.g. JAN — JUL"
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block mono-font text-xs text-military-400 mb-1">Timeline (Full)</label>
                        <input
                          type="text"
                          value={editingProject.timeline}
                          onChange={e => setEditingProject({ ...editingProject, timeline: e.target.value })}
                          placeholder="e.g. JAN 2025 — JUL 2025"
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block mono-font text-xs text-military-400 mb-1">Color</label>
                        <input
                          type="color"
                          value={editingProject.color}
                          onChange={e => setEditingProject({ ...editingProject, color: e.target.value })}
                          className="w-full h-8 bg-military-800 border border-military-600 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block mono-font text-xs text-military-400 mb-1">Start Month (0-11)</label>
                        <input
                          type="number"
                          min="0"
                          max="11"
                          value={editingProject.startMonth}
                          onChange={e => setEditingProject({ ...editingProject, startMonth: parseInt(e.target.value) })}
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block mono-font text-xs text-military-400 mb-1">End Month (0-11)</label>
                        <input
                          type="number"
                          min="0"
                          max="11"
                          value={editingProject.endMonth}
                          onChange={e => setEditingProject({ ...editingProject, endMonth: parseInt(e.target.value) })}
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mono-font text-xs text-military-400 mb-1">Description</label>
                      <textarea
                        value={editingProject.description}
                        onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                        rows={3}
                        className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block mono-font text-xs text-military-400 mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={editingProject.tags.join(', ')}
                        onChange={e => setEditingProject({ ...editingProject, tags: e.target.value.split(',').map(t => t.trim()) })}
                        className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                      />
                    </div>

                    {/* Presentation Script */}
                    <div className="border-t border-amber-500/30 pt-4 mt-4">
                      <label className="mono-font text-xs text-amber-400 mb-1 flex items-center gap-2">
                        <span>📜</span> Presentation Script
                      </label>
                      <textarea
                        value={editingProject.script || ''}
                        onChange={e => setEditingProject({ ...editingProject, script: e.target.value || undefined })}
                        rows={8}
                        placeholder="Enter your presentation script for this project..."
                        className="w-full px-3 py-2 bg-military-800 border border-amber-500/30 rounded-lg text-white text-sm font-mono leading-relaxed"
                      />
                      <p className="text-xs text-military-500 mt-1">
                        This script will appear when you click the 📜 SCRIPT button on the project page.
                      </p>
                    </div>

                    {/* Project Details Section */}
                    <div className="border-t border-military-700 pt-4 mt-4">
                      <h4 className="font-bold text-military-400 mb-3">📋 Project Details</h4>

                      {/* Overview */}
                      <div className="mb-4">
                        <label className="block mono-font text-xs text-military-400 mb-1">Overview</label>
                        <textarea
                          value={editingProject.details?.overview || ''}
                          onChange={e => setEditingProject({
                            ...editingProject,
                            details: { ...editingProject.details, overview: e.target.value }
                          })}
                          rows={3}
                          placeholder="Project overview and context..."
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>

                      {/* Responsibilities */}
                      <div className="mb-4">
                        <label className="block mono-font text-xs text-military-400 mb-1">Responsibilities</label>
                        <div className="space-y-2">
                          {(editingProject.details?.responsibilities || []).map((resp, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={resp}
                                onChange={e => {
                                  const newResponsibilities = [...(editingProject.details?.responsibilities || [])];
                                  newResponsibilities[idx] = e.target.value;
                                  setEditingProject({
                                    ...editingProject,
                                    details: { ...editingProject.details, responsibilities: newResponsibilities }
                                  });
                                }}
                                placeholder="Add responsibility..."
                                className="flex-1 px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                              />
                              <button
                                onClick={() => {
                                  const newResponsibilities = (editingProject.details?.responsibilities || []).filter((_, i) => i !== idx);
                                  setEditingProject({
                                    ...editingProject,
                                    details: { ...editingProject.details, responsibilities: newResponsibilities }
                                  });
                                }}
                                className="px-2 py-1 bg-red-600/50 rounded text-sm hover:bg-red-500"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newResponsibilities = [...(editingProject.details?.responsibilities || []), ''];
                              setEditingProject({
                                ...editingProject,
                                details: { ...editingProject.details, responsibilities: newResponsibilities }
                              });
                            }}
                            className="px-3 py-1 bg-military-700 rounded text-sm hover:bg-military-600"
                          >
                            + Add Responsibility
                          </button>
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="mb-4">
                        <label className="block mono-font text-xs text-military-400 mb-1">Technologies</label>
                        <div className="space-y-2">
                          {(editingProject.details?.technologies || []).map((tech, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={tech}
                                onChange={e => {
                                  const newTechnologies = [...(editingProject.details?.technologies || [])];
                                  newTechnologies[idx] = e.target.value;
                                  setEditingProject({
                                    ...editingProject,
                                    details: { ...editingProject.details, technologies: newTechnologies }
                                  });
                                }}
                                placeholder="Add technology..."
                                className="flex-1 px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                              />
                              <button
                                onClick={() => {
                                  const newTechnologies = (editingProject.details?.technologies || []).filter((_, i) => i !== idx);
                                  setEditingProject({
                                    ...editingProject,
                                    details: { ...editingProject.details, technologies: newTechnologies }
                                  });
                                }}
                                className="px-2 py-1 bg-red-600/50 rounded text-sm hover:bg-red-500"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newTechnologies = [...(editingProject.details?.technologies || []), ''];
                              setEditingProject({
                                ...editingProject,
                                details: { ...editingProject.details, technologies: newTechnologies }
                              });
                            }}
                            className="px-3 py-1 bg-military-700 rounded text-sm hover:bg-military-600"
                          >
                            + Add Technology
                          </button>
                        </div>
                      </div>

                      {/* Achievements */}
                      <div className="mb-4">
                        <label className="block mono-font text-xs text-military-400 mb-1">Achievements</label>
                        <div className="space-y-2">
                          {(editingProject.details?.achievements || []).map((achievement, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={achievement}
                                onChange={e => {
                                  const newAchievements = [...(editingProject.details?.achievements || [])];
                                  newAchievements[idx] = e.target.value;
                                  setEditingProject({
                                    ...editingProject,
                                    details: { ...editingProject.details, achievements: newAchievements }
                                  });
                                }}
                                placeholder="Add achievement..."
                                className="flex-1 px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                              />
                              <button
                                onClick={() => {
                                  const newAchievements = (editingProject.details?.achievements || []).filter((_, i) => i !== idx);
                                  setEditingProject({
                                    ...editingProject,
                                    details: { ...editingProject.details, achievements: newAchievements }
                                  });
                                }}
                                className="px-2 py-1 bg-red-600/50 rounded text-sm hover:bg-red-500"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newAchievements = [...(editingProject.details?.achievements || []), ''];
                              setEditingProject({
                                ...editingProject,
                                details: { ...editingProject.details, achievements: newAchievements }
                              });
                            }}
                            className="px-3 py-1 bg-military-700 rounded text-sm hover:bg-military-600"
                          >
                            + Add Achievement
                          </button>
                        </div>
                      </div>

                      {/* Challenges */}
                      <div className="mb-4">
                        <label className="block mono-font text-xs text-military-400 mb-1">Challenges</label>
                        <div className="space-y-2">
                          {(editingProject.details?.challenges || []).map((challenge, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={challenge}
                                onChange={e => {
                                  const newChallenges = [...(editingProject.details?.challenges || [])];
                                  newChallenges[idx] = e.target.value;
                                  setEditingProject({
                                    ...editingProject,
                                    details: { ...editingProject.details, challenges: newChallenges }
                                  });
                                }}
                                placeholder="Add challenge..."
                                className="flex-1 px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                              />
                              <button
                                onClick={() => {
                                  const newChallenges = (editingProject.details?.challenges || []).filter((_, i) => i !== idx);
                                  setEditingProject({
                                    ...editingProject,
                                    details: { ...editingProject.details, challenges: newChallenges }
                                  });
                                }}
                                className="px-2 py-1 bg-red-600/50 rounded text-sm hover:bg-red-500"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newChallenges = [...(editingProject.details?.challenges || []), ''];
                              setEditingProject({
                                ...editingProject,
                                details: { ...editingProject.details, challenges: newChallenges }
                              });
                            }}
                            className="px-3 py-1 bg-military-700 rounded text-sm hover:bg-military-600"
                          >
                            + Add Challenge
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Project Outputs Section */}
                    <div className="border-t border-military-700 pt-4 mt-4">
                      <h4 className="font-bold text-military-400 mb-3">🔗 Project Outputs</h4>

                      {/* Admin Portal */}
                      <div className="mb-3">
                        <label className="block mono-font text-xs text-military-400 mb-1">Admin Portal URL</label>
                        <input
                          type="url"
                          value={!Array.isArray(editingProject.outputs) && editingProject.outputs?.adminPortal || ''}
                          onChange={e => setEditingProject({
                            ...editingProject,
                            outputs: { ...(Array.isArray(editingProject.outputs) ? {} : editingProject.outputs), adminPortal: e.target.value }
                          })}
                          placeholder="https://admin.example.com"
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>

                      {/* Web App */}
                      <div className="mb-3">
                        <label className="block mono-font text-xs text-military-400 mb-1">Web App URL</label>
                        <input
                          type="url"
                          value={!Array.isArray(editingProject.outputs) && editingProject.outputs?.webApp || ''}
                          onChange={e => setEditingProject({
                            ...editingProject,
                            outputs: { ...(Array.isArray(editingProject.outputs) ? {} : editingProject.outputs), webApp: e.target.value }
                          })}
                          placeholder="https://app.example.com"
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>

                      {/* iOS App */}
                      <div className="mb-3">
                        <label className="block mono-font text-xs text-military-400 mb-1">iOS App URL</label>
                        <input
                          type="url"
                          value={!Array.isArray(editingProject.outputs) && editingProject.outputs?.ios || ''}
                          onChange={e => setEditingProject({
                            ...editingProject,
                            outputs: { ...(Array.isArray(editingProject.outputs) ? {} : editingProject.outputs), ios: e.target.value }
                          })}
                          placeholder="https://apps.apple.com/..."
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>

                      {/* Android App */}
                      <div className="mb-3">
                        <label className="block mono-font text-xs text-military-400 mb-1">Android App URL</label>
                        <input
                          type="url"
                          value={!Array.isArray(editingProject.outputs) && editingProject.outputs?.android || ''}
                          onChange={e => setEditingProject({
                            ...editingProject,
                            outputs: { ...(Array.isArray(editingProject.outputs) ? {} : editingProject.outputs), android: e.target.value }
                          })}
                          placeholder="https://play.google.com/..."
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          // Directly save to Supabase/localStorage without going through context closure
                          const updatedProjects = projects.map(p =>
                            p.id === project.id ? { ...p, ...editingProject } : p
                          );

                          // Update local state
                          setProjects(updatedProjects);
                          setEditingProject(null);

                          // Immediately save with the new data
                          const dataToSave = {
                            projects: updatedProjects,
                            profileInfo,
                            goals2026
                          };

                          console.log('DIRECT SAVE - projects[0].description:', dataToSave.projects[0]?.description?.substring(0, 50));

                          // Save directly using Supabase
                          if (useSupabase) {
                            const { supabase } = await import('../lib/supabase');
                            if (supabase) {
                              await supabase.from('site_data').delete().eq('id', 'main');
                              await supabase.from('site_data').insert({
                                id: 'main',
                                content: dataToSave,
                                updated_at: new Date().toISOString()
                              });
                              showMessage('success', 'Project saved to cloud!');
                            }
                          }
                          localStorage.setItem('vibetank_data', JSON.stringify(dataToSave));
                        }}
                        className="px-3 py-1 bg-green-600 rounded text-sm font-bold hover:bg-green-500"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingProject(null)}
                        className="px-3 py-1 bg-military-700 rounded text-sm hover:bg-military-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{project.icon}</span>
                      <div>
                        <h3 className="font-bold" style={{ color: project.color }}>{project.name}</h3>
                        <p className="mono-font text-xs text-military-400">{project.period}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProject(project)}
                        className="px-3 py-1 bg-military-700 rounded text-sm hover:bg-military-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="px-3 py-1 bg-red-600/50 rounded text-sm hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-4">
            <h2 className="military-font text-2xl text-military-500">2026 Goals</h2>

            {goals2026.map(goal => (
              <div key={goal.id} className="bg-military-900 border border-military-700 rounded-xl p-4">
                {editingGoal?.id === goal.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mono-font text-xs text-military-400 mb-1">Title</label>
                        <input
                          type="text"
                          value={editingGoal.title}
                          onChange={e => setEditingGoal({ ...editingGoal, title: e.target.value })}
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block mono-font text-xs text-military-400 mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={editingGoal.subtitle}
                          onChange={e => setEditingGoal({ ...editingGoal, subtitle: e.target.value })}
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block mono-font text-xs text-military-400 mb-1">Icon</label>
                        <input
                          type="text"
                          value={editingGoal.icon}
                          onChange={e => setEditingGoal({ ...editingGoal, icon: e.target.value })}
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block mono-font text-xs text-military-400 mb-1">Color</label>
                        <input
                          type="color"
                          value={editingGoal.color}
                          onChange={e => setEditingGoal({ ...editingGoal, color: e.target.value })}
                          className="w-full h-8 bg-military-800 border border-military-600 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mono-font text-xs text-military-400 mb-1">Description</label>
                      <textarea
                        value={editingGoal.description}
                        onChange={e => setEditingGoal({ ...editingGoal, description: e.target.value })}
                        rows={2}
                        className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block mono-font text-xs text-military-400 mb-1">Features (comma separated)</label>
                      <input
                        type="text"
                        value={editingGoal.features.join(', ')}
                        onChange={e => setEditingGoal({ ...editingGoal, features: e.target.value.split(',').map(t => t.trim()) })}
                        className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          updateGoal(goal.id, editingGoal);
                          setEditingGoal(null);
                        }}
                        className="px-3 py-1 bg-green-600 rounded text-sm font-bold hover:bg-green-500"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingGoal(null)}
                        className="px-3 py-1 bg-military-700 rounded text-sm hover:bg-military-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <h3 className="font-bold" style={{ color: goal.color }}>{goal.title}</h3>
                        <p className="mono-font text-xs text-military-400">{goal.subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingGoal(goal)}
                      className="px-3 py-1 bg-military-700 rounded text-sm hover:bg-military-600"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Scripts Tab - Presentation Scripts Viewer */}
        {activeTab === 'scripts' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center">
                    <span className="text-3xl">📜</span>
                  </div>
                  <div>
                    <h2 className="military-font text-2xl text-amber-400">PRESENTATION SCRIPTS</h2>
                    <p className="mono-font text-sm text-amber-500/70">Review all scripts before your presentation</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mono-font text-xs text-military-500">Total Projects</div>
                  <div className="military-font text-3xl text-amber-400">{projects.length}</div>
                </div>
              </div>
            </div>

            {/* Scripts List */}
            <div className="space-y-6">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="bg-military-900 border border-military-700 rounded-xl overflow-hidden"
                >
                  {/* Project Header */}
                  <div
                    className="px-6 py-4 border-b border-military-700"
                    style={{ background: `linear-gradient(90deg, ${project.color}20, transparent)` }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${project.color}30`, border: `2px solid ${project.color}50` }}
                      >
                        {project.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="mono-font text-xs text-military-500">MISSION {String(index + 1).padStart(2, '0')}</span>
                          <span className="mono-font text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${project.color}30`, color: project.color }}>
                            {project.period}
                          </span>
                        </div>
                        <h3 className="military-font text-xl" style={{ color: project.color }}>{project.name}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Script Content */}
                  <div className="p-6">
                    {project.script ? (
                      <div className="relative">
                        {/* Left accent bar */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />

                        {/* Script text */}
                        <div className="pl-6 space-y-4">
                          {project.script.split('\n\n').map((paragraph, idx) => (
                            <div key={idx}>
                              {paragraph.includes('•') ? (
                                <div className="space-y-1">
                                  {paragraph.split('\n').map((line, lineIdx) => (
                                    <p
                                      key={lineIdx}
                                      className={`text-military-200 leading-relaxed ${
                                        line.startsWith('•') ? 'pl-4' : ''
                                      }`}
                                      style={{ color: line.startsWith('•') ? project.color : undefined }}
                                    >
                                      {line}
                                    </p>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-military-200 leading-relaxed text-lg">
                                  {paragraph}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-military-500">
                        <span className="text-4xl mb-2 block">📝</span>
                        <p className="mono-font text-sm">No script added yet</p>
                        <p className="text-xs mt-1">Edit this project to add a presentation script</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-3 bg-military-800/50 border-t border-military-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${project.script ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span className="mono-font text-xs text-military-500">
                        {project.script ? 'Script Ready' : 'Script Missing'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setEditingProject(project);
                        setActiveTab('projects');
                      }}
                      className="mono-font text-xs text-amber-400 hover:text-amber-300 transition"
                    >
                      Edit Script →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Intro & Closing Scripts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Intro Script */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-military-900 border border-cyan-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🎬</span>
                  <h3 className="military-font text-lg text-cyan-400">INTRO SCRIPT</h3>
                </div>
                <div className="bg-military-800/50 rounded-lg p-4 border border-cyan-500/20">
                  <p className="text-military-200 leading-relaxed">
                    "Welcome to TANK Portfolio 2025.
                  </p>
                  <p className="text-military-200 leading-relaxed mt-2">
                    I'm a Project Manager at GDC, and today I'll walk you through my key projects and achievements this year.
                  </p>
                  <p className="text-military-200 leading-relaxed mt-2">
                    Let's begin the mission."
                  </p>
                </div>
              </div>

              {/* Closing Script */}
              <div className="bg-gradient-to-br from-green-900/30 to-military-900 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🎯</span>
                  <h3 className="military-font text-lg text-green-400">CLOSING SCRIPT</h3>
                </div>
                <div className="bg-military-800/50 rounded-lg p-4 border border-green-500/20">
                  <p className="text-military-200 leading-relaxed">
                    "Thank you for joining me on this mission briefing.
                  </p>
                  <p className="text-military-200 leading-relaxed mt-2">
                    2025 was a year of innovation, AI integration, and successful delivery.
                  </p>
                  <p className="text-military-200 leading-relaxed mt-2">
                    I'm TANK, and all systems are operational. Thank you."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backup Tab */}
        {activeTab === 'backup' && (
          <div className="bg-military-900 border border-military-700 rounded-xl p-6 space-y-6">
            <h2 className="military-font text-2xl text-military-500">Backup & Restore</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-military-800 border border-military-600 rounded-lg p-4">
                <h3 className="font-bold text-military-400 mb-2">📤 Export Data</h3>
                <p className="text-sm text-military-500 mb-4">Download all data as JSON file</p>
                <button
                  onClick={handleExport}
                  className="w-full px-4 py-2 bg-blue-600 rounded font-bold hover:bg-blue-500 transition"
                >
                  Export JSON
                </button>
              </div>

              <div className="bg-military-800 border border-military-600 rounded-lg p-4">
                <h3 className="font-bold text-military-400 mb-2">📥 Import Data</h3>
                <p className="text-sm text-military-500 mb-4">Restore from JSON backup file</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 bg-green-600 rounded font-bold hover:bg-green-500 transition"
                >
                  Import JSON
                </button>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <h3 className="font-bold text-red-400 mb-2">⚠️ Reset to Default</h3>
              <p className="text-sm text-military-500 mb-4">This will delete all custom data</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 rounded font-bold hover:bg-red-500 transition"
              >
                Reset All Data
              </button>
            </div>

            <div className={`border rounded-lg p-4 ${
              useSupabase
                ? 'bg-green-900/20 border-green-700'
                : 'bg-yellow-900/20 border-yellow-700'
            }`}>
              <h3 className="font-bold mb-2" style={{ color: useSupabase ? '#4ade80' : '#facc15' }}>
                {useSupabase ? '☁️ Cloud Storage Active' : '💾 Local Storage Only'}
              </h3>
              {useSupabase ? (
                <div className="text-sm text-military-400 space-y-1">
                  <p>✅ Connected to Supabase cloud database</p>
                  <p>✅ Changes sync across all devices</p>
                  <p>✅ Data persists for all visitors</p>
                </div>
              ) : (
                <div className="text-sm text-military-400 space-y-1">
                  <p>⚠️ Using browser localStorage only</p>
                  <p>⚠️ Data only persists in this browser</p>
                  <p className="text-yellow-400 mt-2">
                    To enable cloud storage, add Supabase credentials to .env file
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guide Tab */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <h2 className="military-font text-2xl text-military-500">Deployment & Maintenance Guide</h2>

            {/* Architecture Overview */}
            <div className="bg-military-900 border border-military-700 rounded-xl p-6">
              <h3 className="font-bold text-lg text-cyan-400 mb-4">🏗️ Current Architecture</h3>
              <div className="bg-military-800 rounded-lg p-4 mono-font text-sm">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="bg-military-700/50 rounded-lg p-3">
                    <div className="text-2xl mb-2">⚛️</div>
                    <div className="text-military-300 font-bold">Frontend</div>
                    <div className="text-military-400 text-xs">React + Vite</div>
                    <div className="text-cyan-400 text-xs mt-1">Vercel Hosting</div>
                  </div>
                  <div className="bg-military-700/50 rounded-lg p-3">
                    <div className="text-2xl mb-2">🗄️</div>
                    <div className="text-military-300 font-bold">Database</div>
                    <div className="text-military-400 text-xs">PostgreSQL</div>
                    <div className="text-green-400 text-xs mt-1">Supabase Cloud</div>
                  </div>
                  <div className="bg-military-700/50 rounded-lg p-3">
                    <div className="text-2xl mb-2">🌐</div>
                    <div className="text-military-300 font-bold">Domain</div>
                    <div className="text-military-400 text-xs">vibe-tank.com</div>
                    <div className="text-yellow-400 text-xs mt-1">AWS Route 53</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-military-900 border border-military-700 rounded-xl p-6">
              <h3 className="font-bold text-lg text-cyan-400 mb-4">📊 AWS Amplify vs Vercel + Supabase</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-military-600">
                      <th className="text-left py-2 px-3 text-military-400">항목</th>
                      <th className="text-center py-2 px-3 text-orange-400">AWS Amplify (이전)</th>
                      <th className="text-center py-2 px-3 text-green-400">Vercel + Supabase (현재)</th>
                    </tr>
                  </thead>
                  <tbody className="mono-font">
                    <tr className="border-b border-military-700">
                      <td className="py-2 px-3 text-military-300">호스팅</td>
                      <td className="py-2 px-3 text-center text-military-400">AWS Amplify</td>
                      <td className="py-2 px-3 text-center text-military-400">Vercel</td>
                    </tr>
                    <tr className="border-b border-military-700">
                      <td className="py-2 px-3 text-military-300">데이터베이스</td>
                      <td className="py-2 px-3 text-center text-military-400">없음 (Static)</td>
                      <td className="py-2 px-3 text-center text-military-400">Supabase (PostgreSQL)</td>
                    </tr>
                    <tr className="border-b border-military-700">
                      <td className="py-2 px-3 text-military-300">콘텐츠 수정</td>
                      <td className="py-2 px-3 text-center text-red-400">❌ 코드 수정 필요</td>
                      <td className="py-2 px-3 text-center text-green-400">✅ Admin 패널</td>
                    </tr>
                    <tr className="border-b border-military-700">
                      <td className="py-2 px-3 text-military-300">배포 방식</td>
                      <td className="py-2 px-3 text-center text-military-400">Git Push → Build</td>
                      <td className="py-2 px-3 text-center text-military-400">Git Push → Auto Deploy</td>
                    </tr>
                    <tr className="border-b border-military-700">
                      <td className="py-2 px-3 text-military-300">CDN</td>
                      <td className="py-2 px-3 text-center text-military-400">CloudFront</td>
                      <td className="py-2 px-3 text-center text-military-400">Vercel Edge Network</td>
                    </tr>
                    <tr className="border-b border-military-700">
                      <td className="py-2 px-3 text-military-300">SSL 인증서</td>
                      <td className="py-2 px-3 text-center text-military-400">자동 (ACM)</td>
                      <td className="py-2 px-3 text-center text-military-400">자동 (Let's Encrypt)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-military-300">관리 복잡도</td>
                      <td className="py-2 px-3 text-center text-yellow-400">⚠️ 복잡함</td>
                      <td className="py-2 px-3 text-center text-green-400">✅ 간단함</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-military-900 border border-military-700 rounded-xl p-6">
              <h3 className="font-bold text-lg text-cyan-400 mb-4">💰 가격 정책 비교</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
                  <h4 className="font-bold text-orange-400 mb-3">AWS Amplify (이전)</h4>
                  <ul className="text-sm text-military-400 space-y-2">
                    <li>• 빌드: $0.01/분</li>
                    <li>• 호스팅: $0.15/GB (전송)</li>
                    <li>• 저장: $0.023/GB/월</li>
                    <li>• CloudFront: 별도 과금</li>
                    <li>• Route 53: $0.50/zone/월</li>
                    <li className="text-orange-400 font-bold pt-2">예상 월비용: $5~15+</li>
                  </ul>
                </div>
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-3">Vercel + Supabase (현재)</h4>
                  <ul className="text-sm text-military-400 space-y-2">
                    <li>• <span className="text-green-400">Vercel Hobby: 무료</span></li>
                    <li>• 100GB 대역폭/월</li>
                    <li>• <span className="text-green-400">Supabase Free: 무료</span></li>
                    <li>• 500MB 데이터베이스</li>
                    <li>• Route 53: $0.50/zone/월</li>
                    <li className="text-green-400 font-bold pt-2">예상 월비용: $0.50 (DNS만)</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 bg-military-800 rounded-lg p-3 text-xs text-military-400">
                <span className="text-yellow-400">💡 Tip:</span> 트래픽이 많아지면 Vercel Pro ($20/월) 또는 Supabase Pro ($25/월) 업그레이드 고려
              </div>
            </div>

            {/* Important URLs */}
            <div className="bg-military-900 border border-military-700 rounded-xl p-6">
              <h3 className="font-bold text-lg text-cyan-400 mb-4">🔗 중요 URL & 대시보드</h3>
              <div className="space-y-3 mono-font text-sm">
                <div className="flex items-center gap-3 bg-military-800 rounded-lg p-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <div className="text-military-300">Production Site</div>
                    <a href="https://vibe-tank.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">https://vibe-tank.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-military-800 rounded-lg p-3">
                  <span className="text-2xl">▲</span>
                  <div>
                    <div className="text-military-300">Vercel Dashboard</div>
                    <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">https://vercel.com/dashboard</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-military-800 rounded-lg p-3">
                  <span className="text-2xl">🗄️</span>
                  <div>
                    <div className="text-military-300">Supabase Dashboard</div>
                    <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">https://supabase.com/dashboard</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-military-800 rounded-lg p-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <div className="text-military-300">GitHub Repository</div>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">github.com/your-repo</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-military-800 rounded-lg p-3">
                  <span className="text-2xl">🛣️</span>
                  <div>
                    <div className="text-military-300">AWS Route 53 (DNS)</div>
                    <a href="https://console.aws.amazon.com/route53" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">console.aws.amazon.com/route53</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Environment Variables */}
            <div className="bg-military-900 border border-military-700 rounded-xl p-6">
              <h3 className="font-bold text-lg text-cyan-400 mb-4">🔐 환경변수 (Vercel Settings)</h3>
              <div className="bg-military-800 rounded-lg p-4 mono-font text-sm space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-military-700">
                  <span className="text-yellow-400">VITE_SUPABASE_URL</span>
                  <span className="text-military-500">https://xxx.supabase.co</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-military-700">
                  <span className="text-yellow-400">VITE_SUPABASE_ANON_KEY</span>
                  <span className="text-military-500">eyJhbGciOiJIUz...</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-yellow-400">VITE_ADMIN_PASSWORD</span>
                  <span className="text-military-500">••••••••</span>
                </div>
              </div>
              <p className="text-xs text-military-500 mt-3">
                Vercel → Project Settings → Environment Variables 에서 관리
              </p>
            </div>

            {/* Maintenance Guide */}
            <div className="bg-military-900 border border-military-700 rounded-xl p-6">
              <h3 className="font-bold text-lg text-cyan-400 mb-4">🔧 유지보수 가이드</h3>
              <div className="space-y-4">
                <div className="bg-military-800 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">✅ 콘텐츠 수정</h4>
                  <ol className="text-sm text-military-400 list-decimal list-inside space-y-1">
                    <li>vibe-tank.com 접속</li>
                    <li>우측 하단 ⚙️ 버튼 클릭</li>
                    <li>비밀번호 입력</li>
                    <li>Profile/Projects/Goals 탭에서 수정</li>
                    <li>💾 Save All 클릭</li>
                  </ol>
                </div>
                <div className="bg-military-800 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-2">🚀 코드 배포</h4>
                  <ol className="text-sm text-military-400 list-decimal list-inside space-y-1">
                    <li>로컬에서 코드 수정</li>
                    <li>git add . && git commit -m "message"</li>
                    <li>git push origin main</li>
                    <li>Vercel이 자동으로 빌드 & 배포</li>
                    <li>1-2분 후 사이트 반영</li>
                  </ol>
                </div>
                <div className="bg-military-800 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-400 mb-2">⚠️ 문제 해결</h4>
                  <ul className="text-sm text-military-400 space-y-1">
                    <li>• 사이트 안 열림 → Vercel Dashboard에서 배포 상태 확인</li>
                    <li>• 데이터 저장 안 됨 → Supabase Dashboard에서 DB 상태 확인</li>
                    <li>• Admin 비밀번호 분실 → Vercel 환경변수에서 변경</li>
                    <li>• DNS 문제 → AWS Route 53에서 레코드 확인</li>
                  </ul>
                </div>
                <div className="bg-military-800 rounded-lg p-4">
                  <h4 className="font-bold text-purple-400 mb-2">📅 정기 점검 (월 1회 권장)</h4>
                  <ul className="text-sm text-military-400 space-y-1">
                    <li>• Vercel: 사용량 확인 (100GB 대역폭 한도)</li>
                    <li>• Supabase: 데이터베이스 용량 확인 (500MB 한도)</li>
                    <li>• 백업: Admin → Backup → Export JSON</li>
                    <li>• 보안: 비밀번호 주기적 변경 권장</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-700/50 rounded-xl p-6">
              <h3 className="font-bold text-lg text-cyan-400 mb-4">⚡ Quick Reference</h3>
              <div className="grid md:grid-cols-2 gap-4 mono-font text-xs">
                <div>
                  <div className="text-military-400 mb-1">Vercel Project:</div>
                  <div className="text-white">vibe-tank</div>
                </div>
                <div>
                  <div className="text-military-400 mb-1">Supabase Project:</div>
                  <div className="text-white">omnxownctwxqxpjkgtcp</div>
                </div>
                <div>
                  <div className="text-military-400 mb-1">Supabase Table:</div>
                  <div className="text-white">site_data (id: 'main')</div>
                </div>
                <div>
                  <div className="text-military-400 mb-1">Domain DNS:</div>
                  <div className="text-white">AWS Route 53</div>
                </div>
                <div>
                  <div className="text-military-400 mb-1">A Record:</div>
                  <div className="text-white">216.198.79.1</div>
                </div>
                <div>
                  <div className="text-military-400 mb-1">Last Updated:</div>
                  <div className="text-white">2025-01-13</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Password Change Section */}
            <div className="bg-military-900 border border-military-700 rounded-xl p-6">
              <h3 className="font-bold text-lg text-amber-400 mb-4 flex items-center gap-2">
                <span>🔐</span> Change Admin Password
              </h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block mono-font text-xs text-military-400 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 bg-military-800 border border-military-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block mono-font text-xs text-military-400 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 4 chars)"
                    className="w-full px-3 py-2 bg-military-800 border border-military-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block mono-font text-xs text-military-400 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 bg-military-800 border border-military-600 rounded-lg text-white"
                  />
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition"
                >
                  Change Password
                </button>
                <p className="text-xs text-military-500 mt-2">
                  Password is stored locally in your browser. Default password: tank2025
                </p>
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-military-900 border border-military-700 rounded-xl p-6">
              <h3 className="font-bold text-lg text-cyan-400 mb-4 flex items-center gap-2">
                <span>ℹ️</span> System Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-military-800 rounded-lg p-4">
                  <div className="mono-font text-xs text-military-400 mb-1">Storage Mode</div>
                  <div className={`font-bold ${useSupabase ? 'text-green-400' : 'text-yellow-400'}`}>
                    {useSupabase ? '☁️ Cloud (Supabase)' : '💾 Local Storage'}
                  </div>
                </div>
                <div className="bg-military-800 rounded-lg p-4">
                  <div className="mono-font text-xs text-military-400 mb-1">Last Saved</div>
                  <div className="font-bold text-military-300">
                    {lastSaved ? lastSaved.toLocaleString() : 'Never'}
                  </div>
                </div>
                <div className="bg-military-800 rounded-lg p-4">
                  <div className="mono-font text-xs text-military-400 mb-1">Projects Count</div>
                  <div className="font-bold text-military-300">{projects.length}</div>
                </div>
                <div className="bg-military-800 rounded-lg p-4">
                  <div className="mono-font text-xs text-military-400 mb-1">Goals Count</div>
                  <div className="font-bold text-military-300">{goals2026.length}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

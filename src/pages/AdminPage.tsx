import { useState, useRef } from 'react';
import { useData, type Goal } from '../context/DataContext';
import type { Project } from '../data/projects';

type TabType = 'profile' | 'projects' | 'goals' | 'backup';

export function AdminPage({ onBack }: { onBack: () => void }) {
  const {
    projects, setProjects,
    profileInfo, setProfileInfo,
    goals2026, setGoals2026,
    saveData, exportData, importData, resetToDefault
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

  const handleSave = () => {
    saveData();
    showMessage('success', 'Data saved successfully!');
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

  const handleReset = () => {
    if (confirm('Are you sure? This will reset all data to defaults.')) {
      resetToDefault();
      showMessage('success', 'Data reset to defaults');
    }
  };

  // Profile handlers
  const updateProfile = (key: keyof typeof profileInfo, value: string | number) => {
    setProfileInfo({ ...profileInfo, [key]: value });
  };

  // Project handlers
  const updateProject = (id: number, updates: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

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

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'goals', label: '2026 Goals', icon: '🎯' },
    { id: 'backup', label: 'Backup', icon: '💾' }
  ];

  return (
    <div className="min-h-screen bg-military-950 text-white">
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
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-military-500 text-military-950 rounded font-bold hover:bg-military-400 transition"
          >
            💾 Save All
          </button>
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
                        <label className="block mono-font text-xs text-military-400 mb-1">Icon</label>
                        <input
                          type="text"
                          value={editingProject.icon}
                          onChange={e => setEditingProject({ ...editingProject, icon: e.target.value })}
                          className="w-full px-2 py-1 bg-military-800 border border-military-600 rounded text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block mono-font text-xs text-military-400 mb-1">Period</label>
                        <input
                          type="text"
                          value={editingProject.period}
                          onChange={e => setEditingProject({ ...editingProject, period: e.target.value })}
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          updateProject(project.id, editingProject);
                          setEditingProject(null);
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

            <div className="bg-military-800 border border-military-600 rounded-lg p-4">
              <h3 className="font-bold text-military-400 mb-2">ℹ️ Storage Info</h3>
              <p className="text-sm text-military-500">
                Data is stored in browser localStorage.<br />
                Export regularly for backup.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

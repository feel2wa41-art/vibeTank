import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { projects as defaultProjects, profileInfo as defaultProfile, type Project } from '../data/projects';

export interface Goal {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

export interface ProfileInfo {
  name: string;
  role: string;
  year: number;
  tagline: string;
  footer: string;
}

interface DataContextType {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  profileInfo: ProfileInfo;
  setProfileInfo: (info: ProfileInfo) => void;
  goals2026: Goal[];
  setGoals2026: (goals: Goal[]) => void;
  saveData: () => void;
  loadData: () => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  resetToDefault: () => void;
}

const defaultGoals2026: Goal[] = [
  {
    id: 1,
    title: "MTI MAINTENANCE",
    subtitle: "Claude AI Integration",
    description: "Achieving complete mastery of MTI system maintenance through Claude AI. Building intelligent automation and predictive maintenance.",
    icon: "🤖",
    color: "#00f5ff",
    features: ["AI Diagnostics", "Auto-Recovery", "Predictive Analytics", "Zero-Downtime"]
  },
  {
    id: 2,
    title: "LECTURE SYSTEM",
    subtitle: "Next-Gen Education",
    description: "Revolutionary learning management system with AI tutoring, real-time collaboration, and immersive content delivery.",
    icon: "🎓",
    color: "#ff00ff",
    features: ["AI Tutor", "VR/AR Learning", "Real-time Analytics", "Adaptive Curriculum"]
  },
  {
    id: 3,
    title: "KB FINANCIAL KPI",
    subtitle: "Enterprise Intelligence",
    description: "Building cutting-edge KPI management system for KB Financial Group with real-time dashboards and AI-driven insights.",
    icon: "📊",
    color: "#ffff00",
    features: ["Live Dashboards", "AI Predictions", "Auto Reports", "Goal Tracking"]
  },
  {
    id: 4,
    title: "AI EXPANSION",
    subtitle: "IT Innovation & Growth",
    description: "Expanding IT capabilities through AI solutions, machine learning, automation, and intelligent systems.",
    icon: "🚀",
    color: "#00ff88",
    features: ["ML Integration", "Process Automation", "Smart Analytics", "AI Consulting"]
  }
];

const STORAGE_KEY = 'vibetank_data';

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>(defaultProfile);
  const [goals2026, setGoals2026] = useState<Goal[]>(defaultGoals2026);

  // Load data from localStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.projects) setProjects(data.projects);
        if (data.profileInfo) setProfileInfo(data.profileInfo);
        if (data.goals2026) setGoals2026(data.goals2026);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const saveData = () => {
    try {
      const data = { projects, profileInfo, goals2026 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const exportData = (): string => {
    const data = {
      projects,
      profileInfo,
      goals2026,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.projects) setProjects(data.projects);
      if (data.profileInfo) setProfileInfo(data.profileInfo);
      if (data.goals2026) setGoals2026(data.goals2026);
      saveData();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  };

  const resetToDefault = () => {
    setProjects(defaultProjects);
    setProfileInfo(defaultProfile);
    setGoals2026(defaultGoals2026);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <DataContext.Provider value={{
      projects,
      setProjects,
      profileInfo,
      setProfileInfo,
      goals2026,
      setGoals2026,
      saveData,
      loadData,
      exportData,
      importData,
      resetToDefault
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

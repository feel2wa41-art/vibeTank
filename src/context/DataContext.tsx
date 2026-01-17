import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { projects as defaultProjects, profileInfo as defaultProfile, type Project } from '../data/projects';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  setProjects: (projects: Project[] | ((prev: Project[]) => Project[])) => void;
  profileInfo: ProfileInfo;
  setProfileInfo: (info: ProfileInfo | ((prev: ProfileInfo) => ProfileInfo)) => void;
  goals2026: Goal[];
  setGoals2026: (goals: Goal[] | ((prev: Goal[]) => Goal[])) => void;
  saveData: () => Promise<void>;
  loadData: () => Promise<void>;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  resetToDefault: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  useSupabase: boolean;
  lastSaved: Date | null;
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
const SUPABASE_TABLE = 'site_data';

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>(defaultProfile);
  const [goals2026, setGoals2026] = useState<Goal[]>(defaultGoals2026);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Refs to always have latest state (to avoid stale closure in saveData)
  const projectsRef = useRef(projects);
  const profileInfoRef = useRef(profileInfo);
  const goals2026Ref = useRef(goals2026);

  // Custom setters that update ref BEFORE state (truly synchronous)
  // React's setState with function runs async, so we compute using ref and update ref first
  const setProjectsWithRef = useCallback((newProjects: Project[] | ((prev: Project[]) => Project[])) => {
    if (typeof newProjects === 'function') {
      const newValue = newProjects(projectsRef.current);
      projectsRef.current = newValue;
      setProjects(newValue);
    } else {
      projectsRef.current = newProjects;
      setProjects(newProjects);
    }
  }, []);

  const setProfileInfoWithRef = useCallback((newInfo: ProfileInfo | ((prev: ProfileInfo) => ProfileInfo)) => {
    if (typeof newInfo === 'function') {
      const newValue = newInfo(profileInfoRef.current);
      profileInfoRef.current = newValue;
      setProfileInfo(newValue);
    } else {
      profileInfoRef.current = newInfo;
      setProfileInfo(newInfo);
    }
  }, []);

  const setGoals2026WithRef = useCallback((newGoals: Goal[] | ((prev: Goal[]) => Goal[])) => {
    if (typeof newGoals === 'function') {
      const newValue = newGoals(goals2026Ref.current);
      goals2026Ref.current = newValue;
      setGoals2026(newValue);
    } else {
      goals2026Ref.current = newGoals;
      setGoals2026(newGoals);
    }
  }, []);

  const useSupabase = isSupabaseConfigured();

  // Load from Supabase
  const loadFromSupabase = useCallback(async () => {
    if (!supabase) return false;

    try {
      const { data, error } = await supabase
        .from(SUPABASE_TABLE)
        .select('*')
        .eq('id', 'main')
        .single();

      if (error) {
        return false;
      }

      if (data?.content) {
        const content = data.content;
        // Load data directly from Supabase without modification - use WithRef setters to sync refs
        if (content.projects) {
          setProjectsWithRef(content.projects);
        }
        if (content.profileInfo) setProfileInfoWithRef(content.profileInfo);
        if (content.goals2026) setGoals2026WithRef(content.goals2026);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Supabase load failed:', error);
      return false;
    }
  }, [setProjectsWithRef, setProfileInfoWithRef, setGoals2026WithRef]);

  // Load from localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Load data directly without modification - use WithRef setters to sync refs
        if (data.projects) setProjectsWithRef(data.projects);
        if (data.profileInfo) setProfileInfoWithRef(data.profileInfo);
        if (data.goals2026) setGoals2026WithRef(data.goals2026);
        return true;
      }
      return false;
    } catch (error) {
      console.error('localStorage load failed:', error);
      return false;
    }
  }, [setProjectsWithRef, setProfileInfoWithRef, setGoals2026WithRef]);

  // Main load function
  const loadData = useCallback(async () => {
    setIsLoading(true);

    if (useSupabase) {
      const loaded = await loadFromSupabase();
      if (!loaded) {
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    } else {
      loadFromLocalStorage();
    }

    setIsLoading(false);
  }, [useSupabase, loadFromSupabase, loadFromLocalStorage]);

  // Save to Supabase
  const saveToSupabase = useCallback(async (data: { projects: Project[]; profileInfo: ProfileInfo; goals2026: Goal[] }) => {
    if (!supabase) return false;

    try {
      // Delete existing row first
      await supabase
        .from(SUPABASE_TABLE)
        .delete()
        .eq('id', 'main');

      // Insert new row
      const { error: insertError } = await supabase
        .from(SUPABASE_TABLE)
        .insert({
          id: 'main',
          content: data,
          updated_at: new Date().toISOString()
        });

      if (insertError) throw insertError;
      return true;
    } catch {
      return false;
    }
  }, []);

  // Save to localStorage
  const saveToLocalStorage = useCallback((data: { projects: Project[]; profileInfo: ProfileInfo; goals2026: Goal[] }) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }, []);

  // Main save function - reads from refs which are always up-to-date
  const saveData = async () => {
    setIsSaving(true);

    // Use REFS - they are updated synchronously in setProjectsWithRef
    const data = {
      projects: projectsRef.current,
      profileInfo: profileInfoRef.current,
      goals2026: goals2026Ref.current
    };

    // Always save to localStorage as backup
    saveToLocalStorage(data);

    if (useSupabase) {
      await saveToSupabase(data);
    }

    setLastSaved(new Date());
    setIsSaving(false);
  };

  // Export data as JSON
  const exportData = useCallback((): string => {
    const data = {
      projects,
      profileInfo,
      goals2026,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  }, [projects, profileInfo, goals2026]);

  // Import data from JSON
  const importData = useCallback((jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.projects) setProjectsWithRef(data.projects);
      if (data.profileInfo) setProfileInfoWithRef(data.profileInfo);
      if (data.goals2026) setGoals2026WithRef(data.goals2026);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }, [setProjectsWithRef, setProfileInfoWithRef, setGoals2026WithRef]);

  // Reset to default
  const resetToDefault = useCallback(async () => {
    setProjectsWithRef(defaultProjects);
    setProfileInfoWithRef(defaultProfile);
    setGoals2026WithRef(defaultGoals2026);
    localStorage.removeItem(STORAGE_KEY);

    if (useSupabase && supabase) {
      await supabase.from(SUPABASE_TABLE).delete().eq('id', 'main');
    }
  }, [useSupabase, setProjectsWithRef, setProfileInfoWithRef, setGoals2026WithRef]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DataContext.Provider value={{
      projects,
      setProjects: setProjectsWithRef,
      profileInfo,
      setProfileInfo: setProfileInfoWithRef,
      goals2026,
      setGoals2026: setGoals2026WithRef,
      saveData,
      loadData,
      exportData,
      importData,
      resetToDefault,
      isLoading,
      isSaving,
      useSupabase,
      lastSaved
    }}>
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

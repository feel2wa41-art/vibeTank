import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
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
  setProjects: (projects: Project[]) => void;
  profileInfo: ProfileInfo;
  setProfileInfo: (info: ProfileInfo) => void;
  goals2026: Goal[];
  setGoals2026: (goals: Goal[]) => void;
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
        console.log('Supabase load error (may be first run):', error.message);
        return false;
      }

      if (data?.content) {
        const content = data.content;
        console.log('Supabase loaded content:', JSON.stringify(content.projects?.[3]?.description || 'no project 4'));
        // Merge with defaults to ensure all required fields exist and fix old data
        if (content.projects) {
          // Fix image paths: ALWAYS use default iconImage and aiImage paths (ignore stored paths)
          const fixedProjects = content.projects.map((p: Project) => {
            // Find matching default project by id
            const defaultProject = defaultProjects.find(dp => dp.id === p.id);
            return {
              ...p,
              // ALWAYS use default iconImage, aiImage, and script, never use stored ones
              iconImage: defaultProject?.iconImage,
              aiImage: defaultProject?.aiImage,
              script: defaultProject?.script
            };
          });
          setProjects(fixedProjects);
        }
        if (content.profileInfo) setProfileInfo(content.profileInfo);
        if (content.goals2026) setGoals2026(content.goals2026);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Supabase load failed:', error);
      return false;
    }
  }, []);

  // Load from localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Fix image paths: ALWAYS use default iconImage and aiImage paths (ignore stored paths)
        if (data.projects) {
          const fixedProjects = data.projects.map((p: Project) => {
            // Find matching default project by id
            const defaultProject = defaultProjects.find(dp => dp.id === p.id);
            return {
              ...p,
              // ALWAYS use default iconImage, aiImage, and script, never use stored ones
              iconImage: defaultProject?.iconImage,
              aiImage: defaultProject?.aiImage,
              script: defaultProject?.script
            };
          });
          setProjects(fixedProjects);
        }
        if (data.profileInfo) setProfileInfo(data.profileInfo);
        if (data.goals2026) setGoals2026(data.goals2026);
        return true;
      }
      return false;
    } catch (error) {
      console.error('localStorage load failed:', error);
      return false;
    }
  }, []);

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
      // Log what we're saving
      console.log('Saving to Supabase - Project 4 description:', data.projects?.[3]?.description);

      // Delete existing row first
      const { error: deleteError } = await supabase
        .from(SUPABASE_TABLE)
        .delete()
        .eq('id', 'main');

      if (deleteError) {
        console.error('Delete failed:', deleteError);
      }

      // Insert new row
      const { error: insertError } = await supabase
        .from(SUPABASE_TABLE)
        .insert({
          id: 'main',
          content: data,
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Insert failed:', insertError);
        throw insertError;
      }

      console.log('Supabase save successful!');
      return true;
    } catch (error) {
      console.error('Supabase save failed:', error);
      return false;
    }
  }, []);

  // Save to localStorage
  const saveToLocalStorage = useCallback((data: { projects: Project[]; profileInfo: ProfileInfo; goals2026: Goal[] }) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('localStorage save failed:', error);
      return false;
    }
  }, []);

  // Main save function
  const saveData = useCallback(async () => {
    setIsSaving(true);
    const data = { projects, profileInfo, goals2026 };

    // Always save to localStorage as backup
    saveToLocalStorage(data);

    if (useSupabase) {
      await saveToSupabase(data);
    }

    setLastSaved(new Date());
    setIsSaving(false);
  }, [projects, profileInfo, goals2026, useSupabase, saveToSupabase, saveToLocalStorage]);

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
      if (data.projects) setProjects(data.projects);
      if (data.profileInfo) setProfileInfo(data.profileInfo);
      if (data.goals2026) setGoals2026(data.goals2026);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }, []);

  // Reset to default
  const resetToDefault = useCallback(async () => {
    setProjects(defaultProjects);
    setProfileInfo(defaultProfile);
    setGoals2026(defaultGoals2026);
    localStorage.removeItem(STORAGE_KEY);

    if (useSupabase && supabase) {
      await supabase.from(SUPABASE_TABLE).delete().eq('id', 'main');
    }
  }, [useSupabase]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

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

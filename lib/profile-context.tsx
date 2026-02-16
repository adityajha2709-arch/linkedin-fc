"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ProfileData } from "@/types/profile";

interface ProfileContextValue {
  profileData: ProfileData | null;
  setProfileData: (data: ProfileData) => void;
  photoOverride: string | null;
  setPhotoOverride: (photo: string | null) => void;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [photoOverride, setPhotoOverride] = useState<string | null>(null);

  function clearProfile() {
    setProfileData(null);
    setPhotoOverride(null);
  }

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        setProfileData,
        photoOverride,
        setPhotoOverride,
        clearProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

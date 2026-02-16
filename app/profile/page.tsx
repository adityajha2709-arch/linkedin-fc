"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile-context";
import ProfilePage from "@/components/profile/profile-page";

export default function ProfileRoute() {
  const router = useRouter();
  const { profileData } = useProfile();

  useEffect(() => {
    if (!profileData) {
      router.replace("/");
    }
  }, [profileData, router]);

  if (!profileData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pitch-green-light border-t-accent" />
      </div>
    );
  }

  return <ProfilePage />;
}

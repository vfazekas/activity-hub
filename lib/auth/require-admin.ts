import { redirect } from "next/navigation";
import { getProfile } from "./get-profile";

export async function requireAdmin() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role !== "ADMIN") {
    redirect("/");
  }

  return profile;
}
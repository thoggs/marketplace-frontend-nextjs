import { auth } from "@/auth";
import { UserProfileSliceType } from "@/store/types";

export async function assembleUserProfile(): Promise<UserProfileSliceType> {
  const session = await auth();

  const defaultUserProfile: UserProfileSliceType = {
    id: '',
    name: '',
    email: '',
    accessToken: '',
    profileImage: '',
  };

  try {
    if (session && session.user) {
      return {
        id: session.user.data.user.id,
        name: `${session.user.data.user.firstName} ${session.user.data.user.lastName}`,
        email: session.user.data.user.email,
        accessToken: session.user.data.accessToken,
        profileImage: session.picture || '',
      };
    }
  } catch (error) {
    console.error("Failed to fetch user session:", error);
  }
  return defaultUserProfile;
}
'use server'
import { signIn, signOut } from "@/auth";

export async function onSubmitGitHubSignIn() {
  await signIn('github', {
    redirectTo: '/dashboard',
  });
}

export async function onSubmitCredentialsSignIn(email: string, password: string) {
  await signIn('credentials', {
    email,
    password,
    redirectTo: '/dashboard'
  });
}

export async function onSubmitSignOut() {
  await signOut({
    redirectTo: '/auth/signin'
  });
}
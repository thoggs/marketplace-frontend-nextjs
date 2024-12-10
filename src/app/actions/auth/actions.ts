'use server'
import { signIn, signOut } from "@/auth";

export async function onSubmitGitHubSignIn() {
  await signIn('github');
}

export async function onSubmitCredentialsSignIn(email: string, password: string) {
  await signIn('credentials', {
    email,
    password,
  });
}

export async function onSubmitSignOut() {
  await signOut();
}
// app/protected/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }
  return (
    <div>
      <h1>Protected Page</h1>
      <p>Welcome, {session.user.email}!</p>
    </div>
  );
}

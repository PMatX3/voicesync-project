import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/auth"; // Import the auth function

export async function GET(request: NextRequest) {
  try {
    const session = await auth(); // Get the session directly

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("Session:", session);
    return NextResponse.json({ message: "Logged session", session });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ error: "Failed to fetch session", details: error.message }, { status: 500 });
  }
}

import { handlers } from "@/lib/auth";

// Debug: Log the handlers object to confirm it's being exported correctly
console.log("NextAuth handlers:", handlers);

export const { GET, POST } = handlers

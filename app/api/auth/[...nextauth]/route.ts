// app/api/auth/[...nextauth]/route.ts

import { handlers } from "@/lib/auth"; // Import the handlers created in lib/auth.ts

// Export the GET and POST handlers provided by Auth.js
export const { GET, POST } = handlers;

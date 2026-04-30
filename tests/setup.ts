import { config } from "dotenv";
import { resolve } from "node:path";

// Load .env.local for tests so DATABASE_URL etc. are available.
config({ path: resolve(process.cwd(), ".env.local") });

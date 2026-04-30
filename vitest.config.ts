import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    // Append-only trigger tests share a remote DB; run them sequentially
    // within the file via the default in-file ordering. File-level parallelism
    // is fine because each test opens its own pg client and rolls back.
    pool: "forks",
  },
});

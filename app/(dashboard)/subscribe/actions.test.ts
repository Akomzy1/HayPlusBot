/**
 * Tests for the subscribe action's schema and the underlying
 * record_hfm_account RPC. Schema tests are pure Zod (no I/O).
 * RPC tests use a direct pg client with `SET LOCAL request.jwt.claim.sub`
 * to simulate Supabase's auth context, then ROLLBACK so nothing persists.
 */

import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import { Client } from "pg";
import { RecordSchema } from "./schema";

describe("RecordSchema", () => {
  it("accepts an 8-digit account number + valid server", () => {
    const r = RecordSchema.safeParse({
      hfmAccountNumber: "10054472",
      server: "HFM-Real",
    });
    expect(r.success).toBe(true);
  });

  it("rejects fewer than 8 digits", () => {
    const r = RecordSchema.safeParse({
      hfmAccountNumber: "1234567",
      server: "HFM-Real",
    });
    expect(r.success).toBe(false);
  });

  it("rejects more than 8 digits", () => {
    const r = RecordSchema.safeParse({
      hfmAccountNumber: "123456789",
      server: "HFM-Real",
    });
    expect(r.success).toBe(false);
  });

  it("rejects non-numeric account", () => {
    const r = RecordSchema.safeParse({
      hfmAccountNumber: "abcdefgh",
      server: "HFM-Real",
    });
    expect(r.success).toBe(false);
  });

  it("rejects unknown server", () => {
    const r = RecordSchema.safeParse({
      hfmAccountNumber: "10054472",
      server: "HFM-Demo",
    });
    expect(r.success).toBe(false);
  });

  it("accepts each of the three valid servers", () => {
    for (const server of ["HFM-Real", "HFM-Real-Plus", "HFM-Real-Pro"]) {
      const r = RecordSchema.safeParse({
        hfmAccountNumber: "10054472",
        server,
      });
      expect(r.success).toBe(true);
    }
  });
});

describe("public.record_hfm_account RPC", () => {
  // throwaway test user — created and rolled back inside each transaction
  const TEST_USER_ID = "00000000-0000-0000-0000-00000000aaaa";
  const TEST_USER_EMAIL = "subscribe-test@hayplusbot.local";

  const SEED_AUTH_USER_SQL = `
    insert into auth.users (
      id, instance_id, aud, role, email,
      encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at
    ) values (
      $1, '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated', $2,
      crypt('temp', gen_salt('bf')), now(),
      '{}'::jsonb, '{}'::jsonb,
      now(), now()
    )
    on conflict (id) do nothing
  `;

  let dbUrl: string;
  let client: Client;

  beforeAll(() => {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set in .env.local");
    }
    dbUrl = process.env.DATABASE_URL;
  });

  beforeEach(async () => {
    client = new Client({ connectionString: dbUrl });
    await client.connect();
    await client.query("begin");
  });

  afterEach(async () => {
    try {
      await client.query("rollback");
    } finally {
      await client.end();
    }
  });

  async function seedAuthedUser() {
    await client.query(SEED_AUTH_USER_SQL, [TEST_USER_ID, TEST_USER_EMAIL]);
    // The auth.users INSERT fires our handle_new_auth_user trigger, which
    // creates the corresponding signups row. Verify it's there.
    const { rowCount } = await client.query(
      "select 1 from public.signups where user_id = $1",
      [TEST_USER_ID],
    );
    if (rowCount === 0) {
      // Fallback in case the trigger didn't fire in this tx for any reason
      await client.query(
        "insert into public.signups (user_id, email) values ($1, $2) on conflict (user_id) do nothing",
        [TEST_USER_ID, TEST_USER_EMAIL],
      );
    }
    // Simulate Supabase's auth context — populates auth.uid()
    await client.query(`set local "request.jwt.claim.sub" to '${TEST_USER_ID}'`);
  }

  it("updates hfm_account_number when called by an authenticated user", async () => {
    await seedAuthedUser();

    await client.query(
      "select public.record_hfm_account($1, $2)",
      ["10054472", "HFM-Real"],
    );

    const { rows } = await client.query(
      `select hfm_account_number,
              hfm_account_verified_at,
              hfm_account_verified_under_our_code
         from public.signups
        where user_id = $1`,
      [TEST_USER_ID],
    );
    expect(rows[0].hfm_account_number).toBe("10054472");
    expect(rows[0].hfm_account_verified_at).toBeNull();
    expect(rows[0].hfm_account_verified_under_our_code).toBe(false);
  });

  it("re-recording overwrites the previous account number", async () => {
    await seedAuthedUser();

    await client.query("select public.record_hfm_account($1, $2)", [
      "10054472",
      "HFM-Real",
    ]);
    await client.query("select public.record_hfm_account($1, $2)", [
      "20002000",
      "HFM-Real-Plus",
    ]);

    const { rows } = await client.query(
      "select hfm_account_number from public.signups where user_id = $1",
      [TEST_USER_ID],
    );
    expect(rows[0].hfm_account_number).toBe("20002000");
  });

  it("raises 'not authenticated' when auth.uid() is null", async () => {
    // No SET LOCAL → auth.uid() is null
    await expect(
      client.query("select public.record_hfm_account($1, $2)", [
        "10054472",
        "HFM-Real",
      ]),
    ).rejects.toThrow(/not authenticated/);
  });

  it("raises on invalid account-number format (defensive belt-and-braces)", async () => {
    await seedAuthedUser();
    await client.query("savepoint sp");
    await expect(
      client.query("select public.record_hfm_account($1, $2)", [
        "abc",
        "HFM-Real",
      ]),
    ).rejects.toThrow(/invalid account number format/);
    await client.query("rollback to savepoint sp");
  });

  it("raises on invalid server", async () => {
    await seedAuthedUser();
    await client.query("savepoint sp");
    await expect(
      client.query("select public.record_hfm_account($1, $2)", [
        "10054472",
        "HFM-Demo",
      ]),
    ).rejects.toThrow(/invalid server/);
    await client.query("rollback to savepoint sp");
  });
});

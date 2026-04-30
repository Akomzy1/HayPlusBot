/**
 * Append-only trigger tests.
 *
 * Verifies that the BEFORE UPDATE / BEFORE DELETE triggers on
 *   - admin_action_log
 *   - signal_evaluations
 *   - subscribe_balance_check_log
 * raise as designed, even from a service-role connection.
 *
 * Each test opens its own postgres client, BEGINs a transaction, performs
 * setup INSERTs + attempts forbidden ops via SAVEPOINTs, and ROLLBACKs at the
 * end so the remote database is unchanged regardless of pass/fail.
 *
 * DATABASE_URL must be set (typically in .env.local). Get it from the
 * Supabase dashboard → Project Settings → Database → Connection string.
 */

import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Client } from "pg";

// stable UUID + email for the throwaway test user — created and rolled back
// within each test transaction
const TEST_USER_ID = "00000000-0000-0000-0000-00000000fff1";
const TEST_USER_EMAIL = "trigger-test@hayplusbot.local";

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
    throw new Error(
      "DATABASE_URL must be set in .env.local for trigger tests. " +
        "See .env.example.",
    );
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

async function seedTestUser() {
  await client.query(SEED_AUTH_USER_SQL, [TEST_USER_ID, TEST_USER_EMAIL]);
}

async function seedAdmin() {
  await seedTestUser();
  await client.query(
    "insert into admin_users (user_id) values ($1) on conflict do nothing",
    [TEST_USER_ID],
  );
}

async function insertReturningId(
  sql: string,
  params?: unknown[],
): Promise<number> {
  const { rows } = await client.query<{ id: number }>(sql, params);
  const row = rows[0];
  if (!row) {
    throw new Error("INSERT ... RETURNING id returned no rows");
  }
  return row.id;
}

describe("admin_action_log", () => {
  it("blocks UPDATE of any column other than after_state", async () => {
    await seedAdmin();
    const id = await insertReturningId(
      `insert into admin_action_log (admin_user_id, action_type, before_state, reason_note)
       values ($1, 'test_action', '{"x":1}'::jsonb, 'pre') returning id`,
      [TEST_USER_ID],
    );

    await client.query("savepoint sp");
    await expect(
      client.query(
        "update admin_action_log set reason_note = 'hacked' where id = $1",
        [id],
      ),
    ).rejects.toThrow(/only after_state may be modified/);
    await client.query("rollback to savepoint sp");
  });

  it("blocks DELETE outright", async () => {
    await seedAdmin();
    const id = await insertReturningId(
      `insert into admin_action_log (admin_user_id, action_type)
       values ($1, 'test') returning id`,
      [TEST_USER_ID],
    );

    await client.query("savepoint sp");
    await expect(
      client.query("delete from admin_action_log where id = $1", [id]),
    ).rejects.toThrow(/DELETE blocked/);
    await client.query("rollback to savepoint sp");
  });

  it("allows after_state to transition null -> non-null exactly once", async () => {
    await seedAdmin();
    const id = await insertReturningId(
      `insert into admin_action_log (admin_user_id, action_type)
       values ($1, 'test') returning id`,
      [TEST_USER_ID],
    );

    // first update — allowed (null -> non-null)
    await client.query(
      `update admin_action_log set after_state = '{"y":1}'::jsonb where id = $1`,
      [id],
    );

    // second update — forbidden (non-null -> non-null)
    await client.query("savepoint sp");
    await expect(
      client.query(
        `update admin_action_log set after_state = '{"y":2}'::jsonb where id = $1`,
        [id],
      ),
    ).rejects.toThrow(/already set/);
    await client.query("rollback to savepoint sp");
  });
});

describe("signal_evaluations", () => {
  it("blocks UPDATE outright", async () => {
    const id = await insertReturningId(
      `insert into signal_evaluations (pair) values ('EUR/USD') returning id`,
    );

    await client.query("savepoint sp");
    await expect(
      client.query(
        "update signal_evaluations set pair = 'GBP/USD' where id = $1",
        [id],
      ),
    ).rejects.toThrow(/append-only/);
    await client.query("rollback to savepoint sp");
  });

  it("blocks DELETE outright", async () => {
    const id = await insertReturningId(
      `insert into signal_evaluations (pair) values ('EUR/USD') returning id`,
    );

    await client.query("savepoint sp");
    await expect(
      client.query("delete from signal_evaluations where id = $1", [id]),
    ).rejects.toThrow(/append-only/);
    await client.query("rollback to savepoint sp");
  });
});

describe("subscribe_balance_check_log", () => {
  it("blocks UPDATE outright", async () => {
    await seedTestUser();
    const id = await insertReturningId(
      `insert into subscribe_balance_check_log (
         user_id, hfm_account_number, balance_account_currency, account_currency,
         balance_usd_equivalent, fx_rate_used, passed
       ) values ($1, 'TEST', 100, 'USD', 100, 1, true) returning id`,
      [TEST_USER_ID],
    );

    await client.query("savepoint sp");
    await expect(
      client.query(
        "update subscribe_balance_check_log set passed = false where id = $1",
        [id],
      ),
    ).rejects.toThrow(/append-only/);
    await client.query("rollback to savepoint sp");
  });

  it("blocks DELETE outright", async () => {
    await seedTestUser();
    const id = await insertReturningId(
      `insert into subscribe_balance_check_log (
         user_id, hfm_account_number, balance_account_currency, account_currency,
         balance_usd_equivalent, fx_rate_used, passed
       ) values ($1, 'TEST', 100, 'USD', 100, 1, true) returning id`,
      [TEST_USER_ID],
    );

    await client.query("savepoint sp");
    await expect(
      client.query("delete from subscribe_balance_check_log where id = $1", [id]),
    ).rejects.toThrow(/append-only/);
    await client.query("rollback to savepoint sp");
  });
});

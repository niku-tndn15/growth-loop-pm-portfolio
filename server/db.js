const Database = require('better-sqlite3');
const path = require('path');
const seedData = require('./data/seed');

const DB_PATH = path.join(__dirname, 'data', 'portfolio.db');
let db;

function getDb() {
  if (db) return db;
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  initializeDb();
  return db;
}

function initializeDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS funnel (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stage TEXT NOT NULL,
      value INTEGER NOT NULL,
      rate REAL
    );

    CREATE TABLE IF NOT EXISTS channels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      channel TEXT NOT NULL,
      monthly_users INTEGER NOT NULL,
      cac REAL NOT NULL,
      d30_retention INTEGER NOT NULL,
      ltv_cac REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cohorts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cohort TEXT NOT NULL,
      referred_users INTEGER NOT NULL,
      organic_users INTEGER NOT NULL,
      d30_ret_ref INTEGER NOT NULL,
      d30_ret_org INTEGER NOT NULL,
      ltv_ref REAL NOT NULL,
      ltv_org REAL NOT NULL,
      delta_ltv INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS retention_curves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day INTEGER NOT NULL,
      referred REAL NOT NULL,
      organic REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ltv_curves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month INTEGER NOT NULL,
      referred REAL NOT NULL,
      paid REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS kfactor (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      invites_per_user REAL NOT NULL,
      acceptance_rate REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ltvcac (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      monthly_paid_users INTEGER NOT NULL,
      blended_cac REAL NOT NULL,
      average_ltv REAL NOT NULL,
      current_k REAL NOT NULL,
      reward_cost REAL NOT NULL,
      target_k REAL NOT NULL,
      ltv_uplift REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS referral_econ (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      avg_ltv_referred REAL NOT NULL,
      referrer_reward REAL NOT NULL,
      referee_reward REAL NOT NULL,
      fraud_rate REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS roadmap (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phase TEXT NOT NULL,
      start_month INTEGER NOT NULL,
      end_month INTEGER NOT NULL,
      status TEXT NOT NULL,
      deliverables TEXT,
      success_criteria TEXT
    );

    CREATE TABLE IF NOT EXISTS metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metric TEXT NOT NULL,
      type TEXT NOT NULL,
      baseline TEXT NOT NULL,
      target TEXT NOT NULL,
      owner TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scenario TEXT NOT NULL,
      k_factor REAL NOT NULL,
      blended_ltv REAL NOT NULL,
      blended_cac REAL NOT NULL,
      ltv_cac REAL NOT NULL,
      monthly_value_add REAL
    );

    CREATE TABLE IF NOT EXISTS payback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      channel TEXT NOT NULL,
      months REAL NOT NULL
    );
  `);

  // Seed only if tables are empty
  const count = db.prepare('SELECT COUNT(*) as c FROM funnel').get();
  if (count.c === 0) {
    seedAllData();
  }
}

function seedAllData() {
  const insertFunnel = db.prepare('INSERT INTO funnel (stage, value, rate) VALUES (?, ?, ?)');
  const insertChannel = db.prepare('INSERT INTO channels (channel, monthly_users, cac, d30_retention, ltv_cac) VALUES (?, ?, ?, ?, ?)');
  const insertCohort = db.prepare('INSERT INTO cohorts (cohort, referred_users, organic_users, d30_ret_ref, d30_ret_org, ltv_ref, ltv_org, delta_ltv) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const insertRetention = db.prepare('INSERT INTO retention_curves (day, referred, organic) VALUES (?, ?, ?)');
  const insertLtv = db.prepare('INSERT INTO ltv_curves (month, referred, paid) VALUES (?, ?, ?)');
  const insertKfactor = db.prepare('INSERT INTO kfactor (id, invites_per_user, acceptance_rate) VALUES (1, ?, ?)');
  const insertLtvcac = db.prepare('INSERT INTO ltvcac (id, monthly_paid_users, blended_cac, average_ltv, current_k, reward_cost, target_k, ltv_uplift) VALUES (1, ?, ?, ?, ?, ?, ?, ?)');
  const insertReferralEcon = db.prepare('INSERT INTO referral_econ (id, avg_ltv_referred, referrer_reward, referee_reward, fraud_rate) VALUES (1, ?, ?, ?, ?)');
  const insertRoadmap = db.prepare('INSERT INTO roadmap (phase, start_month, end_month, status, deliverables, success_criteria) VALUES (?, ?, ?, ?, ?, ?)');
  const insertMetric = db.prepare('INSERT INTO metrics (metric, type, baseline, target, owner) VALUES (?, ?, ?, ?, ?)');
  const insertScenario = db.prepare('INSERT INTO scenarios (scenario, k_factor, blended_ltv, blended_cac, ltv_cac, monthly_value_add) VALUES (?, ?, ?, ?, ?, ?)');
  const insertPayback = db.prepare('INSERT INTO payback (channel, months) VALUES (?, ?)');

  const seed = db.transaction(() => {
    seedData.funnel.forEach(r => insertFunnel.run(r.stage, r.value, r.rate));
    seedData.channels.forEach(r => insertChannel.run(r.channel, r.monthly_users, r.cac, r.d30_retention, r.ltv_cac));
    seedData.cohorts.forEach(r => insertCohort.run(r.cohort, r.referred_users, r.organic_users, r.d30_ret_ref, r.d30_ret_org, r.ltv_ref, r.ltv_org, r.delta_ltv));

    const { days, referred, organic } = seedData.retention_curves;
    days.forEach((d, i) => insertRetention.run(d, referred[i], organic[i]));

    const { months, referred: ref2, paid } = seedData.ltv_curves;
    months.forEach((m, i) => insertLtv.run(m, ref2[i], paid[i]));

    const kf = seedData.kfactor;
    insertKfactor.run(kf.invites_per_user, kf.acceptance_rate);

    const lc = seedData.ltvcac;
    insertLtvcac.run(lc.monthly_paid_users, lc.blended_cac, lc.average_ltv, lc.current_k, lc.reward_cost, lc.target_k, lc.ltv_uplift);

    const re = seedData.referral_econ;
    insertReferralEcon.run(re.avg_ltv_referred, re.referrer_reward, re.referee_reward, re.fraud_rate);

    seedData.roadmap.forEach(r => insertRoadmap.run(r.phase, r.start_month, r.end_month, r.status, r.deliverables, r.success_criteria));
    seedData.metrics.forEach(r => insertMetric.run(r.metric, r.type, r.baseline, r.target, r.owner));
    seedData.scenarios.forEach(r => insertScenario.run(r.scenario, r.k_factor, r.blended_ltv, r.blended_cac, r.ltv_cac, r.monthly_value_add));
    seedData.payback.forEach(r => insertPayback.run(r.channel, r.months));
  });

  seed();
}

module.exports = { getDb };

const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize DB on startup
const db = getDb();

// --- API Routes ---

app.get('/api/funnel', (req, res) => {
  const rows = db.prepare('SELECT * FROM funnel ORDER BY id').all();
  res.json(rows);
});

app.get('/api/channels', (req, res) => {
  const rows = db.prepare('SELECT * FROM channels ORDER BY id').all();
  res.json(rows);
});

app.get('/api/cohorts', (req, res) => {
  const cohorts = db.prepare('SELECT * FROM cohorts ORDER BY id').all();
  const retention = db.prepare('SELECT * FROM retention_curves ORDER BY day').all();
  const ltv = db.prepare('SELECT * FROM ltv_curves ORDER BY month').all();
  res.json({ cohorts, retention, ltv });
});

app.get('/api/kfactor', (req, res) => {
  const row = db.prepare('SELECT * FROM kfactor WHERE id = 1').get();
  res.json(row);
});

app.post('/api/kfactor', (req, res) => {
  const { invites_per_user, acceptance_rate } = req.body;
  db.prepare('UPDATE kfactor SET invites_per_user = ?, acceptance_rate = ? WHERE id = 1')
    .run(invites_per_user, acceptance_rate);
  const row = db.prepare('SELECT * FROM kfactor WHERE id = 1').get();
  res.json(row);
});

app.get('/api/ltvcac', (req, res) => {
  const row = db.prepare('SELECT * FROM ltvcac WHERE id = 1').get();
  const scenarios = db.prepare('SELECT * FROM scenarios ORDER BY id').all();
  const payback = db.prepare('SELECT * FROM payback ORDER BY id').all();
  res.json({ inputs: row, scenarios, payback });
});

app.post('/api/ltvcac', (req, res) => {
  const { monthly_paid_users, blended_cac, average_ltv, current_k, reward_cost, target_k, ltv_uplift } = req.body;
  db.prepare(`UPDATE ltvcac SET monthly_paid_users = ?, blended_cac = ?, average_ltv = ?,
    current_k = ?, reward_cost = ?, target_k = ?, ltv_uplift = ? WHERE id = 1`)
    .run(monthly_paid_users, blended_cac, average_ltv, current_k, reward_cost, target_k, ltv_uplift);
  const row = db.prepare('SELECT * FROM ltvcac WHERE id = 1').get();
  res.json(row);
});

app.get('/api/referral-econ', (req, res) => {
  const row = db.prepare('SELECT * FROM referral_econ WHERE id = 1').get();
  res.json(row);
});

app.post('/api/referral-econ', (req, res) => {
  const { avg_ltv_referred, referrer_reward, referee_reward, fraud_rate } = req.body;
  db.prepare('UPDATE referral_econ SET avg_ltv_referred = ?, referrer_reward = ?, referee_reward = ?, fraud_rate = ? WHERE id = 1')
    .run(avg_ltv_referred, referrer_reward, referee_reward, fraud_rate);
  const row = db.prepare('SELECT * FROM referral_econ WHERE id = 1').get();
  res.json(row);
});

app.get('/api/roadmap', (req, res) => {
  const rows = db.prepare('SELECT * FROM roadmap ORDER BY id').all();
  res.json(rows);
});

app.get('/api/metrics', (req, res) => {
  const rows = db.prepare('SELECT * FROM metrics ORDER BY id').all();
  res.json(rows);
});

// Serve static frontend in production
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const seedData = {
  funnel: [
    { stage: 'Impressions', value: 250000, rate: null },
    { stage: 'Clicks', value: 31250, rate: 12.5 },
    { stage: 'Installs', value: 8437, rate: 27.0 },
    { stage: 'Signups', value: 5062, rate: 60.0 },
    { stage: 'Activated', value: 2125, rate: 42.0 },
    { stage: 'Retained D30', value: 807, rate: 38.0 },
  ],

  channels: [
    { channel: 'Paid Social', monthly_users: 1840, cac: 22.10, d30_retention: 31, ltv_cac: 1.8 },
    { channel: 'Google UAC', monthly_users: 1240, cac: 19.40, d30_retention: 34, ltv_cac: 2.0 },
    { channel: 'Organic Search', monthly_users: 580, cac: 4.20, d30_retention: 51, ltv_cac: 4.8 },
    { channel: 'Referral', monthly_users: 310, cac: 6.80, d30_retention: 58, ltv_cac: 5.2 },
    { channel: 'Direct/Word of mouth', monthly_users: 155, cac: 1.10, d30_retention: 62, ltv_cac: 6.1 },
  ],

  cohorts: [
    { cohort: 'Jan', referred_users: 89, organic_users: 1240, d30_ret_ref: 56, d30_ret_org: 33, ltv_ref: 86, ltv_org: 48, delta_ltv: 79 },
    { cohort: 'Feb', referred_users: 124, organic_users: 1180, d30_ret_ref: 53, d30_ret_org: 31, ltv_ref: 83, ltv_org: 47, delta_ltv: 76 },
    { cohort: 'Mar', referred_users: 167, organic_users: 1310, d30_ret_ref: 55, d30_ret_org: 34, ltv_ref: 87, ltv_org: 50, delta_ltv: 74 },
    { cohort: 'Apr', referred_users: 198, organic_users: 1290, d30_ret_ref: 57, d30_ret_org: 32, ltv_ref: 89, ltv_org: 49, delta_ltv: 81 },
    { cohort: 'May', referred_users: 241, organic_users: 1350, d30_ret_ref: 54, d30_ret_org: 35, ltv_ref: 85, ltv_org: 51, delta_ltv: 67 },
    { cohort: 'Jun', referred_users: 289, organic_users: 1420, d30_ret_ref: 58, d30_ret_org: 33, ltv_ref: 91, ltv_org: 48, delta_ltv: 89 },
  ],

  retention_curves: {
    days: [0, 7, 14, 30, 60, 90],
    referred: [100, 71, 62, 54, 44, 38],
    organic: [100, 51, 41, 32, 24, 18],
  },

  ltv_curves: {
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    referred: [8, 18, 29, 41, 52, 61, 68, 73, 78, 82, 85, 88],
    paid: [5, 11, 17, 23, 28, 33, 37, 40, 43, 46, 48, 50],
  },

  kfactor: {
    invites_per_user: 4.2,
    acceptance_rate: 13,
  },

  ltvcac: {
    monthly_paid_users: 4125,
    blended_cac: 18.40,
    average_ltv: 52.00,
    current_k: 0.18,
    reward_cost: 22.00,
    target_k: 0.55,
    ltv_uplift: 74,
  },

  referral_econ: {
    avg_ltv_referred: 84.00,
    referrer_reward: 10.00,
    referee_reward: 12.00,
    fraud_rate: 4,
  },

  roadmap: [
    { phase: 'Discovery & Research', start_month: 1, end_month: 1, status: 'complete', deliverables: 'User research interviews (n=30), competitive analysis of 12 referral programs, data audit of current acquisition channels, stakeholder alignment deck', success_criteria: 'Clear understanding of user sharing motivations; identified top 3 trigger moments; executive buy-in secured' },
    { phase: 'Loop Design & PRD', start_month: 1, end_month: 2, status: 'complete', deliverables: 'Growth loop PRD, reward economics model, technical design doc, A/B test plan, fraud prevention spec', success_criteria: 'PRD approved by eng lead and design; economics model validated by finance; test plan reviewed by data science' },
    { phase: 'Engineering Build', start_month: 2, end_month: 4, status: 'in_progress', deliverables: 'Referral infrastructure (deep links, attribution, reward ledger), share UI components, admin dashboard, analytics events', success_criteria: 'All core flows functional in staging; deep links tested on iOS 17+ and Android 14+; load tested to 10x expected volume' },
    { phase: 'Internal Pilot (100 users)', start_month: 4, end_month: 5, status: 'upcoming', deliverables: 'Employee beta test, bug fixes, UX iteration based on qualitative feedback, fraud system validation', success_criteria: 'Share rate >5% among pilot users; zero critical bugs; fraud detection catches all test attacks' },
    { phase: 'A/B Test (10% traffic)', start_month: 5, end_month: 7, status: 'upcoming', deliverables: 'Controlled experiment with holdout group, weekly metrics review, reward amount optimization test', success_criteria: 'Statistically significant lift in K-factor (p<0.05); LTV:CAC improvement >15%; fraud rate <5%' },
    { phase: 'Full Rollout', start_month: 7, end_month: 9, status: 'upcoming', deliverables: 'Phased rollout (25% → 50% → 100%), monitoring dashboard, automated alerts, quarterly review cadence', success_criteria: 'K-factor ≥0.40 at scale; blended CAC reduction ≥20%; reward ROI >200%; no degradation in app store rating' },
  ],

  metrics: [
    { metric: 'K-Factor', type: 'North Star', baseline: '0.18', target: '0.55', owner: 'Growth PM' },
    { metric: 'Referral share rate', type: 'Input', baseline: '2.1%', target: '8.5%', owner: 'Product' },
    { metric: 'Invite acceptance rate', type: 'Input', baseline: '11%', target: '18%', owner: 'Marketing' },
    { metric: 'D30 retention (referred)', type: 'Output', baseline: '54%', target: '62%', owner: 'Product' },
    { metric: 'LTV:CAC ratio', type: 'Output', baseline: '2.9x', target: '3.4x', owner: 'Finance' },
    { metric: 'CAC blended', type: 'Output', baseline: '$18.40', target: '$14.20', owner: 'Growth PM' },
    { metric: 'Reward ROI', type: 'Guardrail', baseline: '—', target: '>200%', owner: 'Finance' },
    { metric: 'Fraud rate', type: 'Guardrail', baseline: '—', target: '<5%', owner: 'Trust & Safety' },
  ],

  scenarios: [
    { scenario: 'No Loop (baseline)', k_factor: 0.18, blended_ltv: 54, blended_cac: 18.40, ltv_cac: 2.9, monthly_value_add: null },
    { scenario: 'Conservative Loop', k_factor: 0.30, blended_ltv: 58, blended_cac: 18.80, ltv_cac: 3.1, monthly_value_add: 28400 },
    { scenario: 'Base Case Loop', k_factor: 0.55, blended_ltv: 66, blended_cac: 19.68, ltv_cac: 3.4, monthly_value_add: 81200 },
    { scenario: 'Optimistic Loop', k_factor: 0.80, blended_ltv: 71, blended_cac: 20.10, ltv_cac: 3.5, monthly_value_add: 124600 },
  ],

  payback: [
    { channel: 'Paid Social', months: 14.2 },
    { channel: 'Google UAC', months: 11.8 },
    { channel: 'Referral (current)', months: 5.1 },
    { channel: 'Referral (optimized)', months: 3.2 },
    { channel: 'Organic', months: 2.1 },
  ],
};

module.exports = seedData;

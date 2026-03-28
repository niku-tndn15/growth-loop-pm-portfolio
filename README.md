
# 🚀 Growth Loop Portfolio: B2C Growth Engineering Case Study

A full-stack Product Management application that transforms a "leaky" acquisition funnel into a compounding growth engine. This tool models the transition from high-cost paid ads to a self-sustaining referral system.

## 📈 Strategic Impact
* **Reduced CAC:** Models a reduction in Customer Acquisition Cost from **$18.40** to **$11.20**.
* **Virality Modeling:** Leverages the **K-factor** formula to predict organic growth:
    $$K = i \times c$$
    *(Where $i$ = invites sent and $c$ = conversion rate)*.
* **LTV Lift:** Demonstrates a **74% higher Lifetime Value** for referred users compared to paid cohorts.


---

## 🛠️ The Tech Stack
* **Frontend:** React (Vite) + Tailwind CSS + Recharts for interactive analytics.
* **Backend:** Node.js + Express REST API.
* **Database:** SQLite for persistent storage of calculator inputs.

---

## 🧩 Core Modules
| Module | PM Objective | Key Feature |
| :--- | :--- | :--- |
| **Growth Loop Designer** | Build compounding virality  | Interactive SVG Loop + K-Factor Slider  |
| **Acquisition Funnel** | Identify the "Leaky Bucket"  | Drop-off visualization with red-flagging  |
| **Cohort Analysis** | Prove long-term retention  | Shaded area retention curves (Referred vs. Paid)  |
| **LTV:CAC Model** | Validate unit economics  | Interactive scenario modeling (Baseline vs. Loop)  |
| **Roadmap & Metrics** | Manage execution & risk  | CSS Gantt Chart + A/B Test Design Cards  |

---

## ⚡ Quick Start
```bash
# Install dependencies for both Client & Server
npm run install:all

# Launch the full-stack environment
npm run dev
```
*App launches at `http://localhost:5173`. API runs on port `3001`.*

---

## 🌟 Key Features
* **Persistence:** All calculator values saved to SQLite via REST API.
* **UX Excellence:** Skeleton loaders, responsive design, and floating "Portfolio Context" modal.
* **Stakeholder Ready:** Print-optimized CSS for clean PDF exports.

---

### Author
**Nikunj Tandan** - *Product Management & Growth Engineering*

---

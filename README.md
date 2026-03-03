# Standard Chartered — Account Plan

Interactive React-based account plan for the Standard Chartered relationship.

## Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub

```bash
# Create a new private repo on github.com, then:
git init
git add .
git commit -m "Account plan FY2026"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/scb-account-plan.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **"Add New Project"**
3. Select your `scb-account-plan` repository
4. Vercel auto-detects Vite — just click **"Deploy"**
5. In ~60 seconds you'll have a live URL like `scb-account-plan.vercel.app`

### Step 3: Password-protect (recommended)

1. In the Vercel dashboard, go to **Settings → General → Password Protection**
2. Enable it and set a password
3. Share the URL + password with collaborators

### Updating

Edit `src/SCBAccountPlan.jsx`, commit, and push. Vercel redeploys automatically.

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Project structure

```
├── index.html              ← Entry point
├── package.json            ← Dependencies (React + Vite)
├── vite.config.js          ← Build config
└── src/
    ├── main.jsx            ← Mounts the component
    └── SCBAccountPlan.jsx  ← The account plan (all logic here)
```

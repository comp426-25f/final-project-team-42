# 🚀 Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel for your F02 submission.

---

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All code changes are committed
- [ ] Build passes locally: `npm run build`
- [ ] All three features work locally
- [ ] No critical errors in console

### 2. Supabase Setup
- [ ] Supabase project is active (not paused)
- [ ] Storage bucket `group-files` exists
- [ ] Storage bucket is set to **public**
- [ ] Database tables exist: `users`, `groups`, `memberships`, `messages`
- [ ] Realtime is enabled for `messages` table
- [ ] Have your Supabase credentials ready:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - [ ] `DATABASE_URL`

### 3. GitHub Repository
- [ ] All changes are pushed to GitHub
- [ ] Repository is accessible
- [ ] Branch is `main` or `master`

---

## 🔧 Deployment Steps

### Step 1: Access Vercel
- [ ] Go to https://vercel.com
- [ ] Log in or create account
- [ ] Click "Add New..." → "Project"

### Step 2: Import Repository
- [ ] Select GitHub as source
- [ ] Find and select `final-project-team-42`
- [ ] Click "Import"

### Step 3: Configure Project
- [ ] Framework: **Next.js** (auto-detected)
- [ ] Root Directory: `./` (default)
- [ ] Build Command: `npm run build` (default)
- [ ] Output Directory: `.next` (default)

### Step 4: Add Environment Variables
Click "Environment Variables" and add:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - Value: `https://[your-project].supabase.co`
  - Environments: Production, Preview, Development

- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - Value: Your Supabase anon/public key
  - Environments: Production, Preview, Development

- [ ] `DATABASE_URL`
  - Value: `postgresql://postgres:[password]@[host]:5432/postgres`
  - Environments: Production, Preview, Development

- [ ] `OPENAI_KEY` (optional)
  - Value: Your OpenAI API key
  - Environments: Production, Preview, Development

### Step 5: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Check for any build errors

---

## 🧪 Post-Deployment Testing

### Step 1: Access Your Deployment
- [ ] Copy your deployment URL: `https://[your-project].vercel.app`
- [ ] Open URL in browser
- [ ] Verify landing page loads

### Step 2: Test Feature 1 - Authentication
- [ ] Navigate to `/signup`
- [ ] Create a new account
- [ ] Verify redirect to dashboard
- [ ] Log out
- [ ] Log back in
- [ ] Verify session persists on refresh

### Step 3: Test Feature 2 - Study Groups
- [ ] Click "Create Group"
- [ ] Fill in group details
- [ ] Verify group appears on dashboard
- [ ] Click on group card
- [ ] Verify group detail page loads

### Step 4: Test Feature 3 - Shared Notes
- [ ] On group page, type a message
- [ ] Click Send
- [ ] Verify message appears
- [ ] Click Upload button
- [ ] Select an image file
- [ ] Click Send
- [ ] Verify image appears
- [ ] Upload a PDF file
- [ ] Verify PDF link appears
- [ ] Open in second browser window
- [ ] Post message in one window
- [ ] Verify it appears in both windows

### Step 5: Verify Data Persistence
- [ ] Refresh the page
- [ ] Verify all messages still appear
- [ ] Close and reopen browser
- [ ] Verify you're still logged in
- [ ] Verify data is still there

---

## 📝 GradeScope Submission

### Information to Collect
- [ ] GitHub Repository URL: `https://github.com/comp426-25f/final-project-team-42`
- [ ] Project Board URL: `[Your GitHub Projects URL]`
- [ ] Vercel Deployment URL: `https://[your-project].vercel.app`

### Features to List
1. [ ] **User Authentication & Profile Management**
   - Testing: See `FEATURE_TESTING_GUIDE.md` - Feature 1

2. [ ] **Study Group Management**
   - Testing: See `FEATURE_TESTING_GUIDE.md` - Feature 2

3. [ ] **Shared Notes Board with File Uploads**
   - Testing: See `FEATURE_TESTING_GUIDE.md` - Feature 3

### Testing Instructions
- [ ] Copy relevant sections from `FEATURE_TESTING_GUIDE.md`
- [ ] Include specific URLs for testing
- [ ] Mention any test accounts if needed

---

## 🐛 Troubleshooting

### Build Fails
- [ ] Check build logs in Vercel dashboard
- [ ] Verify all environment variables are set
- [ ] Check for syntax errors in code
- [ ] Ensure `package.json` has all dependencies

### "Unauthorized" Errors
- [ ] Verify Supabase environment variables are correct
- [ ] Check Supabase project is active
- [ ] Try logging out and back in
- [ ] Check browser console for specific errors

### File Upload Fails
- [ ] Verify `group-files` bucket exists in Supabase
- [ ] Ensure bucket is set to public
- [ ] Check file size is under 10MB
- [ ] Verify Supabase Storage URL is correct

### Real-time Not Working
- [ ] Enable Realtime in Supabase project settings
- [ ] Enable replication for `messages` table
- [ ] Check browser console for WebSocket errors
- [ ] Try refreshing the page

### Database Connection Errors
- [ ] Verify `DATABASE_URL` format is correct
- [ ] Check Supabase project is not paused
- [ ] Ensure database tables exist
- [ ] Check connection string has correct password

---

## 🔄 If You Need to Redeploy

### Option 1: Push to GitHub (Automatic)
```bash
git add .
git commit -m "Fix: your changes"
git push origin main
```
Vercel will automatically redeploy.

### Option 2: Manual Redeploy
- [ ] Go to Vercel Dashboard
- [ ] Select your project
- [ ] Click "Deployments"
- [ ] Click "..." on latest deployment
- [ ] Click "Redeploy"

---

## ⚠️ Important Reminders

- [ ] **DO NOT** push breaking changes after submitting for grading
- [ ] Keep deployment stable during grading period
- [ ] Test everything on deployed version before submitting
- [ ] Make sure GitHub repo is up to date
- [ ] Save your Vercel deployment URL
- [ ] Take screenshots of working features (optional but helpful)

---

## ✨ Final Verification

Before submitting to GradeScope:

- [ ] Deployment URL is accessible
- [ ] All three features work on deployed version
- [ ] No console errors on deployed version
- [ ] GitHub repository is up to date
- [ ] All team members have commits
- [ ] Testing instructions are clear
- [ ] All links are correct

---

## 🎉 You're Ready!

Once all items are checked:
1. Copy your deployment URL
2. Fill out the GradeScope form
3. Submit before the deadline
4. Celebrate! 🎊

---

## 📚 Additional Resources

- **Detailed Deployment Guide:** `DEPLOYMENT.md`
- **Quick Start Guide:** `VERCEL_QUICK_START.md`
- **Feature Testing Guide:** `FEATURE_TESTING_GUIDE.md`
- **Submission Summary:** `F02_SUBMISSION_SUMMARY.md`

Good luck with your submission! 🚀

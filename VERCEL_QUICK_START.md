# Vercel Deployment - Quick Start Guide

## 🚀 Fastest Way to Deploy (5 minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for F02 deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `final-project-team-42` repository
4. Click "Import"

### Step 3: Add Environment Variables

In the Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
DATABASE_URL=your_postgres_connection_string
```

**Where to find these:**
- Supabase Dashboard → Project Settings → API
- Copy the values from your local `.env` file

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Copy your deployment URL: `https://your-project.vercel.app`

---

## ✅ Pre-Deployment Checklist

Before deploying, make sure:

- [ ] All code is committed and pushed to GitHub
- [ ] `.env` file has correct Supabase credentials
- [ ] Supabase Storage bucket `group-files` exists and is public
- [ ] Database tables are created (users, groups, memberships, messages)
- [ ] Local build works: `npm run build`
- [ ] All three features are working locally

---

## 🔧 Supabase Setup Verification

### Check Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Ensure `group-files` bucket exists
3. Make it public: Bucket Settings → Public bucket (toggle ON)

### Check Database Tables
1. Go to Supabase Dashboard → Table Editor
2. Verify these tables exist:
   - `users`
   - `groups`
   - `memberships`
   - `messages`

### Check Realtime
1. Go to Supabase Dashboard → Database → Replication
2. Ensure `messages` table has replication enabled

---

## 📝 For GradeScope Submission

You'll need to provide:

1. **Three Features Implemented:**
   - User Authentication & Profile Management
   - Study Group Management
   - Shared Notes Board with File Uploads

2. **Testing Instructions:**
   - See `FEATURE_TESTING_GUIDE.md` for detailed testing steps

3. **GitHub Repository:**
   - `https://github.com/comp426-25f/final-project-team-42`

4. **Project Board:**
   - Your GitHub Projects board URL

5. **Vercel Deployment URL:**
   - `https://your-project.vercel.app` (from Step 4 above)

---

## 🐛 Common Issues & Fixes

### Build Fails on Vercel
**Problem:** Build fails with TypeScript or ESLint errors

**Solution:** The `next.config.ts` is already configured to ignore ESLint errors during builds. If still failing, check:
- Environment variables are set correctly
- All dependencies are in `package.json`
- No syntax errors in code

### Database Connection Error
**Problem:** "Unauthorized" or database connection errors

**Solution:**
- Double-check `DATABASE_URL` in Vercel environment variables
- Ensure Supabase project is active (not paused)
- Verify connection string format: `postgresql://...`

### File Upload Not Working
**Problem:** Files fail to upload or show errors

**Solution:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set
- Check Supabase Storage bucket `group-files` exists
- Ensure bucket is set to public
- Verify storage policies allow uploads

### Realtime Updates Not Working
**Problem:** Messages don't appear in real-time

**Solution:**
- Enable Realtime in Supabase project settings
- Enable replication for `messages` table
- Check browser console for WebSocket errors

---

## 🔄 Redeploying After Changes

Vercel automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Fix: your changes"
git push origin main
```

Or manually trigger deployment:
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click "..." → "Redeploy"

---

## 📊 Monitoring Your Deployment

### Check Build Status
- Vercel Dashboard → Your Project → Deployments
- Click on latest deployment to see logs

### Check Runtime Logs
- Vercel Dashboard → Your Project → Logs
- View real-time application logs

### Check Analytics
- Vercel Dashboard → Your Project → Analytics
- See page views and performance metrics

---

## 🎯 Important for F02

- **DO NOT** push breaking changes after deploying for grading
- Keep your deployment stable with the three working features
- Test everything on the deployed version before submitting
- Make sure your GitHub repo matches your deployment

---

## 📞 Need Help?

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify Supabase Dashboard for service status
4. Review `DEPLOYMENT.md` for detailed troubleshooting

---

## ✨ Your Deployment is Ready!

Once deployed, test all three features:
1. Sign up / Log in
2. Create a study group
3. Post messages and upload files

Copy your Vercel URL and submit to GradeScope! 🎉

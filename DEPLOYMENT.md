# Deployment Guide for Vercel

## Prerequisites

Before deploying to Vercel, ensure you have:

- A Vercel account (sign up at https://vercel.com)
- Your Supabase project credentials
- Git repository pushed to GitHub

## Step 1: Prepare Your Environment Variables

You'll need the following environment variables from your `.env` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
OPENAI_KEY=your_openai_key (if using AI features)
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Your Git Repository**
   - Select your GitHub repository: `final-project-team-42`
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add each variable from your `.env` file:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
     - `DATABASE_URL`
     - `OPENAI_KEY` (if applicable)
   - Make sure to add them for **Production**, **Preview**, and **Development** environments

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy from Project Root**

   ```bash
   cd /Users/megangao/final-project-team-42
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N` (for first deployment)
   - What's your project's name? Enter a name
   - In which directory is your code located? `./`
   - Want to override the settings? `N`

5. **Add Environment Variables**

   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
   vercel env add DATABASE_URL
   vercel env add OPENAI_KEY
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 3: Verify Deployment

1. **Check Build Logs**
   - In Vercel dashboard, go to your project
   - Click on the latest deployment
   - Review build logs for any errors

2. **Test Your Application**
   - Visit your deployment URL
   - Test the three implemented features:
     1. group chat Management
     2. Shared Notes Board with File Uploads
     3. User Authentication

3. **Check Supabase Connection**
   - Ensure database queries work
   - Verify file uploads to Supabase Storage
   - Test realtime subscriptions

## Step 4: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Verify environment variables are set correctly
- Review build logs in Vercel dashboard

### Database Connection Issues

- Ensure `DATABASE_URL` is correct
- Check Supabase project is active
- Verify database tables exist

### File Upload Issues

- Confirm Supabase Storage bucket `group-files` exists
- Check bucket is set to public
- Verify storage policies allow uploads

### Realtime Not Working

- Ensure Supabase Realtime is enabled for your project
- Check that table replication is enabled for `messages` table

## Important Notes for F02 Submission

- **Do NOT sync development work to deployment during grading**
- Keep your deployment stable with the three working features
- Make sure your GitHub repo is up to date before deploying
- Test all three features on the deployed version before submitting

## Redeployment

To redeploy after making changes:

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Automatic Deployment**
   - Vercel automatically deploys on push to main branch
   - Or manually trigger deployment in Vercel dashboard

3. **Manual Deployment via CLI**
   ```bash
   vercel --prod
   ```

## Getting Your Deployment URL

Your deployment URL will be in the format:

- Production: `https://your-project-name.vercel.app`
- Preview: `https://your-project-name-git-branch.vercel.app`

Copy this URL for your GradeScope submission.

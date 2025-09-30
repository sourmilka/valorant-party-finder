# 🚀 Deploy Your Valorant Party Finder

## Quick Start - Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Valorant Party Finder"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/valorant-party-finder.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Add Environment Variables:**
   - `MONGODB_URI`: `mongodb+srv://jgero961_db_user:5vS64ihmut6ImZ7i@cluster0.n1v0f5m.mongodb.net/valorant-party-finder?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET`: `your-super-secret-jwt-key-change-this-in-production`
   - `NEXTAUTH_URL`: `https://your-app-name.vercel.app` (update after deployment)
   - `NEXTAUTH_SECRET`: `your-nextauth-secret-key`
6. **Click "Deploy"**

### Step 3: Update NEXTAUTH_URL
After deployment, update the `NEXTAUTH_URL` environment variable to your actual Vercel URL.

## Alternative: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow prompts and add environment variables
```

## Your Website Will Be Live At:
- **Vercel URL**: `https://your-app-name.vercel.app`
- **Custom Domain**: Add your own domain in Vercel dashboard

## Environment Variables for Production:

```env
MONGODB_URI=mongodb+srv://jgero961_db_user:5vS64ihmut6ImZ7i@cluster0.n1v0f5m.mongodb.net/valorant-party-finder?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key
```

## Post-Deployment Checklist:
- ✅ Website loads correctly
- ✅ User registration works
- ✅ User login works
- ✅ Party creation works
- ✅ Database connection works
- ✅ All pages accessible

## Custom Domain (Optional):
1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Vercel dashboard → Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

Your Valorant Party Finder will be live and accessible worldwide! 🎮✨

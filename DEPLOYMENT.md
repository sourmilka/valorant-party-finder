# 🚀 Valorant Party Finder - Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com) and sign up/login**
2. **Click "New Project"**
3. **Import your GitHub repository** (you'll need to push to GitHub first)
4. **Configure Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://jgero961_db_user:5vS64ihmut6ImZ7i@cluster0.n1v0f5m.mongodb.net/valorant-party-finder?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=your-nextauth-secret-key
   ```
5. **Click "Deploy"**

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory:**
   ```bash
   vercel
   ```

4. **Follow the prompts and add environment variables**

### Method 3: Deploy via GitHub (Automatic)

1. **Push your code to GitHub**
2. **Connect your GitHub repo to Vercel**
3. **Vercel will automatically deploy on every push**

## Alternative: Netlify Deployment

### Deploy to Netlify

1. **Go to [netlify.com](https://netlify.com)**
2. **Drag and drop your project folder** or connect to GitHub
3. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Add environment variables in Netlify dashboard**

## Environment Variables Required

Make sure to set these in your hosting platform:

```env
MONGODB_URI=mongodb+srv://jgero961_db_user:5vS64ihmut6ImZ7i@cluster0.n1v0f5m.mongodb.net/valorant-party-finder?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret-key
```

## Pre-Deployment Checklist

- ✅ MongoDB Atlas connection working
- ✅ All environment variables configured
- ✅ No build errors
- ✅ All pages loading correctly
- ✅ Authentication working
- ✅ Database operations working

## Post-Deployment

1. **Test your live website**
2. **Verify MongoDB connection**
3. **Test user registration/login**
4. **Test party creation**
5. **Update NEXTAUTH_URL to your live domain**

## Custom Domain (Optional)

1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **In Vercel dashboard, go to your project**
3. **Go to Settings > Domains**
4. **Add your custom domain**
5. **Update DNS records as instructed**

## Monitoring & Analytics

- **Vercel Analytics**: Built-in performance monitoring
- **MongoDB Atlas**: Database monitoring
- **Error tracking**: Consider adding Sentry for production

## Security Notes

- ✅ Change JWT_SECRET to a strong random string
- ✅ Use HTTPS (automatic with Vercel)
- ✅ MongoDB Atlas has built-in security
- ✅ Rate limiting is already implemented

Your Valorant Party Finder will be live and accessible worldwide! 🎮✨

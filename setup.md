# Valorant Party Finder - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/valorant-party-finder

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Optional: API Keys for future features
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

### 3. Database Setup
Make sure MongoDB is running on your system:
- **Local MongoDB**: Start MongoDB service
- **MongoDB Atlas**: Use your cloud connection string
- **Docker**: `docker run -d -p 27017:27017 mongo`

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Your Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Features Implemented

### ✅ Core Functionality
- **User Authentication**: JWT-based registration and login
- **Party Management**: Create and browse party invitations
- **LFG System**: Looking for Group requests for solo players
- **Real-time Features**: Live feeds and instant updates
- **Advanced Filtering**: Filter by rank, region, mode, and more
- **Responsive Design**: Mobile-first with Valorant aesthetics

### ✅ Pages Created
- **Landing Page** (`/`): Hero section with live feeds and statistics
- **Browse Parties** (`/parties`): Advanced filtering and search
- **Create Party** (`/create-party`): Form-based party creation
- **Browse LFG** (`/lfg`): LFG requests with role-based filters
- **Create LFG** (`/create-lfg`): LFG request creation
- **User Dashboard** (`/dashboard`): Personal management hub
- **About/FAQ** (`/about`): Educational content and support
- **Authentication** (`/auth/login`, `/auth/register`): User authentication

### ✅ Technical Features
- **Next.js 14** with App Router and TypeScript
- **MongoDB** with Mongoose for database operations
- **Tailwind CSS** with custom Valorant theme
- **Framer Motion** for smooth animations
- **React Hook Form** with Zod validation
- **Professional UI/UX** with Valorant color scheme

## 🎨 Design Features

### Valorant-Inspired UI/UX
- **Color Scheme**: Valorant red (#FF4655), dark backgrounds, gold accents
- **Typography**: Inter font family for modern, clean text
- **Animations**: Smooth transitions and hover effects
- **Icons**: Lucide React icons with Valorant styling
- **Cards**: Glass-morphism effects with Valorant borders
- **Responsive**: Mobile-first design for all screen sizes

## 📱 Usage Guide

### Creating a Party
1. Go to `/create-party`
2. Fill in party details (size, region, rank, mode)
3. Enter your Valorant party code
4. Add description and tags (optional)
5. Submit to create your party invitation

### Posting LFG Request
1. Go to `/create-lfg`
2. Enter your Riot username
3. Select your rank and preferred roles
4. Set your availability
5. Add description and tags (optional)
6. Submit to post your LFG request

### Browsing and Filtering
- Use the filter panels to narrow down results
- Search by rank, region, mode, or tags
- Sort by newest, oldest, or most viewed
- Copy party codes or usernames with one click

## 🔧 Development

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── parties/            # Party-related pages
│   ├── lfg/                # LFG-related pages
│   ├── dashboard/          # User dashboard
│   └── about/              # About/FAQ page
├── components/             # React components
├── lib/                    # Utility functions
├── models/                 # Database models
├── types/                  # TypeScript types
└── public/                 # Static assets
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Static site deployment
- **AWS**: Full-stack deployment with EC2/RDS
- **DigitalOcean**: VPS deployment

## 🎯 Next Steps

### Planned Features
- [ ] Real-time WebSocket updates
- [ ] Advanced moderation system
- [ ] Email notifications
- [ ] Social sharing integration
- [ ] Mobile app (future)

### Performance Optimizations
- [ ] Image optimization
- [ ] Caching strategies
- [ ] Database indexing
- [ ] CDN integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This website is not affiliated with Riot Games, Inc. Valorant is a trademark of Riot Games, Inc.

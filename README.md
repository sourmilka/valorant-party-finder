# Valorant LFG / Party Finder

Professional Next.js 14 application to create and browse Valorant Parties and LFG posts with a modern Valorant-inspired UI/UX. Backed by MongoDB (Mongoose), hardened API routes, rate limiting, TTL auto-expiry, and Vercel Analytics.

## 🎮 Features Implemented

### ✅ Core Features
- **Create Party**: Valorant-styled form with Riot ID split (name + #tag), rank preview, time-to-live selector, code paste, Discord link, and compact requirements
- **Post LFG**: Matching form design (Riot ID split, rank preview, server + availability, playstyle chips, preferences)
- **Activity Feed**: Redesigned Party and LFG cards (rank badge, hero code/username, info grids, agents/roles, tags, time-left)
- **Responsive UI**: Tailwind + Framer Motion with consistent spacing, alignment, and accessibility
- **Copy & Actions**: One-click copy for party code and username with visual feedback

[🚀 **LIVE DEMO**](https://valo-jgero961-8734s-projects.vercel.app) • [📖 **DOCUMENTATION**](./docs) • [🐛 **REPORT BUG**](../../issues) • [✨ **REQUEST FEATURE**](../../issues)


### Create Party (tab)
- Riot ID split input (`name` + `#tag`), rank selector with image preview
- Server, mode, party size, Discord link (discord.gg/*) validation
- Code field with Paste-from-clipboard helper
- "Active For" time chips (with 45 min) → sets TTL
- Compact Player Requirements, Looking For roles with icons, Preferred Agents grid

### Post LFG (tab)
- Matching layout to Create Party: IGN + Rank, Server + Availability
- Playstyle chips (Entry, Support, IGL, Fragger, Flex)
- Player Preferences selector (chips)
- Submit disabled until required fields set; loading state

### Authentication (`/auth/login`, `/auth/register`)
- Clean, modern login/register forms
- Form validation with error handling
- Social login options (prepared)
- Responsive design

## 🗄️ Database Schema

### User Model
```typescript
{
  email: string;
  password: string;
  riotId: string;
  bio?: string;
  verified: boolean;
  blocked: string[];
}
```

### Party Invite Model
```typescript
{
  userId: string;
  size: 'Solo' | 'Duo' | 'Trio' | 'FourStack';
  region: string;
  rank: string;
  mode: string;
  code: string;
  description?: string;
  tags: string[];
  expiresAt: Date;
  views: number;
  status: 'Active' | 'Expired' | 'Cancelled';
}
```

### LFG Request Model
```typescript
{
  userId: string;
  username: string;
  rank: string;
  playstyle: string[];
  availability: string;
  description?: string;
  tags: string[];
  expiresAt: Date;
  views: number;
  status: 'Active' | 'Expired' | 'Cancelled';
}
```

## 🔧 API Endpoints (App Router)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Parties
- `GET /api/parties` - List parties (sorted by `createdAt`)
- `POST /api/parties` - Create new party
  - Validates fields, clamps duration (5–120 min), enforces rate limits

### LFG Requests
- `GET /api/lfg` - List LFG posts (sorted by `createdAt`)
- `POST /api/lfg` - Create new LFG request
  - Validates fields and trims/normalizes inputs

## 🎯 Features from Project Specification

### ✅ Implemented
- [x] User registration and authentication
- [x] Party invitation creation with code validation
- [x] LFG request system for solo players
- [x] Real-time browsing and filtering
- [x] Valorant-inspired UI/UX design
- [x] Responsive mobile-first design
- [x] Professional file structure
- [x] Database integration with MongoDB
- [x] Form validation and error handling
- [x] Security features (JWT, input validation)

### 🚧 In Progress
- [ ] User dashboard with analytics
- [ ] Real-time WebSocket updates
- [ ] Advanced moderation features
- [ ] Email notifications
- [ ] Social sharing integration

### 📋 Planned
- [ ] About/FAQ page
- [ ] User profile management
- [ ] Advanced search functionality
- [ ] Reporting and moderation system
- [ ] Premium features
- [ ] Mobile app (future)

## 🛠️ Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
# npm test           # (optional) Run tests
```

### Project Structure (simplified)
```
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   └── globals.css         # Global styles
├── components/             # React components
├── lib/                    # Utility functions
├── models/                 # Database models
├── types/                  # TypeScript types
└── public/                 # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repo to Vercel
2. Set env vars in Vercel: `MONGODB_URI`, `JWT_SECRET`, `NEXTAUTH_URL`
3. Push to `master` → auto-deploy
4. Analytics visible in Vercel dashboard (navigate your site to collect data)

### Other Platforms
- **Netlify**: Static site deployment
- **AWS**: Full-stack deployment with EC2/RDS
- **DigitalOcean**: VPS deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Riot Games** for Valorant and inspiration
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Lucide** for beautiful icons

---

**Note**: This website is not affiliated with Riot Games, Inc. Valorant is a trademark of Riot Games, Inc.

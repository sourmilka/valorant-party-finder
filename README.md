# Valorant Party Finder

A professional Next.js website for finding and creating Valorant parties with real-time features, built with Valorant-inspired design and UI/UX.

## 🎮 Features Implemented

### ✅ Core Features
- **User Authentication**: JWT-based auth with registration/login
- **Party Management**: Create, browse, and join party invitations
- **LFG System**: Looking for Group requests for solo players
- **Real-time Updates**: Live feeds and instant notifications
- **Advanced Filtering**: Filter by rank, region, mode, and more
- **Responsive Design**: Mobile-first design with Valorant aesthetics

### ✅ Pages Created
- **Landing Page**: Hero section with live feeds and statistics
- **Browse Parties**: Advanced filtering and search functionality
- **Create Party**: Form-based party creation with validation
- **Authentication**: Login and registration pages
- **User Dashboard**: (Coming next)

### ✅ Technical Implementation
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **MongoDB** with Mongoose for database
- **Tailwind CSS** with custom Valorant theme
- **Framer Motion** for animations
- **React Hook Form** with Zod validation
- **Real-time features** with Socket.io
- **Professional UI/UX** with Valorant color scheme

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd valorant-party-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/valorant-party-finder
   JWT_SECRET=your-super-secret-jwt-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design Features

### Valorant-Inspired UI/UX
- **Color Scheme**: Valorant red (#FF4655), dark backgrounds, and gold accents
- **Typography**: Inter font family for modern, clean text
- **Animations**: Smooth transitions and hover effects
- **Icons**: Lucide React icons with Valorant-themed styling
- **Cards**: Glass-morphism effects with Valorant borders
- **Buttons**: Valorant-style buttons with hover animations

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Breakpoints**: 320px (mobile), 768px (tablet), 1024px (desktop)
- **Touch-Friendly**: Large buttons and easy navigation on mobile

## 📱 Pages Overview

### Landing Page (`/`)
- Hero section with Valorant branding
- Live feeds of recent parties and LFG requests
- Statistics and feature highlights
- Call-to-action buttons

### Browse Parties (`/parties`)
- Grid layout of party cards
- Advanced filtering system
- Real-time search and sorting
- Load more functionality

### Create Party (`/create-party`)
- Multi-step form with validation
- Party code generation
- Tag system for categorization
- Tips and guidance sidebar

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

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Parties
- `GET /api/parties` - Get parties with filtering
- `POST /api/parties` - Create new party

### LFG Requests
- `GET /api/lfg` - Get LFG requests with filtering
- `POST /api/lfg` - Create new LFG request

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
npm test            # Run tests
```

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── parties/            # Party-related pages
│   └── globals.css         # Global styles
├── components/             # React components
├── lib/                    # Utility functions
├── models/                 # Database models
├── types/                  # TypeScript types
└── public/                 # Static assets
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

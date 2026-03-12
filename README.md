# NYUAD Travel Guide v2

A modernized, community-driven travel guide platform where users can share local recommendations from cities around the world. Built with React, Supabase, and modern web technologies.

## 🌍 About

This is the 2026 modernization of the original 2018 NYUAD Travel Guide student project. The v2 platform preserves all 49 original student travel entries while adding modern features like user authentication, real-time updates, photo uploads, and Google Maps integration.

**Original 2018 Version**: [github.com/alyssagabrielleganyu/nyuad-travel-guide](https://github.com/alyssagabrielleganyu/nyuad-travel-guide)

## ✨ Features

- 🗺️ **Interactive World Map** - Explore travel guides on a beautiful map with marker clustering
- 👤 **User Accounts** - Sign up to create and manage your own travel guides
- 📸 **Photo Uploads** - Add up to 5 photos per guide to showcase locations
- 🔍 **Search & Filtering** - Find guides by country, city, or content type
- ⚡ **Real-time Updates** - See new guides appear instantly without refreshing
- 🏙️ **Multiple Guides Per City** - Support for multiple recommendations in the same location
- 🗺️ **Google Maps Integration** - Direct links to locations and embedded maps
- 📱 **Mobile Responsive** - Optimized for all devices
- 🌐 **49 Legacy Entries** - Preserved travel guides from the original 2018 project

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router v6** - Client-side routing
- **React Leaflet** - Interactive maps
- **React Query** - Data fetching and caching
- **Zustand** - State management

### Backend & Database
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Supabase Auth** - Email/password and social authentication
- **Supabase Storage** - Image hosting (5GB free tier)
- **PostGIS** - Geospatial queries and indexing

### Deployment
- **Vercel** - Free hosting with automatic deployments
- **GitHub** - Version control and CI/CD

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)
- Google Maps API key (for geocoding)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alyssagabrielleganyu/nyuad-travel-guide-v2.git
   cd nyuad-travel-guide-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your keys:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
   ```

4. **Set up Supabase database**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL migration in `supabase/migrations/001_initial_schema.sql`
   - Enable PostGIS extension
   - Configure storage bucket for photos

5. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

### Data Migration

To migrate the 49 legacy entries from the 2018 version:

```bash
npm run migrate-data
```

This will read `data-backup-2026.json` from the original project and import all entries into Supabase.

## 📂 Project Structure

```
nyuad-travel-guide-v2/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Map/            # Map visualization
│   │   ├── Guide/          # Guide display and forms
│   │   ├── Search/         # Search and filtering
│   │   ├── Auth/           # Authentication
│   │   └── Layout/         # Layout components
│   ├── pages/              # Route pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities (Supabase, geocoding)
│   └── utils/              # Helper functions
├── scripts/                # Build and migration scripts
├── supabase/               # Database migrations
└── public/                 # Static assets
```

## 🗄️ Database Schema

### Tables
- **guides** - Travel guide entries with location and content
- **guide_photos** - Photos associated with guides
- **users** - User accounts (managed by Supabase Auth)

### Key Features
- Full-text search with PostgreSQL tsvector
- Geospatial indexing with PostGIS
- Row-level security policies
- Real-time subscriptions

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository at [vercel.com](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy!

Your site will be live at `https://your-project.vercel.app`

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is a student educational project from NYU Abu Dhabi.

## 🙏 Acknowledgments

- Original 2018 NYUAD Travel Guide creators and contributors
- All 49 students who submitted their hometown recommendations
- NYU Abu Dhabi community

## 📧 Contact

Created by [@alyssagabrielleganyu](https://github.com/alyssagabrielleganyu)

---

**From 2018 to 2026** - Preserving memories, building community 🌍✨

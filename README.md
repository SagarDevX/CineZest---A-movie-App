# CineZest — Netflix-Style Movie App

A full-stack movie streaming app built with Next.js, Supabase, and TMDB API. Browse trending movies, watch trailers, and save your favorites!

<img width="1882" height="902" alt="cinezest sc" src="https://github.com/user-attachments/assets/c33212e4-6577-405f-9bcb-fcc436a4d326" />


## 🚀 Live Demo - (https://cinezest.vercel.app/)

---

## ✨ Features

- 🔐 **Authentication** — Login with Email/Password or Google
- 🎬 **Movie Discovery** — Trending, Popular, Top Rated, Now Playing
- 🎭 **8+ Categories** — Action, Drama, Horror, Comedy, Korean, Hindi & more
- ▶️ **Trailer Player** — Watch official YouTube trailers
- ❤️ **Wishlist** — Save movies to watch later
- 🔍 **Search** — Search any movie instantly
- 📱 **Fully Responsive** — Works on mobile, tablet & desktop
- ✨ **Smooth Animations** — Powered by Framer Motion

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 15 | React Framework |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| TMDB API | Movie Data |
| Supabase | Auth & Database |
| Vercel | Deployment |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- TMDB API key

### Installation

1. **Clone the repo**
```bash
git clone https://github.com/yourusername/movie-app.git
cd movie-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env.local` file**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

---

## 🔧 Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

---

## 📁 Project Structure

```
movie-app/
├── app/
│   ├── page.tsx          # Homepage
│   ├── login/
│   │   └── page.tsx      # Login page
│   ├── profile/
│   │   └── page.tsx      # Profile page
│   └── layout.tsx        # Root layout
├── components/
│   ├── card.tsx          # Movie card component
│   ├── navbar.tsx        # Navigation bar
│   └── categories/
│       ├── Action.tsx
│       ├── Drama.tsx
│       ├── Animation.tsx
│       └── ...more
├── lib/
│   └── supabase.ts       # Supabase client
└── public/
    └── screenshots/
```

---

## 🎬 API Endpoints

All movie data comes from TMDB API through a custom Vercel proxy:

| Section | Endpoint |
|---|---|
| Trending Today | `endpoint=trending/movie/day` |
| Trending Week | `endpoint=trending/movie/week` |
| Popular | `endpoint=movie/popular` |
| Now Playing | `endpoint=movie/now_playing` |
| Top Rated | `endpoint=movie/top_rated` |
| Action | `endpoint=discover/movie&with_genres=28` |
| Drama | `endpoint=discover/movie&with_genres=18` |
| Horror | `endpoint=discover/movie&with_genres=27` |
| Korean | `endpoint=discover/movie&with_original_language=ko` |
| Hindi | `endpoint=discover/movie&with_original_language=hi` |

---

## 🔐 Authentication

- Email & Password signup/login
- Google OAuth login
- Protected routes
- User session management

All powered by **Supabase Auth**

---

## 🗄️ Database Schema

### Wishlist Table
| Column | Type | Description |
|---|---|---|
| id | int8 | Auto increment |
| user_id | uuid | References auth.users |
| movie_id | text | TMDB movie ID |
| movie_title | text | Movie title |
| poster_path | text | Movie poster URL |
| vote_average | float4 | Movie rating |

---

## 🚀 Deployment

This app is deployed on **Vercel**:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Add environment variables
5. Click Deploy ✅

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE)

---

## 👨‍💻 Author

**Sagar Pundir**
- LinkedIn: [linkedin.com/in/sagaadev](https://linkedin.com/in/sagaadev)
- GitHub: [github.com/SagarDevX](https://github.com/SagarDevX)

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

---

*Built with ❤️ using Next.js and TMDB API*

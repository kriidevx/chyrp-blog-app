# 🌌 Chyrp — Modern Blogging Platform  
_A next-generation, modular, and extensible blogging platform inspired by the classic Chyrp engine, rebuilt for the modern web._

***

## Project Overview  
Chyrp Modernized transforms the classic Chyrp blogging engine into a cutting-edge, API-driven full-stack web application. Powered by Next.js 14, React 18, Tailwind CSS, and Supabase, it delivers a fast, responsive, and modular platform for bloggers. Featuring real-time updates, multiple rich content types (“Feathers”), advanced UI/UX designs with cyberpunk aesthetics, and a secure authentication system, Chyrp is tailored for flexibility, interactivity, and modern web standards.

***

## 🎯 Core Features

### Content & Interaction  
- Support for diverse content types (“Feathers”): Text, Photo, Quote, Link, Video, Audio, and Markdown with MathJax support  
- Post management capabilities: drafting, publishing, editing, unpublishing, and deleting posts  
- Interactive user experience: real-time comments (with threading and emoji reactions), double-tap likes, reaction emojis, and live post view counters  
- Filtering and search: Tags, categories, and full-text search on posts and users  

### UI/UX Highlights  
- Glassmorphism with translucent surfaces and backdrop blur  
- Gradient accents and electric blue-to-cyan color palette  
- Micro-animations including hover effects, loading skeletons, and page transitions  
- Automatic dark/light theme switching with smooth CSS transitions  
- Responsive design supporting mobile through ultra-wide displays  

### Performance & Security  
- Next.js Image optimization (lazy loading, WebP support, blur placeholders)  
- Code splitting and dynamic imports for faster load times  
- Incremental Static Regeneration and API route caching  
- Secure authentication via Supabase Auth with social login (GitHub, Google) and magic link  
- Spam prevention with MAPTCHA integration for form security  
- Edge-ready deployment on Vercel for global fast delivery  

### Extensibility & Architecture  
- Modular React components designed for reusability and scalability  
- Comprehensive RESTful API endpoints supporting posts, users, comments, likes, reactions, profiles, and metadata  
- Supabase backend with PostgreSQL, row-level security policies, and custom SQL functions  
- Rich media uploads and management (image, video, audio) via Supabase Storage  

***

## 🏗️ Project Structure

```
app/                  # Next.js app router pages and layouts
components/           # Reusable React UI components
├─ layout/            # Navbar, Footer, AuthButtons, UserMenu
├─ profile/           # Profile display and editing components
├─ newpost/           # Post creation modal and feather editors
├─ posts/             # Post display, actions, comments, likes
├─ homepage/          # Homepage and trending posts
context/              # React contexts: Auth, Theme, Notifications
hooks/                # Custom React hooks (usePosts, useLikes, etc.)
lib/                  # Supabase helpers and utility functions
public/               # Static assets: images, CSS
styles/               # Global styles
supabase/             # Database schema, RLS policies, SQL functions
typings/              # TypeScript types and interfaces
```

***

## 🖥️ API Endpoints Summary

| Endpoint                        | Method | Purpose                                         | Auth Required |
| -------------------------------|--------|------------------------------------------------|--------------|
| `/api/auth/session`             | GET    | Get current authenticated user session info    | Yes          |
| `/api/posts/new`                | POST   | Create a new post                               | Yes          |
| `/api/posts/user`               | GET    | Fetch current user's posts (drafts, published) | Yes          |
| `/api/posts/[slug]`             | GET    | Fetch post details by slug                      | No           |
| `/api/posts/[id]/edit`          | PUT    | Edit an existing post                           | Yes          |
| `/api/posts/[id]/delete`        | DELETE | Delete a post                                  | Yes          |
| `/api/users/create`             | POST   | Create user profile after signup                | Yes          |
| `/api/users/profile/[username]`| GET    | Fetch user profile and published posts          | No           |
| `/api/users/profile/[id]`       | PUT    | Edit user profile                               | Yes          |
| `/api/users/change-password`    | PUT    | Change user password                            | Yes          |
| `/api/comments`                 | GET    | Fetch comments for a post                       | No           |
| `/api/comments`                 | POST   | Add comment to a post                           | Yes          |
| `/api/comments/[id]`            | DELETE | Delete a comment (author or post owner only)    | Yes          |
| `/api/likes`                    | POST   | Toggle like/unlike on a post                    | Yes          |
| `/api/reactions`                | POST   | Add emoji reaction to a post                    | Yes          |
| `/api/reactions/[id]`           | DELETE | Remove reaction                                 | Yes          |
| `/api/views/[id]`               | GET    | Increment/get post view count                   | No           |
| `/api/tags`                     | GET    | Fetch all tags                                  | No           |
| `/api/categories`               | GET    | Fetch all categories                            | No           |
| `/api/search`                   | GET    | Search posts and users (query param: `q`)      | No           |
| `/api/sitemap`                  | GET    | Generate sitemap XML                            | No           |

***

## 🎨 UI Components Highlights

- **Navbar:** Glassmorphic with backdrop blur, gradient logo, real-time notifications, animated search with suggestions, mobile-responsive menu  
- **PostCard:** Gradient border animations, hover lift effects, reaction system with animated likes, loading skeleton UI  
- **Lightbox:** Advanced media viewer with zoom (up to 3x), 360° rotation, gesture support for touch devices, smooth transitions, thumbnail preview  
- **CommentForm:** Rich text formatting, live preview, emoji picker, @mentions autocomplete, image/GIF uploads  
- **Footer:** Animated gradient backgrounds, interactive social icons, dynamic stats, back-to-top smooth scroll  

***

## 🎭 Theme System  

Dark and light themes are implemented via JSON configuration files for seamless switching:

**Themes/dark.json**
```json
{
  "colors": {
    "background": "#0f172a",
    "foreground": "#f8fafc",
    "primary": { "default": "#2563eb", "hover": "#1d4ed8" },
    "accent": { "default": "#06b6d4", "hover": "#0891b2" }
  }
}
```

**Themes/light.json**
```json
{
  "colors": {
    "background": "#f8fafc",
    "foreground": "#0f172a",
    "primary": { "default": "#2563eb", "hover": "#3b82f6" },
    "accent": { "default": "#06b6d4", "hover": "#22d3ee" }
  }
}
```

***

## 📦 Installation & Setup

1. **Clone the repository**  
   ```bash
   git clone https://github.com/kriidevx/chyrp-blog-app.git
   cd chyrp-blog-app
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Configure environment variables**  
   Create `.env.local` in the project root with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
   ```

4. **Initialize Supabase backend**  
   - Apply database schema: `supabase/schema.sql`  
   - Set Row Level Security policies: `supabase/policies.sql`  
   - Deploy any SQL functions: `supabase/function.sql`  

5. **Run the development server**  
   ```bash
   npm run dev
   ```

6. **Access the app**  
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

***

## ⚙️ Technology Stack

| Layer       | Technologies                          |
|-------------|------------------------------------|
| Frontend    | Next.js 14 (App Router), React 18, Tailwind CSS + shadcn/ui       |
| Backend     | Supabase (PostgreSQL, Auth, Storage) |
| Media       | File uploads, Markdown & MathJax, Prism syntax highlighting       |
| Deployment  | Vercel for edge-ready global delivery                            |

***

## 🚀 Performance & UX Enhancements

- Smart image optimization with lazy loading and format conversion  
- Dynamic code splitting and route-level lazy loading  
- Incremental Static Regeneration & caching strategies for API and queries  
- Micro-interactions: buttons, inputs, cards, navigation with smooth animations  
- Real-time updates powered by Supabase Realtime  

***

## 🔮 Future Enhancements

- Advanced rights and attribution management for authorship control  
- Improved caching layers for faster load and server response  
- Lightbox modal enhancements for media viewing  
- Enhanced MAPTCHA spam protection  
- Infinite scrolling and improved pagination UI  
- Rich embed content and social sharing integrations  

***

## 📚 Additional Resources

- [Component Storybook](docs/storybook.md)  
- [API Documentation](docs/api.md)  
- [Contributing Guide](CONTRIBUTING.md)  
- [Security Policy](SECURITY.md)  

***

## 📝 License

This project is open-sourced under the **MIT License** © 2025 ChyrpBlog.

***

## 🤝 Contributing  

Contributions are warmly welcomed! Please review the [Contributing Guide](CONTRIBUTING.md) for instructions on how to help improve the platform.

***

This README provides a professional, unified view of the Chyrp Modernized blogging platform, covering its functionality, development setup, architecture, and enhancement roadmap, designed for contributors and users alike.

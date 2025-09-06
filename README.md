# Chyrp Modernized - Modern Blogging Platform

_CloneFest 2025 Project_

---

## Project Overview

Chyrp Modernized is a modern, modular, extensible blogging platform inspired by the original Chyrp engine. Built with Next.js 14, React 18, Tailwind CSS, and Supabase, it delivers a fast, API-driven full-stack web application. The platform supports multiple content types (“Feathers”), rich media uploads, interactive features, and a dynamic dashboard, providing bloggers with a flexible and intuitive experience.

---

## Key Features

- **Content Types (Feathers):** Text, Photo, Quote, Link, Video, Audio, Markdown with MathJax support
- **User Interaction:** Comments, Likes, Reaction Emojis, Post view counters
- **Post Management:** Drafts, Publish/Unpublish, Edit, Delete
- **Filtering & Search:** Tags, Categories, Full-text search across posts and users
- **Responsive UI:** Styled with Tailwind CSS for modern, accessible design
- **Authentication:** Signup, login, password reset via Supabase Auth
- **Media Handling:** File uploads and management for images, video, audio
- **SEO & Performance:** Sitemap generation, caching strategies, syntax highlighting
- **Spam Prevention:** MAPTCHA for forms
- **Extensible Architecture:** Modular components and RESTful API design

---

## Project Structure

app/ # Next.js (App Router) pages and layouts
components/ # Reusable React UI components
├─ layout/ # Navbar, Footer, AuthButtons, UserMenu
├─ profile/ # Profile display and editing components
├─ newpost/ # Post creation modal and feather editors
├─ posts/ # Post display, actions, comments, likes
├─ homepage/ # Homepage components and trending posts
context/ # React contexts (Auth, Theme, Notifications)
hooks/ # Custom hooks (usePosts, useLikes, etc.)
lib/ # Supabase helpers and utility functions
public/ # Static assets (images, CSS)
styles/ # Global CSS files
supabase/ # Database schema, RLS policies, and SQL functions
typings/ # TypeScript types and interfaces

---

## API Endpoints Overview

| Endpoint                        | Method | Purpose                                         | Auth Required |
| ------------------------------- | ------ | ----------------------------------------------- | ------------- |
| `/api/auth/session`             | GET    | Get current authenticated user session info     | Yes           |
| `/api/posts/new`                | POST   | Create a post                                   | Yes           |
| `/api/posts/user`               | GET    | Fetch current user's posts (drafts & published) | Yes           |
| `/api/posts/[slug]`             | GET    | Get post details by slug                        | No            |
| `/api/posts/[id]/edit`          | PUT    | Edit a post                                     | Yes           |
| `/api/posts/[id]/delete`        | DELETE | Delete a post                                   | Yes           |
| `/api/users/create`             | POST   | Create user profile (after signup)              | Yes           |
| `/api/users/profile/[username]` | GET    | Fetch user profile and user’s published posts   | No            |
| `/api/users/profile/[id]`       | PUT    | Edit user profile                               | Yes           |
| `/api/users/change-password`    | PUT    | Change user password                            | Yes           |
| `/api/comments`                 | GET    | Fetch comments for a post                       | No            |
| `/api/comments`                 | POST   | Add a comment to a post                         | Yes           |
| `/api/comments/[id]`            | DELETE | Delete comment (author or post owner only)      | Yes           |
| `/api/likes`                    | POST   | Toggle like/unlike for a post                   | Yes           |
| `/api/reactions`                | POST   | Add reaction (emoji) to a post                  | Yes           |
| `/api/reactions/[id]`           | DELETE | Remove reaction                                 | Yes           |
| `/api/views/[id]`               | GET    | Increment and get post view count               | No            |
| `/api/tags`                     | GET    | Fetch all tags                                  | No            |
| `/api/categories`               | GET    | Fetch all categories                            | No            |
| `/api/search`                   | GET    | Search posts and users (query param `q`)        | No            |
| `/api/sitemap`                  | GET    | Generate sitemap XML                            | No            |

---

## Installation & Setup

1. **Clone the repository**  
   git clone https://github.com/kriidevx/chyrp-blog-app/
   cd chyrp-modernized

2. **Install dependencies**  
   npm install

3. **Configure environment variables**  
   Create a `.env.local` file in the project root with the following:  
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>

4. **Initialize Supabase backend**

- Apply database schema: `supabase/schema.sql`
- Set Row Level Security policies: `supabase/policies.sql`
- Deploy SQL functions if needed: `supabase/function.sql`

5. **Run the development server**  
   npm run dev

6. **Access the app**  
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Technology Stack

- Frontend: Next.js 14 (App Router), React 18, Tailwind CSS
- Backend: Supabase with PostgreSQL, Authentication, and Storage
- Additional tools: Markdown & MathJax, Prism for syntax highlighting, media uploads/storage

---

## Future Enhancements

- Advanced Rights & Attribution Management
- Caching layers for improved performance
- Lightbox modal for enhanced media viewing
- MAPTCHA spam prevention improvements
- Infinite scrolling and enhanced pagination
- Rich embed content and social sharing

---

## License

Licensed under the MIT License.

---

_This README provides a comprehensive overview of the Chyrp Modernized blogging platform, covering features, structure, APIs, setup, and future plans. It serves as a reference for contributors, maintainers, and new developers._

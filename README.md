# रेvvano — Wear Your Mood.

A production-ready, luxury fashion e-commerce frontend built for **रेvvano**, a premium western clothing brand where customers shop by personality, not category. Four signature collections — Soft Feminine, Free Spirit, Bossy, and Rebellious — let every woman find her mood.

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Component library (Radix UI primitives) |
| **Framer Motion** | Animations & micro-interactions |
| **React Router DOM** | Client-side routing |
| **TanStack Query** | Server state & data fetching |
| **Swiper.js** | Carousels & sliders |
| **React Hook Form + Zod** | Form validation |
| **Axios** | HTTP client (API abstraction layer) |
| **Lucide Icons** | Icon system |

## Brand Identity

- **Name:** रेvvano
- **Tagline:** Wear Your Mood.
- **Concept:** Shop by personality, not category. Four moods, four collections.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary | `#111111` | Text, buttons, dark UI |
| Background | `#FAF7F3` | Page background |
| Accent | `#C8A46B` | Gold accent, highlights |
| Text | `#2A2A2A` | Body text |
| Neutral | `#D8CFC4` | Borders, muted elements |

### Typography

- **Headings:** Cormorant Garamond (serif, elegant)
- **Body:** Inter (sans-serif, clean)

## The Four Collections

1. **Soft Feminine** — Pastel colors, elegant, romantic, minimal
2. **Free Spirit** — Boho, relaxed, nature, vacation
3. **Bossy** — Power dressing, blazers, formal, luxury
4. **Rebellious** — Streetwear, bold, dark, leather

## Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero, shop by mood, featured collection, new arrivals, best sellers, trending, editor's picks, testimonials, Instagram gallery, newsletter |
| Shop | `/shop` | Full product catalog with filters (mood, category, quick filters), sorting, search |
| Collections | `/collections` | Overview of all four collections |
| Collection Detail | `/collections/:slug` | Collection hero + filtered products |
| Product Detail | `/product/:slug` | Image gallery, color/size selector, quantity, add to cart, wishlist, accordion details, related products, recently viewed |
| Cart | `/cart` | Line items, quantity selector, coupon codes, order summary |
| Wishlist | `/wishlist` | Saved products, move to cart |
| Checkout | `/checkout` | 3-step flow: shipping → payment → review |
| Login | `/login` | Email/password sign in |
| Signup | `/signup` | Account creation with form validation |
| Forgot Password | `/forgot-password` | Email entry for OTP |
| OTP Verification | `/otp` | 6-digit code input |
| Profile | `/profile` | Dashboard with tabs: overview, orders, addresses, wishlist, settings |
| Orders | `/orders` | Order history with status tracking |
| About | `/about` | Brand story, philosophy, values |
| Journal | `/journal` | Editorial blog listing |
| Journal Detail | `/journal/:slug` | Full article view |
| Contact | `/contact` | Contact form + info |
| Privacy Policy | `/privacy-policy` | Legal |
| Refund Policy | `/refund-policy` | Legal |
| Terms & Conditions | `/terms` | Legal |
| 404 | `*` | Not found page |

## Key Features

### Shopping Experience
- Slide-over cart drawer with free shipping progress bar
- Quick View modal for rapid product browsing
- Wishlist with localStorage persistence
- Coupon codes (WELCOME10, MOOD20, FREESHIP)
- 3-step checkout flow
- Recently viewed products
- Related products

### Product Features
- Image gallery with thumbnails
- Hover image swap on product cards
- Color & size selectors
- Rating & review counts
- Discount badges
- New/Bestseller/Trending/Editor's Pick tags

### Design & UX
- Mobile-first responsive design
- Dark/light theme toggle (persisted)
- Framer Motion animations (fade-in, parallax, hover zoom, page transitions)
- Skeleton loaders for all async content
- Lazy-loaded routes (code splitting)
- Sticky header with scroll-aware styling
- Mega menu navigation
- Mobile drawer navigation
- Search bar
- Toast notifications
- Accessible (WCAG — focus states, ARIA labels, semantic HTML)
- SEO meta tags (Open Graph, Twitter Cards)

### Architecture
- Clean folder structure (components, layouts, pages, sections, hooks, services, routes, context, types, utils, constants, data)
- API abstraction layer with Axios (ready for backend integration — swap mock data for real endpoints)
- React Query for server state management
- Context providers for Cart, Wishlist, Auth, and Theme
- TypeScript throughout
- Reusable component design system

## Folder Structure

```
src/
├── components/
│   ├── common/          # SectionHeading, Breadcrumbs, PageHeader
│   ├── layout/          # Header, Footer, CartDrawer, MainLayout, ScrollToTop
│   ├── product/         # ProductCard, ProductGrid, QuickView, Skeletons
│   └── ui/              # shadcn/ui components
├── context/             # Cart, Wishlist, Auth, Theme providers
├── constants/           # Brand config, moods, nav items, coupons
├── data/                # Mock JSON data (products, collections, testimonials, journal)
├── hooks/               # use-toast, use-recently-viewed
├── lib/                 # cn() utility
├── pages/
│   ├── auth/            # Login, Signup, ForgotPassword, OTP
│   ├── home-page.tsx
│   ├── shop-page.tsx
│   ├── collections-page.tsx
│   ├── collection-detail-page.tsx
│   ├── product-detail-page.tsx
│   ├── cart-page.tsx
│   ├── wishlist-page.tsx
│   ├── checkout-page.tsx
│   ├── profile-page.tsx
│   ├── orders-page.tsx
│   ├── about-page.tsx
│   ├── journal-page.tsx
│   ├── journal-detail-page.tsx
│   ├── contact-page.tsx
│   ├── policy-pages.tsx
│   └── not-found-page.tsx
├── routes/              # Route configuration
├── sections/
│   └── home/            # Hero, ShopByMood, FeaturedCollection, Carousels, Testimonials, Instagram
├── services/            # Axios API layer (product, content, auth, order services)
├── types/               # TypeScript type definitions
└── utils/               # formatPrice, formatDate, calculateDiscount
```

## Backend Integration

The frontend is fully ready for backend API integration. All API calls are abstracted in `src/services/` using Axios:

- `productService` — `getProducts()`, `getProductBySlug()`, `getRelatedProducts()`, `getCollections()`
- `contentService` — `getTestimonials()`, `getJournalPosts()`, `getJournalPostBySlug()`
- `authService` — `login()`, `register()`, `forgotPassword()`, `verifyOtp()`, `getProfile()`, `updateProfile()`
- `orderService` — `getOrders()`, `getOrderById()`, `createOrder()`, `validateCoupon()`

Each service method attempts a real API call first, falling back to mock data on failure. To connect a backend:

1. Set `VITE_API_URL` in `.env`
2. Remove the `catch` fallback blocks in service files
3. The Axios client automatically attaches the JWT token from localStorage

## Demo Credentials

- **Login:** Any email + any password (6+ characters)
- **OTP:** `123456`
- **Coupons:** `WELCOME10`, `MOOD20` (min $200), `FREESHIP` (min $100)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck
```

## Design Inspiration

Zara, House of CB, Meshki, COS, Aritzia, Revolve

---

&copy; 2026 रेvvano. Wear Your Mood.

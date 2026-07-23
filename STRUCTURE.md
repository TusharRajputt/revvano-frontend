# Frontend Structure Guide

## Kya badla (What changed)

Pehle sab pages ek hi flat `pages/` folder mein the (25+ files), aur sections
alag `sections/` folder mein. Ab sab **feature-wise (domain-wise)** group
kiya gaya hai — jis feature pe kaam karna ho, uska ek hi folder khol lo,
poora context wahin milega.

## Naya folder layout

```
src/
├── main.tsx, App.tsx          # Entry point (yahan se app start hota hai)
│
├── app/                       # (routes/ folder mein hai) — route definitions
│   └── routes/
│       ├── app-routes.tsx     # Saare routes ki list
│       └── protected-route.tsx
│
├── components/                # Reusable, feature-independent components
│   ├── ui/                    # shadcn/ui base components (button, input, etc.) — mat chhedo, auto-generated hai
│   ├── common/                 # Generic shared bits (breadcrumbs, page-header, error-boundary)
│   ├── layout/                 # Header, footer, main-layout, cart-drawer
│   └── product/                # Product card/grid — reused across multiple features
│
├── features/                  # 🌟 MAIN CHANGE — har business feature ka apna folder
│   ├── auth/                  # login, signup, otp, forgot-password
│   ├── shop/                  # shop listing, product detail
│   ├── cart/                  # cart page
│   ├── checkout/              # checkout page
│   ├── wishlist/              # wishlist page
│   ├── orders/                # customer's orders page
│   ├── collections/           # collections listing + detail
│   ├── journal/                # blog/journal pages
│   ├── profile/                # user profile
│   ├── home/                   # home page + its sections (hero, testimonials, etc.)
│   ├── static/                 # about, contact, policy, 404
│   └── admin/                  # admin dashboard, products, orders, users management
│
├── context/                   # Global state (auth, cart, wishlist, theme) — app-wide, isliye feature-specific nahi
├── services/                  # API calls (api.ts, auth/product/order/admin/content services)
├── hooks/                     # Custom React hooks
├── lib/                       # Utility libs (cn/classnames helper)
├── types/                     # TypeScript types — sab yahin, ek jagah
├── constants/                 # App constants (brand info, nav links)
├── utils/                     # Formatting helpers
└── data/                      # Mock/sample data (backend aane ke baad hata sakte ho)
```

## Rule of thumb aage se

- Naya page/feature banana ho → `features/<feature-name>/` ke andar file banao.
- Component 2+ features mein reuse ho raha ho → `components/common/` ya `components/layout/` mein daalo.
- Ek feature ke andar hi use hone wala component ho → usi feature folder ke andar `components/` sub-folder bana lo.
- Naya import karte waqt hamesha `@/features/...`, `@/components/...` alias use karo — relative `../../../` imports mat likho.

## Fix kiye gaye bugs is round mein

1. `adminService` export comment-out tha `services/index.ts` mein — poora admin panel isi wajah se broken tha. Fix ho gaya.
2. `User` type mein `status` field missing thi (admin ke block/unblock feature ke liye) — add ki.
3. `protected-route.tsx` galat property name (`isLoading` instead of `loading`) use kar raha tha — fix kiya.
4. `otp-page.tsx` galat response-shape assume kar raha tha — ab try/catch pattern use karta hai, jo baaki app mein bhi consistent hai.
5. `authService` mein `forgotPassword` aur `verifyOtp` methods missing the — add kiye (ye tabhi kaam karenge jab backend mein corresponding routes banenge — abhi backend mein sirf login/register/me hai).

## Abhi bhi pending (backend-dependent, frontend se fix nahi ho sakta)

- Forgot-password aur OTP verification — backend mein endpoint nahi hai abhi.
- Cart/Checkout ka actual order-placement backend se connect nahi hai — backend mein Order model/routes hi nahi hai.
- Payment (Razorpay) integration backend mein missing hai.

`npm run build` clean pass ho raha hai — koi TypeScript/build error nahi (in do known backend-dependent items ke alawa).

# AI Prompt Generator 🤖

A powerful Next.js application for generating AI prompts with subscription management, automated blog generation, and payment processing.

## 🌟 Features

- **AI Prompt Generation**: Generate high-quality prompts using DeepSeek AI API
- **Subscription System**: Free, Pro ($5/month), and Elite ($10/month) plans
- **Automated Blog Generation**: AI-powered blog posts every 3 days
- **Payment Integration**: Stripe payment processing with webhooks
- **Real-time AI News**: Latest AI news from NewsAPI
- **Credit System**: Track and manage user credits
- **Responsive Design**: Beautiful UI with Tailwind CSS and shadcn/ui
- **Database Integration**: Prisma ORM with SQLite (dev) and PostgreSQL (production)

## 🚀 Tech Stack

- **Frontend**: Next.js 13.5.1, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI primitives
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: NextAuth.js (planned)
- **Payment**: Stripe integration
- **AI Services**: DeepSeek AI API, NewsAPI
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hasithk/AIpromptgen.git
   cd AIpromptgen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys:
   ```env
   # DeepSeek AI API
   DEEPSEEK_API_KEY=your_deepseek_api_key

   # NewsAPI
   NEWS_API_KEY=your_news_api_key

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret

   # Database
   DATABASE_URL="file:./dev.db"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── blog/          # Blog CRUD and automation
│   │   ├── news/          # AI news endpoints
│   │   ├── payments/      # Stripe payment processing
│   │   ├── prompts/       # AI prompt generation
│   │   └── user/          # User management
│   ├── blog/              # Blog pages
│   ├── history/           # User history
│   ├── library/           # Prompt library
│   ├── pricing/           # Subscription pricing
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Database client
│   ├── stripe.ts         # Stripe integration
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
├── scripts/              # Automation scripts
└── types/                # TypeScript definitions
```

## 🔧 Configuration

### Stripe Setup
1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Create products for Pro and Elite plans
4. Set up webhook endpoints
5. See `STRIPE-SETUP.md` for detailed instructions

### Database Setup
- Development: Uses SQLite (file: `./dev.db`)
- Production: Configure PostgreSQL URL in environment variables

### API Keys
- **DeepSeek AI**: Sign up at DeepSeek and get your API key
- **NewsAPI**: Get your free API key from NewsAPI.org

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set up PostgreSQL database (Vercel Postgres or external)
4. Deploy automatically on push to main branch

See `DEPLOYMENT.md` for detailed deployment instructions.

## 📋 API Endpoints

### Prompts
- `POST /api/prompts/generate` - Generate AI prompts
- `GET /api/user/credits` - Check user credits

### Blog
- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Create new blog post
- `GET /api/blog/[id]` - Get specific blog post
- `POST /api/blog/cron` - Automated blog generation

### Payments
- `POST /api/payments/checkout` - Create Stripe checkout session
- `POST /api/payments/webhook` - Handle Stripe webhooks
- `GET /api/subscription` - Get user subscription status

### News
- `GET /api/news/latest` - Get latest AI news

## 🌿 Branches

- `main` - Production-ready code
- `development` - Integration branch for features
- `feature/payment-system` - Payment and subscription features
- `feature/blog-automation` - Automated blog generation
- `feature/*` - Individual feature branches

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: https://github.com/Hasithk/AIpromptgen
- **Live Demo**: [Coming Soon]
- **Documentation**: See `/docs` folder

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in `/docs`
- Review the setup guides (`STRIPE-SETUP.md`, `DEPLOYMENT.md`)

---

**Built with ❤️ using Next.js and modern web technologies**
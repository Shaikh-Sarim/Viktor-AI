# ContentAI - Setup & Usage Guide

## 🚀 Quick Start

Your AI-powered SaaS platform is ready! Here's how to get it running.

### Step 1: Start Ollama (AI Engine)

Download and install Ollama from [ollama.ai](https://ollama.ai), then:

```bash
ollama serve
```

In another terminal, pull a model:
```bash
ollama pull mistral
```

### Step 2: Start the App

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### Step 3: Create Account or Login

- **Sign Up** for a new account (you get 100 free credits!)
- **Login** with email and password

## 📝 Features

✅ **AI Content Generation** - Blog posts, social media, emails, product descriptions
✅ **Free to Use** - 100 credits/month for new users
✅ **100% Offline** - No expensive API calls, works locally
✅ **Private** - Your data never leaves your computer
✅ **Multi-Model Support** - Mistral, LLaMA 2, Neural Chat, Zephyr

## 💰 Credit System

- **New Users:** 100 free credits
- **Cost:** 10 credits per content generation
- **Monthly Limit:** 10 generations for free users

## 🎯 How to Use

1. Go to Dashboard (after login)
2. Select content type (Blog Post, Social Media, Email, etc.)
3. Write your prompt/requirements
4. Click "Generate Content"
5. Get AI-generated content instantly
6. Copy to clipboard and use!

## ⚙️ Configuration

All settings are in `.env.local`:

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Ollama AI Engine
OLLAMA_API_URL="http://localhost:11434"
OLLAMA_MODEL="mistral"  # Change to llama2, neural-chat, zephyr, etc.

# Stripe (for payments - optional)
STRIPE_PUBLIC_KEY="your_key"
STRIPE_SECRET_KEY="your_key"
```

## 🤖 Available AI Models

Switch models by changing `OLLAMA_MODEL` in `.env.local`:

- **mistral** (7B) - ⭐ Recommended (best balance)
- **llama2** (7B) - Good alternative
- **neural-chat** (7B) - Great for conversations
- **zephyr** (7B) - Best instruction-following
- **openhermes** (7B) - Creative writing
- **orca-mini** (3B) - Fast, lightweight

Pull any model:
```bash
ollama pull neural-chat
```

## 📁 Project Files

```
saas/
├── app/api/
│   ├── auth/[...nextauth]/route.ts    - Login/Logout
│   ├── generate/route.ts              - AI Generation (MAIN)
│   └── register/route.ts              - Sign-Up
├── app/
│   ├── dashboard/page.tsx             - Main Dashboard
│   ├── login/page.tsx                 - Login Page
│   ├── register/page.tsx              - Sign-Up Page
│   └── page.tsx                       - Landing Page
├── components/
│   └── ContentGenerator.tsx           - Content UI
├── prisma/
│   ├── schema.prisma                  - Database Schema
│   └── dev.db                         - SQLite Database
├── auth.ts                            - NextAuth Config
├── .env.local                         - Configuration
└── package.json
```

## 🚨 Troubleshooting

### "Cannot connect to Ollama"
**Error:** "Ollama service is not running"
**Fix:** 
1. Run `ollama serve` in terminal
2. Wait 5 seconds for it to start
3. Make sure you pulled a model: `ollama pull mistral`

### Database Issues
**Error:** "Database error"
**Fix:**
```bash
rm prisma/dev.db
npx prisma db push
```

### Port 3000 Already In Use
**Fix:**
```bash
# Find process
lsof -i :3000
# Kill it
kill -9 <PID>
# Or use different port
npm run dev -- -p 3001
```

### No Credit After Generation
- Refresh the page
- Each generation costs 10 credits
- Logged in users only
- Check dashboard for usage history

## 📊 API Endpoints

### Generate Content
```bash
POST /api/generate
Content-Type: application/json

{
  "prompt": "Write a blog post about AI",
  "contentType": "blog_post"
}

Response:
{
  "document": { ... },
  "generatedContent": "Your AI-generated content here..."
}
```

### Register User
```bash
POST /api/register
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}
```

## 🎨 Customization

### Add New Content Types
In `components/ContentGenerator.tsx`, add to `contentTypes`:
```javascript
{ id: "poem", label: "Poem", icon: "📜" }
```

### Change Credit Cost
In `app/api/generate/route.ts`:
```javascript
creditsUsed: 5  // Change from 10 to your amount
```

### Modify Landing Page
Edit `app/page.tsx` to customize colors, text, pricing.

## 🚀 Production Deployment

### On Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

**Important:** You'll need Ollama running on the server or use a remote Ollama instance.

### On Your Server
```bash
npm run build
npm run start
```

## 💡 Pro Tips

1. **Better Prompts = Better Results**
   - Be specific: "Write a professional LinkedIn post about AI in healthcare"
   - Include tone: "Write it in a funny, sarcastic tone"
   - Give examples: "Here's an example: [example text]"

2. **Speed Tips**
   - First generation loads the model (slower)
   - Subsequent generations are fast
   - Smaller models (7B) are faster than larger ones

3. **Quality Tips**
   - Mistral is best for most content
   - Zephyr is best for following instructions
   - Neural-Chat is best for conversations

4. **Save Content**
   - All generated content is saved automatically
   - View in dashboard under "Recent Documents"
   - Export as needed

## 📞 Support

Having issues? Check:
1. Is Ollama running? (`ollama serve`)
2. Is the model pulled? (`ollama pull mistral`)
3. Do you have credits? (100 free for new users)
4. Check the error message in the browser console

## 📚 Learn More

- [Ollama Documentation](https://ollama.ai)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org/getting-started/introduction)

## 🎉 You're All Set!

Your AI-powered SaaS is ready to go. Start generating amazing content!

**Next:** [Visit the app](http://localhost:3000)

---

Happy content generating! 🚀

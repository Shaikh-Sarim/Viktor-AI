# Admin Panel Setup Guide

## Admin Credentials

The admin panel has been added to your SaaS platform. Here's how to access and configure it:

### Default Credentials (Change These!)
- **Admin ID:** `admin`
- **Admin Password:** `admin123`

### How to Change Admin Credentials

Edit the file `/app/api/admin/login/route.ts` and update these constants:

```typescript
const ADMIN_ID = "admin";        // Change this
const ADMIN_PASSWORD = "admin123"; // Change this
```

## Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Enter your Admin ID and Password
3. You'll be logged into the admin dashboard

## Features

### Admin Dashboard
- **User Statistics:** View total users, paid users, and free users
- **Conversion Rate:** See the percentage of users on paid plans
- **User Management:** Search and view all users with their:
  - Email and name
  - Selected plan (Free, Basic, Pro, Pro+)
  - Payment status (Paid/Free)
  - Current credits
  - Number of chat uses
  - Join date

### Admin Chat (Unlimited Credits)
- Access a dedicated chat interface with unlimited credits
- Perfect for testing features without consuming user credits
- Real-time messaging with your AI assistant

## Database Integration

The admin panel integrates with your existing Prisma database without requiring any schema changes:
- Uses existing `User`, `Subscription`, and `ChatMessage` models
- Displays real-time data from your database
- No migrations needed

## Security Considerations

For production use, consider these enhancements:

1. **JWT Tokens:** Replace base64 token with JWT
2. **IP Whitelisting:** Restrict admin access to specific IPs
3. **Two-Factor Authentication:** Add 2FA for admin login
4. **Audit Logging:** Log all admin activities
5. **Rate Limiting:** Add rate limiting to prevent brute force
6. **Environment Variables:** Store credentials in `.env.local`:
   ```
   ADMIN_ID=your_admin_id
   ADMIN_PASSWORD=your_admin_password
   ```

## File Structure

```
app/
├── admin/
│   ├── layout.tsx          # Admin layout
│   ├── login/
│   │   └── page.tsx        # Admin login page
│   └── page.tsx            # Admin dashboard
└── api/
    └── admin/
        ├── login/
        │   └── route.ts    # Admin authentication
        ├── users/
        │   └── route.ts    # Fetch all users data
        └── chat/
            └── route.ts    # Admin chat with unlimited credits
```

## Screenshots Features

### Statistics Cards
- Real-time count of total users
- Paid users counter
- Free users counter
- Conversion rate percentage

### User Table
- Sortable and searchable user list
- Displays all important user information
- Status badges (Paid/Free)
- Plan information
- Activity tracking (chat uses, documents)

### Admin Chat
- Dedicated chat interface for admin
- Unlimited credit usage
- Real-time responses
- Integration with your existing LLM provider

## Notes

- The admin panel uses localStorage to store authentication tokens
- Tokens are generated on each login and verified server-side
- The admin dashboard is client-side rendered for better interactivity
- All data fetches include token verification for security

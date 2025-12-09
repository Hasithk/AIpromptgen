# Contact Form Email Setup

## Gmail App Password Setup (Recommended)

To enable email sending from the contact form, you need to set up a Gmail App Password:

### Steps:

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/apppasswords
   - Sign in with `lookinternationallk@gmail.com`

2. **Enable 2-Factor Authentication** (if not already enabled)
   - Required before you can create App Passwords

3. **Generate App Password**
   - App name: "AI Prompt Gen Contact Form"
   - Click "Create"
   - Copy the 16-character password

4. **Update Environment Variables**
   - Open `.env.local`
   - Replace `your-gmail-app-password-here` with the generated password
   - Example: `SMTP_PASSWORD=abcd efgh ijkl mnop` (spaces will be handled)

5. **Deploy to Production**
   - Add the same environment variables in your hosting platform:
     - DigitalOcean: App Settings → Environment Variables
     - Vercel: Project Settings → Environment Variables
   
   Variables to add:
   ```
   CONTACT_EMAIL=lookinternationallk@gmail.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=lookinternationallk@gmail.com
   SMTP_PASSWORD=your-app-password-here
   ```

## Alternative: Use Resend (Easier for Production)

For production, consider using Resend (free tier: 3,000 emails/month):

1. Sign up at https://resend.com
2. Get API key
3. Update `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxx
   CONTACT_EMAIL=lookinternationallk@gmail.com
   ```

## Testing

After setup:
1. Visit https://aipromptgen.app/contact
2. Fill out the form
3. Submit
4. Check `lookinternationallk@gmail.com` inbox

## Current Status

- ✅ Contact form created
- ✅ API endpoint ready
- ⏳ Email service needs configuration (add SMTP password to .env.local)
- ⏳ Deploy environment variables to production

## Security Notes

- Never commit `.env.local` to Git (already in .gitignore)
- Use App Passwords, not regular Gmail password
- Rotate passwords periodically
- Monitor email usage in production

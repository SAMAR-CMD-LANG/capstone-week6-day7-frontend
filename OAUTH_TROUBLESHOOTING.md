# Google OAuth Troubleshooting Guide

If you're experiencing issues with Google sign-in, try these steps:

## Common Issues and Solutions

### 1. "Authentication failed" or "OAuth callback failed"
- **Cause**: Cookie/session issues across domains
- **Solution**: 
  - Clear your browser cookies for both the frontend and backend domains
  - Try using an incognito/private browsing window
  - Disable browser extensions that might block cookies

### 2. "No user data received from Google"
- **Cause**: Google OAuth permissions not granted
- **Solution**: 
  - Make sure you grant all requested permissions during Google sign-in
  - Check if your Google account has email visibility enabled

### 3. "Account with this email already exists"
- **Cause**: You previously registered with email/password
- **Solution**: 
  - Use the regular login form with your email and password
  - Or contact support to merge your accounts

### 4. Stuck on "Completing Sign In..." page
- **Cause**: Cookie not being set properly across domains
- **Solution**: 
  - Wait up to 10 seconds for the process to complete
  - If it doesn't work, try refreshing the page
  - Clear cookies and try again

## Browser-Specific Issues

### Chrome/Edge
- Ensure "Block third-party cookies" is disabled for this site
- Check if "SameSite by default cookies" flag is causing issues

### Firefox
- Disable "Enhanced Tracking Protection" for this site temporarily
- Check cookie settings in Privacy & Security

### Safari
- Disable "Prevent cross-site tracking" for this site
- Allow cookies from the backend domain

## Still Having Issues?

1. Try the debug endpoint: `[BACKEND_URL]/debug/oauth`
2. Check browser console for error messages
3. Try a different browser or device
4. Contact support with:
   - Browser type and version
   - Error messages from console
   - Steps you tried

## For Developers

### Debug Steps
1. Check `/debug/oauth` endpoint for configuration
2. Monitor browser network tab during OAuth flow
3. Check server logs for detailed error messages
4. Verify environment variables are set correctly
5. Test cookie setting with `/test-cookie` endpoint

### Common Configuration Issues
- `FRONTEND_URL` and `BACKEND_URL` must match deployed URLs exactly
- Google OAuth credentials must be configured for the correct domains
- CORS settings must allow the frontend domain
- Cookie settings must be appropriate for cross-origin requests
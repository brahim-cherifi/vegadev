# Environment Variable Setup

## Password Configuration

The application password is now managed through a configuration file and can be overridden with environment variables.

### Method 1: Update Config File (Easy)
Edit the file `src/config/auth.js` and change the password value:
```javascript
password: process.env.REACT_APP_PASSWORD || 'your-new-password-here'
```

### Method 2: Use Environment Variables (Recommended for Production)
1. Create a `.env.local` file in the root of your web folder
2. Add the following line:
```
REACT_APP_PASSWORD=your-secure-password-here
```

3. Restart your development server

### Current Setup
- Default password: `vega2024`
- Config file location: `src/config/auth.js`
- Environment variable name: `REACT_APP_PASSWORD`

**Note:** Never commit `.env.local` files to version control. They are already listed in `.gitignore` for security.

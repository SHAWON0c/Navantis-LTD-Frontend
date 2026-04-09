# Building Navantis EMS Web Application

## Prerequisites
- Node.js installed
- All dependencies installed (`npm install`)

## Build Steps

### Build the React Application
```bash
npm run build
```
If PowerShell blocks `npm` scripts on your machine, use:
```bash
npm.cmd run build
```

This creates an optimized production build in the `dist/` folder.

### Output Files
After building, you'll find:
```
dist/
├── index.html
├── assets/
│   ├── *.js
│   ├── *.css
│   └── other files...
└── images/
```

## Deployment
The contents of the `dist/` folder can be deployed to:
- Any web server (Apache, Nginx, etc.)
- Cloud platforms (AWS S3, Azure Storage, Vercel, Netlify, etc.)
- CDN services

## Development
### Run in Development Mode
```bash
npm run dev
```
This starts:
- React dev server with hot module reloading
- Application opens at `http://localhost:5174` (or similar)
- DevTools and debugging enabled

## Version Update
To update the version, modify in `package.json`:
```json
"version": "1.0.0"   // Change this
```

## Troubleshooting
If build fails:
1. Run `npm install` to ensure dependencies are installed
2. Check for console errors during build
3. Clear `dist/` folder and try again
4. Verify all image paths are correct relative to the public folder

# Vercel Deployment Guide

## Environment Variables

Set these environment variables in your Vercel project:

### API Configuration
```
VITE_API_BASE_URL=https://your-railway-backend.up.railway.app
```

## Deployment Steps

1. **Connect to Vercel**:
   - Install Vercel CLI: `npm i -g vercel`
   - Login: `vercel login`

2. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

3. **Or connect GitHub**:
   - Push code to GitHub
   - Connect repository in Vercel dashboard
   - Set environment variables
   - Deploy

## Build Configuration

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add:
   ```
   VITE_API_BASE_URL=https://your-railway-backend.up.railway.app
   ```

## WebSocket Configuration

- **Development**: `ws://localhost:3000`
- **Production**: `wss://your-railway-backend.up.railway.app`

## Important Notes

- Vercel handles HTTPS automatically
- WebSocket connections use WSS in production
- API calls use HTTPS in production
- SPA routing is handled by vercel.json

## Troubleshooting

If WebSocket connections fail:
1. Check that backend is deployed on Railway
2. Verify VITE_API_BASE_URL is set correctly
3. Ensure backend supports WSS connections 
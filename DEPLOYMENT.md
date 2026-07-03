# HEZO SCHOOL Connect - Deployment Guide

This guide details how to build and deploy the application to Vercel and Netlify.

## Environment Variables
The application requires the following environment variables:
* `VITE_SUPABASE_URL`: The API URL of your Supabase project.
* `VITE_SUPABASE_ANON_KEY`: The anonymous API key of your Supabase project.

## Deploying to Vercel (Recommended)
This is a TanStack Start project utilizing Nitro for serverless hosting.
1. Connect your repository to Vercel.
2. In the Vercel project settings:
   * Set **Framework Preset** to **Other** or **Vite**.
   * Set **Build Command** to `npm run build`.
   * Set **Output Directory**: Ensure the **Override** toggle is turned **OFF** (Vercel automatically detects the Nitro `.vercel/output` folder).
3. Set your environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in Vercel settings.
4. Deploy the project.

## Deploying to Netlify
1. In `vite.config.ts`, make sure the Nitro preset is set to Netlify (this is configured automatically if `process.env.VERCEL` is not defined).
2. Set the following build settings in Netlify:
   * **Build Command**: `npm run build`
   * **Publish Directory**: `dist/client`
   * **Functions Directory**: `dist/server`
3. Add the environment variables to Netlify dashboard and deploy.

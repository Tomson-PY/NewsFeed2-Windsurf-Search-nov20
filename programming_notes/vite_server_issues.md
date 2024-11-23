# Vite Development Server Issues

## Problem Description
Changes made to source files were not being reflected in the browser, even after refreshing. This included:
- UI changes (e.g., header background color)
- Configuration changes (e.g., RSS feed URLs)
- Component modifications

## Root Cause
The issue was caused by stale Node.js processes running in the backgrIound. These processes:
- Maintained cached versions of files
- Weren't properly watching for file changes
- Could have been conflicting with each other
- May have been running from different directories

## Solution
The issue was resolved by:
1. Stopping all Node.js processes using `killall node`
2. Starting a fresh development server with `npm run dev`

## How to Identify This Issue
You might be experiencing this issue if:
- Changes to source files aren't appearing in the browser
- The development server appears to be running (accessible on localhost)
- Changes persist even after browser refresh or incognito mode
- Multiple instances of Node.js are visible in process list

## Verification Steps
1. Check for running Node.js processes:
   ```bash
   ps aux | grep node
   # or
   lsof -i :5173  # Vite's default port
   ```

2. Kill all Node.js processes:
   ```bash
   killall node
   ```

3. Start a fresh server:
   ```bash
   npm run dev
   ```

## Prevention
To prevent this issue in the future:
1. Always use `npm run dev` from the project root directory
2. Check for running Node.js processes if changes aren't reflecting
3. Consider using `npx vite --force` to bypass cache
4. Ensure only one development server instance is running at a time

## Additional Notes
- The `@` symbol in `ls -l` output indicates extended attributes on files
- Multiple development server instances can cause port conflicts
- Vite's hot module replacement might not work properly with stale processes

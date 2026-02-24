# Manual Fix Guide for Build Failures

## Common Build Failure Reasons & Solutions

### Issue 1: Google Fonts + Turbopack Compatibility (MOST COMMON)

**Symptoms:**
- Build fails with errors about `@vercel/turbopack-next/internal/font/google/font`
- TLS certificate errors when fetching fonts
- "Module not found" errors in font CSS files

**Root Cause:**
Next.js 16 uses Turbopack by default, which has issues loading Google Fonts during build, especially in corporate networks with proxy/firewall restrictions.

**Solution - Remove Google Fonts:**

1. Open `app/layout.tsx`
2. Remove these lines:
   ```typescript
   import { Inter } from "next/font/google";
   const inter = Inter({ subsets: ["latin"] });
   ```
3. Change the body className from:
   ```typescript
   <body className={inter.className}>
   ```
   To:
   ```typescript
   <body className="font-sans antialiased">
   ```

**Complete Fixed layout.tsx:**
```typescript
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>NextGen Image Optimizer - Privacy-First Image Tools</title>
        <meta name="description" content="Resize, compress and optimize images directly in your browser. 100% Client-side, secure, and free." />
      </head>
      <body className="font-sans antialiased">
        <div className="bg-mesh" />
        {children}
      </body>
    </html>
  );
}
```

---

### Issue 2: Metadata Export Error

**Symptoms:**
- Error: "Page ... cannot use both `export const metadata` and `export default function RootLayout`"
- Build fails during static export

**Root Cause:**
Next.js static export (`output: 'export'`) doesn't support `generateMetadata` or `export const metadata` in layout files.

**Solution:**

1. Open `app/layout.tsx`
2. Remove any `generateMetadata` function or `export const metadata`
3. Move metadata to `<head>` tags directly (as shown in Issue 1 solution above)

---

### Issue 3: GitHub Actions Workflow Permissions

**Symptoms:**
- Workflow runs but fails to deploy
- "Permission denied" errors in Actions logs

**Solution:**

1. Go to your GitHub repository
2. Click **Settings** → **Actions** → **General**
3. Scroll to **Workflow permissions**
4. Select **Read and write permissions**
5. Check **Allow GitHub Actions to create and approve pull requests**
6. Click **Save**

---

### Issue 4: GitHub Pages Not Enabled

**Symptoms:**
- Build succeeds but site not accessible
- 404 error when visiting GitHub Pages URL

**Solution:**

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Wait 1-2 minutes for deployment
4. Visit: `https://[your-username].github.io/image-optimization-main/`

---

## Step-by-Step Manual Fix Process

### Step 1: Fix the Code Locally

```bash
# Navigate to project
cd c:\Users\0143586\.vscode\work\image-optimization-main

# Edit app/layout.tsx (use the fixed version from Issue 1 above)
code app\layout.tsx
```

### Step 2: Test Build Locally

```bash
# Install dependencies (if not already done)
npm install

# Run build
npm run build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages (4/4)
✓ Finalizing page optimization
```

### Step 3: Commit and Push Changes

```bash
# Stage changes
git add -A

# Commit
git commit -m "Fix: Remove Google Fonts for Turbopack compatibility"

# Push to GitHub
git push origin main
```

### Step 4: Configure GitHub Settings

1. **Enable Workflow Permissions:**
   - Go to: `https://github.com/rgolusuTR/image-optimization-main/settings/actions`
   - Set **Workflow permissions** to **Read and write permissions**
   - Save

2. **Enable GitHub Pages:**
   - Go to: `https://github.com/rgolusuTR/image-optimization-main/settings/pages`
   - Set **Source** to **GitHub Actions**
   - Save

### Step 5: Monitor Deployment

1. Go to: `https://github.com/rgolusuTR/image-optimization-main/actions`
2. Click on the latest workflow run
3. Watch the build process
4. If successful, visit: `https://rgolusutr.github.io/image-optimization-main/`

---

## Verification Checklist

- [ ] `app/layout.tsx` has no Google Fonts import
- [ ] `app/layout.tsx` has no `generateMetadata` or `export const metadata`
- [ ] Local build succeeds: `npm run build`
- [ ] Changes committed and pushed to GitHub
- [ ] GitHub Actions workflow permissions set to "Read and write"
- [ ] GitHub Pages source set to "GitHub Actions"
- [ ] Latest workflow run shows green checkmark
- [ ] Site accessible at GitHub Pages URL

---

## Quick Reference: File Locations

- **Layout file:** `app/layout.tsx`
- **Next.js config:** `next.config.ts`
- **GitHub Actions workflow:** `.github/workflows/deploy.yml`
- **Build output:** `out/` directory (after running `npm run build`)

---

## Troubleshooting Commands

```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Clean build
rm -rf .next out
npm run build

# Check git status
git status

# View recent commits
git log --oneline -5

# Check remote URL
git remote -v
```

---

## Still Having Issues?

### Check Build Logs:
1. Go to GitHub Actions: `https://github.com/rgolusuTR/image-optimization-main/actions`
2. Click the failed workflow
3. Click on the failed job
4. Expand the "Build and Export" step
5. Look for the specific error message

### Common Error Patterns:

**"Module not found"** → Check imports in layout.tsx
**"Permission denied"** → Check workflow permissions
**"404 Not Found"** → Check GitHub Pages settings
**"TLS/SSL errors"** → Network/proxy issue, use system fonts instead

---

## Contact Information

If you continue to experience issues after following this guide:
1. Check the error message in GitHub Actions logs
2. Compare your files with the working versions in this guide
3. Ensure all settings match the configurations described above

**Repository:** https://github.com/rgolusuTR/image-optimization-main
**Expected URL:** https://rgolusutr.github.io/image-optimization-main/
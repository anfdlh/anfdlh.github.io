# Panduan Deploy Portfolio React ke GitHub Pages

## Prerequisites

- Git sudah terinstall
- Node.js dan npm sudah terinstall
- Repository GitHub: https://github.com/anfdlh/anfdlh.github.io

## Langkah-langkah:

### 1. Install gh-pages

```bash
cd "c:\Users\Aan\OneDrive\Desktop\New-folder\New folder"
npm install --save-dev gh-pages
```

### 2. Update package.json

Tambahkan di package.json:

```json
{
  "homepage": "https://anfdlh.github.io",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 3. Update vite.config.js

Tambahkan base URL:

```javascript
export default defineConfig({
  plugins: [react()],
  base: "/",
});
```

### 4. Build dan Deploy

```bash
npm run deploy
```

## Alternatif: Manual Deploy

### 1. Build project

```bash
npm run build
```

### 2. Copy dist folder ke repository

```bash
cd "c:\Users\Aan\OneDrive\Desktop\New-folder\New folder"
# Backup file lama jika perlu
# Copy semua file dari dist/ ke root folder
```

### 3. Git commands

```bash
git add .
git commit -m "Update portfolio to React version"
git push origin main
```

## Troubleshooting

### Jika ada error saat push:

```bash
git pull origin main --rebase
git push origin main
```

### Jika perlu force push (HATI-HATI):

```bash
git push -f origin main
```

## Catatan Penting

1. **GitHub Pages Settings**:

   - Buka repository settings
   - Scroll ke "Pages"
   - Source: Deploy from a branch
   - Branch: main / root

2. **Custom Domain** (opsional):

   - Tambahkan file `CNAME` di public folder
   - Isi dengan domain kamu

3. **404 Page**:
   - Untuk SPA, copy `index.html` sebagai `404.html`

## Verifikasi

Setelah deploy, buka:
https://anfdlh.github.io

Tunggu beberapa menit untuk propagasi.

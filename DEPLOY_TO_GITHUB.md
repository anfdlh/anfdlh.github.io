# 🚀 Panduan Lengkap Deploy Portfolio React ke GitHub

## 📍 Lokasi Project

Berdasarkan pencarian, project React ada di:

- `C:\Users\Aan\OneDrive\Desktop\New-folder\portfolio-react`

## 🎯 Langkah-langkah Deploy

### **Opsi 1: Deploy dengan gh-pages (Otomatis) - RECOMMENDED**

#### 1. Buka Terminal di folder project

```powershell
cd "C:\Users\Aan\OneDrive\Desktop\New-folder\portfolio-react"
```

#### 2. Install gh-pages

```powershell
npm install --save-dev gh-pages
```

#### 3. Edit package.json

Tambahkan baris ini di package.json:

```json
{
  "name": "portfolio-react",
  "homepage": "https://anfdlh.github.io",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### 4. Edit vite.config.js

Pastikan ada base URL:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
});
```

#### 5. Deploy!

```powershell
npm run deploy
```

Ini akan:

- Build project otomatis
- Create branch `gh-pages`
- Push ke GitHub
- Website live di https://anfdlh.github.io

---

### **Opsi 2: Deploy Manual**

#### 1. Build project

```powershell
cd "C:\Users\Aan\OneDrive\Desktop\New-folder\portfolio-react"
npm run build
```

#### 2. Clone repository GitHub

```powershell
cd "C:\Users\Aan\OneDrive\Desktop"
git clone https://github.com/anfdlh/anfdlh.github.io.git
cd anfdlh.github.io
```

#### 3. Hapus file lama (backup dulu jika perlu!)

```powershell
# Backup dulu
mkdir backup
Copy-Item -Path * -Destination backup -Recurse -Exclude .git,backup

# Hapus semua kecuali .git
Get-ChildItem -Exclude .git,backup | Remove-Item -Recurse -Force
```

#### 4. Copy file dari dist

```powershell
Copy-Item -Path "..\portfolio-react\dist\*" -Destination . -Recurse
```

#### 5. Commit dan Push

```powershell
git add .
git commit -m "Update portfolio to React version"
git push origin main
```

---

### **Opsi 3: Replace Repository (Fresh Start)**

#### 1. Build project

```powershell
cd "C:\Users\Aan\OneDrive\Desktop\New-folder\portfolio-react"
npm run build
```

#### 2. Initialize git di folder dist

```powershell
cd dist
git init
git add .
git commit -m "Initial commit - React portfolio"
```

#### 3. Force push ke GitHub

```powershell
git remote add origin https://github.com/anfdlh/anfdlh.github.io.git
git branch -M main
git push -f origin main
```

---

## ⚙️ GitHub Pages Settings

Setelah push, setting GitHub Pages:

1. Buka https://github.com/anfdlh/anfdlh.github.io/settings/pages
2. **Source**: Deploy from a branch
3. **Branch**:
   - Jika pakai gh-pages: pilih `gh-pages` / root
   - Jika manual: pilih `main` / root
4. **Save**

## ✅ Verifikasi

1. Tunggu 2-5 menit
2. Buka: https://anfdlh.github.io
3. Portfolio React kamu sudah live! 🎉

## 🔧 Troubleshooting

### Error: "Updates were rejected"

```powershell
git pull origin main --rebase
git push origin main
```

### Error: Permission denied

```powershell
# Setup Git credentials
git config --global user.name "anfdlh"
git config --global user.email "aanfadilahh@gmail.com"

# Atau gunakan GitHub Desktop / VS Code Git
```

### Website tidak muncul

- Cek GitHub Actions (tab Actions di repo)
- Cek Pages settings
- Clear browser cache (Ctrl+Shift+R)

### Assets tidak load (404)

Edit vite.config.js:

```javascript
base: "/anfdlh.github.io/"; // atau base: '/'
```

## 📝 Update Selanjutnya

Setelah setup awal, untuk update:

**Dengan gh-pages:**

```powershell
cd "C:\Users\Aan\OneDrive\Desktop\New-folder\portfolio-react"
npm run deploy
```

**Manual:**

```powershell
npm run build
cd path/to/anfdlh.github.io
# copy dist files
git add .
git commit -m "Update"
git push
```

---

## 🎨 Rekomendasi Saya

**Gunakan Opsi 1 (gh-pages)** karena:

- ✅ Paling mudah
- ✅ Otomatis
- ✅ Tidak perlu manual copy-paste
- ✅ Update cukup `npm run deploy`

Tinggal jalankan 3 command:

```powershell
npm install --save-dev gh-pages
# Edit package.json (tambah homepage & deploy script)
npm run deploy
```

Done! 🚀

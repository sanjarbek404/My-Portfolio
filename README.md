# 🎯 Sanjarbek Otabekov - Portfolio & Portfolio Builder

Professional portfolio website built with modern web technologies. A fully interactive, dynamic portfolio platform with admin panel capabilities for real-time content management.

**Live Demo:** [Portfolio](https://sanjarme.uz) | **GitHub:** [sanjarbek](https://github.com/sanjarbek404/My-Portfolio.git)

---

## ✨ Features

### 👤 Portfolio Showcase
- **Hero Section** - Professional introduction with animated profile image
- **Skills & Certifications** - Interactive display of technical skills and achievements
- **Project Gallery** - Showcase of completed projects with live links and descriptions
- **Experience & Education** - Timeline of professional journey and academic background
- **Services** - Overview of services offered
- **Contact Form** - Direct communication channel with visitors

### 🎨 Design & User Experience
- **Dark/Light Mode** - Responsive theme switching with smooth transitions
- **Smooth Animations** - Framer Motion powered animations and transitions
- **Mobile Responsive** - Fully optimized for all device sizes
- **Accessibility** - WCAG compliant interface design
- **Performance** - Optimized loading and rendering

### 🔧 Admin Panel
- **Content Management** - Edit portfolio content in real-time
- **Image Management** - Upload and manage profile image
- **Dynamic Settings** - Configure social links, resume, and contact info
- **Firebase Integration** - Real-time database synchronization
- **Analytics** - Track visitor engagement and reactions

### 🌐 Multi-Language Support
- **Uzbek (O'zbek)** - Native language interface
- **Russian (Русский)** - Full Russian translation
- **English** - Complete English interface
- **Real-time Switching** - Change language without page reload

### 📊 Interactive Elements
- **Bento Grid Layout** - Modern card-based design system
- **Reaction System** - Visitors can react with emojis (Like, Love, Fire, Rocket)
- **Scroll Progress** - Visual scroll tracking indicator
- **Social Integration** - Direct links to GitHub, LinkedIn, Instagram, etc.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library
- **React Router v7** - Client-side routing

### UI & Animation
- **Lucide React** - Beautifully simple icon set
- **React Hot Toast** - Notifications & toasts
- **Motion** - Advanced animation primitives
- **React to Print** - Print portfolio/CV functionality

### Backend & Database
- **Firebase** - Real-time database and auth
- **Firestore** - NoSQL document database
- **Firebase Rules** - Security and validation

### Data Visualization
- **Recharts** - Composable charting library

### Build & Development
- **TypeScript** - Static type checking
- **ESLint** - Code quality
- **Autoprefixer** - CSS vendor prefixes
- **PostCSS** - CSS transformations

---

## 📦 Installation

### Prerequisites
- **Node.js** 16.x or higher
- **npm** 7.x or **yarn** 3.x
- **Firebase Account** - For database setup

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanjarbek404/My-Portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key (optional)
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

---

## 🚀 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Clean build artifacts
npm run clean

# Type checking
npm run lint
```

### Project Structure

```
├── src/
│   ├── components/
│   │   └── GoogleAnalytics.tsx       # Analytics component
│   ├── lib/
│   │   ├── firebase.ts                # Firebase configuration
│   │   ├── LanguageContext.tsx         # Language context provider
│   │   └── translations.ts            # Multi-language translations
│   ├── pages/
│   │   ├── Portfolio.tsx              # Main portfolio page
│   │   ├── Admin.tsx                  # Admin panel
│   │   ├── Login.tsx                  # Authentication
│   │   └── CVBuilder.tsx              # CV generation
│   ├── App.tsx                         # Root component
│   ├── main.tsx                        # Entry point
│   └── index.css                       # Global styles
├── public/
│   ├── men.png                         # Profile image
│   └── _redirects                      # Netlify redirects
├── firebase.json                       # Firebase config
├── firestore.rules                     # Firestore security rules
├── vite.config.ts                      # Vite configuration
├── tailwind.config.ts                  # TailwindCSS config
├── tsconfig.json                       # TypeScript config
├── netlify.toml                        # Netlify deployment config
├── vercel.json                         # Vercel deployment config
└── package.json                        # Project dependencies
```

---

## 🔐 Firebase Setup

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project
- Enable Firestore Database
- Set up Authentication (Email/Password)

### 2. Configure Security Rules

Add these rules to `firestore.rules`:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access
    match /{document=**} {
      allow read;
    }
    
    // Admin write access only
    match /settings/{document=**} {
      allow write: if request.auth != null;
    }
    match /experiences/{document=**} {
      allow write: if request.auth != null;
    }
    match /education/{document=**} {
      allow write: if request.auth != null;
    }
    match /stats/{document=**} {
      allow write: if true;
    }
  }
}
```

---

## 🌐 Deployment

### Netlify
```bash
# Connect your repository
# Set build command: npm run build
# Set publish directory: dist
```

**Netlify Config** (`netlify.toml`) is pre-configured.

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Vercel Config** (`vercel.json`) is pre-configured.

---

## 🎨 Customization

### Change Theme Colors
Edit `src/index.css` or modify Tailwind config in `tailwind.config.ts`

### Update Translations
Update language strings in `src/lib/translations.ts`

### Modify Content
Use the Admin Panel (`/admin`) to manage:
- Portfolio information
- Skills and certifications
- Projects and experiences
- Education background
- Social media links

---

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | Yes |
| `VITE_GEMINI_API_KEY` | Google Gemini API Key | No |

---

## 📱 Features Breakdown

### Admin Panel (`/admin`)
Secure dashboard for managing portfolio content:
- Profile information and hero image
- Skills and certifications management
- Projects and portfolio items
- Experience and education entries
- Social media links configuration
- Resume/CV upload
- Analytics and statistics

### Authentication (`/login`)
Protected admin access with Firebase authentication

### Portfolio Page (`/`)
Main showcase with:
- Hero section with animated introduction
- Skills grid with icons
- Project showcase
- Timeline of experiences
- Education details
- Contact form
- Reaction system for engagement

---

## 📊 Database Schema

### Firestore Collections

**settings**
```javascript
{
  hero: { image: string },
  contact: { email, phone, address },
  social: { github, linkedin, instagram, telegram }
}
```

**experiences**
```javascript
{
  title: string,
  company: string,
  description: string,
  year: number,
  technologies: string[]
}
```

**education**
```javascript
{
  school: string,
  degree: string,
  field: string,
  year: number
}
```

**projects**
```javascript
{
  title: string,
  description: string,
  image: string,
  technologies: string[],
  link: string
}
```

**skills**
```javascript
{
  category: string,
  items: string[]
}
```

---

## ⚡ Performance Optimization

- **Code Splitting** - Automatic with Vite
- **Image Optimization** - Lazy loading and responsive images
- **CSS Compression** - TailwindCSS purging
- **Bundle Analysis** - Check build size
- **Caching** - Firebase caching strategies

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3001
```

### Firebase Connection Issues
- Verify `.env.local` configuration
- Check Firestore Rules are correctly set
- Ensure Firebase project is active

### Image Not Loading
- Verify image URL in Admin Panel
- Check browser console for CORS errors
- Use absolute URLs from public folder (`/men.png`)

---

## 📝 License

This project is open source under the MIT License. See LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

**Sanjarbek Otabekov**
- Email: sanjarbekotabekov010@gmail.com
- GitHub: [@sanjarbek](https://github.com/sanjarbek404)
- LinkedIn: [Sanjarbek Otabekov](https://www.linkedin.com/in/sanjarbek-otabekov-0600733bb/)
- Portfolio: [sanjarbek.dev](https://sanjarme.uz)

---

## Acknowledgments

- [React](https://react.dev) - UI library
- [Vite](https://vitejs.dev) - Build tool
- [TailwindCSS](https://tailwindcss.com) - Styling
- [Framer Motion](https://www.framer.com/motion) - Animations
- [Firebase](https://firebase.google.com) - Backend services
- [Lucide](https://lucide.dev) - Icons

---

<div align="center">

Made with ❤️ by **Sanjarbek Otabekov**

⭐ Star this repository if you found it helpful!

</div>

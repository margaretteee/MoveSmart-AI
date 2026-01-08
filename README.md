# MoveSmartAI 🚀

**Quick workouts, stretch breaks, and daily movement tips for busy youths—fast, friendly, and easy to follow.**

> ⚠️ **Safety First:** I'm not a doctor. Stop if you experience pain, dizziness, or discomfort.

## 🎯 Target Audience
Students and busy youths (15-25) who:
- Sit a lot throughout the day
- Feel tired and need energy boosts
- Want short, effective routines they can do anywhere
- Prefer Gen-Z friendly, non-cringe content

## ✨ Features

### 🏋️ Core Features
- **Quick Workouts** - 5, 10, or 15-minute routines with timer
- **Stretch Routines** - Target neck, shoulders, back, hips, and full body
- **Daily Movement Tips** - For desk, school, and home with 1-min challenges
- **Interactive Timers** - Full workout and quick challenge timers
- **Chat Integration** - Botpress chatbot ready for AI coaching

### 🎨 Design Features
- **Gen-Z Friendly** - Modern, vibrant color palette
- **Mobile-First** - Optimized for smartphone usage
- **Accessible** - WCAG 2.1 AA compliant with keyboard navigation
- **Dark/Light Mode** - Automatic theme switching
- **Smooth Animations** - Loading states, hover effects, button presses
- **Static Design** - No backend required, works anywhere

## 🎨 Color Palette

```css
Primary:    #6366F1 (Indigo-500) - Modern, confident
Secondary:  #F59E0B (Amber-500)  - Energetic, motivational  
Accent:     #10B981 (Emerald-500) - Fresh, health-focused
Background: #F8FAFC (Slate-50)    - Clean, minimal
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- VS Code (recommended) with Live Server extension
- OR any local HTTP server

### Method 1: VS Code Live Server (Recommended)

1. **Install VS Code** from https://code.visualstudio.com/
2. **Install Live Server Extension:**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Live Server" by Ritwick Dey
   - Click Install

3. **Open Project:**
   ```bash
   # Clone or download this repository
   cd MoveSmartAI
   code .  # Opens in VS Code
   ```

4. **Start Live Server:**
   - Right-click on `index.html` in VS Code
   - Select "Open with Live Server"
   - OR use Command Palette (Ctrl+Shift+P) → "Live Server: Open with Live Server"
   - Website opens automatically at `http://127.0.0.1:5500`

5. **Development Benefits:**
   - Auto-reload on file changes
   - Mobile device testing via IP address
   - Browser sync across devices

### Method 2: Python HTTP Server

```bash
# Navigate to project directory
cd MoveSmartAI

# Python 3.x
python -m http.server 8000

# OR Python 2.x
python -m SimpleHTTPServer 8000

# Open browser to http://localhost:8000
```

### Method 3: Node.js http-server

```bash
# Install globally
npm install -g http-server

# Navigate to project directory
cd MoveSmartAI

# Start server
http-server

# Open browser to http://localhost:8080
```

## 📁 Project Structure

```
MoveSmartAI/
├── index.html              # Main HTML file with all sections
├── css/
│   └── styles.css          # Complete styles with animations
├── js/
│   └── app.js              # Interactive functionality
├── assets/                 # Static assets (images, icons)
├── .github/                # GitHub workflows and templates
├── .vscode/
│   └── settings.json       # Live Server configuration
├── .gitignore             # Git ignore patterns
└── README.md              # This file
```

## 🌐 Deployment

### GitHub Pages (Free Hosting)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy MoveSmartAI"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: Deploy from a branch
   - Branch: `main` / `(root)`
   - Click Save

3. **Access Your Site:**
   - URL: `https://yourusername.github.io/repository-name`
   - Updates automatically on push to main branch

### Netlify (Free Hosting)

1. **Drag & Drop Deployment:**
   - Go to https://netlify.com
   - Drag the `MoveSmartAI` folder to Netlify deploy area
   - Get instant URL

2. **Git Integration:**
   - Connect GitHub repository
   - Auto-deploy on commits
   - Custom domain support

### Vercel (Free Hosting)

1. **Connect Repository:**
   - Go to https://vercel.com
   - Import Git repository
   - Auto-deploy with custom domain

2. **Local Deployment:**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

### Other Hosting Options

- **GitHub Codespaces** - Development in browser
- **Firebase Hosting** - Google's static hosting
- **Surge.sh** - Simple static hosting
- **Any web server** - Upload files to public_html

## 🛠️ Technical Features

### JavaScript Capabilities
- **Timer System** - Workout and challenge timers with controls
- **Section Navigation** - Smooth single-page app experience
- **Theme Toggle** - Persistent dark/light mode
- **Loading States** - Button animations and section transitions
- **Local Storage** - Save user preferences
- **Accessibility** - Screen reader support, keyboard navigation
- **Mobile Optimized** - Touch-friendly interactions

### CSS Features
- **CSS Grid & Flexbox** - Modern responsive layouts
- **Custom Properties** - Maintainable theming system
- **Mobile-First** - Breakpoints at 640px, 768px, 1024px
- **Smooth Animations** - Hover effects, loading states, page transitions
- **Button Press Feedback** - Scale and position animations
- **Safety Notice** - Prominent health disclaimer

### Performance Optimizations
- **Static Files** - No backend dependencies
- **Optimized Images** - Placeholder for future image assets
- **Lazy Loading** - Content loads as needed
- **Minimal Dependencies** - Pure HTML/CSS/JS
- **Caching Ready** - Static assets cache efficiently

## ♿ Accessibility Features

- **ARIA Labels** - Proper semantic markup
- **Keyboard Navigation** - Full keyboard support (Tab, Arrow keys)
- **Screen Reader Support** - Live regions and announcements
- **High Contrast** - Readable color combinations (4.5:1 ratio)
- **Large Touch Targets** - 44px minimum for mobile
- **Skip Links** - Quick navigation for screen readers
- **Focus Management** - Clear focus indicators
- **Reduced Motion** - Respects user motion preferences

## 🎯 Content Overview

### Quick Workouts
1. **5-Min Full Body** - Beginner-friendly, 2 rounds
2. **10-Min Full Body** - 40s work/20s rest intervals  
3. **15-Min Strength + Cardio** - 3 circuits with variety

### Stretch Routines
1. **Neck & Shoulders** - 2-4 min desk relief
2. **Back** - 3-5 min posture improvement
3. **Hips & Legs** - 3-5 min lower body mobility
4. **Full Body** - 5-7 min comprehensive routine

### Daily Tips
1. **At Desk/Studying** - Micro-movements + 1-min challenge
2. **In School/Outside** - Active habits + walking challenge
3. **At Home** - Household movement + circuit challenge

## 🤖 Chatbot Integration

### Botpress Setup
The website includes Botpress integration for AI coaching. To activate:

1. **Create Botpress Account** at https://botpress.com
2. **Set up Workflow** with the provided conversation flow
3. **Update Credentials** in `index.html`:
   ```javascript
   "botId": "your-bot-id-here",
   "clientId": "your-client-id-here", 
   "webhookId": "your-webhook-id-here"
   ```

### Chat Features
- Guided workout selection
- Stretch routine recommendations  
- Daily movement tips
- Safety reminders
- Motivational coaching

## 🔧 Development

### Live Server Configuration
Optimized settings in `.vscode/settings.json`:
- Port: 5500
- Auto-reload enabled
- CORS support for API testing
- Ignore unnecessary files

### Git Workflow
```bash
# Development
git add .
git commit -m "Feature: description"

# Deployment
git push origin main  # Auto-deploys to GitHub Pages
```

## 🎨 Customization

### Colors
Edit CSS custom properties in `:root` selector:
```css
:root {
  --color-primary: #6366F1;    /* Main brand color */
  --color-secondary: #F59E0B;  /* Accent color */
  --color-accent: #10B981;     /* Success/health color */
}
```

### Content
- **Workouts:** Update HTML in workout cards
- **Stretches:** Modify stretch routine steps  
- **Tips:** Customize daily movement advice
- **Timing:** Adjust timer durations in data attributes

### Layout
- **Responsive:** Modify breakpoint variables
- **Spacing:** Adjust space variables
- **Typography:** Change font family/sizes

## 🔮 Future Enhancements

### Phase 1 (Next Steps)
- [ ] Add workout videos/GIFs
- [ ] User progress tracking (localStorage)
- [ ] Workout difficulty levels
- [ ] Sound notifications for timers

### Phase 2 (Advanced)
- [ ] PWA (Progressive Web App) capabilities
- [ ] Offline support with service worker
- [ ] Push notifications for movement reminders
- [ ] Social sharing features

### Phase 3 (Scale)
- [ ] User accounts and profiles
- [ ] Personalized recommendations
- [ ] Community features
- [ ] Mobile app version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Keep it static (no backend required)
- Maintain accessibility standards
- Test on mobile devices
- Follow existing code style
- Update README for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Health Disclaimer

**Important:** This website provides general fitness information only. Always:
- Consult healthcare professionals before starting exercise
- Stop immediately if you feel pain, dizziness, or discomfort  
- Listen to your body and exercise within your limits
- Seek medical advice for any health concerns

## 💚 Made with Love

Built for students who want to feel better, move more, and stay healthy while juggling busy schedules. No gym required, no subscription fees, no complicated equipment—just simple movement that works.

---

**Quick Start**: Open `index.html` in Live Server and start moving! 🎉

**Live Demo**: [Add your deployed URL here]
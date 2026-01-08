/**
 * MoveSmartAI - Interactive JavaScript
 * Features: Theme toggle, animations, card interactions, and accessibility
 */

class MoveSmartAI {
  constructor() {
    this.isLoading = false;
    this.currentTheme = this.getInitialTheme();
    
    // DOM elements
    this.themeToggle = null;
    this.featureCards = [];
    this.loadingElement = null;
    
    // Intersection Observer for animations
    this.animationObserver = null;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }
  
  /**
   * Initialize the application
   */
  init() {
    this.cacheDOM();
    this.bindEvents();
    this.setupTheme();
    this.setupAnimations();
    this.setupAccessibility();
    this.preloadImages();
    
    console.log('🚀 MoveSmartAI initialized');
  }
  
  /**
   * Cache DOM elements for better performance
   */
  cacheDOM() {
    this.themeToggle = document.querySelector('.theme-toggle');
    this.featureCards = document.querySelectorAll('.feature-card');
    this.loadingElement = document.querySelector('.loading');
    this.body = document.body;
    this.html = document.documentElement;
  }
  
  /**
   * Bind event listeners
   */
  bindEvents() {
    // Theme toggle
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Feature card interactions
    this.featureCards.forEach((card, index) => {
      // Click/Enter handler
      card.addEventListener('click', (e) => this.handleCardClick(e, index));
      card.addEventListener('keydown', (e) => this.handleCardKeydown(e, index));
      
      // Mouse events for enhanced interactions
      card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
      card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
    
    // Performance monitoring
    window.addEventListener('load', () => this.trackLoadTime());
    
    // Handle reduced motion preference
    this.handleReducedMotion();
  }
  
  /**
   * Setup theme system
   */
  setupTheme() {
    this.applyTheme(this.currentTheme);
    this.updateThemeToggleIcon();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.updateThemeToggleIcon();
      }
    });
  }
  
  /**
   * Get initial theme preference
   */
  getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    this.updateThemeToggleIcon();
    
    // Save preference
    localStorage.setItem('theme', this.currentTheme);
    
    // Announce to screen readers
    this.announceToScreenReader(`Switched to ${this.currentTheme} mode`);
  }
  
  /**
   * Apply theme to the page
   */
  applyTheme(theme) {
    this.html.setAttribute('data-theme', theme);
    this.body.style.colorScheme = theme;
  }
  
  /**
   * Update theme toggle icon
   */
  updateThemeToggleIcon() {
    if (this.themeToggle) {
      const icon = this.themeToggle.querySelector('.theme-toggle__icon');
      if (icon) {
        icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
      }
      
      this.themeToggle.setAttribute('aria-label', 
        `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} mode`
      );
    }
  }
  
  /**
   * Setup scroll-triggered animations
   */
  setupAnimations() {
    // Don't animate if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    // Intersection Observer for fade-in animations
    this.animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .hero__title, .hero__subtitle');
    animatedElements.forEach((el, index) => {
      el.classList.add('fade-in');
      
      // Add stagger delay
      el.style.transitionDelay = `${index * 100}ms`;
      
      this.animationObserver.observe(el);
    });
  }
  
  /**
   * Handle feature card clicks
   */
  handleCardClick(event, index) {
    const card = event.currentTarget;
    const cardType = this.getCardType(card);
    
    // Visual feedback
    this.addClickFeedback(card);
    
    // Navigate based on card type
    this.navigateToFeature(cardType);
    
    // Analytics (placeholder)
    this.trackUserInteraction('card_click', cardType);
  }
  
  /**
   * Handle keyboard navigation for cards
   */
  handleCardKeydown(event, index) {
    const { key } = event;
    
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.handleCardClick(event, index);
    } else if (key === 'ArrowRight' || key === 'ArrowDown') {
      event.preventDefault();
      this.focusNextCard(index);
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      event.preventDefault();
      this.focusPreviousCard(index);
    }
  }
  
  /**
   * Get card type from classes
   */
  getCardType(card) {
    if (card.classList.contains('feature-card--workout')) return 'workout';
    if (card.classList.contains('feature-card--stretch')) return 'stretch';
    if (card.classList.contains('feature-card--movement')) return 'movement';
    if (card.classList.contains('feature-card--chat')) return 'chat';
    return 'unknown';
  }
  
  /**
   * Add visual feedback for card interactions
   */
  addClickFeedback(card) {
    card.style.transform = 'translateY(-2px) scale(0.98)';
    
    setTimeout(() => {
      card.style.transform = '';
    }, 150);
  }
  
  /**
   * Navigate to specific feature
   */
  navigateToFeature(type) {
    console.log(`🎯 Navigating to: ${type}`);
    
    // Show loading state
    this.showLoading();
    
    // Simulate navigation delay
    setTimeout(() => {
      this.hideLoading();
      
      switch (type) {
        case 'workout':
          this.showComingSoon('Quick Workouts');
          break;
        case 'stretch':
          this.showComingSoon('Stretch Routines');
          break;
        case 'movement':
          this.showComingSoon('Daily Movement Tips');
          break;
        case 'chat':
          this.openChatWidget();
          break;
        default:
          console.warn('Unknown feature type:', type);
      }
    }, 800);
  }
  
  /**
   * Show coming soon modal (placeholder)
   */
  showComingSoon(featureName) {
    alert(`🚧 ${featureName} coming soon! \n\nWe're working hard to bring you the best movement experience.`);
  }
  
  /**
   * Open chat widget (placeholder for Botpress integration)
   */
  openChatWidget() {
    // This would integrate with Botpress or another chat service
    console.log('💬 Opening chat widget...');
    
    // Placeholder implementation
    if (window.botpressWebChat) {
      window.botpressWebChat.sendEvent({ type: 'show' });
    } else {
      this.showComingSoon('Chat with Coach');
    }
  }
  
  /**
   * Focus management for keyboard navigation
   */
  focusNextCard(currentIndex) {
    const nextIndex = (currentIndex + 1) % this.featureCards.length;
    this.featureCards[nextIndex].focus();
  }
  
  focusPreviousCard(currentIndex) {
    const prevIndex = currentIndex === 0 ? this.featureCards.length - 1 : currentIndex - 1;
    this.featureCards[prevIndex].focus();
  }
  
  /**
   * Handle global keyboard shortcuts
   */
  handleGlobalKeydown(event) {
    const { key, ctrlKey, metaKey } = event;
    
    // Theme toggle shortcut (Ctrl/Cmd + Shift + T)
    if ((ctrlKey || metaKey) && event.shiftKey && key === 'T') {
      event.preventDefault();
      this.toggleTheme();
    }
  }
  
  /**
   * Handle card hover effects
   */
  handleCardHover(card, isHovering) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    if (isHovering) {
      card.style.transform = 'translateY(-4px)';
    } else {
      card.style.transform = '';
    }
  }
  
  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Add live region for announcements
    this.createLiveRegion();
    
    // Enhanced focus indicators
    this.setupFocusManagement();
    
    // Skip link functionality is handled in CSS
  }
  
  /**
   * Create ARIA live region for screen reader announcements
   */
  createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    this.liveRegion = liveRegion;
  }
  
  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message) {
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
    }
  }
  
  /**
   * Enhanced focus management
   */
  setupFocusManagement() {
    // Focus trap for modals (when implemented)
    // Skip to main content functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        const targetId = skipLink.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }
  
  /**
   * Handle reduced motion preferences
   */
  handleReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (mediaQuery.matches) {
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition-normal', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
    
    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-normal', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
      } else {
        document.documentElement.style.removeProperty('--transition-fast');
        document.documentElement.style.removeProperty('--transition-normal');
        document.documentElement.style.removeProperty('--transition-slow');
      }
    });
  }
  
  /**
   * Show loading indicator
   */
  showLoading() {
    if (this.loadingElement) {
      this.isLoading = true;
      this.loadingElement.classList.add('active');
      this.loadingElement.setAttribute('aria-hidden', 'false');
      
      // Prevent scrolling
      this.body.style.overflow = 'hidden';
    }
  }
  
  /**
   * Hide loading indicator
   */
  hideLoading() {
    if (this.loadingElement) {
      this.isLoading = false;
      this.loadingElement.classList.remove('active');
      this.loadingElement.setAttribute('aria-hidden', 'true');
      
      // Restore scrolling
      this.body.style.overflow = '';
    }
  }
  
  /**
   * Preload critical images
   */
  preloadImages() {
    // Add image preloading if needed
    const imagesToPreload = [
      // Add image paths here when images are added
    ];
    
    imagesToPreload.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
  
  /**
   * Track page load time
   */
  trackLoadTime() {
    if ('performance' in window) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`📊 Page load time: ${loadTime}ms`);
    }
  }
  
  /**
   * Track user interactions (placeholder for analytics)
   */
  trackUserInteraction(action, data) {
    console.log(`📈 User interaction:`, { action, data, timestamp: new Date().toISOString() });
    
    // Here you would send to your analytics service
    // Example: gtag('event', action, { custom_parameter: data });
  }
  
  /**
   * Utility: Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * Utility: Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Initialize the application
const app = new MoveSmartAI();

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment when service worker is created
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered: ', registration))
    //   .catch(registrationError => console.log('SW registration failed: ', registrationError));
  });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MoveSmartAI;
}
/**
 * MoveSmartAI - Interactive JavaScript
 * Features: Navigation, animations, card interactions, timers, and accessibility
 */

class MoveSmartAI {
  constructor() {
    this.activeSection = 'home';
    this.timers = new Map();
    
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
    try {
      console.log('🚀 MoveSmartAI initializing...');
      
      this.cacheElements();
      this.initEventListeners();
      this.initIntersectionObserver();
      this.initAccessibilityFeatures();
      
      // Track app initialization
      this.trackUserInteraction('app_initialized', 'page_load');
      
      console.log('✅ MoveSmartAI initialized successfully!');
      
    } catch (error) {
      console.error('❌ Error initializing MoveSmartAI:', error);
      this.handleError('initialization', error);
    }
  }
  
  /**
   * Cache DOM elements for better performance
   */
  cacheElements() {
    // Navigation
    this.navLinks = document.querySelectorAll('[data-nav]');
    this.backBtns = document.querySelectorAll('.back-btn');
    this.logo = document.querySelector('.logo');
    
    // Main sections
    this.sections = {
      home: document.querySelector('.main'),
      workouts: document.querySelector('#workouts'),
      stretches: document.querySelector('#stretches'),
      tips: document.querySelector('#tips')
    };
    
    // Log sections for debugging
    console.log('Sections initialized:', this.sections);
    
    // Ensure all page sections start hidden except home
    Object.keys(this.sections).forEach(key => {
      const section = this.sections[key];
      if (section && key !== 'home') {
        section.style.display = 'none';
        section.classList.remove('active');
      }
    });
    
    // Cards
    this.cards = document.querySelectorAll('.feature-card, .workout-card, .stretch-card, .tips-card');
    
    // Timer elements
    this.timerModal = document.querySelector('#timer-modal');
    this.challengeTimerModal = document.querySelector('#challenge-timer-modal');
    this.miniTimer = document.querySelector('#mini-timer');
    
    // Modals
    this.modals = document.querySelectorAll('[role="dialog"], .timer-modal');
    
    // Timer close buttons
    this.timerCloseBtn = document.querySelector('.timer-modal__close');
    this.challengeTimerCloseBtn = document.querySelector('.challenge-timer-modal__close');
    
    console.log('Timer elements found:', {
      timerModal: !!this.timerModal,
      challengeTimerModal: !!this.challengeTimerModal,
      timerCloseBtn: !!this.timerCloseBtn,
      challengeTimerCloseBtn: !!this.challengeTimerCloseBtn
    });
  }
  
  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Navigation
    this.navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavigation.bind(this));
    });
    
    // Logo home navigation
    if (this.logo) {
      this.logo.addEventListener('click', () => this.showSection('home'));
    }
    
    // Back buttons
    this.backBtns.forEach(btn => {
      btn.addEventListener('click', () => this.showSection('home'));
    });
    
    // Card interactions
    this.cards.forEach((card, index) => {
      // Handle general card clicks
      card.addEventListener('click', (e) => {
        // Check if the click was on a challenge timer button
        if (e.target.classList.contains('challenge-timer') || e.target.closest('.challenge-timer')) {
          e.stopPropagation();
          console.log('Challenge timer button clicked directly');
          const duration = 60;
          this.startChallengeTimer(duration, 'Daily Challenge');
        } else {
          this.handleCardClick(card, index);
        }
      });
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCardClick(card, index);
        }
      });
    });
    
    // Challenge timer buttons specifically
    document.querySelectorAll('.challenge-timer').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Challenge timer button clicked via direct listener');
        const duration = 60;
        this.startChallengeTimer(duration, 'Daily Challenge');
      });
    });
    
    // Modal interactions
    this.modals.forEach((modal, index) => {
      const closeBtn = modal.querySelector('.modal__close, .timer-modal__close, .challenge-timer-modal__close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal(modal, index));
      }
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal, index);
        }
      });
    });
    
    // Timer close buttons specifically
    if (this.timerCloseBtn) {
      this.timerCloseBtn.addEventListener('click', () => this.closeTimerModal());
    }
    
    if (this.challengeTimerCloseBtn) {
      this.challengeTimerCloseBtn.addEventListener('click', () => this.closeChallengeTimerModal());
    }
    
    // Timer controls
    this.initTimerControls();
    this.initChallengeTimerControls();
    
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyNavigation.bind(this));
  }
  
  /**
   * Handle navigation clicks
   */
  handleNavigation(e) {
    e.preventDefault();
    
    // Find the button element (either e.target or its parent)
    let targetButton = e.target;
    if (targetButton.tagName === 'SPAN') {
      targetButton = targetButton.parentElement;
    }
    
    const target = targetButton.getAttribute('data-nav');
    if (target) {
      console.log(`Navigating to: ${target}`);
      this.showSection(target);
      this.updateActiveNavigation(targetButton);
    }
  }
  
  /**
   * Show specific section
   */
  showSection(sectionName) {
    console.log(`Showing section: ${sectionName}`);
    console.log('Available sections:', this.sections);
    
    // Hide all sections
    Object.values(this.sections).forEach(section => {
      if (section) {
        section.classList.remove('active');
        section.style.display = 'none';
      }
    });
    
    // Show target section
    const targetSection = this.sections[sectionName];
    console.log(`Target section for ${sectionName}:`, targetSection);
    
    if (targetSection) {
      targetSection.style.display = 'block';
      targetSection.classList.add('active');
      
      // Add animation class
      setTimeout(() => {
        targetSection.classList.add('fade-in');
      }, 10);
      
      this.activeSection = sectionName;
      
      // Update navigation active state
      this.updateNavigationForSection(sectionName);
      
      this.announceToScreenReader(`Navigated to ${sectionName} section`);
      this.trackUserInteraction('navigation', sectionName);
    } else {
      console.error(`Section '${sectionName}' not found!`);
    }
  }
  
  /**
   * Update active navigation state
   */
  updateActiveNavigation(activeLink) {
    this.navLinks.forEach(link => {
      link.removeAttribute('aria-current');
      link.classList.remove('active');
    });
    
    activeLink.setAttribute('aria-current', 'page');
    activeLink.classList.add('active');
  }
  
  /**
   * Update navigation state for a specific section
   */
  updateNavigationForSection(sectionName) {
    // Remove active state from all nav links
    this.navLinks.forEach(link => {
      link.removeAttribute('aria-current');
      link.classList.remove('active');
    });
    
    // Find and activate the correct nav link
    const targetNavLink = document.querySelector(`[data-nav="${sectionName}"]`);
    if (targetNavLink) {
      targetNavLink.setAttribute('aria-current', 'page');
      targetNavLink.classList.add('active');
      console.log(`Updated navigation active state for: ${sectionName}`);
    } else {
      console.warn(`Navigation link for '${sectionName}' not found`);
    }
  }
  
  /**
   * Handle card clicks
   */
  handleCardClick(card, index) {
    const cardType = this.getCardType(card);
    
    console.log(`🃏 ${cardType} card clicked (index: ${index})`);
    
    // Add visual feedback
    card.classList.add('clicked');
    setTimeout(() => card.classList.remove('clicked'), 200);
    
    // Handle different card types
    if (cardType === 'feature') {
      this.handleFeatureCard(card, index);
    } else if (cardType === 'workout' || cardType === 'stretch') {
      this.handleWorkoutStretchCard(card, index);
    } else if (cardType === 'tips') {
      this.handleTipsCard(card, index);
    }
    
    this.trackUserInteraction('card_click', `${cardType}_${index}`);
  }
  
  /**
   * Get card type from classes
   */
  getCardType(card) {
    if (card.classList.contains('feature-card')) return 'feature';
    if (card.classList.contains('workout-card')) return 'workout';
    if (card.classList.contains('stretch-card')) return 'stretch';
    if (card.classList.contains('tips-card')) return 'tips';
    return 'unknown';
  }
  
  /**
   * Handle feature card interaction
   */
  handleFeatureCard(card, index) {
    const sections = ['workouts', 'stretches', 'tips', 'chat'];
    const targetSection = sections[index];
    
    if (targetSection === 'chat') {
      this.openChatWidget();
    } else if (targetSection) {
      this.showSection(targetSection);
    }
  }
  
  /**
   * Handle workout/stretch card interaction
   */
  handleWorkoutStretchCard(card, index) {
    const startButton = card.querySelector('.workout-card__start, .challenge-timer');
    if (startButton) {
      const duration = this.getTimerDuration(card);
      this.startTimer(duration, card.querySelector('h3').textContent);
    }
  }
  
  /**
   * Handle tips card interaction
   */
  handleTipsCard(card, index) {
    // Check if this card has a challenge timer button
    const challengeButton = card.querySelector('.challenge-timer');
    if (challengeButton) {
      console.log('Challenge timer button clicked');
      const duration = 60; // 1 minute for challenges
      this.startChallengeTimer(duration, 'Daily Challenge');
    } else {
      // Add visual feedback for tips cards without timers
      this.showTipDetails(card, index);
    }
  }
  
  /**
   * Show tip details
   */
  showTipDetails(card, index) {
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;
    
    this.announceToScreenReader(`Tip: ${title}. ${description}`);
  }
  
  /**
   * Get timer duration from card
   */
  getTimerDuration(card) {
    const durationText = card.querySelector('.workout-card__info, .stretch-card__info');
    if (durationText) {
      const match = durationText.textContent.match(/(\d+)\s*min/i);
      return match ? parseInt(match[1]) * 60 : 300; // Default 5 minutes
    }
    return 300;
  }
  
  /**
   * Initialize timer controls
   */
  initTimerControls() {
    const startBtns = document.querySelectorAll('.timer-btn--start');
    const pauseBtns = document.querySelectorAll('.timer-btn--pause');
    const resetBtns = document.querySelectorAll('.timer-btn--reset');
    
    startBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleTimerControl('start'));
    });
    
    pauseBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleTimerControl('pause'));
    });
    
    resetBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleTimerControl('reset'));
    });
  }
  
  /**
   * Start timer
   */
  startTimer(duration, title = 'Workout') {
    console.log(`⏱️ Starting timer: ${duration}s for "${title}"`);
    
    const timerId = Date.now();
    const timer = {
      id: timerId,
      duration: duration,
      remaining: duration,
      title: title,
      isRunning: false,
      interval: null
    };
    
    this.timers.set(timerId, timer);
    this.showTimerModal(timer);
    this.trackUserInteraction('timer_started', title);
  }
  
  /**
   * Show timer modal
   */
  showTimerModal(timer) {
    if (this.timerModal) {
      this.timerModal.classList.add('active');
      this.updateTimerDisplay(timer);
      
      // Focus management
      const firstButton = this.timerModal.querySelector('.timer-btn--start');
      if (firstButton) {
        setTimeout(() => firstButton.focus(), 100);
      }
      
      this.announceToScreenReader(`Timer started for ${timer.title}`);
    }
  }
  
  /**
   * Update timer display
   */
  updateTimerDisplay(timer) {
    const display = document.querySelector('.timer-time');
    if (display) {
      const minutes = Math.floor(timer.remaining / 60);
      const seconds = timer.remaining % 60;
      display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }
  
  /**
   * Handle timer controls
   */
  handleTimerControl(action) {
    const activeTimer = Array.from(this.timers.values()).find(t => t.isRunning || this.timerModal?.classList.contains('active'));
    
    if (!activeTimer) return;
    
    switch (action) {
      case 'start':
        this.resumeTimer(activeTimer);
        break;
      case 'pause':
        this.pauseTimer(activeTimer);
        break;
      case 'reset':
        this.resetTimer(activeTimer);
        break;
      case 'stop':
        this.stopTimer(activeTimer);
        break;
    }
  }
  
  /**
   * Resume timer
   */
  resumeTimer(timer) {
    if (timer.isRunning) return;
    
    timer.isRunning = true;
    timer.interval = setInterval(() => {
      timer.remaining--;
      this.updateTimerDisplay(timer);
      
      if (timer.remaining <= 0) {
        this.completeTimer(timer);
      }
    }, 1000);
    
    this.trackUserInteraction('timer_resumed', timer.title);
  }
  
  /**
   * Pause timer
   */
  pauseTimer(timer) {
    if (!timer.isRunning) return;
    
    timer.isRunning = false;
    if (timer.interval) {
      clearInterval(timer.interval);
      timer.interval = null;
    }
    
    this.trackUserInteraction('timer_paused', timer.title);
  }
  
  /**
   * Reset timer
   */
  resetTimer(timer) {
    this.pauseTimer(timer);
    timer.remaining = timer.duration;
    this.updateTimerDisplay(timer);
    
    this.trackUserInteraction('timer_reset', timer.title);
  }
  
  /**
   * Complete timer
   */
  completeTimer(timer) {
    this.pauseTimer(timer);
    
    // Show completion message
    this.announceToScreenReader(`Timer completed for ${timer.title}. Great job!`);
    
    // Optional: Play sound or show notification
    this.showTimerCompletion(timer);
    
    this.trackUserInteraction('timer_completed', timer.title);
  }

  /**
   * Stop timer (end session early)
   */
  stopTimer(timer) {
    this.pauseTimer(timer);
    
    // Close timer modal
    if (this.timerModal) {
      this.timerModal.classList.remove('active');
    }
    
    // Remove timer from map
    this.timers.delete(timer.id);
    
    this.announceToScreenReader(`Timer stopped for ${timer.title}`);
    this.trackUserInteraction('timer_stopped', timer.title);
  }
  
  /**
   * Start challenge timer
   */
  startChallengeTimer(duration, title = 'Challenge') {
    console.log(`⏱️ Starting challenge timer: ${duration}s for "${title}"`);
    
    const timerId = Date.now();
    const timer = {
      id: timerId,
      duration: duration,
      remaining: duration,
      title: title,
      isRunning: false,
      interval: null,
      isChallenge: true
    };
    
    this.timers.set(timerId, timer);
    this.showChallengeTimerModal(timer);
    this.trackUserInteraction('challenge_timer_started', title);
  }
  
  /**
   * Show challenge timer modal
   */
  showChallengeTimerModal(timer) {
    if (this.challengeTimerModal) {
      this.challengeTimerModal.classList.add('active');
      this.challengeTimerModal.setAttribute('aria-hidden', 'false');
      this.updateChallengeTimerDisplay(timer);
      
      // Focus management
      const firstButton = this.challengeTimerModal.querySelector('.challenge-timer-btn--start');
      if (firstButton) {
        setTimeout(() => firstButton.focus(), 100);
      }
      
      this.announceToScreenReader(`Challenge timer started for ${timer.title}`);
    }
  }
  
  /**
   * Update challenge timer display
   */
  updateChallengeTimerDisplay(timer) {
    const display = document.querySelector('.challenge-timer-time');
    if (display) {
      const minutes = Math.floor(timer.remaining / 60);
      const seconds = timer.remaining % 60;
      display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }
  
  /**
   * Initialize challenge timer controls
   */
  initChallengeTimerControls() {
    const startBtns = document.querySelectorAll('.challenge-timer-btn--start');
    const pauseBtns = document.querySelectorAll('.challenge-timer-btn--pause');
    const resetBtns = document.querySelectorAll('.challenge-timer-btn--reset');
    
    startBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleChallengeTimerControl('start'));
    });
    
    pauseBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleChallengeTimerControl('pause'));
    });
    
    resetBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleChallengeTimerControl('reset'));
    });
  }
  
  /**
   * Handle challenge timer controls
   */
  handleChallengeTimerControl(action) {
    const activeTimer = Array.from(this.timers.values()).find(t => t.isChallenge && (t.isRunning || this.challengeTimerModal?.classList.contains('active')));
    
    if (!activeTimer) return;
    
    switch (action) {
      case 'start':
        this.resumeChallengeTimer(activeTimer);
        break;
      case 'pause':
        this.pauseChallengeTimer(activeTimer);
        break;
      case 'reset':
        this.resetChallengeTimer(activeTimer);
        break;
    }
  }
  
  /**
   * Resume challenge timer
   */
  resumeChallengeTimer(timer) {
    if (timer.isRunning) return;
    
    timer.isRunning = true;
    timer.interval = setInterval(() => {
      timer.remaining--;
      this.updateChallengeTimerDisplay(timer);
      
      if (timer.remaining <= 0) {
        this.completeChallengeTimer(timer);
      }
    }, 1000);
    
    this.trackUserInteraction('challenge_timer_resumed', timer.title);
  }
  
  /**
   * Pause challenge timer
   */
  pauseChallengeTimer(timer) {
    if (!timer.isRunning) return;
    
    timer.isRunning = false;
    if (timer.interval) {
      clearInterval(timer.interval);
      timer.interval = null;
    }
    
    this.trackUserInteraction('challenge_timer_paused', timer.title);
  }
  
  /**
   * Reset challenge timer
   */
  resetChallengeTimer(timer) {
    this.pauseChallengeTimer(timer);
    timer.remaining = timer.duration;
    this.updateChallengeTimerDisplay(timer);
    
    this.trackUserInteraction('challenge_timer_reset', timer.title);
  }
  
  /**
   * Complete challenge timer
   */
  completeChallengeTimer(timer) {
    this.pauseChallengeTimer(timer);
    
    // Show completion message
    this.announceToScreenReader(`Challenge completed for ${timer.title}. Awesome job!`);
    
    const display = document.querySelector('.challenge-timer-time');
    if (display) {
      display.textContent = '🎉 DONE!';
      display.style.color = 'var(--color-success)';
      
      setTimeout(() => {
        display.style.color = 'var(--color-primary)';
      }, 3000);
    }
    
    alert(`🎉 Amazing! You completed your ${timer.title}! Keep up the great work!`);
    this.trackUserInteraction('challenge_timer_completed', timer.title);
  }
  
  /**
   * Close timer modal
   */
  closeTimerModal() {
    if (this.timerModal) {
      this.timerModal.classList.remove('active');
      this.timerModal.setAttribute('aria-hidden', 'true');
      
      // Stop any running workout timers
      this.timers.forEach(timer => {
        if (!timer.isChallenge) {
          this.pauseTimer(timer);
        }
      });
    }
  }
  
  /**
   * Close challenge timer modal
   */
  closeChallengeTimerModal() {
    if (this.challengeTimerModal) {
      this.challengeTimerModal.classList.remove('active');
      this.challengeTimerModal.setAttribute('aria-hidden', 'true');
      
      // Stop any running challenge timers
      this.timers.forEach(timer => {
        if (timer.isChallenge) {
          this.pauseChallengeTimer(timer);
        }
      });
    }
  }
  
  /**
   * Show timer completion
   */
  showTimerCompletion(timer) {
    const completionMessage = `🎉 Great job! You completed your ${timer.title}!`;
    
    // Update timer display
    const display = document.querySelector('.timer-time');
    if (display) {
      display.textContent = '🎉 DONE!';
      display.style.color = 'var(--color-success)';
      
      setTimeout(() => {
        display.style.color = 'var(--color-primary)';
      }, 3000);
    }
    
    // Could add confetti or other celebration effects here
    console.log(completionMessage);
    alert(completionMessage);
  }
  
  /**
   * Close modal
   */
  closeModal(modal, index) {
    modal.classList.remove('active');
    
    // Stop any running timers if timer modal is closed
    if (modal === this.timerModal) {
      this.timers.forEach(timer => this.pauseTimer(timer));
    }
    
    this.announceToScreenReader('Modal closed');
  }
  
  /**
   * Open chat widget (Botpress integration)
   */
  openChatWidget() {
    console.log('💬 Opening chat widget...');
    
    // Check if Botpress webchat is loaded
    if (typeof window.botpress !== 'undefined' && window.botpress.open) {
      try {
        // Open the Botpress webchat
        window.botpress.open();
        this.trackUserInteraction('chat_opened', 'botpress_widget');
        this.announceToScreenReader('Chat widget opened');
        
      } catch (error) {
        console.warn('Error opening Botpress widget:', error);
        this.showChatFallback();
      }
    } else {
      // Try alternative methods
      if (typeof window.botpressWebChat !== 'undefined') {
        try {
          window.botpressWebChat.sendEvent({ type: 'show' });
          this.trackUserInteraction('chat_opened', 'botpress_widget_alt');
        } catch (error) {
          console.warn('Error with alternative method:', error);
          this.showChatFallback();
        }
      } else {
        console.warn('Botpress not found');
        this.showChatFallback();
      }
    }
  }
  
  /**
   * Fallback chat option when Botpress isn't available
   */
  showChatFallback() {
    const fallbackMessage = `🤖 Chat with MoveSmart AI\n\n` +
      `Hey! I'm your fitness coach. I can help with:\n\n` +
      `💪 Quick workouts (5-15 min)\n` +
      `🧘 Stretch routines\n` +
      `🚶 Daily movement tips\n` +
      `❓ Exercise questions\n\n` +
      `The chat widget should appear automatically. If you don't see it, please refresh the page!`;
    
    alert(fallbackMessage);
  }
  
  /**
   * Handle keyboard navigation
   */
  handleKeyNavigation(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
      this.modals.forEach(modal => {
        if (modal.classList.contains('active')) {
          this.closeModal(modal, 0);
        }
      });
    }
    
    // Number keys for quick navigation
    if (e.key >= '1' && e.key <= '4' && !e.target.matches('input, textarea')) {
      const sections = ['home', 'workouts', 'stretches', 'tips'];
      const sectionIndex = parseInt(e.key) - 1;
      if (sections[sectionIndex]) {
        this.showSection(sections[sectionIndex]);
      }
    }
  }
  
  /**
   * Initialize intersection observer for animations
   */
  initIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '20px'
      });
      
      // Observe cards and sections
      this.cards.forEach(card => this.observer.observe(card));
    }
  }
  
  /**
   * Initialize accessibility features
   */
  initAccessibilityFeatures() {
    // Add ARIA labels dynamically
    this.cards.forEach((card, index) => {
      if (!card.getAttribute('aria-label')) {
        const title = card.querySelector('h3, .feature-card__title');
        if (title) {
          card.setAttribute('aria-label', `${title.textContent} - Click to interact`);
        }
      }
      
      // Make cards focusable
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
    });
    
    // Enhanced focus management for modals
    this.modals.forEach(modal => {
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          this.trapFocus(e, modal);
        }
      });
    });
  }
  
  /**
   * Trap focus within modal
   */
  trapFocus(e, modal) {
    const focusableElements = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
  
  /**
   * Announce to screen reader
   */
  announceToScreenReader(message) {
    let announcement = document.getElementById('sr-announcement');
    if (!announcement) {
      announcement = document.createElement('div');
      announcement.id = 'sr-announcement';
      announcement.className = 'sr-only';
      announcement.setAttribute('aria-live', 'polite');
      document.body.appendChild(announcement);
    }
    
    announcement.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      announcement.textContent = '';
    }, 1000);
  }
  
  /**
   * Track user interactions for analytics
   */
  trackUserInteraction(action, details = '') {
    const data = {
      action,
      details,
      timestamp: new Date().toISOString(),
      section: this.activeSection,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
    
    console.log('📊 User interaction:', data);
    
    // Here you could send to analytics service
    // Example: gtag('event', action, { custom_parameter: details });
  }
  
  /**
   * Handle errors gracefully
   */
  handleError(context, error) {
    console.error(`❌ Error in ${context}:`, error);
    
    // Show user-friendly error message
    this.announceToScreenReader('An error occurred. Please try refreshing the page.');
    
    // Track error for debugging
    this.trackUserInteraction('error', `${context}: ${error.message}`);
  }
}

// Initialize the application
new MoveSmartAI();
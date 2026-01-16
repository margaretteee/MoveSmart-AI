/**
 * MoveSmartAI - Interactive JavaScript
 * Features: Navigation, animations, card interactions, timers, and accessibility
 */

class MoveSmartAI {
  constructor() {
    this.activeSection = 'home';
    this.timers = new Map();
    
    // Initialize EmailJS
    this.initEmailJS();
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }
  
  /**
   * Initialize EmailJS for email reminders
   */
  initEmailJS() {
    // Initialize EmailJS with configuration from config file
    if (typeof emailjs !== 'undefined' && window.EMAIL_CONFIG) {
      emailjs.init({
        publicKey: window.EMAIL_CONFIG.publicKey,
        limitRate: window.EMAIL_CONFIG.limitRate
      });
      console.log('📧 EmailJS initialized successfully with config');
    } else {
      console.warn('EmailJS or EMAIL_CONFIG not loaded, using fallback email service');
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
      this.initCalendarReminder();
      
      // Check for any previously scheduled reminders
      this.checkScheduledReminders();
      
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
    // First check data-duration attribute
    const dataDuration = card.getAttribute('data-duration');
    if (dataDuration) {
      return parseInt(dataDuration) * 60; // Convert minutes to seconds
    }
    
    // Fallback: check duration text in card
    const durationText = card.querySelector('.workout-card__duration, .stretch-card__duration, .workout-card__info, .stretch-card__info');
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
  
  /**
   * Initialize Calendar Reminder functionality
   */
  initCalendarReminder() {
    // Cache elements
    this.reminderBtn = document.getElementById('set-reminder-btn');
    this.testEmailBtn = document.getElementById('test-email-btn');
    this.reminderModal = document.getElementById('calendar-reminder-modal');
    this.reminderForm = document.getElementById('reminder-form');
    this.reminderCloseBtn = this.reminderModal?.querySelector('.reminder-modal__close');
    this.reminderSuccess = document.getElementById('reminder-success');
    this.downloadOutlookBtn = document.getElementById('download-outlook');

    if (!this.reminderBtn || !this.reminderModal) return;

    // Event listeners
    this.reminderBtn.addEventListener('click', () => this.openReminderModal());
    this.testEmailBtn?.addEventListener('click', () => this.testEmailService());
    this.reminderCloseBtn?.addEventListener('click', () => this.closeReminderModal());
    this.reminderForm.addEventListener('submit', (e) => this.handleReminderSubmit(e));

    // Close modal on outside click
    this.reminderModal.addEventListener('click', (e) => {
      if (e.target === this.reminderModal) {
        this.closeReminderModal();
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.reminderModal.classList.contains('active')) {
        this.closeReminderModal();
      }
    });

    // Load saved preferences
    this.loadReminderPreferences();
    
    console.log('📅 Calendar reminder initialized');
  }

  /**
   * Open reminder modal
   */
  openReminderModal() {
    this.reminderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('reminder-date');
    dateInput.value = tomorrow.toISOString().split('T')[0];
    
    // Set default time to 9:00 AM
    const timeInput = document.getElementById('reminder-time');
    if (!timeInput.value) {
      timeInput.value = '09:00';
    }
    
    // Focus first input
    document.getElementById('reminder-title').focus();
    
    this.trackUserInteraction('reminder_modal_opened', 'modal_open');
  }

  /**
   * Close reminder modal
   */
  closeReminderModal() {
    this.reminderModal.classList.remove('active');
    document.body.style.overflow = '';
    this.reminderSuccess.style.display = 'none';
    this.reminderForm.style.display = 'flex';
  }

  /**
   * Test email service functionality
   */
  async testEmailService() {
    const testEmail = prompt('Enter your email to test the email service:', '');
    if (!testEmail || !testEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      console.log('🧪 Testing email service...');
      
      // Show loading state
      const originalText = this.testEmailBtn.innerHTML;
      this.testEmailBtn.innerHTML = '<span>⏳</span><span>Testing...</span>';
      this.testEmailBtn.disabled = true;
      
      // Test with current date/time
      const testDate = new Date();
      testDate.setMinutes(testDate.getMinutes() + 30); // 30 minutes from now
      
      const success = await this.sendConfirmationEmail(
        testEmail,
        'Email Test - MoveSmartAI',
        testDate,
        30,
        'This is a test email to verify the email service is working correctly.'
      );
      
      if (success) {
        alert('✅ Test email sent successfully! Check your inbox.');
        console.log('✅ Test email sent successfully');
      } else {
        alert('❌ Test email failed. Check the console for details.');
        console.log('❌ Test email failed');
      }
    } catch (error) {
      console.error('❌ Email test error:', error);
      alert('❌ Email test failed: ' + error.message);
    } finally {
      // Restore button state
      const originalText = '<span class="reminder-btn__icon">📧</span><span class="reminder-btn__text">Test Email Service</span>';
      this.testEmailBtn.innerHTML = originalText;
      this.testEmailBtn.disabled = false;
    }
  }

  /**
   * Handle reminder form submission
   */
  handleReminderSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(this.reminderForm);
    
    // Check honeypot (spam protection)
    if (formData.get('website')) {
      console.warn('Spam detected via honeypot');
      return;
    }
    
    // Validate required fields
    const title = formData.get('title').trim();
    const email = formData.get('email').trim();
    const date = formData.get('date');
    const time = formData.get('time');
    const duration = parseInt(formData.get('duration'));
    
    if (!title || !email || !date || !time) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Create reminder data
    this.currentReminder = {
      title,
      email,
      date,
      time,
      duration,
      repeat: formData.get('repeat'),
      notes: formData.get('notes').trim(),
      reminderMinutes: parseInt(formData.get('reminderMinutes'))
    };
    
    // Schedule email reminder
    this.scheduleEmailReminder();
    
    // Save preferences
    this.saveReminderPreferences();
    
    // Show success state
    this.showReminderSuccess();
    
    this.trackUserInteraction('reminder_created', 'form_submit', {
      duration: duration,
      repeat: this.currentReminder.repeat,
      hasEmail: true
    });
  }

  /**
   * Show reminder success state
   */
  showReminderSuccess() {
    this.reminderForm.style.display = 'none';
    this.reminderSuccess.style.display = 'block';
    
    // Setup action button
    this.downloadOutlookBtn.onclick = () => this.downloadOutlookICS();
  }

  /**
   * Schedule email reminder
   */
  async scheduleEmailReminder() {
    const { title, email, date, time, duration, reminderMinutes, notes } = this.currentReminder;
    
    // Create reminder date/time
    const workoutDateTime = new Date(`${date}T${time}`);
    const reminderDateTime = new Date(workoutDateTime.getTime() - reminderMinutes * 60000);
    const now = new Date();
    
    // Send immediate confirmation email
    console.log('📧 Sending confirmation email...');
    await this.sendConfirmationEmail(email, title, workoutDateTime, duration, notes);
    
    // Check if reminder time is in the future
    const timeUntilReminder = reminderDateTime.getTime() - now.getTime();
    
    if (timeUntilReminder > 0) {
      // Schedule the email reminder
      console.log(`⏰ Reminder scheduled for ${reminderDateTime.toLocaleString()} (in ${Math.round(timeUntilReminder / 1000 / 60)} minutes)`);
      
      setTimeout(async () => {
        console.log('⏰ Time to send workout reminder!');
        await this.sendEmailReminder(email, title, workoutDateTime, duration, notes);
      }, timeUntilReminder);
      
      // Also store in localStorage for persistence (in case page is refreshed)
      this.storeScheduledReminder({
        email, title, workoutDateTime: workoutDateTime.toISOString(), 
        duration, notes, reminderDateTime: reminderDateTime.toISOString()
      });
      
    } else {
      console.warn('⚠️ Reminder time is in the past, cannot schedule future reminder');
      // Show a friendly message to user
      alert('Note: Your workout time is very soon or has passed. You\'ve received a confirmation email, but no reminder will be scheduled.');
    }
  }
  
  /**
   * Store scheduled reminder in localStorage
   */
  storeScheduledReminder(reminderData) {
    try {
      const stored = JSON.parse(localStorage.getItem('movesmartai_scheduled_reminders') || '[]');
      stored.push(reminderData);
      localStorage.setItem('movesmartai_scheduled_reminders', JSON.stringify(stored));
    } catch (error) {
      console.warn('Could not store scheduled reminder:', error);
    }
  }
  
  /**
   * Check for any scheduled reminders on page load
   */
  checkScheduledReminders() {
    try {
      const stored = JSON.parse(localStorage.getItem('movesmartai_scheduled_reminders') || '[]');
      const now = new Date();
      const remaining = [];
      
      stored.forEach(reminder => {
        const reminderTime = new Date(reminder.reminderDateTime);
        const timeUntilReminder = reminderTime.getTime() - now.getTime();
        
        if (timeUntilReminder > 0) {
          // Reschedule this reminder
          console.log(`🔄 Rescheduling reminder for ${reminderTime.toLocaleString()}`);
          setTimeout(async () => {
            await this.sendEmailReminder(
              reminder.email, 
              reminder.title, 
              new Date(reminder.workoutDateTime), 
              reminder.duration, 
              reminder.notes
            );
          }, timeUntilReminder);
          remaining.push(reminder);
        }
      });
      
      // Update stored reminders, removing past ones
      localStorage.setItem('movesmartai_scheduled_reminders', JSON.stringify(remaining));
      
    } catch (error) {
      console.warn('Error checking scheduled reminders:', error);
    }
  }
  
  /**
   * Send email reminder using EmailJS
   */
  async sendEmailReminder(email, title, workoutDateTime, duration, notes) {
    console.log(`📧 Attempting to send email reminder to ${email}`);
    
    // Try EmailJS first
    if (typeof emailjs !== 'undefined' && window.EMAIL_CONFIG) {
      try {
        const emailParams = {
          to_email: email,
          to_name: 'Fitness Enthusiast',
          from_name: 'MoveSmartAI',
          subject: `🏋️‍♀️ Workout Reminder: ${title}`,
          message: `Hi there! 👋\n\nThis is your friendly reminder that your workout "${title}" is scheduled for:\n\n📅 Date: ${workoutDateTime.toLocaleDateString()}\n⏰ Time: ${workoutDateTime.toLocaleTimeString()}\n⏱️ Duration: ${duration} minutes\n\n${notes ? `📝 Notes: ${notes}\n\n` : ''}Time to get moving! 💪\n\nRemember:\n• Find a comfortable space\n• Stay hydrated\n• Listen to your body\n• Have fun with it!\n\nBest regards,\nYour MoveSmartAI Team\n\nP.S. Visit https://margaretteee.github.io/MoveSmart-AI/ for more workouts!`
        };
        
        await emailjs.send(
          window.EMAIL_CONFIG.serviceId,
          window.EMAIL_CONFIG.templateId,
          emailParams
        );
        console.log('✅ Reminder email sent successfully via EmailJS!');
        return true;
      } catch (error) {
        console.warn('EmailJS failed, trying fallback method:', error);
      }
    }
    
    // Fallback: Use webhook service
    return await this.sendEmailViaWebhook(email, title, workoutDateTime, duration, notes, 'reminder');
  }
  
  /**
   * Send confirmation email
   */
  async sendConfirmationEmail(email, title, workoutDateTime, duration, notes) {
    console.log(`📧 Sending confirmation email to ${email}`);
    
    if (typeof emailjs !== 'undefined' && window.EMAIL_CONFIG) {
      try {
        const emailParams = {
          to_email: email,
          to_name: 'Fitness Enthusiast',
          from_name: 'MoveSmartAI',
          subject: `✅ Workout Reminder Confirmed: ${title}`,
          message: `Hi there! 👋\n\nYour workout reminder has been set up successfully!\n\n📅 Workout: ${title}\n📅 Date: ${workoutDateTime.toLocaleDateString()}\n⏰ Time: ${workoutDateTime.toLocaleTimeString()}\n⏱️ Duration: ${duration} minutes\n\n${notes ? `📝 Notes: ${notes}\n\n` : ''}We'll send you a reminder email before your workout time.\n\nStay motivated and keep moving! 💪\n\nBest regards,\nYour MoveSmartAI Team`
        };
        
        await emailjs.send(
          window.EMAIL_CONFIG.serviceId,
          window.EMAIL_CONFIG.templateId,
          emailParams
        );
        console.log('✅ Confirmation email sent via EmailJS!');
        return true;
      } catch (error) {
        console.warn('EmailJS failed for confirmation, trying fallback:', error);
      }
    }
    
    return await this.sendEmailViaWebhook(email, title, workoutDateTime, duration, notes, 'confirmation');
  }
  
  /**
   * Fallback email service using webhook
   */
  async sendEmailViaWebhook(email, title, workoutDateTime, duration, notes, type) {
    try {
      const isReminder = type === 'reminder';
      const subject = isReminder ? `🏋️‍♀️ Workout Reminder: ${title}` : `✅ Workout Reminder Confirmed: ${title}`;
      const message = isReminder 
        ? `Time for your workout "${title}"!\n\nScheduled for: ${workoutDateTime.toLocaleString()}\nDuration: ${duration} minutes\n${notes ? `\nNotes: ${notes}` : ''}\n\nGet moving! 💪`
        : `Your workout reminder for "${title}" has been confirmed!\n\nScheduled for: ${workoutDateTime.toLocaleString()}\nDuration: ${duration} minutes\n\nWe'll remind you before it's time!`;
      
      const response = await fetch('https://formspree.io/f/xnnqlrpv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          subject: subject,
          message: message,
          _subject: subject,
          _replyto: email
        })
      });
      
      if (response.ok) {
        console.log('✅ Email sent successfully via webhook!');
        return true;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Failed to send email via webhook:', error);
      // Last resort: browser notification
      this.showBrowserNotification(title, workoutDateTime);
      return false;
    }
  }
  
  /**
   * Fallback browser notification
   */
  showBrowserNotification(title, workoutDateTime) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`🏋️‍♀️ ${title}`, {
          body: `Scheduled for ${workoutDateTime.toLocaleString()}`,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(`🏋️‍♀️ ${title}`, {
              body: `Scheduled for ${workoutDateTime.toLocaleString()}`,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
  }
  downloadOutlookICS() {
    const { title, date, time, duration, repeat, notes, reminderMinutes } = this.currentReminder;
    
    // Create start and end times
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
    
    // Format dates for ICS (UTC format)
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };
    
    // Generate RRULE for repeat
    let rrule = '';
    if (repeat === 'daily') {
      rrule = '\nRRULE:FREQ=DAILY';
    } else if (repeat === 'weekly') {
      rrule = '\nRRULE:FREQ=WEEKLY';
    }
    
    // Create VALARM for reminder
    const reminderTrigger = `-PT${reminderMinutes}M`;
    const valarm = `BEGIN:VALARM
TRIGGER:${reminderTrigger}
DESCRIPTION:${title}
ACTION:DISPLAY
END:VALARM`;
    
    // Create ICS content with Outlook-specific formatting
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Microsoft Corporation//Outlook 16.0 MIMEDIR//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@movesmartai.outlook.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDateTime)}
DTEND:${formatDate(endDateTime)}
SUMMARY:${title}
DESCRIPTION:${notes || 'Time for your MoveSmartAI workout! 💪\n\nThis reminder will help you stay consistent with your fitness goals.\n\nVisit: https://margaretteee.github.io/MoveSmart-AI/'}
LOCATION:Your preferred workout space
CATEGORIES:FITNESS,HEALTH,PERSONAL
PRIORITY:5
STATUS:CONFIRMED
TRANSP:OPAQUE${rrule}
${valarm}
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '\r\n');

    // Create and download file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `MoveSmartAI-Workout-Reminder-${date}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    
    this.trackUserInteraction('outlook_ics_downloaded', 'file_download', {
      reminderMinutes: reminderMinutes
    });
  }

  /**
   * Save user preferences to localStorage
   */
  saveReminderPreferences() {
    const prefs = {
      title: this.currentReminder.title,
      email: this.currentReminder.email,
      duration: this.currentReminder.duration,
      repeat: this.currentReminder.repeat,
      reminderMinutes: this.currentReminder.reminderMinutes
    };
    
    try {
      localStorage.setItem('movesmartai_reminder_prefs', JSON.stringify(prefs));
    } catch (error) {
      console.warn('Could not save reminder preferences:', error);
    }
  }

  /**
   * Load user preferences from localStorage
   */
  loadReminderPreferences() {
    try {
      const prefs = JSON.parse(localStorage.getItem('movesmartai_reminder_prefs') || '{}');
      
      if (prefs.title) {
        document.getElementById('reminder-title').value = prefs.title;
      }
      if (prefs.email) {
        document.getElementById('reminder-email').value = prefs.email;
      }
      if (prefs.duration) {
        document.getElementById('reminder-duration').value = prefs.duration;
      }
      if (prefs.repeat) {
        document.getElementById('reminder-repeat').value = prefs.repeat;
      }
      if (prefs.reminderMinutes) {
        document.getElementById('reminder-minutes').value = prefs.reminderMinutes;
      }
    } catch (error) {
      console.warn('Could not load reminder preferences:', error);
    }
  }
}

// Initialize the application
new MoveSmartAI();
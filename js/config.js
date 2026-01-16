/**
 * MoveSmartAI Email Configuration
 * Configure EmailJS settings for sending reminder emails
 */

// EmailJS Configuration
// Sign up at https://www.emailjs.com/ and replace these with your actual credentials
const EMAIL_CONFIG = {
  // EmailJS Public Key (from your EmailJS dashboard)
  publicKey: 'iG7UP4CNtfOHJKrLf', // This is a working demo key, replace with yours for production
  
  // EmailJS Service ID (create a service in your EmailJS dashboard)
  serviceId: 'service_moveai', // Replace with your actual service ID
  
  // EmailJS Template ID (create a template in your EmailJS dashboard)
  templateId: 'template_reminder', // Replace with your actual template ID
  
  // Rate limiting
  limitRate: {
    throttle: 10000, // 10 seconds between requests
  },
  
  // Fallback email service configuration
  fallback: {
    // Using a reliable webhook service as fallback
    webhookUrl: 'https://formspree.io/f/xnnqlrpv', // Replace with your webhook URL
    enabled: true
  }
};

// Email Template Configuration
const EMAIL_TEMPLATES = {
  reminder: {
    subject: '🏋️‍♀️ Workout Reminder: {{title}}',
    preheader: 'Time for your scheduled workout!',
    greeting: 'Hi there! 👋',
    mainMessage: 'This is your friendly reminder that your workout "{{title}}" is scheduled for:',
    schedulingInfo: '📅 Date: {{date}}\n⏰ Time: {{time}}\n⏱️ Duration: {{duration}} minutes',
    motivationalText: 'Time to get moving! 💪',
    tips: [
      '• Find a comfortable space',
      '• Stay hydrated', 
      '• Listen to your body',
      '• Have fun with it!'
    ],
    signature: 'Best regards,\nYour MoveSmartAI Team',
    footer: 'P.S. Visit https://margaretteee.github.io/MoveSmart-AI/ for more workouts!'
  },
  
  confirmation: {
    subject: '✅ Workout Reminder Confirmed: {{title}}',
    preheader: 'Your workout reminder has been set up successfully!',
    greeting: 'Hi there! 👋',
    mainMessage: 'Your workout reminder has been set up successfully!',
    schedulingInfo: '📅 Workout: {{title}}\n📅 Date: {{date}}\n⏰ Time: {{time}}\n⏱️ Duration: {{duration}} minutes',
    motivationalText: 'Stay motivated and keep moving! 💪',
    signature: 'Best regards,\nYour MoveSmartAI Team'
  }
};

// Export configuration for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EMAIL_CONFIG, EMAIL_TEMPLATES };
} else {
  // For browser environment
  window.EMAIL_CONFIG = EMAIL_CONFIG;
  window.EMAIL_TEMPLATES = EMAIL_TEMPLATES;
}
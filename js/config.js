/**
 * MoveSmartAI Email Configuration
 * Configure EmailJS settings for sending reminder emails
 */

// EmailJS Configuration
// Using working EmailJS credentials for actual email delivery
const EMAIL_CONFIG = {
  // EmailJS Public Key - this is a working public key
  publicKey: 'iG7UP4CNtfOHJKrLf',
  
  // EmailJS Service ID - working Gmail service
  serviceId: 'service_8n6kzua',
  
  // EmailJS Template ID - using a basic template that should work
  templateId: 'template_reminder',
  
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
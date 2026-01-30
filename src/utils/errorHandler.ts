/**
<<<<<<< HEAD
 * Error Handler Utility
 * Converts technical error messages into user-friendly messages
 */

/**
=======
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
 * Sanitize error messages by removing technical details
 * and providing user-friendly alternatives
 */
export const sanitizeErrorMessage = (error: unknown): string => {
  if (!error) {
    return 'An unexpected error occurred';
  }

  let errorMessage = '';
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = String(error);
  }

  // Convert technical errors to user-friendly messages
  const errorMappings: { [key: string]: string } = {
    // Bluetooth connection errors
    'java.io.ioexception': 'Connection failed',
    'read failed': 'Connection failed',
    'connection lost': 'Connection lost',
    'socket closed': 'Connection closed',
    'bt socket closed': 'Connection closed',
    'connection reset': 'Connection failed',
    'broken pipe': 'Connection failed',
    'software caused connection abort': 'Connection failed',
    'socket might closed': 'Connection closed',
    'unable to start service discovery': 'Unable to connect to device',
    
    // Timeout errors
    'timeout': 'Connection timeout',
    'timed out': 'Connection timeout',
    
    // Permission errors
    'permission': 'Permission required',
    'denied': 'Permission denied',
    
    // Device errors
    'device not found': 'Device not found',
    'no device': 'No device connected',
    'not connected': 'Device not connected',
    
    // Generic errors
    'failed': 'Operation failed',
    'error': 'An error occurred',
  };

  // Check if error message contains any technical terms
  const lowerError = errorMessage.toLowerCase();
  
  for (const [technical, friendly] of Object.entries(errorMappings)) {
    if (lowerError.includes(technical)) {
      return friendly;
    }
  }

  // If no mapping found and message looks technical (contains java/android packages)
  if (lowerError.includes('java.') || 
      lowerError.includes('android.') || 
      lowerError.includes('exception') ||
      lowerError.includes('stack trace')) {
    return 'Connection failed';
  }

  // Return original message if it seems user-friendly (short and simple)
  if (errorMessage.length < 50 && !errorMessage.includes('.')) {
    return errorMessage;
  }

  // Default fallback
  return 'An error occurred. Please try again.';
};

/**
 * Log error for debugging while showing user-friendly message
 */
export const handleError = (error: unknown, context?: string): string => {
  // Log full technical error for debugging
  if (context) {
    console.error(`[${context}]`, error);
  } else {
    console.error(error);
  }

  // Return sanitized message for user display
  return sanitizeErrorMessage(error);
};

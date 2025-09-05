export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateUsername(username: string): {
  isValid: boolean;
  error?: string;
} {
  if (username.length < 3) {
    return {
      isValid: false,
      error: 'Username must be at least 3 characters long'
    };
  }

  if (username.length > 20) {
    return {
      isValid: false,
      error: 'Username cannot be longer than 20 characters'
    };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, underscores, and hyphens'
    };
  }

  return { isValid: true };
}

export function validatePostTitle(title: string): {
  isValid: boolean;
  error?: string;
} {
  if (!title.trim()) {
    return {
      isValid: false,
      error: 'Title is required'
    };
  }

  if (title.length < 3) {
    return {
      isValid: false,
      error: 'Title must be at least 3 characters long'
    };
  }

  if (title.length > 100) {
    return {
      isValid: false,
      error: 'Title cannot be longer than 100 characters'
    };
  }

  return { isValid: true };
}

export function validatePostContent(content: string): {
  isValid: boolean;
  error?: string;
} {
  if (!content.trim()) {
    return {
      isValid: false,
      error: 'Content is required'
    };
  }

  if (content.length < 10) {
    return {
      isValid: false,
      error: 'Content must be at least 10 characters long'
    };
  }

  return { isValid: true };
}

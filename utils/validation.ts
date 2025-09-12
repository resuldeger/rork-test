export const validateEmail = (email: string): string | undefined => {
  if (!email) return "Email is required";
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) return "Password is required";
  
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  
  if (!/\d/.test(password)) {
    return "Password must contain at least one number";
  }
  
  return undefined;
};

export const validatePhoneNumber = (phone: string): string | undefined => {
  if (!phone) return "Phone number is required";
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.length < 10) {
    return "Please enter a valid phone number";
  }
  
  return undefined;
};

export const validateRequired = (value: string, minLength = 1): boolean => {
  return value && value.trim().length >= minLength;
};

export const validateAge = (birthDate: string): string | undefined => {
  if (!birthDate) return "Birth date is required";
  
  const date = new Date(birthDate);
  if (isNaN(date.getTime())) {
    return "Please enter a valid date (YYYY-MM-DD)";
  }
  
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    // Haven't had birthday this year
    if (age - 1 < 18) {
      return "You must be at least 18 years old";
    }
  } else {
    if (age < 18) {
      return "You must be at least 18 years old";
    }
  }
  
  return undefined;
};
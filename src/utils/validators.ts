/** Validate email string */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/** Validate password (min 8 chars, 1 uppercase, 1 number) */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

/** Validate phone number (basic international format) */
export const isValidPhone = (phone: string): boolean => {
  const regex = /^\+?[\d\s\-()]{7,15}$/;
  return regex.test(phone);
};






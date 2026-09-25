// lib/validators.ts

export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone) return false;
  // Allows optional leading + followed strictly by 7 to 15 digits
  const phoneRegex = /^\+?\d{7,15}$/;
  return phoneRegex.test(phone.trim());
};

export const sanitizePhoneInput = (input: string): string => {
  if (!input) return "";
  const hasPlus = input.trim().startsWith("+");
  const digitsOnly = input.replace(/\D/g, "");
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
};
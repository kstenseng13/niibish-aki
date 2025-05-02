"use client";


export const validateUsername = (username) => {
  const usernameRegex = /^\S+$/; // No spaces in username
  
  if (!username) return 'Username is required.';
  if (username.length < 5 || username.length > 15) return 'Username must be between 5 and 15 characters.';
  if (!usernameRegex.test(username)) return 'Username cannot contain spaces.';
  
  return '';
};


export const validatePassword = (password, repeatPassword = null, requireStrong = false) => {
  if (!password) return 'Password is required.';
  if (password.length < 8 || password.length > 16) return 'Password must be between 8 and 16 characters.';
  
  if (requireStrong) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must include at least one uppercase letter, one number, and one special character.';
    }
  }
  
  if (repeatPassword !== null && password !== repeatPassword) {
    return 'Passwords do not match.';
  }
  
  return '';
};

export const validateAddress = (address) => {
  if (!address.line1) return 'Address line 1 is required.';
  if (!address.city) return 'City is required.';
  if (!address.state) return 'State is required.';
  if (!address.zipcode) return 'Zip code is required.';
  
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(address.zipcode)) {
    return 'Please enter a valid zip code (e.g., 12345 or 12345-6789).';
  }
  
  return '';
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required.';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }
  
  return '';
};

export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return 'Phone number is required.';

  const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return 'Please enter a valid phone number (e.g., (800)-123-4567).';
  }
  
  return '';
};

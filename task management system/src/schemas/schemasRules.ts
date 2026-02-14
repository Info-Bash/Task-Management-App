
export const REGISRULES = {
  FULL_NAME: {
    regex: /^[A-Za-z][A-Za-z'\-]{1,}(?:\s[A-Za-z][A-Za-z'\-]{0,}){1,2}$/,
    min: 5,
    max: 50,
    error: 'Format: "First Last" or "First Middle Last"'
  },

  USER_NAME: {
    min: 4,
    max: 20,
    regex: /^[a-zA-Z0-9](?!.*__)[a-zA-Z0-9_]{2,18}[a-zA-Z0-9]$/,
    error: "Username: 4–20 characters, letters/numbers only at start/end, underscores allowed but no __."
  },

  AGE: {
    min: 18,
    max: 65,
    error: 'Required'
  },

  NATIONAL_ID: {
    max: 11,
    min: 11,
    regex: /[a-zA-Z0-9]{11}/,
    error: 'Alphanumeric'
  },

 PHONE_NUMBER: {
    max: 11,
    min: 11,
    regex: /^0\d{10}$/, 
    error: 'Phone number must be 11 digits and start with 0'
  },

  EMAIL: {
    message: "Enter a valid email",
    requireMsg: "Email is required",
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    error: "Must have a valid domain (e.g. .com)"
  },

  GENDER: {
    sex: ["male", "female", "other"],
    error: "Gender selection is required"
  },

  MARITAL_STATUS: {
    status: ["single", "married", "divorced", " widowed", "separated"],
    error: "Marital status is required"
  },

  PASSWORD: {
    min: 8,
    max: 100,
    requireMsg: "Password is required",
    // Regex for: 1 Uppercase, 1 Number, 1 Special Character
    regex: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  }
}
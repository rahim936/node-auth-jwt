import UserModel from '../Models/UserModel.js';

export const validateRegister = async (req, res, next) => {
  const { username, email, password, confirm_password } = req.body;

  const errors = [];

  const username_validator = new RegExp(/^(?=.{4,12}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/);
  const email_validator = new RegExp(/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/);
  const password_validator = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[~`'"\[{\]}!@#$%^&*(=+-_)\\<,.?>\/])[a-zA-Z\d~`'"\[{\]}!@#$%^&*(=+-_)\\<,.?>\/]{8,}$/);

  try {
        // username
        if (!username) {
            errors.push({ field_name: 'username', error_name: 'required', error_message: 'Username is Required.' });
          } else if (username.length < 4) {
            errors.push({ field_name: 'username', error_name: 'minLength', error_message: 'Username is must be 4 characters long.' });
          } else if (username.length > 12) {
            errors.push({ field_name: 'username', error_name: 'maxLenght', error_message: 'Username is too long.' });
          } else if (!username_validator.test(username)) {
            errors.push({ field_name: 'username', error_name: 'match', error_message: 'Username can not start or end with . or _ and must be 4 characters long.' });
          } else {
            const user_exists = await UserModel.findOne({ username: username });
            if (user_exists) {
              errors.push({ field_name: 'username', error_name: 'unique', error_message: 'Username already in use.' });
            }
          }
      
          //email
          if (!email) {
            errors.push({ field_name: 'email', error_name: 'required', error_message: 'Email is required.' });
          } else if (!email_validator.test(email)) {
            errors.push({ field_name: 'email', error_name: 'match', error_message: 'Please provide a valid email address.' });
          } else {
            const email_exists = await UserModel.findOne({ email: email });
            if (email_exists) {
              errors.push({ field_name: 'email', error_name: 'unique', error_message: 'Email already exists.' });
            }
          }
      
          // password
          if (!password) {
            errors.push({ field_name: 'password', error_name: 'required', error_message: 'Password is required.' });
          } else if (password.length < 8) {
            errors.push({ field_name: 'password', error_name: 'minLength', error_message: 'Passoword must be 8 characters long.' });
          } else if (!password_validator.test(password)) {
            errors.push({
              field_name: 'password',
              error_name: 'match',
              error_message: 'Password must contain one uppercase letter, one lowercase letter, one digit, one special characters and must be 8 chartactes long.',
            });
          }
      
          if (!confirm_password) {
            errors.push({ field: 'confirm_password', error_name: 'required', error_message: 'Confirm Password is required.' });
          } else if (confirm_password !== password) {
            errors.push({ field_name: 'confirm_password', error_name: 'misMatch', error_message: "Password does't match." });
          }
      
          if (errors.length === 0) return next();
          return res.status(400).json({ success: false, error: errors });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal Server Error'})
  }
};

export const validateLogin = async (req, res, next) => {
    const { username_or_email, password } = req.body;

    const errors = [];
    if (!username_or_email) {
      errors.push({ field_name: 'username_or_email', error_name: 'required', error_message: 'This field is required.' });
    }
  
    if (!password) {
      errors.push({ field_name: 'password', error_name: 'required', error_message: 'This field is required.' });
    }
  
    if (errors.length === 0) return next();
    return res.status(400).json({ success: false, error: errors });
};

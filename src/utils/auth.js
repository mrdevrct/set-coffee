import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

const hashPassword = async (password) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

const verifyPassword = async (password, hashedPassword) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

const generateAccessToken = (data) => {
  const token = sign({ ...data }, process.env.ACCESS_TOKEN, {
    expiresIn: "60d",
  });
  return token;
};

const verifyAccessToken = (token) => {
  try {
    const tokenPayload = verify(token, process.env.ACCESS_TOKEN);
    return tokenPayload;
  } catch (e) {
    console.log("verify access token error", e);
    return false;
  }
};

const generateRefreshToken = (data) => {
  const token = sign({ ...data }, process.env.REFRESH_TOKEN, {
    expiresIn: "60d",
  });
  return token;
};

const validateEmail = (email) => {
  const pattern =
    /^(?=.{1,256})(?=.{1,64}@.{1,255})(?:(?:(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*)|(?:"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*"))@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3}(?::\d{1,5})?(?:\/[a-zA-Z0-9#]+\/?)?)\s*)$/g;

  return pattern.test(email);
};

const validatePhone = (phone) => {
  const pattern = /^(\+98|0)?9\d{9}$|^\+?[1-9]\d{1,14}$/g;
  return pattern.test(phone);
};

const validatePassword = (password) => {
  const pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;
  return pattern.test(password);
};

export {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  validateEmail,
  validatePhone,
  validatePassword,
};

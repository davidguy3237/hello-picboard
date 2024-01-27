import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = scryptSync(password, salt, 64).toString("hex");
  return `${hashedPassword}:${salt}`;
}

export function comparePasswords(
  inputtedPassword: string,
  storedPassword: string,
) {
  const [hashedPassword, salt] = storedPassword.split(":");
  const hashedPasswordBuffer = Buffer.from(hashedPassword, "hex");
  const inputtedPasswordBuffer = scryptSync(inputtedPassword, salt, 64);
  return timingSafeEqual(hashedPasswordBuffer, inputtedPasswordBuffer);
}

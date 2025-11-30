// Authentication utilities
import crypto from "crypto"
import { db } from "./db"

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function generateUserId(): string {
  return crypto.randomUUID()
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export async function register(email: string, password: string, fullName: string) {
  // Check if email already exists
  const existingUser = Array.from(db.users.values()).find((u) => u.email === email)
  if (existingUser) {
    throw new Error("Email already registered")
  }

  // Validate password
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters")
  }

  // Create new user
  const userId = generateUserId()
  const user = {
    id: userId,
    email,
    password: hashPassword(password),
    fullName,
    createdAt: new Date(),
  }

  db.users.set(userId, user)
  return { id: userId, email, fullName }
}

export async function login(email: string, password: string) {
  const user = Array.from(db.users.values()).find((u) => u.email === email)

  if (!user) {
    throw new Error("Email not found")
  }

  if (user.password !== hashPassword(password)) {
    throw new Error("Invalid password")
  }

  return { id: user.id, email: user.email, fullName: user.fullName }
}

export async function requestPasswordReset(email: string) {
  const user = Array.from(db.users.values()).find((u) => u.email === email)

  if (!user) {
    throw new Error("Email not found")
  }

  const token = generateResetToken()
  const expiresAt = new Date(Date.now() + 3600000) // 1 hour

  db.resetTokens.set(token, { email, expiresAt })
  return token
}

export async function resetPassword(token: string, newPassword: string) {
  const resetData = db.resetTokens.get(token)

  if (!resetData) {
    throw new Error("Invalid reset token")
  }

  if (new Date() > resetData.expiresAt) {
    db.resetTokens.delete(token)
    throw new Error("Reset token expired")
  }

  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters")
  }

  const user = Array.from(db.users.values()).find((u) => u.email === resetData.email)
  if (user) {
    user.password = hashPassword(newPassword)
    db.resetTokens.delete(token)
  }
}

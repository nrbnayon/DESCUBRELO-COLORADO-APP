// utils/validationSchemas.ts
import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(4, "Password must be needed"),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .refine((email) => {
      // Check for no uppercase letters
      return email === email.toLowerCase();
    }, "Email must be in lowercase")
    .refine((email) => {
      // Check for no spaces
      return !email.includes(" ");
    }, "Email cannot contain spaces"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .refine((password) => {
      // Check for no spaces
      return !password.includes(" ");
    }, "Password cannot contain spaces")

    .refine((password) => {
      // Check for no common patterns
      const commonPatterns = [
        /123456/,
        /password/i,
        /qwerty/i,
        /abc123/i,
        /admin/i,
        /letmein/i,
      ];
      return !commonPatterns.some((pattern) => pattern.test(password));
    }, "Password contains common patterns that are not secure"),
  agreeToPrivacyPolicy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy",
  }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Language selection schema
export const languageSelectSchema = z.object({
  languageId: z.string().min(1, "Please select a language"),
  languageCode: z.string().min(1, "Language code is required"),
  languageName: z.string().min(1, "Language name is required"),
});

// Password strength calculation utility
export const calculatePasswordStrength = (password: string) => {
  let score = 0;
  const checks = {
    length: false,
    uppercase: false,
    lowercase: false,
    numbers: false,
    special: false,
    noCommon: false,
  };

  // Length check (8+ characters)
  if (password.length >= 8) {
    score += 20;
    checks.length = true;
  }

  // Uppercase letter
  if (/[A-Z]/.test(password)) {
    score += 15;
    checks.uppercase = true;
  }

  // Lowercase letter
  if (/[a-z]/.test(password)) {
    score += 15;
    checks.lowercase = true;
  }

  // Numbers
  if (/[0-9]/.test(password)) {
    score += 15;
    checks.numbers = true;
  }

  // Special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 20;
    checks.special = true;
  }

  // No common patterns
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /admin/i,
    /letmein/i,
  ];
  if (!commonPatterns.some((pattern) => pattern.test(password))) {
    score += 15;
    checks.noCommon = true;
  }

  // Determine strength level
  let strength: "weak" | "medium" | "strong" = "weak";
  if (score >= 80) {
    strength = "strong";
  } else if (score >= 50) {
    strength = "medium";
  }

  return {
    score: Math.min(score, 100),
    strength,
    checks,
  };
};

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type LanguageSelectFormData = z.infer<typeof languageSelectSchema>;

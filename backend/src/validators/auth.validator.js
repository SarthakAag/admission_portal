const { z } = require("zod");

const signupSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.union([
    z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
    z.literal(""),
  ]).optional(),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

module.exports = { signupSchema, loginSchema };
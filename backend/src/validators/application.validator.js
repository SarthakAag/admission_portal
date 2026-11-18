const { z } = require("zod");

const createApplicationSchema = z.object({
  courseId: z.string().uuid("Invalid course ID"),
  academicYear: z
    .string()
    .trim()
    .min(4, "Academic year is required")
    .max(20, "Academic year is too long"),
  entranceExam: z
    .string()
    .trim()
    .max(100, "Entrance exam name is too long")
    .optional()
    .nullable(),
  entranceRank: z
    .number()
    .int("Rank must be a whole number")
    .positive("Rank must be positive")
    .optional()
    .nullable(),
  entranceScore: z
    .number()
    .min(0, "Score cannot be negative")
    .optional()
    .nullable(),
});

const updateApplicationSchema = z.object({
  courseId: z.string().uuid().optional(),
  academicYear: z.string().trim().min(4).max(20).optional(),
  entranceExam: z.string().trim().max(100).optional().nullable(),
  entranceRank: z.number().int().positive().optional().nullable(),
  entranceScore: z.number().min(0).optional().nullable(),
});

module.exports = {
  createApplicationSchema,
  updateApplicationSchema,
};
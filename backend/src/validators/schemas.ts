import { z } from 'zod';

export const createGradeSchema = z.object({
  score: z.number().min(0).max(20, 'Score must be between 0 and 20'),
  course: z.string().min(1, 'Course name is required').max(100),
  semester: z.number().int().min(1).max(10, 'Semester must be between 1 and 10'),
});

export const updateGradeSchema = z.object({
  score: z.number().min(0).max(20).optional(),
  course: z.string().min(1).max(100).optional(),
  semester: z.number().int().min(1).max(10).optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type CreateGradeInput = z.infer<typeof createGradeSchema>;
export type UpdateGradeInput = z.infer<typeof updateGradeSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

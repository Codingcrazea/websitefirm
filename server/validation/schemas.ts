import { z } from 'zod';

export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  country: z.string().optional(),
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  sourcePage: z.string().optional(),
});

export const AdminLoginSchema = z.object({
  email: z.string().email('Invalid admin email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const ContentWriteSchema = z.object({
  type: z.enum([
    'blogs',
    'portfolio',
    'case-studies',
    'services',
    'solutions',
    'industries',
    'technologies',
    'team',
    'testimonials',
    'faqs',
    'careers',
  ]),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  frontmatter: z.record(z.any()),
  content: z.string(),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
export type AdminLoginData = z.infer<typeof AdminLoginSchema>;
export type ContentWriteData = z.infer<typeof ContentWriteSchema>;

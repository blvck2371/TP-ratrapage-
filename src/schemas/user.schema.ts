// Schemas de validation pour les utilisateurs (Zod)

import { z } from 'zod';

// Création d'un user
export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    name: z.string().min(2, 'Nom trop court'),
    age: z.number().int().min(0).max(150).optional(),
    role: z.enum(['user', 'admin', 'moderator']).default('user'),
  }),
});

// Mise à jour d'un user
export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide'),
  }),
  body: z.object({
    email: z.string().email().optional(),
    name: z.string().min(2).optional(),
    age: z.number().int().min(0).max(150).optional(),
    role: z.enum(['user', 'admin', 'moderator']).optional(),
    isActive: z.boolean().optional(),
  }),
});

// Récupérer un user par ID
export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide'),
  }),
});

// Liste des users avec pagination
export const listUsersSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('10'),
    role: z.enum(['user', 'admin', 'moderator']).optional(),
  }),
});

// Types inférés
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Routes pour les utilisateurs

import { Router } from 'express';
import { userController } from '../controllers/index.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createUserSchema,
  updateUserSchema,
  getUserByIdSchema,
  listUsersSchema,
} from '../schemas/index.js';

const router = Router();

// GET /users - liste des utilisateurs
router.get('/', validate(listUsersSchema), userController.getAll);

// POST /users - créer un utilisateur
router.post('/', validate(createUserSchema), userController.create);

// GET /users/:id - récupérer un utilisateur
router.get('/:id', validate(getUserByIdSchema), userController.getById);

// PUT /users/:id - modifier un utilisateur
router.put('/:id', validate(updateUserSchema), userController.update);

// DELETE /users/:id - supprimer un utilisateur
router.delete('/:id', validate(getUserByIdSchema), userController.remove);

export { router as userRoutes };

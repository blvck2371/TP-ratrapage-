// Controller User - gère les requêtes HTTP pour les utilisateurs

import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service.js';

// POST /users - créer un utilisateur
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    if (error.message === 'Email déjà utilisé') {
      res.status(409).json({ success: false, error: error.message });
    } else {
      next(error);
    }
  }
};

// GET /users/:id - récupérer un utilisateur
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// GET /users - lister les utilisateurs
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, role } = req.query as any;
    const result = await userService.getUsers(page, limit, role);
    
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// PUT /users/:id - modifier un utilisateur
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// DELETE /users/:id - supprimer un utilisateur
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (error) {
    next(error);
  }
};

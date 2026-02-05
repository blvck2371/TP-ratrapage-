// Service User - logique métier pour les utilisateurs

import { User, IUser } from '../models/mongodb/user.model.js';
import { recordUserActivity } from '../models/influxdb/metrics.model.js';

// Créer un utilisateur
export const createUser = async (data: {
  email: string;
  name: string;
  age?: number;
  role?: 'user' | 'admin' | 'moderator';
}): Promise<IUser> => {
  // Vérifier si l'email existe déjà
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new Error('Email déjà utilisé');
  }

  const user = new User(data);
  await user.save();

  // Log l'activité
  await recordUserActivity(user.id, 'user_created');

  return user;
};

// Récupérer un user par ID
export const getUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

// Récupérer tous les users avec pagination
export const getUsers = async (page: number, limit: number, role?: string) => {
  const query: any = {};
  if (role) query.role = role;

  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Mettre à jour un user
export const updateUser = async (
  id: string,
  data: Partial<IUser>
): Promise<IUser | null> => {
  const user = await User.findByIdAndUpdate(id, data, { new: true });
  
  if (user) {
    await recordUserActivity(user.id, 'user_updated');
  }

  return user;
};

// Supprimer un user
export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await User.findByIdAndDelete(id);
  
  if (result) {
    await recordUserActivity(id, 'user_deleted');
    return true;
  }

  return false;
};

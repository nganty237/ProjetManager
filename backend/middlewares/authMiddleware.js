import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Récupérer le token du header
      token = req.headers.authorization.split(' ')[1];

      // Decrypt and verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request, excluding sensitive password data for security
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur introuvable' });
      }

      // Proceed to the next middleware or controller
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  }

  // Pas de token dans les headers
  return res.status(401).json({ message: 'Non autorisé, pas de token' });
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Administrateur') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé : réservé aux administrateurs' });
  }
};

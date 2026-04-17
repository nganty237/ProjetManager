import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Récupérer le token du header
      token = req.headers.authorization.split(' ')[1];

      // Décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ajouter l'utilisateur à la requête (sans le mot de passe)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur introuvable' });
      }

      return next(); // ← IMPORTANT : return pour éviter le double appel à res
    } catch (error) {
      return res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  }

  // Pas de token dans les headers
  return res.status(401).json({ message: 'Non autorisé, pas de token' });
};

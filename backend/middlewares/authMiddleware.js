import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Project from '../models/Project.js';

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

      // Check account status
      if (req.user.status === 'EN_ATTENTE') {
        return res.status(403).json({ 
          message: "Votre compte est en attente d'activation. Veuillez utiliser le lien d'invitation pour définir votre mot de passe." 
        });
      }

      if (req.user.status === 'INACTIF') {
        return res.status(403).json({ 
          message: "Votre compte a été désactivé par l'administrateur." 
        });
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

// Middleware: Administrateur uniquement
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMINISTRATEUR') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé : réservé aux administrateurs' });
  }
};

// Middleware: Chef de projet uniquement
export const isChefDeProjet = (req, res, next) => {
  if (req.user && req.user.role === 'CHEF_DE_PROJET') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé : réservé aux chefs de projet' });
  }
};

// Middleware: Chef de projet ou Administrateur
export const isChefOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'CHEF_DE_PROJET' || req.user.role === 'ADMINISTRATEUR')) {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé : réservé aux administrateurs et chefs de projet' });
  }
};

/**
 * Middleware vérifiant si l'utilisateur connecté est le propriétaire (ownerId) du projet ciblé.
 */
export const isProjectOwner = async (req, res, next) => {
  try {
    const projectId = req.params.id || req.params.projectId;
    if (!projectId) {
      return res.status(400).json({ message: 'Identifiant du projet manquant' });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Le chef de projet doit être le créateur/propriétaire
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé : vous n'êtes pas le propriétaire de ce projet" });
    }

    req.project = project;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la vérification des droits sur le projet" });
  }
};

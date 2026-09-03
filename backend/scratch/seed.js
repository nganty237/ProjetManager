import sequelize from '../config/db.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion établie.');

    // Définir les relations pour que addMembers fonctionne
    Project.hasMany(Task, { onDelete: 'CASCADE' });
    Task.belongsTo(Project);
    Project.belongsToMany(User, { through: 'TeamMembers', as: 'members' });
    User.belongsToMany(Project, { through: 'TeamMembers', as: 'projects' });
    User.hasMany(Task, { foreignKey: 'assignedToId' });
    Task.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignee' });

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });
    console.log('Tables synchronisées.');

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Ajouter des utilisateurs avec des noms africains
    const usersData = [
      { name: 'Amadou Diallo', email: 'amadou@example.com', role: 'Membre', password: passwordHash },
      { name: 'Fatou Diop', email: 'fatou@example.com', role: 'Membre', password: passwordHash },
      { name: 'Kwame Osei', email: 'kwame@example.com', role: 'Admin', password: passwordHash },
      { name: 'Aisha Mensah', email: 'aisha@example.com', role: 'Membre', password: passwordHash },
      { name: 'Chidi Eze', email: 'chidi@example.com', role: 'Membre', password: passwordHash }
    ];

    const users = await User.bulkCreate(usersData);
    console.log('Utilisateurs ajoutés.');

    // 2. Ajouter des projets fictifs
    const projectsData = [
      {
        title: 'Refonte du site e-commerce',
        description: 'Mise à jour complète du design et intégration de nouveaux moyens de paiement pour l\'Afrique de l\'Ouest.',
        status: 'active',
        priority: 'high',
        progress: 45
      },
      {
        title: 'Application mobile de livraison',
        description: 'Développement de l\'application iOS et Android pour les livreurs partenaires de Dakar.',
        status: 'planning',
        priority: 'medium',
        progress: 10
      },
      {
        title: 'Campagne marketing Q3',
        description: 'Préparation des supports visuels pour la rentrée.',
        status: 'completed',
        priority: 'low',
        progress: 100
      }
    ];

    const projects = await Project.bulkCreate(projectsData);
    console.log('Projets ajoutés.');

    // Assigner des membres aux projets
    await projects[0].addMembers([users[0], users[1], users[2]]);
    await projects[1].addMembers([users[3], users[4]]);
    await projects[2].addMembers([users[1], users[4]]);

    // 3. Ajouter des tâches
    const tasksData = [
      { title: 'Maquette page d\'accueil', description: 'Faire les maquettes Figma', status: 'in-progress', projectId: projects[0].id, assignedToId: users[1].id },
      { title: 'Intégration API Mobile Money', description: 'Orange Money, Wave, MTN', status: 'todo', projectId: projects[0].id, assignedToId: users[0].id },
      { title: 'Définir architecture base de données', description: 'Choix entre SQL et NoSQL', status: 'todo', projectId: projects[1].id, assignedToId: users[3].id },
      { title: 'Flyers et affiches', description: 'Impression terminée', status: 'done', projectId: projects[2].id, assignedToId: users[4].id }
    ];

    await Task.bulkCreate(tasksData);
    console.log('Tâches ajoutées.');

    console.log('Base de données remplie avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding de la base de données :', error);
    process.exit(1);
  }
};

seedDatabase();

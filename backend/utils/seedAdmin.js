import bcrypt from 'bcryptjs';
import User from '../models/User.js';

/**
 * Initialise automatiquement le compte administrateur principal si aucun administrateur n'existe dans la base.
 * Les paramètres peuvent être personnalisés via les variables d'environnement (.env) :
 * - ADMIN_NAME     : Nom complet de l'administrateur
 * - ADMIN_EMAIL    : Adresse email de connexion
 * - ADMIN_PASSWORD : Mot de passe initial
 */
export const initAdminAccount = async () => {
  try {
    const adminExists = await User.findOne({ where: { role: 'ADMINISTRATEUR' } });

    if (!adminExists) {
      const name = process.env.ADMIN_NAME || 'Administrateur Principal';
      const email = (process.env.ADMIN_EMAIL || 'admin@admin.com').trim().toLowerCase();
      const password = process.env.ADMIN_PASSWORD || 'admin123';

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'ADMINISTRATEUR',
        status: 'ACTIF',
      });

      console.log('\n=============================================================');
      console.log('👑 [PROJET MANAGER] Compte Administrateur initial configuré');
      console.log(`   Nom          : ${name}`);
      console.log(`   Email        : ${email}`);
      console.log(`   Mot de passe : ${password}`);
      console.log('   Connectez-vous via l\'interface pour changer votre mot de passe.');
      console.log('=============================================================\n');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation du compte administrateur :', error.message);
  }
};

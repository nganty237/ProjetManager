import { connectDB, sequelize } from '../config/db.js';
import '../models/index.js';
import User from '../models/User.js';
import * as authService from '../services/authService.js';
import bcrypt from 'bcryptjs';

async function runTest() {
  try {
    console.log('--- Connexion à la base de données ---');
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log('Base synchronisée avec succès.');

    // 1. Créer ou récupérer un utilisateur de test actif
    const testEmail = 'test_reset_pwd@example.com';
    let user = await User.findOne({ where: { email: testEmail } });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('InitialPassword123!', salt);
      user = await User.create({
        name: 'Test Reset User',
        email: testEmail,
        password: hash,
        role: 'MEMBRE',
        status: 'ACTIF',
      });
      console.log('Utilisateur de test créé.');
    } else {
      user.status = 'ACTIF';
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash('InitialPassword123!', salt);
      user.resetPasswordToken = null;
      user.resetPasswordExpiresAt = null;
      await user.save();
    }

    console.log('\n--- Test 1: Demande avec un email inexistant (sécurité anti-énumération) ---');
    const nonExistingRes = await authService.requestPasswordReset('non_existant_999@example.com');
    console.log('Réponse reçue :', nonExistingRes);

    console.log('\n--- Test 2: Demande avec l’email de test existant ---');
    const existingRes = await authService.requestPasswordReset(testEmail);
    console.log('Réponse reçue :', existingRes);
    const token = existingRes.resetToken;
    console.log('Token généré :', token);

    console.log('\n--- Test 3: Vérification d’un token invalide ---');
    try {
      await authService.verifyResetPasswordToken('token_completement_invalide');
      console.error('ERREUR : Le token invalide a été accepté !');
    } catch (err) {
      console.log('Succès : Erreur attendue capturée ->', err.message);
    }

    console.log('\n--- Test 4: Vérification du token valide ---');
    const verifyRes = await authService.verifyResetPasswordToken(token);
    console.log('Token valide :', verifyRes);

    console.log('\n--- Test 5: Réinitialisation avec le nouveau mot de passe ---');
    const newPassword = 'NouveauMotDePasse2026!';
    const resetRes = await authService.resetPasswordWithToken(token, newPassword);
    console.log('Réponse réinitialisation :', resetRes);

    console.log('\n--- Test 6: Tentative de réutilisation du même token (doit échouer) ---');
    try {
      await authService.verifyResetPasswordToken(token);
      console.error('ERREUR : Le token a pu être réutilisé !');
    } catch (err) {
      console.log('Succès : Token invalidé après usage ->', err.message);
    }

    console.log('\n--- Test 7: Connexion avec l’ancien mot de passe (doit échouer) ---');
    try {
      await authService.loginUser(testEmail, 'InitialPassword123!');
      console.error('ERREUR : L’ancien mot de passe a fonctionné !');
    } catch (err) {
      console.log('Succès : Ancien mot de passe rejeté ->', err.message);
    }

    console.log('\n--- Test 8: Connexion avec le nouveau mot de passe (doit réussir) ---');
    const loginRes = await authService.loginUser(testEmail, newPassword);
    console.log('Connexion réussie ! Token JWT généré :', !!loginRes.token);

    // Nettoyage
    await user.destroy();
    console.log('\nNettoyage terminé.');
    process.exit(0);
  } catch (error) {
    console.error('Erreur durant le test :', error);
    process.exit(1);
  }
}

runTest();

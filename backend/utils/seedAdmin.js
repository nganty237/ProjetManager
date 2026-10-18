import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import config from '../config/index.js';
import logger from './logger.js';

const log = logger.for('AdminInit');

/**
 * Initialise automatiquement le compte administrateur initial si aucun compte administrateur n'existe.
 */
export const initAdminAccount = async () => {
  try {
    const adminExists = await User.findOne({ where: { role: 'ADMINISTRATEUR' } });

    if (!adminExists) {
      const { name, email, password } = config.admin;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'ADMINISTRATEUR',
        status: 'ACTIF',
      });

      log.info(`Default administrator account created (email: ${email})`);
    } else {
      log.debug('Existing administrator account detected.');
    }
  } catch (error) {
    log.error(`Failed to initialize administrator account: ${error.message}`, error);
  }
};

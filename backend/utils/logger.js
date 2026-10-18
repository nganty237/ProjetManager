import fs from 'fs';
import path from 'path';
import util from 'util';
import config from '../config/index.js';

// Niveaux de logs conformes aux standards Syslog / RFC 5424
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Codes de couleurs ANSI pour console
const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const LEVEL_COLORS = {
  error: `${COLORS.bold}${COLORS.red}`,
  warn: `${COLORS.bold}${COLORS.yellow}`,
  info: `${COLORS.bold}${COLORS.green}`,
  http: `${COLORS.bold}${COLORS.cyan}`,
  debug: `${COLORS.dim}${COLORS.magenta}`,
};

const LEVEL_NAMES = {
  error: 'ERROR',
  warn: 'WARN',
  info: 'INFO',
  http: 'HTTP',
  debug: 'DEBUG',
};

class Logger {
  constructor() {
    this.currentLevel = LOG_LEVELS[config.log.level] ?? LOG_LEVELS.info;
    this.logDir = config.log.dir;
    this.fileLogging = config.log.fileLogging;

    if (this.fileLogging) {
      this.combinedFile = path.join(this.logDir, 'app.log');
      this.errorFile = path.join(this.logDir, 'error.log');
      this.httpFile = path.join(this.logDir, 'http.log');
    }
  }

  /**
   * Horodatage ISO-8601 standard
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Écriture asynchrone non-bloquante dans les fichiers de logs
   */
  writeToFile(filePath, line) {
    if (!this.fileLogging) return;
    try {
      fs.appendFile(filePath, line + '\n', 'utf8', (err) => {
        if (err) {
          process.stderr.write(`[LOGGER_ERROR] Unable to write log to ${filePath}: ${err.message}\n`);
        }
      });
    } catch {
      // Ignorer silencieusement pour ne pas bloquer l'application
    }
  }

  /**
   * Formatage console coloré standard : [ISO_TIMESTAMP] [LEVEL] [CONTEXT] Message
   */
  formatConsole(level, message, tag = '', meta = null) {
    const timestamp = `${COLORS.dim}${this.getTimestamp()}${COLORS.reset}`;
    const levelStr = `${LEVEL_COLORS[level]}[${LEVEL_NAMES[level].padEnd(5)}]${COLORS.reset}`;
    const tagStr = tag ? `${COLORS.bold}${COLORS.blue}[${tag}]${COLORS.reset} ` : '';

    let formatted = `${timestamp} ${levelStr} ${tagStr}${message}`;

    if (meta) {
      if (meta instanceof Error) {
        formatted += `\n${COLORS.red}${meta.stack || meta.message}${COLORS.reset}`;
      } else if (typeof meta === 'object' && Object.keys(meta).length > 0) {
        formatted += `\n${COLORS.gray}${util.inspect(meta, { colors: true, depth: 3, compact: false })}${COLORS.reset}`;
      }
    }

    return formatted;
  }

  /**
   * Formatage texte brut standard pour les fichiers : ISO_TIMESTAMP [LEVEL] [CONTEXT] Message [meta]
   */
  formatPlain(level, message, tag = '', meta = null) {
    const timestamp = this.getTimestamp();
    const levelStr = `[${LEVEL_NAMES[level].padEnd(5)}]`;
    const tagStr = tag ? `[${tag}] ` : '';

    let plain = `${timestamp} ${levelStr} ${tagStr}${message}`;

    if (meta) {
      if (meta instanceof Error) {
        plain += `\n${meta.stack || meta.message}`;
      } else if (typeof meta === 'object' && Object.keys(meta).length > 0) {
        plain += ` | ${JSON.stringify(meta)}`;
      }
    }

    return plain;
  }

  /**
   * Émission générique de log
   */
  log(level, message, meta = null, tag = '') {
    if (LOG_LEVELS[level] > this.currentLevel) {
      return;
    }

    const consoleOutput = this.formatConsole(level, message, tag, meta);
    const plainOutput = this.formatPlain(level, message, tag, meta);

    if (level === 'error') {
      console.error(consoleOutput);
    } else if (level === 'warn') {
      console.warn(consoleOutput);
    } else {
      console.log(consoleOutput);
    }

    if (this.fileLogging) {
      this.writeToFile(this.combinedFile, plainOutput);
      if (level === 'error') {
        this.writeToFile(this.errorFile, plainOutput);
      }
      if (level === 'http') {
        this.writeToFile(this.httpFile, plainOutput);
      }
    }
  }

  error(message, errorOrMeta = null, tag = '') {
    this.log('error', message, errorOrMeta, tag);
  }

  warn(message, meta = null, tag = '') {
    this.log('warn', message, meta, tag);
  }

  info(message, meta = null, tag = '') {
    this.log('info', message, meta, tag);
  }

  http(message, meta = null) {
    this.log('http', message, meta, 'HTTP');
  }

  debug(message, meta = null, tag = '') {
    this.log('debug', message, meta, tag);
  }

  /**
   * Fournit un sous-logger contextuel pré-tagué (ex: logger.for('Database'))
   */
  for(tag) {
    return {
      error: (msg, meta) => this.error(msg, meta, tag),
      warn: (msg, meta) => this.warn(msg, meta, tag),
      info: (msg, meta) => this.info(msg, meta, tag),
      http: (msg, meta) => this.http(msg, meta),
      debug: (msg, meta) => this.debug(msg, meta, tag),
    };
  }
}

export const logger = new Logger();
export default logger;

import { createLogger, format, transports } from 'winston'
import chalk from 'chalk';
import 'winston-daily-rotate-file';
const { combine, timestamp, printf, errors, colorize, uncolorize } = format;


const env = process.env.NODE_ENV;

// Daily Rotate File to Delete file after some time
const errorTransport = new transports.DailyRotateFile({
  filename: 'error-%DATE%.log',
  level: 'error', 
  maxSize: '10m',
  maxFiles: '7d',
  datePattern: 'YYYY-MM-DD-HH', 
  dirname: 'src/logs'
});

const infoTransport = new transports.DailyRotateFile({
  dirname: 'src/logs',
  filename: 'info-%DATE%.log', 
  maxSize: '10m',
  maxFiles: '7d', 
  datePattern: 'YYYY-MM-DD-HH'
})

const combinedTransport = new transports.DailyRotateFile({
  dirname: 'src/logs',
   filename: 'combined-%DATE%.log', 
  maxSize: '10m',
  maxFiles: '7d',
   datePattern: 'YYYY-MM-DD-HH'
});


// This format will be used in while working in development

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let filename = 'unknown'
  if (meta && meta.__filename) {
    const parts = meta.__filename.split('\\')
    filename = parts[parts.length - 1]
  }
  return `${timestamp} : ${chalk.blueBright.underline.bold(
    filename
  )} :: ${level} :: ${stack || message}`
})

// this format will be used when working in production

const prodLogFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let filename = 'unknown'
  if (meta && meta.__filename) {
    const parts = meta.__filename.split('\\')
    filename = parts[parts.length - 1]
  }
  return `${timestamp} : ${filename} ${level} :: ${stack || message}`
})

const logger = createLogger({
  format: combine(
    env === 'DEVELOPMENT' ? colorize() : uncolorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    format.prettyPrint(),
    format.splat(),  // Added to enable string interpolation to print object 
    env === 'DEVELOPMENT' ? logFormat : prodLogFormat
  ),

  exitOnError: false,
  transports: [errorTransport, infoTransport, combinedTransport],
})

if (env !== 'PRODUCTION') {
  logger.add(new transports.Console())
  logger.remove(errorTransport);
  logger.remove(infoTransport);
  logger.remove(combinedTransport)
}

export { logger }

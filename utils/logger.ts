import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const transport = new DailyRotateFile({
	filename: "logs/application-%DATE%.log",
	datePattern: "YYYY-MM-DD",
	zippedArchive: true,
	maxFiles: "3d",
	level: "debug",
});

const logger = winston.createLogger({
	level: "debug",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ timestamp, level, message }) => {
			return `${timestamp} [${level}]: ${message}`;
		})
	),
	transports: [
		transport,
		new winston.transports.Console({
			format: winston.format.simple(),
			level: "debug",
		}),
	],
});

export default logger;

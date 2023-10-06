import { LogLevel } from "./enums";

export class Logger {
  private level: LogLevel;
  private name: string;

  constructor(name: string) {
    this.name = name;
    if (Memory.logLevel === undefined) Memory.logLevel = "INFO";
    this.level = LogLevel[Memory.logLevel];
  }

  private format(level: string, message: string): string {
    return `[${this.name}] [${level}] ${message}`;
  }

  log(level: LogLevelStrings, message: string): void {
    let enum_level = LogLevel[level];
    if (enum_level < this.level) return;
    console.log(this.format(level, message));
  }

  debug(message: string): void {
    this.log("DEBUG", message);
  }
  info(message: string): void {
    this.log("INFO", message);
  }
  warn(message: string): void {
    this.log("WARN", message);
  }
  error(message: string): void {
    this.log("ERROR", message);
  }
  fatal(message: string): void {
    this.log("FATAL", message);
  }
}

export default Logger;

export function setLogLevel(level: LogLevelStrings): void {
  Memory.logLevel = level;
}

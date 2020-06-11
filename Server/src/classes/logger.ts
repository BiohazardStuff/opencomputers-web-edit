import LogLevel from '../constant/enums/log-level';

export default class Logger {
  private static _debugging: boolean = true;
  private static _logLevelLabels: {[key in LogLevel]: string} = {
    [LogLevel.INFO]: "Info",
    [LogLevel.WARNING]: "Warning",
    [LogLevel.ERROR]: "Error",
  };

  private static log(logLevel: LogLevel, message: string): void {
    if (!Logger._debugging) {
      return;
    }

    const logLevelLabel: string = Logger._logLevelLabels[logLevel];

    console.log(`${ logLevelLabel }: ${ message }`);
  }

  public static info(message: string): void {
    Logger.log(LogLevel.INFO, message);
  }
}

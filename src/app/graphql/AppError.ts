
class AppError extends Error {
  code: string;
  constructor(message:string, code: string) {
    super(message);
    this.code = code;
  }
  static get CODE () {
    return {
      E_VALIDATIONFAILED: 'E_VALIDATION_FAILED',
    };
  }
}

export default AppError;

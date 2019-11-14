
class AppError extends Error {
  code: string;
  constructor(message:string, code: string) {
    super(message);
    this.code = code;
  }
  static get CODE () {
    return {
      E_VALIDATION_FAILED: 'E_VALIDATION_FAILED',
      E_INVALID_INPUT: 'E_INVALID_INPUT',
    };
  }
}

export default AppError;

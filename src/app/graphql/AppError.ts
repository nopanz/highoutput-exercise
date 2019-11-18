
class AppError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }

  static get CODE() {
    return {
      E_VALIDATION_FAILED: 'E_VALIDATION_FAILED',
      E_INVALID_INPUT: 'E_INVALID_INPUT',
      E_ACCOUNT_NOT_FOUND: 'E_ACCOUNT_NOT_FOUND',
      E_ITEM_EXIST: 'E_ITEM_EXIST',
      E_ITEM_NOT_FOUND: 'E_ITEM_NOT_FOUND',
    };
  }
}

export default AppError;

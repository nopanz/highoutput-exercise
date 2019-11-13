import Ajv from 'ajv';
import AppError from '../graphql/AppError';
import { mergeDeepWith , concat } from 'ramda';

class Operation {
  validator: Ajv.Ajv;
  scenario: string;
  constructor() {
    this.validator = new Ajv({ allErrors: true });
    this.scenario = 'default';
  }

  get jsonSchema () {
    return {};
  }

  setSchema (schemas: any) {
    const defaultSchema = {
      properties:{
        scenario: {
          type: 'string',
        },
      },
      required: ['scenario'],
    };
    return mergeDeepWith(concat, defaultSchema, schemas[this.scenario]);
  }

  validate () {
    const valid = this.validator.validate(this.jsonSchema, this);
    if (!valid) {
      if (this.validator.errors !== null && this.validator.errors !== undefined) {
        if (this.validator.errors[0].message !== undefined) {
          throw new AppError(this.validator.errors[0].message, AppError.CODE.E_VALIDATIONFAILED);
        }

      }
    }
  }
}

export default Operation;

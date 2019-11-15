import Ajv from 'ajv';
import { mergeDeepWith, concat } from 'ramda';
import AppError from '../graphql/AppError';

interface JsonSchema {
  [key: string]: object;
}

class Operation {
  validator: Ajv.Ajv;

  scenario: string;

  constructor() {
    this.validator = new Ajv({ allErrors: true });
    this.scenario = 'default';
  }

  get jsonSchema() {
    return this.setSchema();
  }

  setSchema(schemas?: JsonSchema) {
    const defaultSchema = {
      properties: {
        scenario: {
          type: 'string',
        },
      },
      required: ['scenario'],
    };
    if (schemas !== undefined) {
      return mergeDeepWith(concat, defaultSchema, schemas[this.scenario]);
    }
    return defaultSchema;
  }

  validate() {
    const valid = this.validator.validate(this.jsonSchema, this);
    if (!valid) {
      if (this.validator.errors !== null && this.validator.errors !== undefined) {
        if (this.validator.errors[0].message !== undefined) {
          throw new AppError(this.validator.errors[0].message, AppError.CODE.E_VALIDATION_FAILED);
        }
      }
    }
  }
}

export default Operation;

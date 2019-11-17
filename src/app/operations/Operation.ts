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

  setSchema(common?: object, schemas?: JsonSchema) {
    let selectedSchema: object | undefined;

    const defaultSchema = {
      properties: {
        scenario: {
          type: 'string',
        },
      },
      required: ['scenario'],
    };
    if (schemas !== undefined) {
      selectedSchema = schemas[this.scenario];

      if (common !== undefined) {
        selectedSchema = mergeDeepWith(concat, common, selectedSchema);
      }

      return mergeDeepWith(concat, defaultSchema, selectedSchema);
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

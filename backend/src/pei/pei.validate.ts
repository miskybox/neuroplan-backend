import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from './pei.schema.json';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema as any);

export function assertValidPei(obj: any) {
  const ok = validate(obj);
  if (!ok) throw new Error('PEI inválido: ' + JSON.stringify(validate.errors, null, 2));
}

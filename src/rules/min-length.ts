import { createRule } from '../validation';

export const minLength = (length) =>
  createRule({
    condition: (str) => str.length >= length,
    message: `Must be at least ${length} characters`,
  });

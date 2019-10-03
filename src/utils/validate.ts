function validate(
  ...args: Array<{ valid: boolean; field: string; msg: string }>
): { valid: boolean; errors: Array<{ field: string; msg: string }> } {
  const errors = args
    .filter(a => !a.valid)
    .map(({ msg, field }) => {
      return { msg, field };
    });
  return {
    valid: errors.length === 0,
    errors
  };
}

function GqlError(errors: Array<{ field: string; msg: string }>) {
  const error: any = new Error();
  error.message = errors;
  return error;
}

export { validate, GqlError };

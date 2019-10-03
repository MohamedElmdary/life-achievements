import { Middleware } from '../middleware.interface';
import { UserCreateInput } from '@generated';
import { validate, GqlError } from '@utils';
import { isEmpty, isLength, isEmail } from 'validator';

const createUser: Middleware<UserCreateInput> = async (
  resolver,
  _,
  { data },
  { exists },
  info
) => {
  const {
    first_name,
    last_name,
    username,
    gender,
    phone,
    email,
    password
  } = data;
  const { valid, errors } = validate(
    {
      field: 'first_name',
      msg: 'First name min length 2 and max length 20.',
      valid: !isEmpty(first_name) && isLength(first_name, { min: 2, max: 20 })
    },
    {
      field: 'last_name',
      msg: 'Last name min length 2 and max length 20.',
      valid: !isEmpty(last_name) && isLength(last_name, { min: 2, max: 20 })
    },
    {
      field: 'username',
      msg: 'username min length 2 and max length 20.',
      valid: !isEmpty(last_name) && isLength(last_name, { min: 2, max: 20 })
    },
    {
      field: 'username',
      msg: 'Username must be unique.',
      valid: !(await exists.User({ username }))
    },
    {
      field: 'gender',
      msg: 'Gender could be Male or Female only.',
      valid: gender === 'MALE' || gender === 'FEMALE'
    },
    {
      field: 'phone',
      msg: 'Invalid Phone number.',
      valid:
        !isEmpty(phone) &&
        isLength(phone, { max: 11, min: 11 }) &&
        /^\d{11}$/.test(phone.trim())
    },
    {
      field: 'phone',
      msg: 'Phone must be unique.',
      valid: !(await exists.User({ phone }))
    },
    {
      field: 'email',
      msg: 'Invalid Email.',
      valid: isEmail(email)
    },
    {
      field: 'email',
      msg: 'Email must be unique.',
      valid: !(await exists.User({ email }))
    },
    {
      field: 'password',
      msg: 'password min length 6 chars.',
      valid: !isEmpty(password) && isLength(password, { min: 6 })
    }
  );
  if (valid) {
    return resolver();
  }
  throw GqlError(errors);
};

export default { createUser };

import { Middleware } from '../middleware.interface';
import { UserCreateInput, User } from '@generated';
import { validate, GqlError, userSelectorMethod } from '@utils';
import { isEmpty, isLength, isEmail } from 'validator';
import { compareSync } from 'bcryptjs';

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

const verifyRegister: Middleware<UserCreateInput> = async (
  resolver,
  _,
  { data },
  { req, exists },
  info
) => {
  const { username, register_code } = data;
  const args: any = userSelectorMethod(username);
  const { valid, errors } = validate({
    field: 'register_code',
    msg: 'Invalid Register Code or Username.',
    valid: await exists.User({
      ...args,
      register_code
    })
  });
  if (valid) {
    (<any>req).user = args;
    return resolver();
  }
  return GqlError(errors);
};

const loginUser: Middleware<UserCreateInput> = async (
  resolver,
  _,
  { data },
  { req, query },
  info
) => {
  const { username, password } = data;
  const args = userSelectorMethod(username);
  const user = await query.user(
    { where: args },
    '{ id register_code password }'
  );
  if (user && user.register_code) {
    return GqlError([{ field: 'message', msg: 'Please verify Your account!' }]);
  }
  const { valid, errors } = validate(
    {
      field: 'username',
      msg: 'Invalid Username.',
      valid: !!user
    },
    {
      field: 'password',
      msg: 'Invalid Password.',
      valid: compareSync(password, (user || { password: '' }).password)
    }
  );
  if (valid) {
    (<any>req).user = user;
    return resolver();
  }
  throw GqlError(errors);
};

export default { loginUser, createUser, verifyRegister };

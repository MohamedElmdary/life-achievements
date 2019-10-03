import { isEmail } from 'validator';

function userSelectorMethod(username: string) {
  if (isEmail(username)) {
    return { email: username };
  } else if (/^\d{11}$/.test(username)) {
    return { phone: username };
  }
  return { username };
}

export { userSelectorMethod };

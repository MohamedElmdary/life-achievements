import { Request } from 'express';
import { sign, verify, decode } from 'jsonwebtoken';
import { Exists, Mutation } from '@generated';
import { GqlError } from './validate';

interface TokenPayload {
    id: string;
}

function generateToken(id: string): string {
    const token = sign(
        { date: new Date(), id },
        process.env.JWT_TOKEN_SECRET as string,
        { expiresIn: process.env.JWT_TOKEN_TIME }
    );
    return token;
}

function isValidToken(token: any) {
    return verify(
        token,
        process.env.JWT_TOKEN_SECRET as string
    ) as TokenPayload;
}

async function validateAuth(
    req: Request,
    exists: Exists,
    mutation: Mutation
): Promise<string | never> {
    const authorization = req.header('Authorization') || '';
    const token = authorization.split('Bearer ')[1];
    try {
        const { id } = isValidToken(token);
        return id;
    } catch {
        const { id } = (decode(token) || { id: '' }) as TokenPayload;
        if (id && (await exists.User({ id, token }))) {
            const newToken = generateToken(id);
            await mutation.updateUser({
                data: { token: newToken },
                where: { id }
            });
            throw GqlError([{ field: 'NEW_TOKEN', msg: newToken }]);
        }
        throw GqlError([{ field: 'MESSAGE', msg: 'User not found.' }]);
    }
}

export { validateAuth, generateToken, isValidToken };

/* function generateToken(id: string): [string, string] {
  const token = sign(
    {
      date: new Date(),
      id
    },
    process.env.JWT_TOKEN_SECRET as string,
    {
      expiresIn: '4h'
    }
  );
  const refresh_token = sign(
    {
      date: new Date().getTime() + 5,
      id
    },
    process.env.JWT_REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: '10d'
    }
  );
  return [token, refresh_token];
} */

// async function validateAuth(
//   req: Request,
//   exists: Exists,
//   mutation: Mutation
// ): Promise<string | never> {
//   const Authorization = req.header('Authorization');
//   try {
//     const decoded = verify(
//       Authorization as string,
//       process.env.JWT_TOKEN_SECRET as string
//     ) as { id: string };
//     return decoded.id;
//   } catch {}

//   try {
//     const decoded_token = decode(Authorization as string) as { id: string };
//     if (!decoded_token) {
//       throw new Error('User Not Found');
//     }
//     const refresh_token = req.header('Refresh_token');
//     if (
//       await exists.User({
//         id: decoded_token.id,
//         refresh_token,
//         token: Authorization
//       })
//     ) {
//       const [newToken, new_refresh_toke] = generateToken(decoded_token.id);
//       await mutation.updateUser(
//         {
//           where: {
//             id: decoded_token.id
//           },
//           data: {
//             token: newToken,
//             refresh_token: new_refresh_toke
//           }
//         },
//         '{ id }'
//       );
//       return GqlError([{ field: 'message', msg: 'Invalid Token' }]);
//     } else {
//       throw new Error('User Not Found');
//     }
//   } catch (e) {
//     throw e;
//   }
// }

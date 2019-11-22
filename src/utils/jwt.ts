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

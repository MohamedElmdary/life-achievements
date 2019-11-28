import { Resolver } from '../resolver.interface';
import { User } from '@generated';

const searchUsers: Resolver<{ name: string }, User[]> = async (
    _,
    { data: { name } },
    { query, req },
    info
) => {
    const formatedName =
        name[0]?.toLocaleUpperCase() ?? '' + name.slice(1).toLocaleLowerCase();

    return await query.users(
        {
            where: {
                register_code: null,
                id_not: (<any>req).userId,
                OR: [
                    {
                        first_name_contains: name
                    },
                    {
                        first_name_contains: name.toLocaleLowerCase()
                    },
                    {
                        first_name_contains: formatedName
                    },
                    {
                        last_name_contains: name
                    },
                    {
                        last_name_contains: name.toLocaleLowerCase()
                    },
                    {
                        last_name_contains: formatedName
                    }
                ]
            }
        },
        info
    );
};

const getUser: Resolver<{ id: string }, User | null> = async (
    _,
    { data: { id } },
    { query, req },
    info
) => {
    return (
        await query.users(
            {
                where: {
                    id,
                    register_code: null
                }
            },
            info
        )
    )[0];
};

export default { searchUsers, getUser };

const userPublicFields = `
    id: ID!
    first_name: String!
    last_name: String!
    username: String!
    rate: Int!
    gender: Gender!
    picture: String!
    created_at: String!
`;

const CreateUserInput = `
    input CreateUserInput {
        first_name: String!
        last_name: String!
        username: String!
        gender: Gender!
        phone: String!
        email: String!
        password: String!
    }
`;

const PublicUserType = `
    type PublicUser {
        ${userPublicFields}
    }
`;

export default `
    enum Gender {
        MALE
        FEMALE
    }
    ${CreateUserInput}
    ${PublicUserType}
`;

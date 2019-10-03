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

const createUserInput = `
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

const loginUserInput = `
    input loginUserInput {
        username: String!
        password: String!
    }
`;

const verifyRegisterInput = `
    input verifyRegisterInput {
        username: String!
        register_code: String!
    }
`;

const publicUserType = `
    type PublicUser {
        ${userPublicFields}
    }
`;

// should be added
/*    achievements: [Achievement!]!
        comments: [Comment!]!
        replays: [Replay!]!
        achievement_reacts: [Achievement!]! 
        comment_reacts: [Comment!]! 
        replay_reacts: [Replay!]! */
const currentUserType = `
    type CurrentUserType {
        ${userPublicFields}
        phone: String!
        email: String!
        token: String
        refresh_token: String
        friends: [PublicUser!]!
        updated_at: String!
    }
`;

export default `
    enum Gender {
        MALE
        FEMALE
    }
    ${createUserInput}
    ${publicUserType}
    ${loginUserInput}
    ${currentUserType}
    ${verifyRegisterInput}
`;

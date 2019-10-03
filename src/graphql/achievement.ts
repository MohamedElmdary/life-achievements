const publicAchievementFields = `
    id: ID!
    title: String!
    description: String!
    days: [Boolean!]!
    type: Type!
    completed: Boolean!
    published: Boolean!
    picture: String!
    created_at: String!
`;

const CreateAchievementInput = `
    input CreateAchievementInput {
        title: String!
        description: String!
        days: Int!
        type: Type!
        published: Boolean!
    }
`;

const publicAchievementType = `
    type PublicAchievement {
        ${publicAchievementFields}
    }
`;

export default `
    enum Type {
        DO_IT
        GET_RID_OF
    }
    ${CreateAchievementInput}
    ${publicAchievementType}
`;

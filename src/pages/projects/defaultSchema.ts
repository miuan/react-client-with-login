export const DEFAULT_SCHEMA = `
# type model @protection {
#  all: user.filter
# }

type File @model {
    contentType: String!
    createdAt: DateTime!
    id: ID! @isUnique
    name: String!
    secret: String! @isUnique
    size: Int!
    updatedAt: DateTime!
    url: String! @isUnique
}

@create("public") 
type User @model {
    createdAt: DateTime!
    id: ID! @isUnique
    updatedAt: DateTime!
    email: String @isUnique
    password: String
    token: String
    refreshToken: String
    roles: [UserRole] @relation(name: "RoleOnUser")
    projects: [Project] @relation(name: "ProjectOnUser")
    verirfiedProjects: [Project] @relation(name: "ProjectOnVerifierUser")
}

type UserRole @model {
    id: ID! @isUnique
    role: String @isUnique
    users: [User] @relation(name: "RoleOnUser")
}

@all(filter:"userId=:userId")
@all(role:"project",filter:"name=project")
@create("user") 
@one("owner") @update("owner") @remove("owner")
type Project @model {
    id: ID! @isUnique
    name: String
    models: String
    verified: Boolean
    verifiedBy: User @relation(name: "ProjectOnVerifierUser")
    user: User! @relation(name: "ProjectOnUser")
}
`
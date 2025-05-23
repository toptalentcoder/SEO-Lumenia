import { createMongoAbility, MongoAbility, AbilityBuilder, MongoQuery, AbilityTuple } from "@casl/ability";

export type Actions = "manage" | "create" | "read" | "update" | "delete";
export type Subjects = "all" | "User" | "Post" | "Comment" | "Role" | "Permission";
export type AppAbility = MongoAbility<[Actions, Subjects]>;
export type UserRole = "admin" | "editor" | "viewer";

export const defineAbilitiesFor = (role : string) : AppAbility => {

    const { can, cannot, rules } = new AbilityBuilder<MongoAbility<[Actions, Subjects]>>(createMongoAbility);

    switch (role) {
        case "admin":
            can("manage", "all");
            break;
        case "editor":
            can("read", "User");
            can('update', 'User');
            break;
        case "viewer":
            can("read", "User");
            cannot("delete", "User");
            break;
        default:
            can("read", "User");
            cannot("update", "User");
            cannot("delete", "User");
            break;
    }

    return createMongoAbility(rules);
}
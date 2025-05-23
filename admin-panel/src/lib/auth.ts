import { id } from "zod/v4/locales"

//Simulate logged in user
export const getCurrentUser = async () => {

    return {
        id : 123,
        email : "healer@gmail.com",
        role : "admin",
    }
}
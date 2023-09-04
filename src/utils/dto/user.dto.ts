import { UserDocument } from "../../types/user.interface"


export const normalizeUser = (user: UserDocument) => {
    return {
        email: user.email,
        userName: user.name,
        userId: user.id,
        role: user.role,
        phone:user.phone,
        userImg: user.userImg || "",
        address:user.address
    }
}
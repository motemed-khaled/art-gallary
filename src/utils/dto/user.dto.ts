
import mongoose from "mongoose"
import { UserDocument } from "../../types/user.interface"


export const normalizeUser = (user: UserDocument) => {
    return {
        email: user.email,
        name: user.name,
        _id: user.id,
        role: user.role,
        phone:user.phone,
        userImg: user.userImg || "",
        address: user.address,
        wishList: user.wishList
    }
}
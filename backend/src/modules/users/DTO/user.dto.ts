type Role = "user" | "trainer" | "admin"

export interface IUserDto{
    _id: string;
    username: string;
    email: string;
    role: Role;
    isBlocked: boolean;
    isVerified: boolean;
    isPremium: boolean;
    profilePicture?: string;
    gender?: string;
    phone?: string;
    city?: string;
    pincode?:string;
    createdAt: Date;
    updatedAt: Date;
}
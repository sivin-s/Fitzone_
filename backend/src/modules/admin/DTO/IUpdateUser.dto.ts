export interface IUpdateUserDto{
    username?: string;
    email?: string;
    role?: "admin" | "user" | "trainer";
    isBlocked?: boolean;
    phone?: string;
    city?: string;
    pincode?: string;
    gender?: "male" | "female" | "other"
}
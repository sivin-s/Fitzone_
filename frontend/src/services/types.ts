export interface ApiResponse<T = undefined> {
   success: boolean;
   message: string;
   data: T;
}

type Role = "user" | "trainer" | "admin";

export interface User{
    _id: string;
    username: string;
    email: string;
    role: Role;
    isBlocked:  boolean;
    isVerified: boolean;
    isPremium: boolean;
    createdAt: string;
    updateAt: string;
    profilePicture?: string;
    phone?: string;
    gender?: string;
    city?: string;
    pincode?: string;
}

export interface Session {  // it is about cookies handle separately for admin and user (jwt)
   userId: string;
   role: Role;
}

export interface LoginUser{
    id:string;
    username: string;
    email: string;
    role: Role;
}

export interface UsersResponse{  // admin frontend
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}


export interface UserListParams{ // user management filter - (admin)
    search?: string;
    page?: number;
    limit?: number;
    membership?: 'all' | "premium" | "trainers" | "basic";
    status?: 'all' | "active" | "blocked";
    sortBy?: 'createdAt' | 'username' | 'email';
    sortOrder?: 'asc'  | 'desc';
}




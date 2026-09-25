export interface GoogleIdentity{
    email: string;
    sub: string; // PK unique
    name?: string;
}

export interface IGoogleAuthProvider{
    verify(idToken: string): Promise<GoogleIdentity>
}


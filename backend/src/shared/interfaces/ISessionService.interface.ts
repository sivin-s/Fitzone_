import type { AuthPayload } from "../../types/AuthRequest.types.ts";


export type SessionKind = "user" | "admin";

export interface ISessionService {
  authenticate(
      token: string | undefined,
      kind?: SessionKind
  ):Promise<AuthPayload>
  refresh(
    token: string | undefined,
    kind?: SessionKind
  ):Promise<{
          accessToken: string
          role: AuthPayload["role"]    
    }>
}
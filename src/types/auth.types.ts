export type UserDTO = {
  id: number;
  email: string;
  orgId: number;
  role: string;
  tokenVersion: number;
};

export type CreateUserInputDTO = {
  email: string;
  passwordHash: string;
};
export type UserEntity = {
  id: number;
  email: string;
  passwordHash: string;
  memberships?: OrgMemberEntity[];
  tokenVersion: number;
};
export type LoginDTO = {
  email: string;
  password: string;
};

export type JwtPayload = {
  userId: number;
  orgId: number;
  role: string;
};

export type OrgMemberEntity = {
  id: number;
  userId: number;
  orgId: number;
  role: Role;
  createdAt: Date;
};

export type RefreshTokenPayload = {
  userId: number;
  tokenVersion: number;
  iat?: number;
  exp?: number;
};

export enum Role {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export const PERMISSIONS = {
  [Role.OWNER]: [
    "project:create",
    "project:delete",
    "project:update",
    "project:read",
    "billing:view",
  ],
  [Role.ADMIN]: ["project:create", "project:update", "project:read"],
  [Role.MEMBER]: ["project:read"],
};
/*
Opcija B: "Contextual" struktura (Ako user ima više firmi)
Ovo koristiš ako želiš da Frontend zna da je User "onaj isti čovek", a da je firma samo trenutni šešir koji nosi.
export type UserDTO = {
  id: number;
  email: string;
  activeOrg: {
    id: number;
    name: string; // Lepo je vratiti i ime firme
    role: string;
  };
};
*/

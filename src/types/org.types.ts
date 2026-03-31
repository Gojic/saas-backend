import { Transaction } from "sequelize";
export type OrgEntity = {
  id: number;
  name: string;
  plan: string;
  seatsAllowed: number;
  createdAt: Date;
};
export type OrgRole = "OWNER" | "ADMIN" | "MEMBER";
export type CreateOrgDTO = {
  name: string;
  seatsAllowed: number;
};
export interface CreateOrgParams extends CreateOrgDTO {
  userId: number;
  transaction?: Transaction;
}
export type OrgDTO = {
  id: number;
  name: string;
  plan: string;
};
export type OrgMemberUserDTO = {
  id: number;
  email: string;
};

export type OrgMemberDTO = {
  userId: number;
  role: string;
  orgId: number;
  user?: OrgMemberUserDTO;
};
export type UpdateOrgDTO = {
  name?: string;
  plan?: string;
  seatsAllowed?: number;
};

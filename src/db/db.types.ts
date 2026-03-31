import type { Sequelize } from "sequelize";
import type {
  UserModel,
  OrgModel,
  OrgMemberModel,
  ProjectModel,
  DocumentsModel,
  InviteModel,
} from "./types";

export type DB = {
  sequelize: Sequelize;
  Sequelize: any;
  User: typeof UserModel;
  Org: typeof OrgModel;
  OrgMember: typeof OrgMemberModel;
  Project: typeof ProjectModel;
  Documents: typeof DocumentsModel;
  Invite: typeof InviteModel;
};

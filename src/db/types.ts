import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { Model } from "sequelize";

export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare passwordHash: string;

  declare membership?: OrgMemberModel[];
}

export class OrgModel extends Model<
  InferAttributes<OrgModel>,
  InferCreationAttributes<OrgModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare plan: "free" | "pro";
  declare seatsAllowed: number;
}

export class OrgMemberModel extends Model<
  InferAttributes<OrgMemberModel>,
  InferCreationAttributes<OrgMemberModel>
> {
  declare id: CreationOptional<number>;
  declare orgId: number;
  declare userId: number;
  declare role: "OWNER" | "ADMIN" | "MEMBER";

  declare user?: UserModel;
  declare org?: OrgModel;
}
export class ProjectModel extends Model<
  InferAttributes<ProjectModel>,
  InferCreationAttributes<ProjectModel>
> {
  declare id: CreationOptional<number>;
  declare orgId: number;
  declare name: string;
}

export class DocumentsModel extends Model<
  InferAttributes<DocumentsModel>,
  InferCreationAttributes<DocumentsModel>
> {
  declare id: CreationOptional<number>;
  declare orgId: number;
  declare projectId: number;
  declare title: string;
  declare content: string;
}

export class InviteModel extends Model<
  InferAttributes<InviteModel>,
  InferCreationAttributes<InviteModel>
> {
  declare id: CreationOptional<number>;
  declare orgId: number;
  declare email: string;
  declare role: string;
  declare token: string;
  declare expiresAt: Date;
  declare acceptedAt: CreationOptional<Date | null>;
}

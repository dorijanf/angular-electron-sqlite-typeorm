import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
} from "sequelize-typescript";

@Table
export class Species extends Model {
  @PrimaryKey
  @Column
  speciesId: number;

  @Column
  name!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}

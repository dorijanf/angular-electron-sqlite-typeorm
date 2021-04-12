import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from "sequelize-typescript";
import { Species } from "./Species";

@Table
export class Animal extends Model {
  @PrimaryKey
  @Column
  animalId: number;

  @Column
  name!: string;

  @Column
  breed!: string;

  @Column
  age!: number;

  @Column
  description?: string;

  @ForeignKey(() => Species)
  @Column
  speciesId!: number;

  @BelongsTo(() => Species, "speciesId")
  species: Species;

  @Column
  @CreatedAt
  createdAt!: Date;

  @Column
  @UpdatedAt
  updatedAt!: Date;
}

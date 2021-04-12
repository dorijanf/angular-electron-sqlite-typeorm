import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
} from "sequelize-typescript";
import { Animal } from "./Animal";

@Table
export class Location extends Model {
  @PrimaryKey
  @Column
  locationId: number;

  @Column
  coordX!: number;

  @Column
  coordY!: number;

  @ForeignKey(() => Animal)
  @Column
  animalId!: number;

  @BelongsTo(() => Animal, "animalId")
  animal!: Animal;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}

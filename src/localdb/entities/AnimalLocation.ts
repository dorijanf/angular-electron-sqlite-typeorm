import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";
import "reflect-metadata";

@Entity()
export class AnimalLocation {
  @PrimaryColumn()
  id!: number;

  @Column({
    type: "float"
  })
  coordX!: number;

  @Column({
    type: "float"
  })
  coordY!: number;

  @Column({
    type: "int"
  })
  animalId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import "reflect-metadata";

@Entity()
export class Species {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 128
  })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

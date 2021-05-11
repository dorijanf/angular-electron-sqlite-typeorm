import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AnimalQueue {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "integer",
  })
  isUpdating: number;

  @Column({
    length: 128,
  })
  name!: string;

  @Column({
    length: 64,
  })
  breed!: string;

  @Column({
    type: "tinyint",
  })
  age!: number;

  @Column({
    length: 512,
  })
  description?: string;

  @Column({
    nullable: true
  })
  speciesId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({
    type: "float",
  })
  coordX!: number;

  @Column({
    type: "float",
  })
  coordY!: number;

  @Column({
    type: "integer",
    default: 0
  })
  isSynced: number;
}

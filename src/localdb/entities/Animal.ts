import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Animal {
  @PrimaryColumn()
  id!: number;

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
}

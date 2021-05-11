import * as typeorm from "typeorm";

@typeorm.Entity()
export class DatabaseSync {
  @typeorm.PrimaryGeneratedColumn()
  id: number;

  @typeorm.CreateDateColumn()
  createdAt: Date;
}

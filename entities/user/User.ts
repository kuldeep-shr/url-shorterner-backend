import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { DateTimeEntity } from "../base/timestamp";

@Entity("user_auth", { orderBy: { id: "ASC" } })
export class User extends DateTimeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column()
  @Unique(["email"])
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  lastLogin!: string;

  @Column({ default: true })
  isActive!: boolean;
}

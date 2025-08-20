import { Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany } from "typeorm";
import { DateTimeEntity } from "../base/timestamp";
import { Prompt } from "../prompt/Prompt";

@Entity("users", { orderBy: { id: "ASC" } })
@Unique(["email"])
export class User extends DateTimeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 150 })
  email!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 200 })
  password!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  lastLogin!: Date;

  @Column({ default: true })
  isActive!: boolean;

  // RELATION → one user can create many prompts
  @OneToMany(() => Prompt, (prompt) => prompt.created_by)
  prompts!: Prompt[];
}

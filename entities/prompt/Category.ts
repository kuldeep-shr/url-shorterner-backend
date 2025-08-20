import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm";
import { DateTimeEntity } from "../base/timestamp";
import { Prompt } from "./Prompt";

@Entity("categories")
@Index("idx_name", ["name"])
export class Category extends DateTimeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @OneToMany(() => Prompt, (prompt) => prompt.category)
  prompts!: Prompt[];
}

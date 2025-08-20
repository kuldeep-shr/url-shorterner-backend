import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from "typeorm";
import { DateTimeEntity } from "../base/timestamp";
import { Category } from "./Category";
import { User } from "../user/User";

@Entity("prompts")
@Index("idx_title", ["title"])
@Index("idx_category", ["category"])
export class Prompt extends DateTimeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "text" })
  body!: string;

  @ManyToOne(() => Category, (category) => category.prompts, { eager: true })
  category!: Category;

  @ManyToOne(() => User, (user) => user.prompts, { eager: true })
  created_by!: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  last_updated!: Date;
}

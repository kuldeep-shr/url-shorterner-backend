import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { DateTimeEntity } from "../base/timestamp";

@Entity("kgs_pool")
export class KGSKey extends DateTimeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  short_code!: string;

  @Column({ default: false })
  is_used!: boolean;
}

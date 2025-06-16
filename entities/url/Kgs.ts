import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

import { DateTimeEntity } from "../base/timestamp";

@Entity("kgs_pool")
@Index("idx_is_used", ["is_used"])
export class KGSKey extends DateTimeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  short_code!: string;

  @Column({ default: false })
  is_used!: boolean;
}

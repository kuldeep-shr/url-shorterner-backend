import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "../user/User";
import { DateTimeEntity } from "../base/timestamp";

import { UrlAccessLog } from "../url/UrlAccessLog";

@Entity("short_urls")
export class ShortUrl extends DateTimeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user: any) => user.shortUrls, { onDelete: "CASCADE" })
  user!: User;

  @Column()
  original_url!: string;

  @Column({ unique: true, nullable: true })
  short_code!: string;

  @Column({ nullable: true })
  custom_alias!: string;

  @Column({ nullable: true, type: "timestamp" })
  expires_at!: Date;

  @OneToMany(() => UrlAccessLog, (log) => log.shortUrl)
  accessLogs!: UrlAccessLog[];
}

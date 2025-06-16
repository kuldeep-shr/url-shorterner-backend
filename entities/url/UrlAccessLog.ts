import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { ShortUrl } from "./ShortUrl";
import { DateTimeEntity } from "../base/timestamp";

@Entity("url_access_logs")
export class UrlAccessLog extends DateTimeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => ShortUrl, (shortUrl) => shortUrl.accessLogs)
  shortUrl!: ShortUrl;

  @Column()
  shortUrlId!: number;

  @CreateDateColumn()
  accessed_at!: Date;

  @Column({ nullable: true })
  ip_address!: string;

  @Column({ nullable: true })
  referrer!: string;

  @Column({ nullable: true })
  country!: string;
}

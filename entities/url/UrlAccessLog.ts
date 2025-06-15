import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { ShortUrl } from "./ShortUrl";

@Entity("url_access_logs")
export class UrlAccessLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ShortUrl, (shortUrl) => shortUrl.accessLogs)
  shortUrl!: ShortUrl;

  @CreateDateColumn()
  accessed_at!: Date;

  @Column({ nullable: true })
  ip_address!: string;

  @Column({ nullable: true })
  referrer!: string;

  @Column({ nullable: true })
  country!: string;
}

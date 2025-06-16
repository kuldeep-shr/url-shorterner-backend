import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { ShortUrl } from "./ShortUrl";
import { DateTimeEntity } from "../base/timestamp";

//indexing for better performance
@Entity("url_access_logs")
@Index("idx_short_url_id", ["shortUrl"])
@Index("idx_referrer", ["referrer"])
@Index("idx_country", ["country"])
@Index("idx_accessed_at", ["accessed_at"])
export class UrlAccessLog extends DateTimeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => ShortUrl, (shortUrl) => shortUrl.accessLogs, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "short_url_id" })
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

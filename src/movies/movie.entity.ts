import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  episode_number: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  director: string;

  @Column({ nullable: true })
  release_date: string;

  @Column({ nullable: true, type: 'text' })
  description: string;
}

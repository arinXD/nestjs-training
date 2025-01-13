import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    description: "User's first name",
    example: 'John',
    minLength: 3,
    maxLength: 96,
  })
  @Column({ length: 96 })
  firstName: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
    minLength: 3,
    maxLength: 96,
  })
  @Column({ length: 96 })
  lastName: string;

  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
    format: 'email',
  })
  @Index({ unique: true })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Hashed password',
    example: '$2b$10$...',
    writeOnly: true,
  })
  @Column({ select: false })
  password: string;

  @ApiProperty({
    description: 'Timestamp of when the user was created',
    example: '2024-01-13T12:00:00Z',
  })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of when the user was last updated',
    example: '2024-01-13T12:00:00Z',
  })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}

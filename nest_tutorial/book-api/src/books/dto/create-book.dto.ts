import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  publicationYear: number;
}

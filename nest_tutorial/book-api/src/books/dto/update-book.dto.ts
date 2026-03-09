import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
// based on this data make dto DTOs make sure the data sent by the client is correct before reaching your service or database.
//If the client sends incorrect data, validation will fail.
// {
//   "title": "Clean Code",
//   "author": "Robert C. Martin",
//   "publicationYear": 2008
// }

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  @IsOptional()
  publicationYear?: number;
}

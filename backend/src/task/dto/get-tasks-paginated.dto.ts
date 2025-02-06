import { IsIn, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class GetTasksPaginatedDto {
  @IsInt()
  @Min(1) 
  @IsNotEmpty()
  page: number;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsNotEmpty()
  page_size: number;

  @IsString() 
  @IsNotEmpty()
  @IsIn(['title', 'due_date', 'completed', 'created_at', 'updated_at'])
  sort_by: 'title' | 'due_date' | 'completed' | 'created_at' | 'updated_at';

  @IsString() 
  @IsNotEmpty()
  @IsIn(['asc', 'desc'])
  sort_type: 'asc' | 'desc';
}
import {   IsNotEmpty, IsString, Matches  } from "class-validator";

export class GetUsersDto {
  @IsString()
  @IsNotEmpty()
  type: string; 
}
 
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  old_password: string;
  
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*\d).{8,}$/, {
    message: 'Password must be at least 8 characters long and contain at least one number',
  })
  new_password: string;
}
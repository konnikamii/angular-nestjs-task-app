import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, ValidateIf } from "class-validator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message: 'Username must be at least 5 characters long',
  })
  username: string;
  
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*\d).{8,}$/, {
    message: 'Password must be at least 8 characters long and contain at least one number',
  })
  password: string;
}

export class LoginDto {
  @ValidateIf((o: LoginDto) => !o.email)
  @IsString()
  @IsNotEmpty()
  username?: string;

  @ValidateIf((o: LoginDto) => !o.username)
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
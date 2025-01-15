import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SendMailDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  templateId: string;

  @IsObject()
  @IsNotEmpty()
  variables: Record<string, string>;
}

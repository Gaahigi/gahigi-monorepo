import {  ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCourseContentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;
}
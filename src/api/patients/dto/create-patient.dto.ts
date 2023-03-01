import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nome do paciente',
    example: 'Wellysson Gomes Godinho',
  })
  public name: string;

  @IsMobilePhone('pt-BR')
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Telefone do paciente',
    example: '5531999999999',
  })
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email do paciente',
    example: 'wellysson.gomes@gmail.com',
  })
  public email: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Data Nascimento',
    example: '1980-03-20',
  })
  birthday: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Gênero do paciente',
    example: 'Masculino',
  })
  gender: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Altura do paciente',
    example: '1.78m',
  })
  height: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Peso do paciente',
    example: '82kg',
  })
  weight: string;
}

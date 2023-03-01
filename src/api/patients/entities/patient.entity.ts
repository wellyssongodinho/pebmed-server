import { ApiProperty } from '@nestjs/swagger';
import { Patient } from '@prisma/client';

export class PatientEntity implements Patient {
  @ApiProperty({
    description: 'Identificador único do paciente',
    example: '1',
  })
  id: number;

  @ApiProperty({
    description: 'Nome do paciente',
    example: 'Wellysson Gomes Godinho',
  })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Telefone do paciente',
    example: '5531999999999',
  })
  phone: string;

  @ApiProperty({
    description: 'Email do paciente',
    example: 'wellysson.gomes@gmail.com',
  })
  email: string;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'Data Nascimento',
    example: '1980-03-20',
  })
  birthday: string;

  @ApiProperty({
    description: 'Gênero do paciente',
    example: 'masculino',
  })
  gender: string;

  @ApiProperty({
    description: 'Altura do paciente',
    example: '1.78m',
  })
  height: string;

  @ApiProperty({
    description: 'Peso do paciente',
    example: '82kg',
  })
  weight: string;
}

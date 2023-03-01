import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAppointmentDto {
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Data e hora do agendamento',
    example: '2023-03-01T08:30:00Z',
  })
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Identificador do paciente',
    example: '1',
  })
  patientId: number;
}

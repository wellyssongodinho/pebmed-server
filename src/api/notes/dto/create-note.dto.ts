import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Observação médica',
    example: 'Paciente apresentou enjoo e náusea',
  })
  observation: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Identificador único do agendamento',
    example: '1',
  })
  appointmentId: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Appointment } from '@prisma/client';

export class AppointmentEntity implements Appointment {
  @ApiProperty({
    description: 'Identificador único da agenda',
    example: '1',
  })
  id: number;

  @ApiProperty({
    description: 'Data e hora do agendamento',
    example: '2023-03-01T08:30:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Identificador do paciente',
    example: '1',
  })
  patientId: number;

  @ApiProperty({
    description: 'Data e hora da criação do registro de agendamento',
    example: '2023-02-28T10:30:00Z',
  })
  createdAt: Date;
  @ApiProperty({
    description: 'Data e hora da alteração do registro de agendamento',
    example: '2023-02-28T14:30:00Z',
  })
  updatedAt: Date;
}

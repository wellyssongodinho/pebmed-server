import { ApiProperty } from '@nestjs/swagger';
import { Note } from '@prisma/client';

export class NoteEntity implements Note {
  @ApiProperty({
    description: 'Identificador único da nota',
    example: '1',
  })
  id: number;

  @ApiProperty({
    description: 'Observação médica',
    example: 'Paciente apresentou enjoo e náusea',
  })
  observation: string;

  @ApiProperty({
    description: 'Identificador único do agendamento',
    example: '1',
  })
  appointmentId: number;

  @ApiProperty({
    description: 'Data e hora da criação do registro da nota',
    example: '2023-02-28T10:30:00Z',
  })
  createdAt: Date;
  @ApiProperty({
    description: 'Data e hora da alteração do registro da nota',
    example: '2023-02-28T14:30:00Z',
  })
  updatedAt: Date;
}

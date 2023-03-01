import { Module } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { NotesModule } from './notes/notes.module';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [PatientsModule, AppointmentsModule, NotesModule],
})
export class ApiModule {}

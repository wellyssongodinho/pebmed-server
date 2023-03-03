import { CreateAppointmentDto } from '../dto/create-appointment.dto';

export class CreateAppointmentDtoMock extends CreateAppointmentDto {
  date = new Date(Date.now());
  patientId = 1;
  createdAt = new Date(Date.now());
  updatedAt = new Date(Date.now());
  constructor(date?, patientId?, createdAt?, updatedAt?) {
    super();
    this.date = date ? date : this.date;
    this.patientId = patientId ? patientId : this.patientId;
    this.createdAt = createdAt ? createdAt : this.createdAt;
    this.updatedAt = updatedAt ? updatedAt : this.updatedAt;
  }
}

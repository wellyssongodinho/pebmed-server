import { CreateAppointmentDto } from '../dto/create-appointment.dto';

export class CreateAppointmentMock extends CreateAppointmentDto {
  constructor(date?, patientId?) {
    super();
    this.date = date;
    this.patientId = patientId;
  }
}

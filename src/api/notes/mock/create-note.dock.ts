import { CreateNoteDto } from '../dto/create-note.dto';

export class CreateNoteMock extends CreateNoteDto {
  constructor(observation?, appointmentId?) {
    super();
    this.observation = observation;
    this.appointmentId = appointmentId;
  }
}

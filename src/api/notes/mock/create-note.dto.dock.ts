import { CreateNoteDto } from '../dto/create-note.dto';

export class CreateNoteDtoMock extends CreateNoteDto {
  observation = 'Patient apresentou nausea';
  appointmentId = 1;
  createdAt = new Date(Date.now());
  updatedAt = new Date(Date.now());
  constructor(observation?, appointmentId?, createdAt?, updatedAt?) {
    super();
    this.observation = observation ? observation : this.observation;
    this.appointmentId = appointmentId ? appointmentId : this.appointmentId;
    this.createdAt = createdAt ? createdAt : this.createdAt;
    this.updatedAt = updatedAt ? updatedAt : this.updatedAt;
  }
}

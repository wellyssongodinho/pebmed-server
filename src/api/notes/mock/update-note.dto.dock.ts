import { UpdateNoteDto } from '../dto/update-note.dto';

export class UpdateNoteDtoMock extends UpdateNoteDto {
  observation = 'Patient apresentou nausea e enjoo';
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

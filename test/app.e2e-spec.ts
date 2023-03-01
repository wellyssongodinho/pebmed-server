import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateAppointmentMock } from './../src/api/appointments/mock/create-appointment.dock';
import { CreateNoteMock } from './../src/api/notes/mock/create-note.dock';
import { CreatePatientMock } from './../src/api/patients/mock/create-patient.dock';
import { AppModule } from './../src/app.module';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let patientId, appointmentId, noteId: number;
  let appointmentMock: CreateAppointmentMock;
  let noteMock: CreateNoteMock;
  const patientMock = new CreatePatientMock();
  const emailUpdated = 'm' + patientMock.email;
  const dateAppointment = new Date(Date.now() + getRandomInt(30));
  const dateAppointmentUpdated = new Date(Date.now() + getRandomInt(30));
  const observation = 'Paciente apresentou enjoo';
  const observationUpdated = 'Paciente apresentou enjoo e nausea';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Bem Vindo ao Desafio PebMed!');
  });

  //start patients tests
  describe('GET /patients', () => {
    it('should return an error', async () => {
      await request(app.getHttpServer())
        .get('/patients/0')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe('Paciente Id 0 não cadastrado');
        });
    });
  });

  describe('POST /patients', () => {
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/patients')
        .send(patientMock)
        .expect(201);

      patientId = res.body.id;
    });

    it('should create a new patient', () => {
      return request(app.getHttpServer())
        .get(`/patients/${patientId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(patientMock.name);
        });
    });
    afterAll(async () => {
      appointmentMock = new CreateAppointmentMock(dateAppointment, patientId);
    });
  });

  describe('PATCH /patients', () => {
    beforeAll(async () => {
      await request(app.getHttpServer())
        .patch(`/patients/${patientId}`)
        .send({ email: emailUpdated })
        .expect(200);
    });

    it('should update a patient', () => {
      return request(app.getHttpServer())
        .get(`/patients/${patientId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(emailUpdated);
        });
    });
  });

  //start appointments tests
  describe('GET /appointments', () => {
    it('should return an error', async () => {
      await request(app.getHttpServer())
        .get('/appointments/0')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe('Agendamento Id 0 não cadastrado');
        });
    });
  });

  describe('POST /appointments', () => {
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/appointments')
        .send(appointmentMock)
        .expect(201);

      appointmentId = res.body.id;
    });

    it('should create a new appointment', () => {
      return request(app.getHttpServer())
        .get(`/appointments/${appointmentId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.date).toBe(appointmentMock.date.toISOString());
        });
    });
    afterAll(async () => {
      noteMock = new CreateNoteMock(observation, appointmentId);
    });
  });

  describe('PATCH /appointments', () => {
    beforeAll(async () => {
      await request(app.getHttpServer())
        .patch(`/appointments/${appointmentId}`)
        .send({ date: dateAppointmentUpdated })
        .expect(200);
    });

    it('should update a appointment', () => {
      return request(app.getHttpServer())
        .get(`/appointments/${appointmentId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.date).toBe(dateAppointmentUpdated.toISOString());
        });
    });
  });

  //start notes tests
  describe('GET /notes', () => {
    it('should return an error', async () => {
      await request(app.getHttpServer())
        .get('/notes/0')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe('Anotação Id 0 não cadastrada');
        });
    });
  });

  describe('POST /notes', () => {
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/notes')
        .send(noteMock)
        .expect(201);

      noteId = res.body.id;
    });

    it('should create a new note', () => {
      return request(app.getHttpServer())
        .get(`/notes/${noteId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.observation).toBe(observation);
        });
    });
  });

  describe('PATCH /notes', () => {
    beforeAll(async () => {
      await request(app.getHttpServer())
        .patch(`/notes/${noteId}`)
        .send({ observation: observationUpdated })
        .expect(200);
    });

    it('should update a note', () => {
      return request(app.getHttpServer())
        .get(`/notes/${noteId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.observation).toBe(observationUpdated);
        });
    });
  });

  //start delete cascate tests
  describe('DELETE /notes', () => {
    it('should delete a note', async () => {
      await request(app.getHttpServer()).delete(`/notes/${noteId}`).expect(200);
    });

    it('should return an error', async () => {
      await request(app.getHttpServer())
        .get(`/notes/${noteId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe(`Anotação Id ${noteId} não cadastrada`);
        });
    });
  });

  describe('DELETE /appointments', () => {
    it('should delete a appointment', async () => {
      await request(app.getHttpServer())
        .delete(`/appointments/${appointmentId}`)
        .expect(200);
    });

    it('should return an error', async () => {
      await request(app.getHttpServer())
        .get(`/appointments/${appointmentId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe(
            `Agendamento Id ${appointmentId} não cadastrado`,
          );
        });
    });
  });

  describe('DELETE /patients', () => {
    it('should delete a patient', async () => {
      await request(app.getHttpServer())
        .delete(`/patients/${patientId}`)
        .expect(200);
    });

    it('should return an error', async () => {
      await request(app.getHttpServer())
        .get(`/patients/${patientId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe(
            `Paciente Id ${patientId} não cadastrado`,
          );
        });
    });
  });

  // describe('NotesModule', () => {
  //   it('/ (GET NOTE) ', async () => {
  //     const response = await request(app.getHttpServer()).get('/notes/0');
  //     expect(response.body.status).toEqual(404);
  //     expect(response.body.message).toEqual(`Anotação Id 0 não cadastrada`);
  //   });
  //   it('/ (POST NOTE) ', async () => {
  //     note = await request(app.getHttpServer())
  //       .post('/note')
  //       .send({
  //         observation: observationNote,
  //         appointmentId: appointment.body.id,
  //       })
  //       .expect(201);
  //     return note;
  //   });
  //   it('/ (PATCH NOTE) ', async () => {
  //     const response = await request(app.getHttpServer())
  //       .get(`/notes/${note.body.id}`)
  //       .expect(200);
  //     expect(response.body.appointmentId).toEqual(note.appointmentId);
  //     await request(app.getHttpServer())
  //       .patch(`/notes/${note.body.id}`)
  //       .send({
  //         observation: observationNoteUpdated,
  //       })
  //       .expect(200);
  //   });
  // });

  // describe('CleanModules', () => {
  //   it('/ (DELETE NOTES) ', async () => {
  //     const response = await request(app.getHttpServer())
  //       .get(`/notes/${note.body.id}`)
  //       .expect(200);
  //     expect(response.body.observation).toEqual(observationNoteUpdated);
  //     await request(app.getHttpServer())
  //       .delete(`/notes/${note.body.id}`)
  //       .expect(200);
  //   });

  //   it('/ (DELETE APPOINTMENTS) ', async () => {
  //     const response = await request(app.getHttpServer())
  //       .get(`/appointments/${appointment.body.id}`)
  //       .expect(200);
  //     expect(response.body.date).toEqual(dateAppointmentUpdated);
  //     await request(app.getHttpServer())
  //       .delete(`/appointments/${appointment.body.id}`)
  //       .expect(200);
  //   });

  //   it('/ (DELETE PATIENTS) ', async () => {
  //     const response = await request(app.getHttpServer())
  //       .get(`/patients/${patient.body.id}`)
  //       .expect(200);
  //     expect(response.body.email).toEqual(emailUpdated);
  //     await request(app.getHttpServer())
  //       .delete(`/patients/${patient.body.id}`)
  //       .expect(200);
  //   });
  // });
});

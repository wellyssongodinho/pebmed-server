import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../config/prisma';
import { PatientEntity } from '../patients/entities/patient.entity';
import { CreatePatientDtoMock } from '../patients/mock/create-patient.dto.mock';
import { AppointmentsService } from './appointments.service';
import { AppointmentEntity } from './entities/appointment.entity';
import { CreateAppointmentDtoMock } from './mock/create-appointment.dto.dock';
import { UpdateAppointmentDtoMock } from './mock/update-appointment.dto.dock';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let repository: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsService, PrismaService],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    repository = module.get<PrismaService>(PrismaService);
  });

  const createPatientDtoMock = new CreatePatientDtoMock();
  const patient: PatientEntity = { ...createPatientDtoMock, id: 1 };
  const createAppointmentDtoMock = new CreateAppointmentDtoMock();
  const updateAppointmentDtoMock = new UpdateAppointmentDtoMock({
    ...createAppointmentDtoMock,
    date: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  });
  const appointment: AppointmentEntity = { ...createAppointmentDtoMock, id: 1 };
  const appointmentUpdated: AppointmentEntity = {
    ...updateAppointmentDtoMock,
    id: 1,
  };

  describe('create', () => {
    it('should create a new appointment', async () => {
      jest.spyOn(repository.patient, 'findUnique').mockResolvedValue(patient);
      jest.spyOn(repository.appointment, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(repository.appointment, 'create')
        .mockResolvedValue(appointment);

      expect(await service.create(createAppointmentDtoMock)).toBe(appointment);
      expect(repository.patient.findUnique).toHaveBeenCalledTimes(1);
      expect(repository.appointment.findFirst).toHaveBeenCalledTimes(1);
      expect(repository.appointment.create).toHaveBeenCalledTimes(1);
    });

    it('should throw a ConflictException if appointment is already registered', async () => {
      jest.spyOn(repository.patient, 'findUnique').mockResolvedValue(patient);
      jest
        .spyOn(repository.appointment, 'findFirst')
        .mockResolvedValue(appointment);
      jest
        .spyOn(repository.appointment, 'create')
        .mockRejectedValue(new ConflictException());

      await expect(service.create(createAppointmentDtoMock)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.patient.findUnique).toHaveBeenCalledTimes(1);
      expect(repository.appointment.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of appointments', async () => {
      jest
        .spyOn(repository.appointment, 'findMany')
        .mockResolvedValue([appointment]);

      expect(await service.findAll()).toBeInstanceOf(Array);

      expect(repository.appointment.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an appointment by id', async () => {
      jest
        .spyOn(repository.appointment, 'findUnique')
        .mockResolvedValue(appointment);

      expect(await service.findOne(appointment.id)).toBe(appointment);

      expect(repository.appointment.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update an existing appointment', async () => {
      jest
        .spyOn(repository.appointment, 'update')
        .mockResolvedValue(appointmentUpdated);
      expect(
        await service.update(appointment.id, updateAppointmentDtoMock),
      ).toBe(appointmentUpdated);
      expect(repository.appointment.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete an appointment by id', async () => {
      jest
        .spyOn(repository.appointment, 'delete')
        .mockResolvedValue(appointment);
      expect(await service.remove(appointment.id)).toBe(appointment);
      expect(repository.appointment.delete).toHaveBeenCalledTimes(1);
    });
    it('should delete a NotFoundException with status 404 if the appointment 2 is not found', async () => {
      jest
        .spyOn(repository.appointment, 'delete')
        .mockRejectedValue(new NotFoundException());
      await expect(service.remove(2)).rejects.toThrow(NotFoundException);
    });
  });
});

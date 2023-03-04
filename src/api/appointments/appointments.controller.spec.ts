import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../config/prisma';
import { PatientEntity } from '../patients/entities/patient.entity';
import { CreatePatientDtoMock } from '../patients/mock/create-patient.dto.mock';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentEntity } from './entities/appointment.entity';
import { CreateAppointmentDtoMock } from './mock/create-appointment.dto.dock';
import { UpdateAppointmentDtoMock } from './mock/update-appointment.dto.dock';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [AppointmentsService, PrismaService],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get<PrismaService>(PrismaService);
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
      jest.spyOn(service.patient, 'findUnique').mockResolvedValue(patient);
      jest.spyOn(service.appointment, 'findFirst').mockResolvedValue(null);
      jest.spyOn(service.appointment, 'create').mockResolvedValue(appointment);

      expect(await controller.create(createAppointmentDtoMock)).toBe(
        appointment,
      );
      expect(service.patient.findUnique).toHaveBeenCalledTimes(1);
      expect(service.appointment.findFirst).toHaveBeenCalledTimes(1);
      expect(service.appointment.create).toHaveBeenCalledTimes(1);
    });

    it('should throw a ConflictException if name is not provided', async () => {
      jest.spyOn(service.patient, 'findUnique').mockResolvedValue(patient);
      jest
        .spyOn(service.appointment, 'findFirst')
        .mockResolvedValue(appointment);
      jest
        .spyOn(service.appointment, 'create')
        .mockRejectedValue(new ConflictException());

      await expect(controller.create(createAppointmentDtoMock)).rejects.toThrow(
        ConflictException,
      );
      expect(service.patient.findUnique).toHaveBeenCalledTimes(1);
      expect(service.appointment.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of appointments', async () => {
      jest
        .spyOn(service.appointment, 'findMany')
        .mockResolvedValue([appointment]);

      expect(await controller.findAll()).toBeInstanceOf(Array);

      expect(service.appointment.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an appointment by id', async () => {
      jest
        .spyOn(service.appointment, 'findUnique')
        .mockResolvedValue(appointment);

      expect(await controller.findOne(appointment.id.toString())).toBe(
        appointment,
      );

      expect(service.appointment.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update an existing appointment', async () => {
      jest
        .spyOn(service.appointment, 'findUnique')
        .mockResolvedValue(appointment);
      jest
        .spyOn(service.appointment, 'update')
        .mockResolvedValue(appointmentUpdated);
      expect(
        await controller.update(
          appointmentUpdated.id.toString(),
          updateAppointmentDtoMock,
        ),
      ).toBe(appointmentUpdated);
      expect(service.appointment.findUnique).toHaveBeenCalledTimes(1);
      expect(service.appointment.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete an appointment by id', async () => {
      jest
        .spyOn(service.appointment, 'findUnique')
        .mockResolvedValue(appointment);
      jest.spyOn(service.appointment, 'delete').mockResolvedValue(appointment);
      expect(await controller.remove(appointment.id.toString())).toBe(
        appointment,
      );
      expect(service.appointment.findUnique).toHaveBeenCalledTimes(1);
      expect(service.appointment.delete).toHaveBeenCalledTimes(1);
    });
    it('should delete an appointment by id', async () => {
      jest
        .spyOn(service.appointment, 'delete')
        .mockRejectedValue(new NotFoundException());
      await expect(controller.remove('2')).rejects.toThrow(NotFoundException);
    });
  });
});

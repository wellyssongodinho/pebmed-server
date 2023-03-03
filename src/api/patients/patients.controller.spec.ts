import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../config/prisma';
import { PatientEntity } from './entities/patient.entity';
import { CreatePatientDtoMock } from './mock/create-patient.dto.mock';
import { UpdatePatientDtoMock } from './mock/update-patient.dto.mock';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

describe('PatientsController', () => {
  let controller: PatientsController;
  let service: PatientsService;

  const createPatientDtoMock = new CreatePatientDtoMock();
  const updatePatientDtoMock = new UpdatePatientDtoMock();
  const patient: PatientEntity = { ...createPatientDtoMock, id: 1 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [PrismaService, PatientsService],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);
  });

  describe('create', () => {
    it('should create a new patients', async () => {
      jest.spyOn(service, 'findOneEmail').mockResolvedValue(null);
      jest.spyOn(service, 'create').mockResolvedValue(patient);

      expect(await controller.create(createPatientDtoMock)).toBe(patient);
    });

    it('should throw a ConflictException if name is not provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(patient);
      jest.spyOn(service, 'create').mockRejectedValue(new ConflictException());

      await expect(controller.create(createPatientDtoMock)).rejects.toThrow(
        ConflictException,
      );
    });
    it('should throw a BadRequestException if name is not provided', async () => {
      const createPatientDtoMockFail: CreatePatientDtoMock = {
        ...createPatientDtoMock,
        name: '',
      };
      await expect(controller.create(createPatientDtoMockFail)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of patients', async () => {
      const patients = [patient];
      jest.spyOn(service, 'findAll').mockResolvedValue(patients);

      expect(await controller.findAll()).toBe(patients);
    });
  });

  describe('findOne', () => {
    it('should return an patient', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(patient);
      expect(await controller.findOne('1')).toBe(patient);
    });
    it('should throw an NotFoundException with status 404 if the patient 1 is not found', async () => {
      await expect(controller.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an existing patients', async () => {
      const patientUpdated: PatientEntity = { ...updatePatientDtoMock, id: 1 };
      jest.spyOn(service, 'update').mockResolvedValue(patientUpdated);

      expect(await controller.update('1', updatePatientDtoMock)).toBe(
        patientUpdated,
      );
    });

    it('should throw a BadRequestException if name is not provided', async () => {
      const updatePatientDtoMockError: UpdatePatientDtoMock = {
        ...updatePatientDtoMock,
        name: '',
      };

      await expect(
        controller.update('1', updatePatientDtoMockError),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove an existing patient', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(patient);
      jest.spyOn(service, 'remove').mockResolvedValue(patient);

      expect(await controller.remove('1')).toBe(patient);
    });

    it('should throw a NotFoundException with status 404 if the patient 1 is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});

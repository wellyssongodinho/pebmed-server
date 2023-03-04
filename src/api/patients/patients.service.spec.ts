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
import { PatientsService } from './patients.service';

describe('PatientsService', () => {
  let service: PatientsService;
  let repository: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientsService, PrismaService],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    repository = module.get<PrismaService>(PrismaService);
  });

  const createPatientDtoMock = new CreatePatientDtoMock();
  const updatePatientDtoMock = new UpdatePatientDtoMock();
  const patient: PatientEntity = { ...createPatientDtoMock, id: 1 };
  const patientUpdated: PatientEntity = { ...updatePatientDtoMock, id: 1 };

  describe('create', () => {
    it('should create a new patients', async () => {
      jest.spyOn(repository.patient, 'findUnique').mockResolvedValue(null);
      jest.spyOn(repository.patient, 'create').mockResolvedValue(patient);
      expect(await service.create(createPatientDtoMock)).toBe(patient);
      expect(repository.patient.findUnique).toHaveBeenCalledTimes(1);
      expect(repository.patient.create).toHaveBeenCalledTimes(1);
    });

    it('should throw a ConflictException if patinet is already registered', async () => {
      jest.spyOn(repository.patient, 'findUnique').mockResolvedValue(patient);
      jest
        .spyOn(repository.patient, 'create')
        .mockRejectedValue(new ConflictException());

      await expect(service.create(createPatientDtoMock)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.patient.findUnique).toHaveBeenCalledTimes(1);
    });
    it('should throw a BadRequestException if name is not provided', async () => {
      const createPatientDtoMockFail: CreatePatientDtoMock = {
        ...createPatientDtoMock,
        name: '',
      };
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException());
      await expect(service.create(createPatientDtoMockFail)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of patients', async () => {
      jest.spyOn(repository.patient, 'findMany').mockResolvedValue([patient]);

      expect(await service.findAll()).toBeInstanceOf(Array);

      expect(repository.patient.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an patient by id', async () => {
      jest.spyOn(repository.patient, 'findUnique').mockResolvedValue(patient);

      expect(await service.findOne(patient.id)).toBe(patient);

      expect(repository.patient.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update an existing patient', async () => {
      jest.spyOn(repository.patient, 'findUnique').mockResolvedValue(patient);
      jest
        .spyOn(repository.patient, 'update')
        .mockResolvedValue(patientUpdated);
      expect(await service.update(patient.id, updatePatientDtoMock)).toBe(
        patientUpdated,
      );
      expect(repository.patient.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete an patient by id', async () => {
      jest.spyOn(repository.patient, 'findUnique').mockResolvedValue(patient);
      jest.spyOn(repository.patient, 'delete').mockResolvedValue(patient);
      expect(await service.remove(patient.id)).toBe(patient);
      expect(repository.patient.delete).toHaveBeenCalledTimes(1);
    });
    it('should throw a NotFoundException with status 404 if the patient 2 is not found', async () => {
      jest
        .spyOn(repository.patient, 'delete')
        .mockRejectedValue(new NotFoundException());
      await expect(service.remove(2)).rejects.toThrow(NotFoundException);
    });
  });
});

import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../config/prisma';
import { AppointmentEntity } from '../appointments/entities/appointment.entity';
import { CreateAppointmentDtoMock } from '../appointments/mock/create-appointment.dto.dock';
import { NoteEntity } from './entities/note.entity';
import { CreateNoteDtoMock } from './mock/create-note.dto.dock';
import { UpdateNoteDtoMock } from './mock/update-note.dto.dock';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let service: NotesService;
  let repository: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesService, PrismaService],
    }).compile();

    service = module.get<NotesService>(NotesService);
    repository = module.get<PrismaService>(PrismaService);
  });

  const createAppointmentDtoMock = new CreateAppointmentDtoMock();
  const appointment: AppointmentEntity = { ...createAppointmentDtoMock, id: 1 };
  const createNoteDtoMock = new CreateNoteDtoMock();
  const note: NoteEntity = { ...createNoteDtoMock, id: 1 };
  const updateNoteDtoMock = new UpdateNoteDtoMock();
  const noteUpdated: NoteEntity = { ...updateNoteDtoMock, id: 1 };

  describe('create', () => {
    it('should create a new appointment', async () => {
      jest
        .spyOn(repository.appointment, 'findUnique')
        .mockResolvedValue(appointment);
      jest.spyOn(repository.note, 'findUnique').mockResolvedValue(null);
      jest.spyOn(repository.note, 'create').mockResolvedValue(note);

      expect(await service.create(createNoteDtoMock)).toBe(note);
      expect(repository.appointment.findUnique).toHaveBeenCalledTimes(1);
      expect(repository.note.findUnique).toHaveBeenCalledTimes(1);
      expect(repository.note.create).toHaveBeenCalledTimes(1);
    });

    it('should throw a ConflictException if note is registered', async () => {
      jest
        .spyOn(repository.appointment, 'findUnique')
        .mockResolvedValue(appointment);
      jest.spyOn(repository.note, 'findUnique').mockResolvedValue(note);
      jest
        .spyOn(repository.appointment, 'create')
        .mockRejectedValue(new ConflictException());

      await expect(service.create(createNoteDtoMock)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.appointment.findUnique).toHaveBeenCalledTimes(1);
      expect(repository.note.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of appointments', async () => {
      jest.spyOn(repository.note, 'findMany').mockResolvedValue([note]);

      expect(await service.findAll()).toBeInstanceOf(Array);

      expect(repository.note.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an patient by id', async () => {
      jest.spyOn(repository.note, 'findUnique').mockResolvedValue(note);

      expect(await service.findOne(note.id)).toBe(note);

      expect(repository.note.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update an existing patient', async () => {
      jest.spyOn(repository.note, 'findUnique').mockResolvedValue(note);
      jest.spyOn(repository.note, 'update').mockResolvedValue(noteUpdated);
      expect(await service.update(note.id, updateNoteDtoMock)).toBe(
        noteUpdated,
      );
      expect(repository.note.findUnique).toHaveBeenCalledTimes(1);
      expect(repository.note.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete an note by id', async () => {
      jest.spyOn(repository.note, 'findUnique').mockResolvedValue(note);
      jest.spyOn(repository.note, 'delete').mockResolvedValue(note);
      expect(await service.remove(note.id)).toBe(note);
      expect(repository.note.findUnique).toHaveBeenCalledTimes(1);
      expect(repository.note.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException with status 404 if the note 2 is not found', async () => {
      jest
        .spyOn(repository.note, 'delete')
        .mockRejectedValue(new NotFoundException());
      await expect(service.remove(2)).rejects.toThrow(NotFoundException);
    });
  });
});

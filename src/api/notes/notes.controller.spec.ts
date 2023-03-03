import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../config/prisma';
import { AppointmentEntity } from '../appointments/entities/appointment.entity';
import { CreateAppointmentDtoMock } from '../appointments/mock/create-appointment.dto.dock';
import { NoteEntity } from './entities/note.entity';
import { CreateNoteDtoMock } from './mock/create-note.dto.dock';
import { UpdateNoteDtoMock } from './mock/update-note.dto.dock';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

describe('NotesController', () => {
  let controller: NotesController;
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [NotesService, PrismaService],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<PrismaService>(PrismaService);
  });

  const createAppointmentDtoMock = new CreateAppointmentDtoMock();
  const appointment: AppointmentEntity = { ...createAppointmentDtoMock, id: 1 };
  const createNoteDtoMock = new CreateNoteDtoMock();
  const note: NoteEntity = { ...createNoteDtoMock, id: 1 };
  const updateNoteDtoMock = new UpdateNoteDtoMock();
  const noteUpdated: NoteEntity = { ...updateNoteDtoMock, id: 1 };

  describe('create', () => {
    it('should create a new note', async () => {
      jest
        .spyOn(service.appointment, 'findUnique')
        .mockResolvedValue(appointment);
      jest.spyOn(service.note, 'findUnique').mockResolvedValue(null);
      jest.spyOn(service.note, 'create').mockResolvedValue(note);

      expect(await controller.create(createNoteDtoMock)).toBe(note);
      expect(service.appointment.findUnique).toHaveBeenCalledTimes(1);
      expect(service.note.findUnique).toHaveBeenCalledTimes(1);
      expect(service.note.create).toHaveBeenCalledTimes(1);
    });

    it('should throw a ConflictException if note already exists', async () => {
      jest
        .spyOn(service.appointment, 'findUnique')
        .mockResolvedValue(appointment);
      jest.spyOn(service.note, 'findUnique').mockResolvedValue(note);
      jest
        .spyOn(service.note, 'create')
        .mockRejectedValue(new ConflictException());

      await expect(controller.create(createNoteDtoMock)).rejects.toThrow(
        ConflictException,
      );
      expect(service.appointment.findUnique).toHaveBeenCalledTimes(1);
      expect(service.note.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of notes', async () => {
      jest.spyOn(service.note, 'findMany').mockResolvedValue([note]);

      expect(await controller.findAll()).toBeInstanceOf(Array);

      expect(service.note.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an note by id', async () => {
      jest.spyOn(service.note, 'findUnique').mockResolvedValue(note);

      expect(await controller.findOne(note.id.toString())).toBe(note);

      expect(service.note.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update an existing note', async () => {
      jest.spyOn(service.note, 'update').mockResolvedValue(noteUpdated);
      expect(
        await controller.update(note.id.toString(), updateNoteDtoMock),
      ).toBe(noteUpdated);
      expect(service.note.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete an note by id', async () => {
      jest.spyOn(service.note, 'delete').mockResolvedValue(note);
      expect(await controller.remove(note.id.toString())).toBe(note);
      expect(service.note.delete).toHaveBeenCalledTimes(1);
    });
    it('should delete an note by id', async () => {
      jest
        .spyOn(service.note, 'delete')
        .mockRejectedValue(new NotFoundException());
      await expect(controller.remove('2')).rejects.toThrow(NotFoundException);
    });
  });
});

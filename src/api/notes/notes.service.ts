import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(createNoteDto: CreateNoteDto) {
    //'This action adds a new note';
    await this.findOneAppointment(createNoteDto.appointmentId);

    const note = await this.findOneNote(createNoteDto.appointmentId);
    if (note instanceof Error)
      return await this.prisma.note.create({ data: createNoteDto });
    else
      throw new ConflictException(
        `Anotação do agendamento ${createNoteDto.appointmentId} já cadastrada`,
      );
  }

  async findAll() {
    //`This action returns all notes`;
    return await this.prisma.note.findMany();
  }

  async findOne(id: number) {
    //`This action returns a #${id} note`;
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note || note === undefined)
      throw new NotFoundException(`Anotação Id ${id} não cadastrada`);
    else return note;
  }

  async findOneNote(appointmentId: number) {
    //`This action returns a #${id} note`;
    const note = await this.prisma.note.findUnique({
      where: { appointmentId },
    });
    if (!note || note === undefined)
      return new NotFoundException(
        `Anotação do agendamento ${appointmentId} não cadastrada`,
      );
    else return note;
  }

  async findOneAppointment(appointmentId: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment || appointment === undefined)
      throw new NotFoundException(
        `Agendamento Id ${appointmentId} não cadastrado`,
      );
    else return appointment;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    //`This action updates a #${id} note`;
    // await this.findOneAppointment(updateNoteDto.appointmentId);

    const note = await this.findOne(id);
    if (note instanceof Error) return note;
    else
      return await this.prisma.note.update({
        where: { id },
        data: updateNoteDto,
      });
  }

  async remove(id: number) {
    //`This action removes a #${id} note`;
    const note = await this.findOne(id);
    if (note instanceof Error) return note;
    else return await this.prisma.note.delete({ where: { id } });
  }
}

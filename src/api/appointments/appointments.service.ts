import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    'This action adds a new appointment';
    await this.findOnePatient(createAppointmentDto.patientId);

    const appointment = await this.findOneDate(
      createAppointmentDto.date,
      createAppointmentDto.patientId,
    );
    if (appointment instanceof Error)
      return await this.prisma.appointment.create({
        data: createAppointmentDto,
      });
    else
      throw new ConflictException(
        `Agendamento Data ${createAppointmentDto.date} já cadastrado`,
      );
  }

  async findAll() {
    //`This action returns all appointments`;
    return await this.prisma.appointment.findMany();
  }

  async findOne(id: number) {
    //`This action returns a #${id} appointment`;
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!appointment || appointment === undefined)
      throw new NotFoundException(`Agendamento Id ${id} não cadastrado`);
    else return appointment;
  }

  async findOneDate(date, patientId) {
    //`This action returns a #${date} appointment`;
    const appointment = await this.prisma.appointment.findFirst({
      where: { date, patientId },
    });
    if (!appointment || appointment === undefined)
      return new NotFoundException(`Agendamento Data ${date} não cadastrado`);
    else return appointment;
  }

  async findOnePatient(patientId: number) {
    //`This action returns a #${id} patient`;
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
    console.log('passou aqui', JSON.stringify(patient));
    if (!patient || patient === undefined)
      throw new NotFoundException(`Paciente Id ${patientId} não cadastrado`);
    else return patient;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    //`This action updates a #${id} appointment`;
    // await this.findOnePatient(updateAppointmentDto.patientId);

    const appointment = await this.findOne(id);
    if (appointment instanceof Error) return appointment;
    else
      return await this.prisma.appointment.update({
        where: { id },
        data: updateAppointmentDto,
      });
  }

  async remove(id: number) {
    //`This action removes a #${id} appointment`;
    const appointment = await this.findOne(id);
    if (appointment instanceof Error) return appointment;
    else return await this.prisma.appointment.delete({ where: { id } });
  }
}

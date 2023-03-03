import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientEntity } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto) {
    //'This action adds a new film';

    const { name } = createPatientDto;
    if (name === undefined || name === '')
      throw new BadRequestException('Nome deve ser informado');

    const patient = await this.findOneEmail(createPatientDto.email);
    if (patient instanceof Error)
      return await this.prisma.patient.create({ data: createPatientDto });
    else
      throw new ConflictException(
        `Paciente Email ${createPatientDto.email} já cadastrado`,
      );
  }

  async findAll() {
    //`This action returns all patient`;
    return await this.prisma.patient.findMany();
  }

  async findOne(id: number) {
    //`This action returns a #${id} pacient`;
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient || patient === undefined)
      throw new NotFoundException(`Paciente Id ${id} não cadastrado`);
    else return patient;
  }

  async findOneEmail(email: string): Promise<PatientEntity | Error | null> {
    //`This action returns a #${email} pacient`;
    const patient = await this.prisma.patient.findUnique({ where: { email } });
    if (!patient || patient === undefined) {
      return new NotFoundException(`Paciente Email ${email} não cadastrado`);
    }
    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    //`This action updates a #${id} patient`;
    const { name } = updatePatientDto;
    if (name === undefined || name === '')
      throw new BadRequestException('Nome deve ser informado');

    const patient = await this.findOne(id);
    if (patient instanceof Error) return patient;
    else
      return await this.prisma.patient.update({
        where: { id },
        data: updatePatientDto,
      });
  }

  async remove(id: number) {
    //`This action removes a #${id} patient`;
    const patient = await this.findOne(id);
    if (patient instanceof Error) return patient;
    else return await this.prisma.patient.delete({ where: { id } });
  }
}

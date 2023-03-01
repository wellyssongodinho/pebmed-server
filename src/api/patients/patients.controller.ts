import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientEntity } from './entities/patient.entity';
import { PatientsService } from './patients.service';

@Controller('patients')
@ApiTags('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiCreatedResponse({ type: PatientEntity })
  @ApiResponse({ status: 409, description: 'Paciente já cadastrado' })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @ApiOkResponse({ type: PatientEntity, isArray: true })
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: PatientEntity })
  @ApiResponse({ status: 404, description: 'Paciente não cadastrado' })
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({
    status: 200,
    description: 'Paciente atualizado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Paciente não cadastrado' })
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  @ApiOkResponse({ status: 200, description: 'Paciente excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Paciente não cadastrado' })
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
}

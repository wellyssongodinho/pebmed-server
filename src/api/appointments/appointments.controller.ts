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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentEntity } from './entities/appointment.entity';

@Controller('appointments')
@ApiTags('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiCreatedResponse({ type: AppointmentEntity })
  @ApiResponse({ status: 404, description: 'Paciente não cadastrado' })
  @ApiResponse({ status: 409, description: 'Agendamento já cadastrado' })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @ApiOkResponse({ type: AppointmentEntity, isArray: true })
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: AppointmentEntity })
  @ApiResponse({ status: 404, description: 'Agendamento não cadastrado' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({
    status: 200,
    description: 'Agendamento atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Agendamento/Paciente não cadastrado',
  })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    status: 200,
    description: 'Agendamento excluído com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Agendamento não cadastrado' })
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}

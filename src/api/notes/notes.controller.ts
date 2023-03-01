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
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteEntity } from './entities/note.entity';
import { NotesService } from './notes.service';

@Controller('notes')
@ApiTags('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiCreatedResponse({ type: NoteEntity })
  @ApiResponse({ status: 404, description: 'Agendamento não cadastrado' })
  @ApiResponse({
    status: 409,
    description: 'Anotação do agendamento já cadastrada',
  })
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  @ApiOkResponse({ type: NoteEntity, isArray: true })
  findAll() {
    return this.notesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: NoteEntity })
  @ApiResponse({ status: 404, description: 'Anotação não cadastrada' })
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({
    status: 200,
    description: 'Anotação atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Anotação/Agendamento não cadastrada',
  })
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    status: 200,
    description: 'Anotação excluída com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Anotação não cadastrada' })
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}

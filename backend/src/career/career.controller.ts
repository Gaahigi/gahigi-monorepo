import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { CareerService } from './career.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PreferencesDTO } from './career.dto';

@Controller('career')
@ApiTags('carreer')
@ApiBearerAuth()
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Post('generate')
  async generateCareerPath(@Req() req) {
    return this.careerService.generateCareerPath(req.user?.id);
  }

  @Post('add-preferneces')
  async addPreferences(@Body() { questions }: PreferencesDTO, @Req() req) {
    return this.careerService.savePreferences({
      questions,
      userId: req.user?.id,
    });
  }
}

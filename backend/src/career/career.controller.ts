import { Controller, Get, Post, Body } from '@nestjs/common';
import { CareerService } from './career.service';

@Controller('career')
export class CareerController {
    constructor(private readonly careerService: CareerService) {}

    // This endpoint now expects an array of questions and answers
    @Post('generate')
    async generateCareerPath(@Body() {questionsAnswers}: { questionsAnswers: string[] }) {
        return this.careerService.generateCareerPath(questionsAnswers);
    }
}

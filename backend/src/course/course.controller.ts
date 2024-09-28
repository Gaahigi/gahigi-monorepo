import { Controller, Post, Body, Get, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiTags } from '@nestjs/swagger';
import { ChatCourseDto, CreateCourseContentDto } from './dto/generateCourse.dto';
import { MediaService } from './media.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '@/shared/decorators';

@Controller('course')
@ApiTags("course")
export class CourseController {
    constructor(private readonly courseService: CourseService, private mediaService: MediaService) {}

    @Post('content')
    async createCourseContent(@Body() {title}: CreateCourseContentDto) {
        return this.courseService.generateCourseContent(title);
    }
    @Post('chat')
    async chatCourse(@Body() {courseTitle, message}: ChatCourseDto) {
        return this.courseService.generateAIResponse({courseTitle, message});
    }
    @Post('onboarding')
    async onboarding(@Body() course: object[]) {
        return this.courseService.generateCareerRecommendations(course);
    }
    @Public()
    @Get('interview/question')
    async getInterviewQuestion(@Query() difficulty: string) {
        return this.courseService.generateInterviewQuestion(difficulty??'medium');
    }
    @Post('interview/feedback')
    @UseInterceptors(FileInterceptor('file'))
    async provideFeedback(@Body() body: any, @UploadedFile() file: Express.Multer.File   ) {
        try {
            const { questionId, mode } = body;
            let answer, audioAnalysis, videoAnalysis;

            if (mode === 'text') {
                answer = body.answer;
            } else if (mode === 'voice' || mode === 'video') {
                if (!file) {
                    throw new Error('No audio file uploaded');
                }
                answer = await this.mediaService.transcribeAudio(file.buffer);
                audioAnalysis = await this.mediaService.analyzeAudio(file.buffer);
                if (mode === 'video') {
                    videoAnalysis = await this.mediaService.analyzeVideo(file.buffer);
                }
            }

            const feedback = await this.courseService.generateInterviewFeedback(questionId, answer, audioAnalysis, videoAnalysis);
            
            if (!feedback || typeof feedback.confidence !== 'number') {
                throw new Error('Invalid feedback received from AI');
            }

            // Note: Difficulty adjustment logic removed as it seems to be out of scope for this controller

            return { feedback };
        } catch (error) {
            console.error('Error generating interview feedback:', error);
            throw new Error('Internal server error: ' + error.message);
        }
    }
}

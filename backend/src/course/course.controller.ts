import { Controller, Post, Body } from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiTags } from '@nestjs/swagger';
import { ChatCourseDto, CreateCourseContentDto } from './dto/generateCourse.dto';


@Controller('course')
@ApiTags("course")
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Post('content')
    async createCourseContent(@Body() {title}: CreateCourseContentDto) {
        return this.courseService.generateCourseContent(title);
    }
    @Post('chat')
    async chatCourse(@Body() {courseTitle, message}: ChatCourseDto) {
        return this.courseService.generateAIResponse({courseTitle, message});
    }
    @Post('onboarding')
    async onboarding(@Body() course:object[]) {
        return this.courseService.generateCareerRecommendations(course);
    }
}

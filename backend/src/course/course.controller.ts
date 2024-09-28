import { Controller, Post, Body } from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCourseContentDto } from './dto/generateCourse.dto';


@Controller('course')
@ApiTags("course")
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Post('content')
    async createCourseContent(@Body() {title}: CreateCourseContentDto) {
        return this.courseService.generateCourseContent(title);
    }
}

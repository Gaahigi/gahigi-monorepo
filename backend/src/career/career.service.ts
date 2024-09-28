import { Injectable } from '@nestjs/common';
import { GroqService } from '@/shared/services/groq.service';


@Injectable()
export class CareerService {
    constructor(private readonly groqService: GroqService) {}

    // Sample list of career-related questions
    getCareerQuestions() {
        return [
            'What are your strengths?:Hard working',
            'What kind of work environment do you prefer?:remote',
            "What are your long-term career goals?:have startup",
            "Which subjects or tasks do you enjoy the most?:Math and computer scient",
           "How do you handle challenges and pressure:face them",
        ];
    }

    // Method to generate a career path based on answers
    async generateCareerPath(questionsAndAnswers:string[]): Promise<any> {

        const prompt = `Based on the following questions, and answers generate a suitable career path: ${questionsAndAnswers.join(', ')}`;

        // Using GroqService to send the prompt to Groq API
        return this.groqService.sendPrompts({
            messages: [
                { role: 'system', content: 'You are json server and Career Advisor.  return 10 object in json only in format [{"title":"", "description":"",}], otherwise return empty array' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 2048,
        });
    }
}

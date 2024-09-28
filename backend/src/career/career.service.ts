import { BadRequestException, Injectable } from '@nestjs/common';
import { GroqService } from '@/shared/services/groq.service';
import { response } from 'express';


@Injectable()
export class CareerService {
    constructor(private readonly groqService: GroqService) {}

    async generateCareerPath(questionsAndAnswers:string[]): Promise<any> {

        const prompt = `Based on the following questions, and answers generate a suitable career path: ${questionsAndAnswers.join(', ')}`;

            try{
                const result=await this.groqService.sendPrompts({
                    messages: [
                        { role: 'system', content: 'You are json server and Career Advisor.  return 10 object in json only in format [{"title":"", "description":"",}], otherwise return empty array' },
                        { role: 'user', content: prompt },
                    ],
                    temperature: 0.7,
                    max_tokens: 2048,
                });
            
                const response=await JSON.parse(result?.choices?.[0]?.message?.content??"[]")
                console.log(response)
                return response;
            }catch(error){
                throw new BadRequestException('Failed to generate career path');
            }
    }
}

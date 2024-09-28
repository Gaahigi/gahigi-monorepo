import { GroqService } from '@/shared/services/groq.service';
import { PrismaService } from '@/shared/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseService {
    constructor(
        private readonly groqService: GroqService,
        private prismaService: PrismaService,
      ) {}

    async generateCourseContent(courseTitle: string) {
        try {
          const prompt = `Generate a detailed course outline for "${courseTitle}". Include 5 main steps, each with a label and description. Also, provide an introduction to the course and a conclusion.`;
      
          const response = await this.groqService.sendPrompts({
            model: 'mixtral-8x7b-32768',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 1000
          });
      
          console.log('Raw API response:', JSON.stringify(response.data, null, 2));
      
          if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
            const content = response.data.choices[0].message.content;
            console.log('API response content:', content);
      
            // Process the content into steps
            const steps = this. processContentIntoSteps(content);
            console.log('Processed steps:', JSON.stringify(steps, null, 2));
            return steps;
          } else {
            console.error('Unexpected API response structure:', response.data);
            return [];
          }
        } catch (error) {
          console.error('Error in generateCourseContent:', error);
          console.error('Error stack:', error.stack);
          console.error('Full response:', JSON.stringify(error.response, null, 2));
          throw error;
        }

    }
     processContentIntoSteps(content) {
        // Split the content into lines
        const lines = content.split('\n').filter(line => line.trim() !== '');
        
        const steps = [];
        let currentStep = null;
      
        for (const line of lines) {
          if (line.startsWith('Step ') || line.startsWith('Introduction')) {
            if (currentStep) {
              steps.push(currentStep);
            }
            currentStep = { label: line.trim(), description: '' };
          } else if (currentStep) {
            currentStep.description += line.trim() + ' ';
          }
        }
      
        if (currentStep) {
          steps.push(currentStep);
        }
      
        return steps;
      }}
      async function generateInterviewFeedback(questionId, answer, difficulty, audioAnalysis, videoAnalysis) {
        let prompt = `Analyze the following interview answer for a ${difficulty} difficulty question:
        "${answer}"
        `;
      
        if (audioAnalysis) {
          prompt += `Audio analysis: ${JSON.stringify(audioAnalysis)}
          `;
        }
      
        if (videoAnalysis) {
          prompt += `Video analysis: ${JSON.stringify(videoAnalysis)}
          `;
        }
      
        prompt += `Provide feedback, including:
        1. Overall assessment
        2. Confidence score (0-1)
        3. 2-3 suggestions for improvement
        4. Comments on tone of voice and body language (if applicable)
        Return the response as a JSON object with 'content', 'confidence', and 'suggestions' properties.`;
      
        try {
          const response = await this.groqService.sendPrompts.post('', {
            model: 'mixtral-8x7b-32768',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 300
          });
      
          const content = response.data.choices[0].message.content;
          console.log('AI response:', content);
          return JSON.parse(content);
        } catch (error) {
          console.error('Error calling Groq API:', error.response?.data || error.message);
          throw new Error('Failed to generate interview feedback');
        }
      }
      


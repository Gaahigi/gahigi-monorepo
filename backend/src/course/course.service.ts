import { GroqService } from '@/shared/services/groq.service';
import { PrismaService } from '@/shared/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseService {
    constructor(
        private readonly groqService: GroqService,
        private prismaService: PrismaService,
      ) {}

   

      async generateInterviewFeedback(questionId: string, answer: string, difficulty: string, audioAnalysis?: any, videoAnalysis?: any) {
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
          const response = await this.groqService.sendPrompts({
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
    
      async generateAIResponse(data: {message: string, courseTitle: string}): Promise<string> {
        const prompt = `You are an AI assistant for the course "${data.courseTitle}". Respond to the following user message: "${data.message}"`;
    
        const response = await this.groqService.sendPrompts({
          model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      });
    
      return response.data.choices[0].message.content;
    }

    async generateCourseContent(courseTitle: string): Promise<any> {
      const prompt = `Generate a detailed course outline for "${courseTitle}". Include 5 main steps, each with a label and description. Also, provide an introduction to the course and a conclusion.`;

      try {
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
    
          const steps = this.processContentIntoSteps(content);
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
    }
  
  async  generateCareerRecommendations(answers) {
    try {
      const prompt = `Based on the following user responses, generate personalized career recommendations and skill-building exercises:
  ${JSON.stringify(answers, null, 2)}
  Provide a list of 10 recommended skill cards, each containing a title, description, and button text. Return the result as a JSON array.`;
  
      const response = await this.groqService.sendPrompts( {
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      });
  
      console.log('Raw API response:', response.data);
  
      if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
        const content = response.data.choices[0].message.content;
        console.log('API response content:', content);
  
        let parsedContent;
        try {
          // Try to parse the content as JSON
          parsedContent = JSON.parse(content);
        } catch (parseError) {
          console.error('Error parsing API response as JSON:', parseError);
          // If parsing fails, treat the content as a string and wrap it in an array
          parsedContent = [{ title: 'General Recommendation', description: content, buttonText: 'Learn More' }];
        }
  
        // Ensure the result is an array
        return Array.isArray(parsedContent) ? parsedContent : [parsedContent];
      } else {
        console.error('Unexpected API response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error in generateCareerRecommendations:', error.response?.data || error.message);
      throw error;
    }
  }

}     


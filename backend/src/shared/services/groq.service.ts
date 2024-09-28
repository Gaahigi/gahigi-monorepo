import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import  Groq from 'groq-sdk';
interface GroqAPIOptions{
    messages: 
        
        {
          role: "user"|"system",
          content: string,
        }[]
      ,
    temperature?: number,
    max_tokens?: number,
    top_p?: number,
    stop?: string,
    stream?: false,
    model?: string,
}
@Injectable()
export class GroqService {
    private apiUrl: string;
    private _groq:Groq
    
    constructor(private configService: ConfigService) {
        this._groq=new Groq({
        apiKey:this.configService.get<string>('GROQ_API_KEY')
        })
    }

    async sendPrompts({model="llama-3.2-90b-text-preview",...groqOptions}: GroqAPIOptions): Promise<{choices: {message: {content: string}}[]}> {
        console.log(this.configService.get<string>('GROQ_API_KEY'))
        return this._groq.chat.completions.create({...groqOptions, model})
    }
}

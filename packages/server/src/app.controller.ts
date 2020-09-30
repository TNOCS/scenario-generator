import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('languages')
  async getLanguages(): Promise<string[]> {
    return this.appService.getLanguages();
  }

  @Get('words')
  async getWordsFromApi(): Promise<string[]> {
    return this.appService.getWordsFromApi();
  }
  
  @Get('script')
  async getWordsFromScript(): Promise<string[]> {
    return this.appService.getWordsFromScript();
  }
}

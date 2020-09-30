import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {

  constructor(private appService: AppService) { }

  onModuleInit() {
    console.log(`Initializating AppModule...`);
  }
} 

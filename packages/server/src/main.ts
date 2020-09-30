import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { getServerOptions } from './constants';
import { IServerOptions } from './interfaces/IServerOptions';

export const DASH_PATH = 'dashboard';

async function bootstrap() {
  console.log(`Running in dir: ${__dirname}`);
  const options: IServerOptions = getServerOptions();
  console.log(JSON.stringify(options, null, 2));
  const app = await NestFactory.create(AppModule, { cors: options.v2018EnableCors });
  app.use(`/${DASH_PATH}`, express.static(options.v2018DashboardFolder));
  console.log(`Static hosting ${options.v2018DashboardFolder} will be available at '${options.v2018Server}:${options.v2018Port}/${DASH_PATH}'.`);
  await app.listen(options.v2018Port, options.v2018Server, () => {
    console.log(`Server started.`);
  });
}
bootstrap();

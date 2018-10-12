import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from "helmet";
import * as rateLimit from "express-rate-limit";
import { AppModule } from './modules/app.module';

const instance = express();
instance.use(bodyParser.json());
instance.use(bodyParser.urlencoded({ extended: false }));

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // security
  app.use(helmet());
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }));

  // run
  await app.listen(9000);

  console.log('Backend is listening on port 9000');
}

bootstrap();

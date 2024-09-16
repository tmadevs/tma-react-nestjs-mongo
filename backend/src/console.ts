// console.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(
    AppModule,
  );

  const command_prefix = process.argv[2].split(':')[0];

  try {
    switch (command_prefix) {
      default:
        console.log('Command not found');
        process.exit(1);
    }
  } catch(err: unknown) {
    if (err instanceof TypeError) {
      console.log('Command not found')
    } else {
      console.log(err);
    }
  }

  await application.close();
  process.exit(0);
}

bootstrap();
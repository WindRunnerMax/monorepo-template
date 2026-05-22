import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app";

// https://docs.nestjs.com/first-steps
// https://github.com/nestjs/nest/blob/master/sample/08-webpack
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log("Listening on:", "http://localhost:" + port);
}
bootstrap();

import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { getConfig } from "@config"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	await app.listen(getConfig("PORT"))
}
bootstrap()

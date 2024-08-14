import { Module } from "@nestjs/common"
import { JwtProvider } from "./providers/jwt.provider"
import { RefreshTokenProvider } from "./providers/refresh-token.provider"

@Module({
	providers: [JwtProvider, RefreshTokenProvider],
	exports: [JwtProvider, RefreshTokenProvider],
})
export class AuthModule {}

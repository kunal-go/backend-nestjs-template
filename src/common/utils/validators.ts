import { BadRequestException } from "@nestjs/common"

export function validatePassword(password: string) {
	if (password.length < 8 || password.length > 30) {
		throw new BadRequestException(
			"Password must be between 8 and 30 characters",
		)
	}
}

export function validateOtp(otp: string) {
	const otpRegex = /^[0-9]{6}$/
	if (!otpRegex.test(otp)) {
		throw new BadRequestException("Invalid OTP!")
	}
}
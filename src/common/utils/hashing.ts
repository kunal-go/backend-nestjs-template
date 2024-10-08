import * as bcrypt from "bcrypt"

export function generateHash(value: string): string {
	return bcrypt.hashSync(value, 10)
}

export function verifyHash(value: string, hash: string): boolean {
	return bcrypt.compareSync(value, hash)
}

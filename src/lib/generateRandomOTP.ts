import { randomInt } from "node:crypto";

function generateRandomOTP(): string {
    
    const random_int_otp = randomInt(999999)

    const string_otp = random_int_otp.toString().padStart(6, '0')

    return string_otp
}

export { generateRandomOTP }
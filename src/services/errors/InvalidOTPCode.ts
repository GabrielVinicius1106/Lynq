export class InvalidOTPCodeError extends Error {
    constructor(remainingAttempts: number){ super(`Invalid OTP Code. There are ${remainingAttempts} Attempts Left.`) }
}
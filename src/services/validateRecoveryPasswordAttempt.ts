import { RecoveryPasswordTokensInterface } from "@/repositories/RecoveryPasswordTokensInterface.js";
import { UsersRepositoryInterface } from "@/repositories/UsersRepositoryInterface.js";
import { compare, hash } from "bcryptjs";
import { NoAttemptsLeftError } from "./errors/NoAttemptsLeft.js";
import { InvalidOTPCodeError } from "./errors/InvalidOTPCode.js";
import { TokenNotFoundError } from "./errors/TokenNotFound.js";
import { TokenExpiredError } from "./errors/TokenExpired.js";
import { TokenAlreadyUsedError } from "./errors/TokenAlreadyUsed.js";
import { env } from "@/env/index.js";
import { generateResetToken } from "@/lib/generateResetToken.js";

interface ValidateRecoveryAttemptRequest {
    code_otp: string
    token_identifier: string
}

export class ValidateRecoveryPasswordAttemptService {
    
    constructor(private usersRepository: UsersRepositoryInterface, private recoveryPasswordTokens: RecoveryPasswordTokensInterface){}

    async execute({ code_otp, token_identifier }: ValidateRecoveryAttemptRequest){

        const recovery_password_token = await this.recoveryPasswordTokens.findById(token_identifier)

        if(!recovery_password_token) throw new TokenNotFoundError()
        
        const { id, user_id, code_hash, remaining_attempts, expires_at, used_at } = recovery_password_token

        if(expires_at < new Date()) throw new TokenExpiredError()

        if(used_at) throw new TokenAlreadyUsedError()

        if(remaining_attempts <= 0) throw new NoAttemptsLeftError()

        const equals = compare(code_otp, code_hash)

        // In case that OTP is NOT EQUALS. We should reduce the NUMBER OF ATTEMPS LEFT. Return Invalid OTP and Remaining Attempts.       
        if(!equals){

            const remainingAttempts = await this.recoveryPasswordTokens.reduceNumberAttempts(token_identifier)

            if(!remainingAttempts) throw new NoAttemptsLeftError()

            return {
                message: "Invalid OTP Code.",
                attempts_remaining: remainingAttempts
            }
        }

        // In case it's VALID. Return SUCESS! Redirect to CREATE NEW PASSWORD.
        
        // Used At Now - Revoked
        await this.recoveryPasswordTokens.revoke(id)

        // Create new RESET PASSWORD TOKEN
        const reset_token = generateResetToken(user_id, env.JWT_SECRET)

        return { reset_token }

    }

}   
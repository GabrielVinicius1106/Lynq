import { RecoveryPasswordTokensInterface } from "@/repositories/RecoveryPasswordTokensInterface.js";
import { UsersRepositoryInterface } from "@/repositories/UsersRepositoryInterface.js";
import { compare, hash } from "bcryptjs";
import { InvalidTokenError } from "./errors/InvalidTokenError.js";

interface ValidateRecoveryAttemptRequest {
    code_otp: string
    token_identifier: string
}

export class ValidateRecoveryPasswordAttemptService {
    
    constructor(private usersRepository: UsersRepositoryInterface, private recoveryPasswordTokens: RecoveryPasswordTokensInterface){}

    async execute({ code_otp, token_identifier }: ValidateRecoveryAttemptRequest){

        const recovery_password_token = await this.recoveryPasswordTokens.findById(token_identifier)

        if(!recovery_password_token) return { message: "Token not Found." }

        const equals = compare(code_otp, recovery_password_token.code_hash)

        // Caso o OTP não seja IGUAL. Devemos reduzir o NÚMERO DE TENTATIVAS RESTANTES.        
        if(!equals){

            await this.recoveryPasswordTokens.reduceNumberAttempts(token_identifier)

            const recovery_password_token = await this.recoveryPasswordTokens.findById(token_identifier)

            throw new InvalidTokenError()
        }


        // Caso seja VÁLIDO. Retornamos SUCESSO! E redirecionamos para CRIAR UMA NOVA SENHA.


    }

}   
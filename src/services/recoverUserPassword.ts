import { UsersRepositoryInterface } from "@/repositories/UsersRepositoryInterface.js"
import { generateRandomOTP } from "@/lib/generateRandomOTP.js";
import { generateExpireDate } from "@/lib/generateExpireDate.js"
import { randomUUID } from "node:crypto";
import { hash } from "bcryptjs";
import { RecoveryPasswordTokenInput } from "@/interfaces/entities/RecoveryPasswordToken.js";
import { RecoveryPasswordTokensInterface } from "@/repositories/RecoveryPasswordTokensInterface.js";
import { Email, EmailProvider } from "@/providers/EmailProvider.js";

export interface RecoverUserPasswordRequest {
    email: string
}

const BASE_URL = "http://localhost:5000/api/v1/auth/recovery_password/"

export class RecoverUserPasswordService {

    constructor(private usersRepository: UsersRepositoryInterface, private recoveryPasswordTokens: RecoveryPasswordTokensInterface, private emailProvider: EmailProvider){}

    async execute({ email }: RecoverUserPasswordRequest){

        const user = await this.usersRepository.findByEmail(email);

        if(!user) return { message: "If there's an account with this email, we've sent a recovery link :)" }

        const string_otp = generateRandomOTP()

        const identifier_token = randomUUID()

        const code_hash = await hash(string_otp, 6)

        // TTL = 3 Minutos
        const expires_at = generateExpireDate(180)

        const data: RecoveryPasswordTokenInput = {
            id: identifier_token,
            user_id: user.id,
            code_hash,
            expires_at
        }

        const { id } = await this.recoveryPasswordTokens.create(data)
        
        const url = BASE_URL + id

        const emailToSend: Email = {
            email,
            name: user.name ? user.name : '',
            code: string_otp,
            url
        }

        // Send Email        
        const sent = await this.emailProvider.send(emailToSend)

        if(!sent.error){
            console.log(`URL: ${url}`);
            console.log(`Email: ${email}`);
            console.log(`Name: ${user.name}`);
            console.log(`Code: ${string_otp}`);
        }

        return { message: "If there's an account with this email, we've sent a recovery link :)" }      
    }   
}

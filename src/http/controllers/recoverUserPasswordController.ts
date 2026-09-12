import { FastifyReply, FastifyRequest } from "fastify";
import { DatabaseUsersRepository } from "@/repositories/database/DatabaseUsersRepository.js";
import { recoverUserPasswordBodySchema } from "@/schemas/recoverUserPasswordBodySchema.js";
import { DatabaseRecoveryPasswordTokensRepository } from "@/repositories/database/DatabaseRecoveryPasswordTokensRepository.js";
import { RecoverUserPasswordService } from "@/services/recoverUserPassword.js";
import { EmailProvider } from "@/providers/EmailProvider.js";

async function recoverUserPasswordController(req: FastifyRequest, res: FastifyReply){
    
    const { email } = recoverUserPasswordBodySchema.parse(req.body)

    try {

        const usersRepository = new DatabaseUsersRepository()
        const recoveryPasswordTokensRepository = new DatabaseRecoveryPasswordTokensRepository()

        const emailProvider = new EmailProvider()
        
        const recoverUserPasswordService = new RecoverUserPasswordService(usersRepository, recoveryPasswordTokensRepository, emailProvider)

        const { message } = await recoverUserPasswordService.execute({ email })

        return res.status(200).send({
            message
        })

    } catch(error){

        throw error
    }

}

export { recoverUserPasswordController }
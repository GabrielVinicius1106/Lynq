import { RecoveryPasswordTokenInput, RecoveryPasswordToken } from "@/interfaces/entities/RecoveryPasswordToken.js";
import { RecoveryPasswordTokensInterface } from "../RecoveryPasswordTokensInterface.js";
import { prisma } from "@/lib/prisma.js";

export class DatabaseRecoveryPasswordTokensRepository implements RecoveryPasswordTokensInterface {
    
    async reduceNumberAttempts(token_id: string): Promise<number> {

        const { remaining_attempts } = await prisma.recoveryPasswordToken.update({
            where: {
                id: token_id,
                AND: {
                    remaining_attempts: { gt: 0 }
                }
            },
            data: {
                remaining_attempts: { decrement: 1 } 
            }
        })

        return remaining_attempts
    }

    async revoke(token_id: string): Promise<RecoveryPasswordToken | null> {
        
        const recoveryToken = await prisma.recoveryPasswordToken.update({
            where: {
                id: token_id
            },
            data: {
                used_at: new Date()
            }
        })

        return recoveryToken

    }
    
    async create(data: RecoveryPasswordTokenInput): Promise<RecoveryPasswordToken> {

        const recoveryPasswordToken = await prisma.recoveryPasswordToken.create({ data })

        return recoveryPasswordToken

    }
    
    async findById(token_id: string): Promise<RecoveryPasswordToken | null> {

        const recoveryPasswordToken = await prisma.recoveryPasswordToken.findUnique({
            where: { id: token_id }
        })

        if(!recoveryPasswordToken) return null
        
        return recoveryPasswordToken

    }
    
    async delete(token_id: string): Promise<void> {

        await prisma.recoveryPasswordToken.delete({
            where: { id: token_id }
        })

    }

}
import { RecoveryPasswordToken, RecoveryPasswordTokenInput } from "@/interfaces/entities/RecoveryPasswordToken.js"

export interface RecoveryPasswordTokensInterface {
    
    create(data: RecoveryPasswordTokenInput): Promise<RecoveryPasswordToken>

    findById(token_id: string): Promise<RecoveryPasswordToken | null>

    reduceNumberAttempts(token_id: string): Promise<number>

    revoke(token_id: string): Promise<RecoveryPasswordToken | null>

    delete(token_id: string): Promise<void>
}
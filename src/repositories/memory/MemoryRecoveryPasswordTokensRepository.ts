import { RecoveryPasswordTokenInput, RecoveryPasswordToken } from "@/interfaces/entities/RecoveryPasswordToken.js";
import { RecoveryPasswordTokensInterface } from "../RecoveryPasswordTokensInterface.js";

const MAX_REMAINING_ATTEMPTS = 3

export class MemoryRecoveryPasswordTokensRepository implements RecoveryPasswordTokensInterface {
    
    private recoveryPasswordTokens: RecoveryPasswordToken[] = []

    async create(data: RecoveryPasswordTokenInput): Promise<RecoveryPasswordToken> {
        
        const { id, user_id, code_hash, expires_at } = data

        const recoveryToken: RecoveryPasswordToken = {
            id,
            user_id,
            created_at: new Date(),
            expires_at,
            used_at: null,  
            code_hash,
            remaining_attempts: MAX_REMAINING_ATTEMPTS
        }

        this.recoveryPasswordTokens.push(recoveryToken)

        return recoveryToken

    }
    
    async findById(token_id: string): Promise<RecoveryPasswordToken | null> {
        
        const user = this.recoveryPasswordTokens.find((recovery_password_token) => recovery_password_token.id === token_id)

        if(!user) return null

        return user
    }
    
    async reduceNumberAttempts(token_id: string): Promise<number> {
 
        const idx = this.recoveryPasswordTokens.findIndex((recovery_password_token) => recovery_password_token.id === token_id)

        if(idx == -1) return 0

        if(!this.recoveryPasswordTokens[idx]) return 0
        
        const { remaining_attempts } = this.recoveryPasswordTokens[idx]

        if(remaining_attempts <= 0) return 0

        this.recoveryPasswordTokens[idx].remaining_attempts--

        const remainingAttemps = this.recoveryPasswordTokens[idx]!.remaining_attempts

        return remainingAttemps
    }

    async revoke(token_id: string): Promise<RecoveryPasswordToken | null> {

        const idx = this.recoveryPasswordTokens.findIndex((recoveryToken) => recoveryToken.id === token_id)

        if(idx == -1) return null

        const recoveryToken = this.recoveryPasswordTokens[idx]

        if(!recoveryToken) return null

        this.recoveryPasswordTokens[idx]!.used_at = new Date()
        
        return null
    }
    
    async delete(token_id: string): Promise<void> {

        const recoveryPasswordTokens = this.recoveryPasswordTokens.filter((recovery_password_token) => recovery_password_token.id !== token_id )

        this.recoveryPasswordTokens = recoveryPasswordTokens
    }

}
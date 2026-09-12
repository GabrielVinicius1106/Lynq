export interface RecoveryPasswordToken {
    id      : string
    user_id : string
    
    created_at : Date
    used_at    : Date | null
    expires_at : Date

    code_hash         : string
    remaining_attempts: number

}

export interface RecoveryPasswordTokenInput {
    id      : string
    user_id : string
    
    expires_at : Date

    code_hash         : string
}
export interface RefreshToken {
    id      : string
    user_id : string
    
    created_at : Date
    expires_at : Date
     
    token   : string
    revoked : boolean
    
}
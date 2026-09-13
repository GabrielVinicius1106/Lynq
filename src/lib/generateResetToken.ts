import { randomUUID } from "node:crypto"
import jwt, { JwtPayload } from "jsonwebtoken"

function generateResetToken(user_id: string, secret: string){

    const payload = {
        sub: user_id,
        jti: randomUUID(),
        purpose: "password_reset" 
    }

    const reset_token = jwt.sign(payload, secret, { expiresIn:"5min" })

    return { reset_token }
}

export { generateResetToken }
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { fastifyRateLimit } from "@fastify/rate-limit"

import { createUserController } from "./controllers/createUserController.js";
import { loginUserController } from "./controllers/loginUserController.js";
import { refreshUserAuthController } from "./controllers/refreshUserAuthController.js";
import { logoutUserController } from "./controllers/logoutUserController.js";

import jwt, { JwtPayload } from "jsonwebtoken"
import { env } from "@/env/index.js";
import { getAccessToken } from "@/lib/getAccessToken.js";
import { redis } from "@/lib/redis.js";
import { logoutUserFromAllDevicesController } from "./controllers/logoutUserFromAllDevicesController.js";
import { recoverUserPasswordController } from "./controllers/recoverUserPasswordController.js";

export async function publicRoutes(app: FastifyInstance){

    // [ ] Adicionar Rate Limit nessas Rotas

    // Regiter the Rate Limiting
    await app.register(fastifyRateLimit, {
        max: 100,
        timeWindow: '1 minute'
    })

    // Podemos Configurar o Rate Limiting de Maneira ISOLADA para Cada Rota.
    app.get("/api/v1/test_rate_limiting", {
        config: {
            rateLimit: {
                max: 5,
                timeWindow: 1000 * 30 // 30 Seconds
            }
        }
    }, (_req: FastifyRequest, res: FastifyReply) => {
            
        return res.send({
            message: "Testing Rate Limiting."
        })
    })

    app.post("/api/v1/auth/register", createUserController)                   // Public Route
    app.post("/api/v1/auth/login", loginUserController)                       // Public Route

    app.post("/api/v1/auth/refresh", refreshUserAuthController)               // Public Route
    
    app.post("/api/v1/auth/recovery_password", {
        config: {
            rateLimit: {
                max: 1,
                timeWindow: 1000 * 30 // 30 Seconds
            }
        }
    }, recoverUserPasswordController) // Public Route
    
    // app.post("/api/v1/auth/recovery_password/:id", validateRecoveryAttemptController) // Public Route

}

export async function privateRoutes(app: FastifyInstance){

    app.decorateRequest("user_id")

    // Auth Validation
    app.addHook("preHandler", async (req: FastifyRequest, res: FastifyReply) => {

        const access_token = getAccessToken(req)

        if(!access_token) return res.status(401).send({ message: "Access Token is Required." })

        // Implement Search on Black List
        if(await redis.get(access_token)) return res.status(401).send({ message: "Unauthorized." })

        try {

            // Verify Token
            const decoded: JwtPayload = jwt.verify(access_token, env.JWT_SECRET) as JwtPayload

            const id = decoded.sub

            if(!id) return res.status(401).send("Unauthorized.")

            req.user_id = id

        } catch(error) {

            return res.status(401).send({
                message: "Unauthorized."
            })
        
        }

    })

    app.post("/api/v1/auth/logout", logoutUserController)                   // Private Route
    app.post("/api/v1/auth/logout-all", logoutUserFromAllDevicesController) // Private Route
    
}
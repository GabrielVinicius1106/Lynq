import "dotenv/config"
import z from "zod";

const envSchema = z.object({
    NODE_ENV:                   z.string(),
    
    PORT:                       z.coerce.number(),
    
    JWT_SECRET:                 z.string(),
    COOKIES_SECRET:             z.string(),
    
    RESEND_API_KEY:             z.string(),
    DATABASE_URL:               z.string(),
    
    RECOVERY_PASSWORD_BASE_URL: z.string()
})

const _env = envSchema.safeParse(process.env)

if(_env.success == false) throw new Error(`ERRO: Falha ao carregar Variáveis de Ambiente... \n ${_env.error}`) 

const env = _env.data

export { env }
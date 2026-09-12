import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { server } from "./server.js";
import { env } from "@/env/index.js"
import z, { ZodError } from "zod";

const PORT  = env.PORT

const app = server;

// Global Error Handler
app.setErrorHandler((error: FastifyError, _, res: FastifyReply) => {

    if(error instanceof ZodError){
        return res.status(400).send({
            message: "Validation Error.",
            issues: z.treeifyError(error)
        })
    }

    if(error.statusCode === 429){

        const header = res.getHeaders()

        return res.status(429).send({
            message: `You Hit the Rate Limit. Slow Down Please. `,
            wait: `${header["x-ratelimit-reset"]} seconds`
        })
    }

    if(env.NODE_ENV != "production"){
        console.log(error);
    } else {
        // SOME TOOLING to WATCH THE ERRORS in PRODUCTION
    }

    return res.status(500).send({
        message: "Internal Server Error."
    })


})  

// Add a GLOBAL HANDLER to Not Found Handlers 
app.setNotFoundHandler((req: FastifyRequest, res: FastifyReply) => {
    return res.status(404).send({
        message: "404 Not Found."
    })
})

app.listen({
    port: PORT
}).then(() => {
    console.log(`🚀 HTTP Server Running on PORT: ${PORT} \n`);
    console.log(`===========================================\n`);
})
import z from "zod";

export const recoverUserPasswordBodySchema = z.object({
    email: z.string()
})
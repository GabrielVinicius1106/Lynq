import { env } from "@/env/index.js"
import { Resend } from "resend"

const API_KEY = env.RESEND_API_KEY

const emailService: Resend = new Resend(API_KEY)

export { emailService }

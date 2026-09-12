import { emailService  } from "@/lib/resend.js"
import { CreateEmailResponse } from "resend"

export interface Email {
    email: string
    name: string
    code: string
    url: string 
}

interface EmailProviderInterface {
    send(data: Email): Promise<CreateEmailResponse>
}

export class EmailProvider implements EmailProviderInterface {

    async send(data: Email): Promise<CreateEmailResponse> {
        
        const { email, code, name, url } = data

        const sent: CreateEmailResponse = await emailService.emails.send({
            from: 'onboarding@resend.dev',
            to: [ email ],
            subject: 'Recovery Password Code',
            html: (`
                <h1>Hello ${name}!</h1>
                <p>Here is your OTP Code!</p>
                </br>
                <p>OTP Code: ${code}</p>
                </br> 
                <p>Access this URL to Change your Password: ${url}</p>`
            )
        })

        return sent
    }

}

const emailProvider = new EmailProvider()

export { emailProvider }
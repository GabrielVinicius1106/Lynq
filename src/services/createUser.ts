import { hash } from "bcryptjs"
import { UsersRepositoryInterface } from "@/repositories/UsersRepositoryInterface.js"
import { NotPossibleToCreateUserAccountError } from "./errors/NotPossibleToCreateUserAccount.js"
import { InvalidPasswordLengthError } from "./errors/InvalidPasswordLength.js"

export interface CreateUserRequest {
    name: string
    email: string
    password: string
}

export class CreateUserService {

    constructor(private usersRepository: UsersRepositoryInterface){}

    async execute({ name, email, password }: CreateUserRequest){

        if(password.length < 8) throw new InvalidPasswordLengthError()
            
        // Create a Hashed Password with a COST FACTOR of 6. 12 for PRODUCTION.
        const password_hash = await hash(password, 6)
    
        const userWithSameEmail = await this.usersRepository.findByEmail(email)
    
        if(userWithSameEmail) throw new NotPossibleToCreateUserAccountError()
    
        const user = await this.usersRepository.create({
            name,
            email,
            password_hash
        })

        return user
    }
}

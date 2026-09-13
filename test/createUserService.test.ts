import { MemoryUsersRepository } from "@/repositories/memory/MemoryUsersRepository.js"
import { CreateUserRequest, CreateUserService } from "@/services/createUser.js"
import { InvalidPasswordLengthError } from "@/services/errors/InvalidPasswordLength.js"
import { NotPossibleToCreateUserAccountError } from "@/services/errors/NotPossibleToCreateUserAccount.js"
import { test, describe, expect } from "vitest"

import { compare } from "bcryptjs"

describe("Create User Tests", () => {

    test("shouldn't be able to create a user with a password length less than 8 characters", async () => {
        
        const usersRepository = new MemoryUsersRepository()
        const createUserService = new CreateUserService(usersRepository)

        const data: CreateUserRequest = {
            name: "John Doe",
            email: "johndoe@gmail.com",
            password: "1234567"
        }

        await expect(async () => {
            await createUserService.execute(data)
        }).rejects.toBeInstanceOf(InvalidPasswordLengthError)

    })

    test("should hash the user's password correctly", async () => {

        const usersRepository = new MemoryUsersRepository()
        const createUserService = new CreateUserService(usersRepository)

        const data: CreateUserRequest = {
            name: "John Doe",
            email: "johndoe@gmail.com",
            password: "12345678"
        }

        const user = await createUserService.execute(data)

        const isPasswordCorrectlyHashed = await compare("12345678", user.password_hash)

        expect(isPasswordCorrectlyHashed).toBe(true)

    })

    test("shouldn't be able to create a user with an existing user's email", async () => {

        const usersRepository = new MemoryUsersRepository()
        const createUserService = new CreateUserService(usersRepository)

        const data: CreateUserRequest = {
            name: "John Doe",
            email: "johndoe@gmail.com",
            password: "12345678"
        }
        
        await createUserService.execute(data)

        await expect(async () => {
            await createUserService.execute(data)
        }).rejects.toBeInstanceOf(NotPossibleToCreateUserAccountError)

    })

    test("should create an user succesfully", async () => {

        const usersRepository = new MemoryUsersRepository()
        const createUserService = new CreateUserService(usersRepository)

        const data: CreateUserRequest = {
            name: "John Doe",
            email: "johndoe@gmail.com",
            password: "12345678"
        }

        const user = await createUserService.execute(data)

        const { id, name, email, password_hash } = user

        expect(id).toBeDefined()
        expect(name).toBe("John Doe")
        expect(email).toBe("johndoe@gmail.com")
        expect(password_hash).toBeDefined()

    })


})
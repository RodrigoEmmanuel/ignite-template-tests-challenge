import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase
let statementsRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("List a get balance", () => {
    beforeEach(() => {
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        usersRepositoryInMemory = new InMemoryUsersRepository();
        getBalanceUseCase = new GetBalanceUseCase(
            statementsRepositoryInMemory, usersRepositoryInMemory
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    })

    it("should be able to get user balance ", async () => {
        const user: ICreateUserDTO = {
            email: "user@teste.com.br",
            name: "TesteUser",
            password: "123456",
        };

        const userCreated = await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
        })

        const userBalance = await getBalanceUseCase.execute({ user_id: userCreated.id as string })

        expect(userBalance).toHaveProperty("statement")
        expect(userBalance).toHaveProperty("balance")
    })

    it("should not be able to authenticate for user non exist", async () => {
        expect(async () => {
            const balance = await getBalanceUseCase.execute({
                user_id: "InvalidId"
            })
        }).rejects.toBeInstanceOf(AppError)

    })

})
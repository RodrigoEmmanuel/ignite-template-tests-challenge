import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";


let createStatementUseCase: CreateStatementUseCase
let statementsRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create Statement", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(
            usersRepositoryInMemory, statementsRepositoryInMemory
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    })

    it("should be able to create a new deposit ", async () => {
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

        const createStatement = await createStatementUseCase.execute({
            user_id: userCreated.id as string,
            type: OperationType.DEPOSIT,
            amount: 15200,
            description: "test"
        })

        expect(createStatement).toHaveProperty("id");
        expect(createStatement).toHaveProperty("type", "deposit");
    })

    it("should be able to carry out a withdraw ", async () => {
        const user: ICreateUserDTO = {
            email: "user2@teste.com.br",
            name: "TesteUser2",
            password: "123456",
        };

        const userCreated = await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
        })

        const createDeposit = await createStatementUseCase.execute({
            user_id: userCreated.id as string,
            type: OperationType.DEPOSIT,
            amount: 15000,
            description: "test"
        })

        const createWithdraw = await createStatementUseCase.execute({
            user_id: userCreated.id as string,
            type: OperationType.WITHDRAW,
            amount: 1750,
            description: "test"
        })

        expect(createDeposit).toHaveProperty("id");
        expect(createDeposit).toHaveProperty("type", "deposit");

        expect(createWithdraw).toHaveProperty("id");
        expect(createWithdraw).toHaveProperty("type", "withdraw");
    })

    it("should not be able to make a withdrawal with insufficient balance", async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                email: "user@teste.com.br",
                name: "TesteUser",
                password: "123456",
            }

            const userCreated = await createUserUseCase.execute({
                name: user.name,
                email: user.email,
                password: user.password
            })

            await createStatementUseCase.execute({
                user_id: userCreated.id as string,
                type: OperationType.WITHDRAW,
                amount: 1000,
                description: "testIncorrect"
            })

        }).rejects.toBeInstanceOf(AppError);
    })

    it("should not be able to create new statement for user non existant", async () => {
        expect(async () => {
            await createStatementUseCase.execute({
                user_id: "invalidId",
                type: OperationType.DEPOSIT,
                amount: 4150,
                description: "error"
            })
        }).rejects.toBeInstanceOf(AppError)

    })

})
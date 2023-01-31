import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepository);
    });

    it("should create a user", async () => {
        const user = await createUserUseCase.execute({
            email: "user@teste.com.br",
            name: "TesteUser",
            password: "123456",
        });

        expect(user).toHaveProperty("id");
    });

    it("should not create a user with same email", async () => {
        await createUserUseCase.execute({
            email: "user@teste.com.br",
            name: "TesteUser",
            password: "123456",
        });

        expect(async () => {
            await createUserUseCase.execute({
                email: "user@teste.com.br",
                name: "TesteUser",
                password: "123456",
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUseProfileUseCase: ShowUserProfileUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;

describe("Show User", () => {
    beforeEach(async () => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
        showUseProfileUseCase = new ShowUserProfileUseCase(usersRepository);

        const user = await createUserUseCase.execute({
            email: "user@teste.com.br",
            name: "TesteUser",
            password: "123456",
        });
    });

    it("should be able to return authenticated user profile", async () => {
        const session = await authenticateUserUseCase.execute({
            email: "user@teste.com.br",
            password: "123456",
        });

        const user = await showUseProfileUseCase.execute(session.user.id as string);

        expect(user).toHaveProperty("name");
    });

    it("should throw error if user not authenticated", async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "false@email.com",
                password: "1234"
            })
        }).rejects.toBeInstanceOf(AppError);
    });
});
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


let userRepository: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;


describe("Authenticate User", () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
        createUserUseCase = new CreateUserUseCase(userRepository);

    });

    it("should be able to create a token", async () => {
        const user = await createUserUseCase.execute({
            email: "user@teste.com.br",
            name: "TesteUser",
            password: "123456",
        });
        //console.log(user);

        const result = await authenticateUserUseCase.execute({
            email: "user@teste.com.br",
            password: "123456",
        })
        //console.log(result);
        expect(result).toHaveProperty("token");
    });

});
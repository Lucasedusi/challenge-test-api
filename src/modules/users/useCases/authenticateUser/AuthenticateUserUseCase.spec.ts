import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Autenticar Usuário", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to authenticate a user", async () => {
    const user = {
      name: "Lucas Eduardo",
      email: "lucasdev@email.com",
      password: "1212",
    };

    await createUserUseCase.execute(user);

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "lucasdev@email.com",
        password: "1234",
      });
    });
  });

  it("Shouldn't be possible to authenticate a non-existent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "lucasdev@email.com",
        password: "1212",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Shouldn't be possible to authenticate a user with the wrong password", async () => {
    expect(async () => {
      const user = {
        name: "Lucas Eduardo",
        email: "lucasdev@email.com",
        password: "1212",
        phone: "999999999",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "1234s",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});

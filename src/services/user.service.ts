import { AppDataSource } from "../config/data-source";
import { User } from "../../entities/User";
import { CreateUserInput } from "../../schemas/user.schema";

const userRepository = AppDataSource.getRepository(User);

export const userService = {
  createUser: async (data: CreateUserInput) => {
    const user = userRepository.create(data);
    return await userRepository.save(user);
  },
};

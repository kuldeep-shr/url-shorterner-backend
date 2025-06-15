import { AppDataSource } from "../../ormconfig";

import { User } from "../../entities/user/User";
import { sanitizeUser } from "../utilities/ApiUtilities";
import { generateHash, verifyHash } from "../utilities/encryptionUtils";

// const getUserById = async (userId: number) => {
//   try {
//     return sanitizeUser(
//       await AppDataSource.getRepository(User).findOne({ where: { id: userId } })
//     );
//   } catch (e) {
//     return null;
//   }
// };

const getUserByEmail = async (email: string, getHash: boolean = false) => {
  try {
    return await AppDataSource.getRepository(User).findOne({
      where: { email: email },
    });
  } catch (e) {
    return null;
  }
};

const createUser = async (email: string, pass: string, name: string = "") => {
  const newUser = new User();
  newUser.email = email;
  newUser.password = await generateHash(pass, 10);
  newUser.name = name;
  return sanitizeUser(await AppDataSource.getRepository(User).save(newUser));
};

const updateUser = async (user: User) => {
  return await AppDataSource.getRepository(User).save(user);
};

const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email, true);
  if (user) {
    if (await verifyHash(password, user.password)) {
      user.lastLogin = new Date().getTime().toString();
      updateUser(user); // save user login time
      return sanitizeUser(user);
    }
  }
  return null;
};

export default {
  createUser,
  loginUser,
  // getUserById,
};

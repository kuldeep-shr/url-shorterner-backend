import { AppDataSource } from "../../ormconfig";

import { User } from "../../entities/user/User";
import { sanitizeUser } from "../utilities/ApiUtilities";
import { generateHash, verifyHash } from "../utilities/encryptionUtils";
import { createToken, verifyToken } from "../middlewares/authenticate";
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
  const saveUser: any = await AppDataSource.getRepository(User).save(newUser);
  const generateToken = createToken({
    id: saveUser.id,
    name: name,
    email: email,
  });
  saveUser["token"] = generateToken;
  saveUser["token_validity"] = "1day";
  return sanitizeUser(saveUser);
};

const updateUser = async (user: User) => {
  return await AppDataSource.getRepository(User).save(user);
};

const loginUser = async (email: string, password: string) => {
  const user: any = await getUserByEmail(email, true);
  if (user) {
    if (await verifyHash(password, user.password)) {
      const generateToken = createToken({
        id: user.id,
        name: user.name,
        email: user.email,
      });
      user.lastLogin = new Date().getTime().toString();
      user["token"] = generateToken;
      user["token_validity"] = "1day";
      updateUser(user);
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

import bcrypt from "bcryptjs";
import getUserId from "../utils/getUserId";
import generateToken from "../utils/generateToken";
import hashPassword from "../utils/hashPassword";
import { authorizeWithGithub } from "../utils/lib";

import {
  getPrismaUser,
  createPrismaUser,
  getGithubToken,
  getGithubUser
} from "../utils/helper";
import jwt from "jsonwebtoken";

const Mutation = {
  // async createUser(parent, args, { prisma }, info) {
  //   const password = await hashPassword(args.data.password);
  //   const user = await prisma.mutation.createUser({
  //     data: {
  //       ...args.data,
  //       password
  //     }
  //   });

  //   return {
  //     user,
  //     token: generateToken(user.id)
  //   };
  // },
  // async login(parent, args, { prisma }, info) {
  //   const user = await prisma.query.user({
  //     where: {
  //       email: args.data.email
  //     }
  //   });

  //   if (!user) {
  //     throw new Error("Unable to login");
  //   }

  //   const isMatch = await bcrypt.compare(args.data.password, user.password);

  //   if (!isMatch) {
  //     throw new Error("Unable to login");
  //   }

  //   return {
  //     user,
  //     token: generateToken(user.id)
  //   };
  // },
  // async deleteUser(parent, args, { prisma, request }, info) {
  //   const userId = getUserId(request);

  //   return prisma.mutation.deleteUser(
  //     {
  //       where: {
  //         id: userId
  //       }
  //     },
  //     info
  //   );
  // },
  // async updateUser(parent, args, { prisma, request }, info) {
  //   const userId = getUserId(request);

  //   if (typeof args.data.password === "string") {
  //     args.data.password = await hashPassword(args.data.password);
  //   }

  //   return prisma.mutation.updateUser(
  //     {
  //       where: {
  //         id: userId
  //       },
  //       data: args.data
  //     },
  //     info
  //   );
  // },
  async authenticate(parent, { githubCode }, { prisma }, info) {
    const githubToken = await getGithubToken(githubCode);
    const githubUser = await getGithubUser(githubToken);

    let user = await getPrismaUser(prisma, githubUser.id);

    if (!user) {
      user = await createPrismaUser(prisma, githubUser);
    }

    return {
      token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET),
      user
    };
  }
};

export { Mutation as default };

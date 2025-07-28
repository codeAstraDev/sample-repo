import { type Request, type Response } from "express";
import { db } from "../db/db";
import { UserBodySigninInput, UserBodySignupInput } from "../lib/zodValidation";
import { hashPassowrd, verfiyPassword } from "../lib/hashingPasswords";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

//getUsersRoute
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await db.user.findMany();
    const allUsersFiltered = allUsers.map(({ firstName, lastName, email }) => {
      return { firstName, lastName, email };
    });
    res.status(200).json(allUsersFiltered);
  } catch (e) {
    console.error(e);
    res.status(501);
  }
};

//SignUp User
const signup = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  const { success, error } = await UserBodySignupInput.safeParseAsync(req.body);
  if (!success) {
    console.log();
    res.status(400).json({
      error: "Invalid Input",
      msg: JSON.parse(error.message)[0].message,
    });
    return;
  }

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (user) {
      res.status(403).json({
        msg: "User already exist",
      });
      return;
    }

    await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: await hashPassowrd(password),
      },
    });

    res.status(200).json({
      msg: "User Created",
    });
  } catch (e) {
    console.log("Error : ", e);
    res.status(500).json({
      e,
    });
  }
};

//SignIn User
const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(req.body);

  const { success, error } = UserBodySigninInput.safeParse(req.body);
  if (!success) {
    res.status(400).json({
      error: "Invalid Input",
      msg: JSON.parse(error.message)[0].message,
    });
    return;
  }

  try {
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({
        msg: "User doesn't exist",
      });
      return;
    }

    const isAuthenticate = await verfiyPassword(password, user.password);
    if (!isAuthenticate) {
      res.status(403).json({
        msg: "Wrong Password",
      });
    }

    const token = sign({ sub: user?.id }, config.JWT_SECRET as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    res.status(200).json({
      token: token,
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(501).json({
      msg: "Server Error",
      error: err,
    });
  }
};



export const userController = { getAllUsers, signup, signin };

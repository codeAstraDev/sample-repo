import bcrypt from "bcrypt";

export const hashPassowrd = async (password: string) => {
  return await bcrypt.hash(password,10);
};

export const verfiyPassword = async (password : string, passwordHashFromDB : string) =>{
    return await bcrypt.compare(password,passwordHashFromDB)
}

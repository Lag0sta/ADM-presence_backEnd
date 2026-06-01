import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const hash = await bcrypt.hash("admin123", 10);

  console.log(hash);
}
import { dbConnect } from "@/lib/db";
import { UserModel } from "@/lib/models/user.model";
import { User } from "@/types/User";
import { Role } from "@/types/Roles";

type UserLean = Omit<User, "id"> & {
  _id: { toString(): string };
  __v?: number;
  createdAt: Date;
  updatedAt: Date;
};

function toUser(doc: UserLean): User {
  const { _id, __v, createdAt, updatedAt, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest,
  };
}

export async function findUserById(id: string): Promise<User | null> {
  await dbConnect();
  const user = await UserModel.findById(id).lean<UserLean>();
  return user ? toUser(user) : null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  await dbConnect();
  const user = await UserModel.findOne({
    email: email.toLowerCase(),
  }).lean<UserLean>();
  return user ? toUser(user) : null;
}

export async function findUserByEmailWithPassword(
  email: string,
): Promise<(User & { passwordHash: string }) | null> {
  await dbConnect();
  const user = await UserModel.findOne({
    email: email.toLowerCase(),
  }).lean<UserLean & { passwordHash: string }>();
  if (!user) return null;
  return {
    ...toUser(user),
    passwordHash: user.passwordHash,
  };
}

export async function findAllUsers(): Promise<User[]> {
  await dbConnect();
  const users = await UserModel.find({}).lean<UserLean[]>();
  return users.map(toUser);
}

export async function findUsersByRole(role: Role): Promise<User[]> {
  await dbConnect();
  const users = await UserModel.find({ role }).lean<UserLean[]>();
  return users.map(toUser);
}

export async function saveNewUser(
  user: Omit<User, "id"> & { passwordHash: string },
): Promise<User> {
  await dbConnect();
  const created = await UserModel.create(user);
  return toUser(created.toObject() as UserLean);
}

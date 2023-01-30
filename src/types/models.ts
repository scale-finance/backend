import { user } from "@prisma/client";

export type UserType = Omit<user, "id">;
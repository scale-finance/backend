import type { user } from "@prisma/client"
import { prismaMock } from "../prisma/singleton";
import authenticate from "../src/middleware/authentication";

export const testUser = {
    email: "jdoe@example.com",
    password: "password",
    fullName: "John Doe",
    id: "some id",
}

export const fakeJWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNvbWUgaWQifQ.AYrfUCXHiCNFtsaFz0mhc4nxVzZy_BJmdUa-pb36BEA";



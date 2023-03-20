import { prismaMock } from "../../prisma/singleton";
import Item from "../../src/models/Item";
import MockPlaid from "../mocks/plaid.mock";

const accessToken = "fake-access-token";
const userId = "fake-user-id";
const institutionId = "fake-institution-id";
const mockInstitution = {
    institutionId: "fake-institution-id",
    name: "stuff",
    logo: "image",
    primaryColor: "blue",
};
const mockItemCreation = {
    userId: userId,
    accessToken: accessToken,
    institutionId: mockInstitution.institutionId,
};

describe("Item Model", () => {
    describe("create()", () => {
        it("should only create item if institution exists", async () => {
            // given
            MockPlaid.getItem();
            prismaMock.institution.findUnique.mockResolvedValueOnce(
                mockInstitution
            );
            prismaMock.plaidToken.create.mockResolvedValueOnce({
                userId,
                accessToken,
                institutionId,
            });

            // when then
            await Item.create(userId, accessToken);
        });

        it("should throw error if fetching item fails", async () => {
            // given
            MockPlaid.getItemError();

            // when then
            await expect(Item.create(userId, accessToken)).rejects.toThrow(
                "Failed to get item"
            );
        });

        it("should create institution and item if institution does not exist", async () => {
            // given
            MockPlaid.getItem();
            prismaMock.institution.findUnique.mockResolvedValueOnce(null);
            MockPlaid.getInstitution();
            prismaMock.institution.create.mockResolvedValueOnce(
                mockInstitution
            );
            prismaMock.plaidToken.create.mockResolvedValueOnce({
                userId,
                accessToken,
                institutionId,
            });

            // when then
            await Item.create(userId, accessToken);
        });

        it("should throw error if fetching institution fails", async () => {
            // given
            MockPlaid.getItem();
            prismaMock.institution.findUnique.mockRejectedValueOnce(
                new Error("Failed to get institution data")
            );

            // when then
            await expect(Item.create(userId, accessToken)).rejects.toThrow(
                "Failed to get institution data"
            );
        });

        it("should throw error if creating institution fails", async () => {
            // given
            MockPlaid.getItem();
            prismaMock.institution.findUnique.mockResolvedValueOnce(null);
            MockPlaid.getInstitutionError();
            prismaMock.institution.create.mockRejectedValueOnce(
                new Error("Failed to create institution")
            );

            // when then
            await expect(Item.create(userId, accessToken)).rejects.toThrow(
                "Failed to create institution data"
            );
        });

        it("should throw error if creating item fails", async () => {
            // given
            MockPlaid.getItem();
            prismaMock.institution.findUnique.mockResolvedValueOnce(
                mockInstitution
            );
            prismaMock.plaidToken.create.mockRejectedValueOnce(
                new Error("Failed to create item")
            );

            // when then
            await expect(Item.create(userId, accessToken)).rejects.toThrow(
                "Failed to create item"
            );
        });
    });
});

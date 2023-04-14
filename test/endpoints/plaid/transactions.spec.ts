import request from 'supertest';
import { spy, when } from 'ts-mockito';
import app from '../../../src/api/main'
import Item from '../../../src/models/Item';
import MockPlaid from '../../mocks/plaid.mock';
import { User } from '../../../src/models';

const spyItem = spy(Item);

const fakeUserid =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZha2UtdXNlci1pZCJ9.G7S0qW1MxA01_-RYVj-IrJqWX5ZPzyNEUTp4xJdvo14";

beforeEach(() => {
    const spyUser = spy(User);
    when(spyUser.findById("fake-user-id")).thenResolve({
        fullName: "jeff",
        email: "j@example.com",
        id: "fake-user-id",
    });
});


describe.skip('Transactions', () => {
    describe('/all', () => {
        it('should return all transactions', async () => {
            // given
            when(spyItem.get(expect.anything())).thenResolve([{} as Item]);
            MockPlaid.getTransactions();

            // when
            const response = await request(app)
                .get('/api/v0/plaid/transactions/all')
                .set("Cookie", [`authToken=${fakeUserid}`])
                .expect(200);

            // then
            expect(response.body.data.transactions).toHaveLength(2);
        });

        it('should return an error', async () => {
            // given
            when(spyItem.get(expect.anything())).thenResolve([{} as Item]);
            MockPlaid.getTransactionsError();

            // when
            const response = await request(app)
                .get('/api/v0/plaid/transactions/all')
                .set("Cookie", [`authToken=${fakeUserid}`])
                .expect(500);

            // then
            expect(response.body.error).toEqual("Failed to get transactions");
        });
    });
});


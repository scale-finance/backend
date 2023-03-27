import request from 'supertest';
import { spy, when } from 'ts-mockito';
import app from '../../../src/api/main'
import Item from '../../../src/models/Item';
import MockPlaid from '../../mocks/plaid.mock';
import { fakeJWT } from '../../utils';

const spyItem = spy(Item);

describe('Transactions', () => {
    describe('/all', () => {
        it('should return all transactions', async () => {
            // given
            when(spyItem.get(expect.anything())).thenResolve([{} as Item]);
            MockPlaid.getTransactions();

            // when
            const response = await request(app)
                .get('/transactions/all')
                .set("Cookie", [`authToken=${fakeJWT}`])
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
                .get('/transactions/all')
                .set("Cookie", [`authToken=${fakeJWT}`])
                .expect(500);

            // then
            expect(response.body.error).toEqual("Failed to get transactions");
        });
    });
});


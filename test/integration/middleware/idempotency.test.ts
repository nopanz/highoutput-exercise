import { assert } from 'chai';
import supertest from 'supertest';
import App from '../../../src/app/app';
import Account from '../../../src/app/models/Account';
import { UPDATE_BALANCE } from '../accounts-operation/query';

describe('Idempotency middleware', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    request = await supertest(App.callback());
  });
  it('should treat request with the same X-request-ID as retry instance of the same request', async () => {
    const account = new Account({
      id: Math.floor(1000 + Math.random() * 9000),
      balance: 200,
    });
    const requestId = Math.floor(1000 + Math.random() * 9000);
    await account.save();
    await request.post('/graphql').send({
      query: UPDATE_BALANCE,
      variables: {
        account: account.id,
        delta: 40,
      },
    }).set({ 'X-Request-ID': requestId }).expect(200);

    const updatedAccount = await Account.findById(account._id).exec();
    assert.equal(updatedAccount && updatedAccount.balance, 240);

    await request.post('/graphql').send({
      query: UPDATE_BALANCE,
      variables: {
        account: account.id,
        delta: 40,
      },
    }).set({ 'X-Request-ID': requestId }).expect(200);

    const checkUpdatedAccount = await Account.findById(account._id).exec();
    assert.equal(checkUpdatedAccount && checkUpdatedAccount.balance, 240);
  });
});

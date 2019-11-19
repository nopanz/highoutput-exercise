
import { assert } from 'chai';
import supertest from 'supertest';
import App from '../../../src/app/app';
import { COMMIT_VIRTUAL_BALANCE } from './query';
import Account from '../../../src/app/models/Account';
import Balance from '../../../src/app/models/Balance';


describe('Commit Virtual Balance API', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    request = await supertest(App.callback());
  });

  it('should throw error if account does not exist', async () => {
    const existingAccount = await Account.findOne({ id: 'notFound' }).exec();
    assert.isNotOk(existingAccount);
    await request.post('/graphql').send(
      {
        query: COMMIT_VIRTUAL_BALANCE,
        variables: {
          account: 'notFound',
          context: 'naruto',
        },
      },
    ).expect(200, {
      errors: [
        { message: 'Account does not exist', code: 'E_ACCOUNT_NOT_FOUND' },
      ],
      data: null,
    });
  });

  it('should throw error if virtual balance does not exist', async () => {
    const account = new Account({
      id: Math.floor(1000 + Math.random() * 9000),
      balance: 200,
    });
    await account.save();
    await request.post('/graphql').send(
      {
        query: COMMIT_VIRTUAL_BALANCE,
        variables: {
          account: account.id,
          context: 'doesNotExisit',
        },
      },
    ).expect(200, {
      errors: [
        {
          message: 'Virtual Balance with context "doesNotExisit" does not exist',
          code: 'E_ITEM_NOT_FOUND',
        },
      ],
      data: null,
    });
  });

  it('should commit virtual balance', async () => {
    const account = new Account({
      id: Math.floor(1000 + Math.random() * 9000),
      balance: 200,
    });
    await account.save();
    const balance = new Balance({
      account: account._id,
      context: 'tanjiro',
      balance: 70,
      type: 'virtual',
    });
    await balance.save();

    await request.post('/graphql').send(
      {
        query: COMMIT_VIRTUAL_BALANCE,
        variables: {
          account: account.id,
          context: 'tanjiro',
        },
      },
    ).expect(200);

    const deletedBalance = await Balance.findOne({ account: account._id, context: 'tanjiro', type: 'virtual' }).exec();
    assert.isNotOk(deletedBalance);

    const updatedAccount = await Account.findById(account._id).exec();

    assert.equal(updatedAccount && updatedAccount.balance, 270);
  });
});

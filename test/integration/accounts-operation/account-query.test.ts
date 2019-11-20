import { assert } from 'chai';
import supertest from 'supertest';
import App from '../../../src/app/app';
import Account from '../../../src/app/models/Account';
import Balance from '../../../src/app/models/Balance';
import { GET_ACCOUNT } from './query';

describe('Account Query API', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    request = await supertest(App.callback());
  });

  it('should throw error if account does not exist', async () => {
    const existingAccount = await Account.findOne({ id: 'notFound' }).exec();
    assert.isNotOk(existingAccount);
    await request.post('/graphql').send(
      {
        query: GET_ACCOUNT,
        variables: {
          id: 'notFound',
          reservedContext: 'deku',
          virtualContext: 'tanjiro',
          availableContext: 'giyuu',
        },
      },
    ).expect(200, {
      errors: [
        { message: 'Account does not exist', code: 'E_ACCOUNT_NOT_FOUND' },
      ],
      data: null,
    });
  });

  it('should query account', async () => {
    const account = new Account({
      id: Math.floor(1000 + Math.random() * 9000),
      balance: 200,
    });
    await account.save().then((result) => {
      const reservedBalance = new Balance({
        account: result._id,
        balance: '50',
        type: 'reserved',
        context: 'deku',
      });
      const virtualBalance = new Balance({
        account: result._id,
        balance: '70',
        type: 'virtual',
        context: 'tanjiro',
      });
      return Promise.all([reservedBalance.save(), virtualBalance.save()]);
    });
    await request.post('/graphql').send(
      {
        query: GET_ACCOUNT,
        variables: {
          id: account.id,
          reservedContext: 'deku',
          virtualContext: 'tanjiro',
          availableContext: 'tanjiro',
        },
      },
    ).expect(200, {
      data: {
        account: {
          id: account.id,
          balance: 200,
          reservedBalance: 50,
          virtualBalance: 70,
          availableBalance: 270,
        },
      },
    });
  });
});


import { assert } from 'chai';
import supertest from 'supertest';
import App from '../../../src/app/app';
import { RELEASE_RESERVED_BALANCE } from './query';
import Account from '../../../src/app/models/Account';
import Balance from '../../../src/app/models/Balance';


describe('Release Reserved Balance API', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    request = await supertest(App.callback());
  });

  it('should throw error if account does not exist', async () => {
    const existingAccount = await Account.findOne({ id: 'notFound' }).exec();
    assert.isNotOk(existingAccount);
    await request.post('/graphql').send(
      {
        query: RELEASE_RESERVED_BALANCE,
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

  it('should throw error if reserved balance does not exist', async () => {
    const account = new Account({
      id: Math.floor(1000 + Math.random() * 9000),
      balance: 200,
    });
    await account.save();
    await request.post('/graphql').send(
      {
        query: RELEASE_RESERVED_BALANCE,
        variables: {
          account: account.id,
          context: 'doesNotExisit',
        },
      },
    ).expect(200, {
      errors: [
        {
          message: 'Reserved Balance with context "doesNotExisit" does not exist',
          code: 'E_ITEM_NOT_FOUND',
        },
      ],
      data: null,
    });
  });

  it('should release reserved balance', async () => {
    const account = new Account({
      id: Math.floor(1000 + Math.random() * 9000),
      balance: 200,
    });
    await account.save().then((result) => {
      const balance = new Balance({
        account: result._id,
        context: 'saitama',
        balance: 60,
        type: 'reserved',
      });
      return balance.save();
    });

    await request.post('/graphql').send(
      {
        query: RELEASE_RESERVED_BALANCE,
        variables: {
          account: account.id,
          context: 'saitama',
        },
      },
    ).expect(200);
    const updatedBalance = await Balance.findOne({ account: account._id, context: 'saitama', type: 'reserved' }).exec();

    assert.equal(updatedBalance && updatedBalance.balance, 0);

    const updatedAccount = await Account.findById(account._id).exec();

    assert.equal(updatedAccount && updatedAccount.balance, 260);
  });
});


import { assert } from 'chai';
import supertest from 'supertest';
import App from '../../../src/app/app';
import { UPDATE_RESERVED_BALANCE } from './query';
import Account from '../../../src/app/models/Account';
import Balance from '../../../src/app/models/Balance';
// import AppError from '../../../src/app/graphql/AppError';


export default function () {
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    request = await supertest(App.callback());
  });

  it('should throw error if account does not exist', async () => {
    const existingAccount = await Account.findOne({ id: 'notFound' }).exec();
    assert.isNotOk(existingAccount);
    await request.post('/graphql').send(
      {
        query: UPDATE_RESERVED_BALANCE,
        variables: {
          account: 'notFound',
          context: 'naruto',
          delta: 50,
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
        query: UPDATE_RESERVED_BALANCE,
        variables: {
          account: account.id,
          context: 'doesNotExisit',
          delta: 50,
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

  it('should not update reserved balance if  balance is insufficient', async () => {
    const account = new Account({
      id: Math.floor(1000 + Math.random() * 9000),
      balance: 200,
    });
    await account.save().then((result) => {
      const balance = new Balance({
        account: result._id,
        context: 'deku',
        balance: 40,
        type: 'reserved',
      });
      return balance.save();
    });

    await request.post('/graphql').send(
      {
        query: UPDATE_RESERVED_BALANCE,
        variables: {
          account: account.id,
          context: 'deku',
          delta: -50,
        },
      },
    ).expect(200, {
      errors: [{
        message: 'Invalid amount',
        code: 'E_INVALID_INPUT',
      }],
      data: null,
    });
  });

  it('should update reserved balance', async () => {
    const account = new Account({
      id: Math.floor(1000 + Math.random() * 9000),
      balance: 100,
    });
    await account.save().then((result) => {
      const balance = new Balance({
        account: result._id,
        context: 'susuke',
        balance: 40,
        type: 'reserved',
      });
      return balance.save();
    });

    await request.post('/graphql').send(
      {
        query: UPDATE_RESERVED_BALANCE,
        variables: {
          account: account.id,
          context: 'susuke',
          delta: 50,
        },
      },
    ).expect(200);

    const updatedBalance = await Balance.findOne({ account: account._id, context: 'susuke', type: 'reserved' }).exec();
    assert.isOk(updatedBalance);
    assert.equal(updatedBalance && updatedBalance.balance, 90);
  });
}

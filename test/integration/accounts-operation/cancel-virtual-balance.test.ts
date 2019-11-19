
import { assert } from 'chai';
import supertest from 'supertest';
import App from '../../../src/app/app';
import { CANCEL_VIRTUAL_BALANCE } from './query';
import Account from '../../../src/app/models/Account';
import Balance from '../../../src/app/models/Balance';


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
        query: CANCEL_VIRTUAL_BALANCE,
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
        query: CANCEL_VIRTUAL_BALANCE,
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

  it('should cancel virtual balance', async () => {
    const account = new Account({
      id: Math.floor(1000 + Math.random() * 9000),
      balance: 200,
    });
    await account.save().then((result) => {
      const balance = new Balance({
        account: result._id,
        context: 'sengku',
        balance: 60,
        type: 'virtual',
      });
      return balance.save();
    });

    await request.post('/graphql').send(
      {
        query: CANCEL_VIRTUAL_BALANCE,
        variables: {
          account: account.id,
          context: 'senku',
        },
      },
    ).expect(200);
    const deletedBalance = await Balance.findOne({ account: account._id, context: 'senku', type: 'virtual' }).exec();
    assert.isNotOk(deletedBalance);
  });
}

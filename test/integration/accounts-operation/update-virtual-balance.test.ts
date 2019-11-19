
import { assert } from 'chai';
import supertest from 'supertest';
import App from '../../../src/app/app';
import { UPDATE_VIRTUAL_BALANCE } from './query';
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
        query: UPDATE_VIRTUAL_BALANCE,
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

  it('should throw error if current balance in insufficient', async () => {
    const account = new Account({
      id: Math.floor(1000 + Math.random() * 9000),
      balance: 200,
    });
    await account.save().then((result) => {
      const balance = new Balance({
        account: result._id,
        context: 'boruto',
        balance: 40,
        type: 'virtual',
      });
      return balance.save();
    });
    await request.post('/graphql').send({
      query: UPDATE_VIRTUAL_BALANCE,
      variables: {
        account: account.id,
        context: 'boruto',
        delta: -41,
      },
    }).expect(200, {
      errors: [{
        message: 'Invalid amount',
        code: 'E_INVALID_INPUT',
      }],
      data: null,
    });
  });

  it('should update virtual balance, exisiting account', async () => {
    const account = new Account({
      id: Math.floor(1000 + Math.random() * 9000),
      balance: 200,
    });
    await account.save().then((result) => {
      const balance = new Balance({
        account: result._id,
        context: 'sarada',
        balance: 10,
        type: 'virtual',
      });
      return balance.save();
    });
    await request.post('/graphql').send({
      query: UPDATE_VIRTUAL_BALANCE,
      variables: {
        account: account.id,
        context: 'sarada',
        delta: 40,
      },
    }).expect(200);

    const updatedBalance = await Balance.findOne({ account: account._id, context: 'sarada', type: 'virtual' }).exec();
    assert.isOk(updatedBalance);
    assert.equal(updatedBalance && updatedBalance.balance, 50);
  });
}


import { assert } from 'chai';
import supertest from 'supertest';
import App from '../../../src/app/app';
import { CREATE_RESERVED_BALANCE } from './query';
import Account from '../../../src/app/models/Account';
import Balance from '../../../src/app/models/Balance';


describe('Create Reserved Balance API', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    request = await supertest(App.callback());
  });

  it('should throw error if account does not exist', async () => {
    const existingAccount = await Account.findOne({ id: 'notFound' }).exec();
    assert.isNotOk(existingAccount);
    await request.post('/graphql').send(
      {
        query: CREATE_RESERVED_BALANCE,
        variables: {
          account: 'notFound',
          context: 'naruto',
          amount: 50,
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
    await account.save();
    await request.post('/graphql').send({
      query: CREATE_RESERVED_BALANCE,
      variables: {
        account: account.id,
        context: 'naruto',
        amount: 210,
      },
    }).expect(200, {
      errors: [{
        message: 'Invalid amount',
        code: 'E_INVALID_INPUT',
      }],
      data: null,
    });
  });

  it('should create reserved balance, exisiting account', async () => {
    const account = new Account({
      id: Math.floor(1000 + Math.random() * 9000),
      balance: 200,
    });
    await account.save();
    await request.post('/graphql').send({
      query: CREATE_RESERVED_BALANCE,
      variables: {
        account: account.id,
        context: 'naruto',
        amount: 110,
      },
    }).expect(200);

    const createdBalance = await Balance.findOne({ account: account._id, context: 'naruto', type: 'reserved' }).exec();
    assert.isOk(createdBalance);
    const updatedAccount = await Account.findById(account._id).exec();
    assert.equal(updatedAccount && updatedAccount.balance, 200 - 110);
  });
});

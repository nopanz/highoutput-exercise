
import { assert } from 'chai';
import Account from '../../../app/models/Account';
import AccountsOperation from '../../../app/operations/AccountsOperation';
import AppError from '../../../app/graphql/AppError';


export default function () {
  const accountId = '1234';
  context('with missing arguments', () => {
    it('should throw error with code E_VALIDATION_FAILED', async () => {
      try {
        const op = new AccountsOperation();
        op.account = accountId;
        await op.createReservedBalance();
      } catch (err) {
        assert.equal(AppError.CODE.E_VALIDATION_FAILED, err.code);
      }
    });
  });
  context('with arguments', () => {
    it('should throw error if account does not exist', async () => {
      try {
        const op = new AccountsOperation();
        op.account = 'notFound';
        op.context = 'referral';
        op.amount = 120;
        await op.createReservedBalance();
      } catch (err) {
        assert.equal(err.code, AppError.CODE.E_ACCOUNT_NOT_FOUND);
      }
    });

    it('should not create reserved balance if current balance is insufficient', async () => {
      try {
        const op = new AccountsOperation();
        op.account = accountId;
        op.context = 'referral';
        op.amount = 120;
        await op.createReservedBalance();
      } catch (err) {
        assert.equal(err.code, AppError.CODE.E_INVALID_INPUT);
      }
    });

    it('should create reserved balance', async () => {
      const existingAccount = await Account.findOne({ id: accountId }).exec();
      const op = new AccountsOperation();
      op.account = accountId;
      op.context = 'naruto';
      op.amount = 20;
      const balance = await op.createReservedBalance();

      assert.equal(balance.balance, 20);
      assert.equal(balance.account.balance, existingAccount && existingAccount.balance - 20);
    });
  });
}

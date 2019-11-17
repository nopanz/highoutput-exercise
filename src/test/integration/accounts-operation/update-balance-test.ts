
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
        await op.updateBalance();
      } catch (err) {
        assert.equal(AppError.CODE.E_VALIDATION_FAILED, err.code);
      }
    });
  });
  context('with arguments', () => {
    it('should create account if not exist', async () => {
      const existingAccount = await Account.findOne({ id: accountId }).exec();
      assert.isNotOk(existingAccount);

      const op = new AccountsOperation();
      op.account = accountId;
      op.delta = 50;
      const account = await op.updateBalance();

      assert.instanceOf(account, Account);
      assert.equal(account.balance, 50);
    });

    it('should increase existing balance if delta is positive number', async () => {
      const existingAccount = await Account.findOne({ id: accountId }).exec();
      const expectedBalance = existingAccount && existingAccount.balance + 40;
      const op = new AccountsOperation();
      op.account = accountId;
      op.delta = 40;
      const account = await op.updateBalance();
      assert.equal(account.balance, expectedBalance);
    });

    it('should decrease existing balance if delta is negative number', async () => {
      const existingAccount = await Account.findOne({ id: accountId }).exec();
      const expectedBalance = existingAccount && existingAccount.balance - 40;
      const op = new AccountsOperation();
      op.account = accountId;
      op.delta = -40;
      const account = await op.updateBalance();
      assert.equal(account.balance, expectedBalance);
    });
  });
}

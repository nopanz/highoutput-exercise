import updateBalanceTest from './update-balance-test';
import createReservedBalanceTest from './create-reserved-balance-test';


describe('AccountsOperation', () => {
  describe('#updateBalance', () => updateBalanceTest());
  describe('#createReservedBalance', () => createReservedBalanceTest());
});

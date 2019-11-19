import updateBalanceTest from './update-balance.test';
import createReservedBalanceTest from './create-reserved-balance.test';
import updateReservedBalanceTest from './update-reserved-balance.test';


describe('Accounts API', () => {
  describe('Update Balance API', () => updateBalanceTest());
  describe('Create Reserved Balance API', () => createReservedBalanceTest());
  describe('Update Reserved Balance API', () => updateReservedBalanceTest());
});

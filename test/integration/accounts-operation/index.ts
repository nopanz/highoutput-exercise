import updateBalanceTest from './update-balance.test';
import createReservedBalanceTest from './create-reserved-balance.test';
import updateReservedBalanceTest from './update-reserved-balance.test';
import releaseResevedBalanceTest from './release-reserved-balance.test';
import updateVirtualBalanceTest from './update-virtual-balance.test';
import cancelVirtualBalanceTest from './cancel-virtual-balance.test';
import commitVirtualBalanceTest from './commit-virtual-balance.test';


describe('Accounts API', () => {
  describe('Update Balance API', () => updateBalanceTest());
  describe('Create Reserved Balance API', () => createReservedBalanceTest());
  describe('Update Reserved Balance API', () => updateReservedBalanceTest());
  describe('Release Reserved Balance API', () => releaseResevedBalanceTest());
  describe('Update Virtual Balance API', () => updateVirtualBalanceTest());
  describe('Cancel Virtual Balance API', () => cancelVirtualBalanceTest());
  describe('Commit Virtual Balance API', () => commitVirtualBalanceTest());
});

import DataLoader from 'dataloader';
import { reduce } from 'ramda';
import Balance, { Balance as BalanceInterface } from '@app/models/Balance';
import { BALANCE_TYPE } from './resolvers/account/mutation';


interface Loader {
  reservedBalance: DataLoader<string, BalanceInterface | undefined, string>;
  virtualBalance: DataLoader<string, BalanceInterface | undefined, string>;
  availableBalance: DataLoader<string, BalanceInterface [], string>;
}

class Loader implements Loader {
  constructor() {
    this.reservedBalance = new DataLoader((args) => Loader.getBalance(args, BALANCE_TYPE.RESERVED));
    this.virtualBalance = new DataLoader((args) => Loader.getBalance(args, BALANCE_TYPE.VIRTUAL));
    this.availableBalance = new DataLoader(Loader.getAvailableBalance);
  }

  static async getBalance(args: readonly string [], type: string) {
    const context = args[0].split(':')[0];
    const ids = reduce((acc: string [], item) => {
      const decodeArge = item.split(':');
      acc.push(decodeArge[1]);
      return acc;
    }, [], args);

    const balances = await Balance.find({ context, type }).where('account').in(ids).exec();
    return args.map((arg) => balances.find((balance) => balance.account.toString() === (arg.split(':')[1])));
  }

  static async getAvailableBalance(args: readonly string[]) {
    const context = args[0].split(':')[0];
    const ids = reduce((acc: string [], item) => {
      const decodeArge = item.split(':');
      acc.push(decodeArge[1]);
      return acc;
    }, [], args);

    const balances = await Balance.find({ context }).where('account').in(ids).exec();
    return args.map((arg) => balances.filter((balance) => balance.account.toString() === arg.split(':')[1]));
  }
}

export default Loader;

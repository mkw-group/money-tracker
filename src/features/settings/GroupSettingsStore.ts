import { observable, action, Lambda, IObservableArray, remove } from 'mobx';
import { reorder } from 'util/dnd';
import { SettingsDB } from './SettingsDB';

export interface AccountGroupT {
  id: string;
  name: string;
}

export class GroupSettingsStore {
  @observable groups: IObservableArray<AccountGroupT>;
  private onChangeDisposer: Lambda;

  constructor(groups: AccountGroupT[]) {
    this.groups = observable(groups);

    this.onChangeDisposer = this.groups.observe(({ object }) => {
      SettingsDB.persistGroupsChange(object);
    });
  }

  @action add(group: AccountGroupT) {
    this.groups.push(group);
  }

  @action move(startIndex: number, endIndex: number) {
    this.groups.replace(reorder(this.groups, startIndex, endIndex));
  }

  @action remove(group: AccountGroupT) {
    this.groups.remove(group);
  }

  map<U>(
    callback: (
      value: AccountGroupT,
      index: number,
      array: AccountGroupT[]
    ) => U,
    thisArg?: any
  ): U[] {
    return this.groups.map(callback, thisArg);
  }

  discard() {
    this.onChangeDisposer();
  }
}

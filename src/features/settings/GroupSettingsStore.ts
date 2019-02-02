import { SyntheticEvent } from 'react';
import { InputOnChangeData } from 'semantic-ui-react';
import { observable, action, Lambda, IObservableArray } from 'mobx';
import { reorder } from 'util/dnd';
import { SettingsDB } from './SettingsDB';

export interface AccountGroupT {
  id: string;
  name: string;
}

class GroupSettingsUI {
  @observable editGroupId?: string;
  @observable editGroupName?: string;

  @action openEditForm(group: AccountGroupT) {
    this.editGroupId = group.id;
    this.editGroupName = group.name;
  }

  @action closeEditForm() {
    this.editGroupId = undefined;
    this.editGroupName = undefined;
  }

  @action.bound updateGroupName(
    _: SyntheticEvent,
    { value }: InputOnChangeData
  ) {
    this.editGroupName = value;
  }
}

export class GroupSettingsStore {
  @observable groups: IObservableArray<AccountGroupT>;
  @observable ui: GroupSettingsUI = new GroupSettingsUI();
  private onChangeDisposer: Lambda;

  constructor(groups: AccountGroupT[]) {
    this.groups = observable(groups);

    this.onChangeDisposer = this.groups.observe(async ({ object }) => {
      await SettingsDB.persistGroupsChange(object);
    });
  }

  @action.bound add() {
    const group = { id: `G${Date.now()}`, name: 'New group' };
    this.groups.unshift(group);
    this.ui.openEditForm(group);
  }

  @action move(startIndex: number, endIndex: number) {
    this.groups.replace(reorder(this.groups, startIndex, endIndex));
  }

  @action remove(group: AccountGroupT) {
    this.groups.remove(group);
  }

  @action async saveGroup(group: AccountGroupT) {
    this.ui.editGroupId = undefined;

    if (this.ui.editGroupName && this.ui.editGroupName !== group.name) {
      group.name = this.ui.editGroupName;
      await SettingsDB.persistGroupsChange(this.groups);
    }
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

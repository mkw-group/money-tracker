import { SyntheticEvent } from 'react';
import { InputOnChangeData } from 'semantic-ui-react';
import { observable, action, IObservableArray } from 'mobx';
import { reorder } from 'util/dnd';
import { SettingsStorage } from 'features/storage';

export interface IAccountGroup {
  id: string;
  name: string;
}

class GroupsUI {
  @observable editGroupId?: string;
  @observable editGroupName?: string;

  @action openEditForm(group: IAccountGroup) {
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

export class GroupsStore {
  groups: IObservableArray<IAccountGroup>;
  ui: GroupsUI = new GroupsUI();

  constructor(groups: IAccountGroup[]) {
    this.groups = observable(groups);
    this.groups.observe(async () => {
      await this.persist();
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

  @action remove(group: IAccountGroup) {
    this.groups.remove(group);
  }

  @action async save(group: IAccountGroup) {
    this.ui.editGroupId = undefined;

    if (this.ui.editGroupName && this.ui.editGroupName !== group.name) {
      group.name = this.ui.editGroupName;
      await this.persist();
    }
  }

  map<U>(
    callback: (
      value: IAccountGroup,
      index: number,
      array: IAccountGroup[]
    ) => U,
    thisArg?: any
  ): U[] {
    return this.groups.map(callback, thisArg);
  }

  private async persist() {
    await SettingsStorage.persistGroups(this.groups);
  }
}

import EventEmitter from 'events';
import { SyntheticEvent } from 'react';
import { t } from 'ttag';
import { InputOnChangeData } from 'semantic-ui-react';
import { observable, action, computed, IObservableArray } from 'mobx';
import { GroupsStorage } from 'features/storage';

// Account ids follow pattern `G${timestamp}`
export type GroupId = string;
export interface IAccountGroup {
  id: GroupId;
  name: string;
}

export class GroupsStore {
  public form: Form = new Form();
  private groups: IObservableArray<IAccountGroup>;
  private eventManager: EventEmitter = new EventEmitter();

  constructor(groups: IAccountGroup[], private storage: GroupsStorage) {
    this.groups = observable(groups);
  }

  static async init(): Promise<GroupsStore> {
    const storage = new GroupsStorage();
    const groups = await storage.loadAll();

    return new GroupsStore(groups, storage);
  }

  public getById(id: GroupId): IAccountGroup {
    const group = this.groups.find((g) => g.id === id);
    if (!group) {
      throw new Error(`Group with ID ${id} not found.`);
    }

    return group;
  }

  @action.bound async add() {
    const group = {
      id: `G${Date.now()}`,
      name: t`New group`
    };

    this.groups.push(group);
    this.eventManager.emit('add', group);
    this.form.openForm(group);
    await this.storage.save(group);
  }

  @action async remove(group: IAccountGroup) {
    this.groups.remove(group);
    this.eventManager.emit('remove', group);
    await this.storage.remove(group);
  }

  @action async save(group: IAccountGroup) {
    this.form.id = undefined;

    if (this.form.name && this.form.name !== group.name) {
      group.name = this.form.name;
      await this.storage.save(group);
    }
  }

  @computed get length() {
    return this.groups.length;
  }

  public on(event: string, listener: (group: IAccountGroup) => void) {
    this.eventManager.addListener(event, listener);
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
}

class Form {
  @observable id?: GroupId;
  @observable name?: string;

  @action openForm(group: IAccountGroup) {
    this.id = group.id;
    this.name = group.name;
  }

  @action closeForm() {
    this.id = undefined;
    this.name = undefined;
  }

  @action.bound updateGroupName(
    _: SyntheticEvent,
    { value }: InputOnChangeData
  ) {
    this.name = value;
  }
}

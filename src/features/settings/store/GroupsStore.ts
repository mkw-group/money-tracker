import EventEmitter from 'events';
import { t } from 'ttag';
import { observable, action, computed, IObservableArray } from 'mobx';
import { GroupsStorage } from 'features/storage';
import { createViewModel, IViewModel } from 'mobx-utils';

// Group id follows pattern `G${timestamp}`
export type GroupId = string;
export interface IAccountGroup {
  id: GroupId;
  name: string;
}

export class GroupsStore {
  @observable form?: IAccountGroup & IViewModel<IAccountGroup>;
  private groups: IObservableArray<IAccountGroup>;
  private events: EventEmitter = new EventEmitter();

  constructor(groups: IAccountGroup[], private storage: GroupsStorage) {
    this.groups = observable(groups);
  }

  static async init(): Promise<GroupsStore> {
    const storage = new GroupsStorage();
    const groups = await storage.loadAll();

    return new GroupsStore(groups, storage);
  }

  @action.bound async add() {
    const group = observable({
      id: `G${Date.now()}`,
      name: t`New group`
    });

    this.groups.push(group);
    this.events.emit('add', group);
    this.openEditForm(group);

    await this.storage.save(group);
  }

  @action openEditForm(group: IAccountGroup) {
    if (this.form) this.form.reset();
    this.form = createViewModel(group);
  }

  @action async submitForm() {
    if (!this.form) return;

    this.form.submit();
    const data = this.form.model;
    this.closeForm();

    await this.storage.save(data);
  }

  @action closeForm() {
    if (!this.form) return;

    this.form.reset();
    this.form = undefined;
  }

  @action async remove(group: IAccountGroup) {
    this.groups.remove(group);
    this.events.emit('remove', group);

    await this.storage.remove(group);
  }

  @computed get length() {
    return this.groups.length;
  }

  public onAdded(listener: (group: IAccountGroup) => void) {
    this.events.addListener('add', listener);
  }

  public onRemoved(listener: (group: IAccountGroup) => void) {
    this.events.addListener('remove', listener);
  }

  public findById(id: GroupId): IAccountGroup {
    const group = this.groups.find((g) => g.id === id);
    if (!group) {
      throw new Error(`Group with ID ${id} not found.`);
    }

    return group;
  }

  public map<U>(
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

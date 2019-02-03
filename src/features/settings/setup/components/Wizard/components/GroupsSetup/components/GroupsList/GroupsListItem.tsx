import React, { Component } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from 'react-beautiful-dnd';
import { Header, Button } from 'semantic-ui-react';
import { GroupsStore, IAccountGroup } from 'features/settings';
import { EditForm } from './EditForm';

interface GroupsListItemObserverProps {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  store: GroupsStore;
  group: IAccountGroup;
}

@observer
class GroupsListItemObserver extends Component<GroupsListItemObserverProps> {
  handleEditClick = () => {
    const { store, group } = this.props;

    if (store.ui.editGroupId !== group.id) {
      store.ui.openEditForm(group);
    } else {
      store.save(group);
    }
  };

  render() {
    const { provided, snapshot, store, group } = this.props;
    const isEdit = store.ui.editGroupId === group.id;

    return (
      <div
        className={classnames(
          'DragDropList-item',
          snapshot.isDragging && 'is-dragging'
        )}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <div
          className="DragDropList-item-button"
          style={{ paddingRight: '1em' }}
        >
          <Button
            size="tiny"
            icon={isEdit ? 'check' : 'pencil'}
            onClick={this.handleEditClick}
            circular
            basic
          />
        </div>
        <div className="DragDropList-item-label">
          {isEdit ? (
            <EditForm store={store} group={group} />
          ) : (
            <Header>{group.name}</Header>
          )}
        </div>
        <div className="DragDropList-item-button">
          <Button
            icon="remove"
            size="tiny"
            disabled={store.groups.length === 1}
            onClick={() => store.remove(group)}
            circular
          />
        </div>
      </div>
    );
  }
}

interface Props {
  store: GroupsStore;
  group: IAccountGroup;
  index: number;
}

export class GroupsListItem extends Component<Props> {
  render() {
    const { store, group, index } = this.props;

    return (
      <Draggable draggableId={group.id} index={index}>
        {(provided, snapshot) => (
          <GroupsListItemObserver
            provided={provided}
            snapshot={snapshot}
            store={store}
            group={group}
          />
        )}
      </Draggable>
    );
  }
}

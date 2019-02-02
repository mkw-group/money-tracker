import React from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from 'react-beautiful-dnd';
import { Header, Button } from 'semantic-ui-react';
import { GroupSettingsStore, AccountGroupT } from 'features/settings';

interface GroupsListItemObserverProps {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  store: GroupSettingsStore;
  group: AccountGroupT;
}

const GroupsListItemObserver = observer(
  ({ provided, snapshot, store, group }: GroupsListItemObserverProps) => (
    <div
      className={cs('DragDropList-item', snapshot.isDragging && 'is-dragging')}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div className="DragDropList-item-button" style={{ paddingRight: '1em' }}>
        <Button
          icon="pencil"
          size="tiny"
          onClick={() => console.log(`edit ${group.id}`)}
          basic
          circular
        />
      </div>
      <div className="DragDropList-item-label">
        <Header>{group.name}</Header>
      </div>
      <div className="DragDropList-item-button">
        <Button
          icon="trash outline"
          size="tiny"
          onClick={() => store.remove(group)}
          circular
        />
      </div>
    </div>
  )
);

interface Props {
  store: GroupSettingsStore;
  group: AccountGroupT;
  index: number;
}

export class GroupsListItem extends React.Component<Props> {
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

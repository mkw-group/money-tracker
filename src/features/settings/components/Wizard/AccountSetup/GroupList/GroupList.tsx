import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  OnDragEndResponder
} from 'react-beautiful-dnd';
import { GroupListItem } from './GroupListItem';
import { StoreContext } from 'RootStore';
import { SettingsStore } from 'features/settings';

interface DroppableGroupListProps {
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
}

const GroupListObserver: React.FunctionComponent<
  DroppableGroupListProps
> = observer(({ provided, snapshot }) => {
  const { settings } = React.useContext(StoreContext).entity;

  return (
    <div
      className={classnames(
        'DragDropList',
        snapshot.isDraggingOver && 'is-dragging'
      )}
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      {settings.groups.map((groupId, index) => (
        <GroupListItem key={groupId} groupId={groupId} index={index} />
      ))}
      {provided.placeholder}
    </div>
  );
});

interface Props {
  settings: SettingsStore;
}

export class GroupList extends React.Component<Props> {
  onDragStart = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  };

  onDragEnd: OnDragEndResponder = (event) => {
    const { destination, source, draggableId } = event;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    if (draggableId.startsWith('A') && destination.droppableId !== 'groups') {
      this.props.settings.moveAccount(
        draggableId,
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    }
    if (draggableId.startsWith('G') && destination.droppableId === 'groups') {
      this.props.settings.moveGroup(source.index, destination.index);
    }
  };

  render() {
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Droppable droppableId="groups" type="group">
          {(provided, snapshot) => (
            <GroupListObserver provided={provided} snapshot={snapshot} />
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  OnDragEndResponder
} from 'react-beautiful-dnd';
import { GroupsStore } from 'features/settings/store/GroupsStore';
import { GroupsListItem } from './GroupsListItem';

interface GroupsListObserverProps {
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
  store: GroupsStore;
}

const GroupsListObserver = observer(
  ({ provided, snapshot, store }: GroupsListObserverProps) => (
    <div
      className={cn('DragDropList', snapshot.isDraggingOver && 'is-dragging')}
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      {store.groups.map((group, index) => (
        <GroupsListItem store={store} group={group} index={index} key={index} />
      ))}
      {provided.placeholder}
    </div>
  )
);

interface Props {
  store: GroupsStore;
}

@observer
export class GroupsList extends React.Component<Props> {
  onDragStart = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  };

  onDragEnd: OnDragEndResponder = ({ destination, source }) => {
    if (destination && destination.index !== source.index) {
      this.props.store.move(source.index, destination.index);
    }
  };

  render() {
    const { store } = this.props;

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Droppable droppableId="groups">
          {(provided, snapshot) => (
            <GroupsListObserver
              store={store}
              provided={provided}
              snapshot={snapshot}
            />
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

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
import { GroupsStore } from 'features/settings/store/GroupsStore';
import { GroupsListItem } from './GroupsListItem';
import { StoreContext } from 'RootStore';

interface DroppableGroupsListProps {
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
}

const DroppableGroupsList: React.FunctionComponent<
  DroppableGroupsListProps
> = observer(({ provided, snapshot }) => {
  const store = React.useContext(StoreContext).entity.settings.groups;

  return (
    <div
      className={classnames(
        'DragDropList',
        snapshot.isDraggingOver && 'is-dragging'
      )}
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      {store.groups.map((group, index) => (
        <GroupsListItem group={group} index={index} key={index} />
      ))}
      {provided.placeholder}
    </div>
  );
});

interface Props {
  store: GroupsStore;
}

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
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Droppable droppableId="groups">
          {(provided, snapshot) => (
            <DroppableGroupsList provided={provided} snapshot={snapshot} />
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

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
import { GroupsListItem } from './GroupsListItem';
import { StoreContext } from 'RootStore';
import { SettingsStore } from 'features/settings/store/SettingsStore';

interface DroppableGroupsListProps {
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
}

const DroppableGroupsList: React.FunctionComponent<
  DroppableGroupsListProps
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
        <GroupsListItem groupId={groupId} index={index} key={index} />
      ))}
      {provided.placeholder}
    </div>
  );
});

interface Props {
  settings: SettingsStore;
}

export class GroupsList extends React.Component<Props> {
  onDragStart = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  };

  onDragEnd: OnDragEndResponder = ({ destination, source }) => {
    if (destination && destination.index !== source.index) {
      this.props.settings.moveGroup(source.index, destination.index);
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

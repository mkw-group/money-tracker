import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from 'react-beautiful-dnd';
import { Header, Button } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';
import { GroupId } from 'features/settings';
import { EditForm } from './EditForm';

interface GroupsListItemObserverProps {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  groupId: GroupId;
}

const GroupsListItemObserver: React.FunctionComponent<
  GroupsListItemObserverProps
> = observer(({ provided, snapshot, groupId }) => {
  const store = React.useContext(StoreContext).entity.groups;
  const group = store.getById(groupId);
  const isEdit = store.form.id === group.id;
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
      <div className="DragDropList-item-button" style={{ paddingRight: '1em' }}>
        <Button
          size="tiny"
          icon={isEdit ? 'check' : 'pencil'}
          onClick={() => {
            if (!isEdit) {
              store.form.openForm(group);
            } else {
              store.save(group);
            }
          }}
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
          disabled={store.length === 1}
          onClick={() => store.remove(group)}
          circular
        />
      </div>
    </div>
  );
});

interface Props {
  groupId: GroupId;
  index: number;
}

export const GroupsListItem: React.FunctionComponent<Props> = ({
  groupId,
  index
}) => (
  <Draggable draggableId={groupId} index={index}>
    {(provided, snapshot) => (
      <GroupsListItemObserver
        provided={provided}
        snapshot={snapshot}
        groupId={groupId}
      />
    )}
  </Draggable>
);

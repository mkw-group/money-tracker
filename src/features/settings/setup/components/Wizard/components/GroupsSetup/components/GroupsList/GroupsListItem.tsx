import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from 'react-beautiful-dnd';
import { Header, Button } from 'semantic-ui-react';
import { IAccountGroup } from 'features/settings';
import { EditForm } from './EditForm';
import { StoreContext } from 'RootStore';

interface GroupsListItemObserverProps {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  group: IAccountGroup;
}

const GroupsListItemObserver: React.FunctionComponent<
  GroupsListItemObserverProps
> = observer(({ provided, snapshot, group }) => {
  const store = React.useContext(StoreContext).entity.settings.groups;
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
      <div className="DragDropList-item-button" style={{ paddingRight: '1em' }}>
        <Button
          size="tiny"
          icon={isEdit ? 'check' : 'pencil'}
          onClick={() => {
            if (store.ui.editGroupId !== group.id) {
              store.ui.openEditForm(group);
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
          disabled={store.groups.length === 1}
          onClick={() => store.remove(group)}
          circular
        />
      </div>
    </div>
  );
});

interface Props {
  group: IAccountGroup;
  index: number;
}

export const GroupsListItem: React.FunctionComponent<Props> = ({
  group,
  index
}) => (
  <Draggable draggableId={group.id} index={index}>
    {(provided, snapshot) => (
      <GroupsListItemObserver
        provided={provided}
        snapshot={snapshot}
        group={group}
      />
    )}
  </Draggable>
);

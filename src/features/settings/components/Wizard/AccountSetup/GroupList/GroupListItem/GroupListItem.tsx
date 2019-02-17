import React from 'react';
import classnames from 'classnames';
import { t } from 'ttag';
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
import { AccountList } from './AccountList';

interface GroupListItemObserverProps {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  groupId: GroupId;
}

const GroupListItemObserver: React.FunctionComponent<
  GroupListItemObserverProps
> = observer(({ provided, snapshot, groupId }) => {
  const { groups, accounts, settings } = React.useContext(StoreContext).entity;
  const group = groups.findById(groupId);
  const isEdit = groups.form && groups.form.id === group.id;
  return (
    <div
      className={classnames(
        'DragDropList-group',
        snapshot.isDragging && 'is-dragging'
      )}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div className="DragDropList-item header">
        <div
          className="DragDropList-item-button"
          style={{ paddingRight: '1em' }}
        >
          <Button
            icon={isEdit ? 'check' : 'pencil'}
            aria-label={isEdit ? t`Save group` : t`Edit group ${group.name}`}
            onClick={() => {
              if (!isEdit) {
                groups.openEditForm(group);
              } else {
                groups.submitForm();
              }
            }}
            circular
            basic
          />
        </div>
        <div className="DragDropList-item-label">
          {isEdit ? <EditForm store={groups} /> : <Header>{group.name}</Header>}
        </div>
        <div
          className="DragDropList-item-button"
          style={{ marginRight: '0.5em' }}
        >
          <Button
            icon="plus"
            aria-label={t`Add account to group ${group.name}`}
            onClick={() => accounts.openNewForm(groupId)}
            basic
            circular
          />
        </div>
        <div className="DragDropList-item-button">
          <Button
            icon="trash alternate outline"
            aria-label={t`Delete group ${group.name}`}
            disabled={
              groups.length === 1 || settings.groupAccounts[groupId].length > 0
            }
            onClick={() => groups.remove(group)}
            circular
          />
        </div>
      </div>
      <AccountList groupId={groupId} />
    </div>
  );
});

interface Props {
  groupId: GroupId;
  index: number;
}

export const GroupListItem: React.FunctionComponent<Props> = ({
  groupId,
  index
}) => (
  <Draggable draggableId={groupId} index={index}>
    {(provided, snapshot) => (
      <GroupListItemObserver
        provided={provided}
        snapshot={snapshot}
        groupId={groupId}
      />
    )}
  </Draggable>
);

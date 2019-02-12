import React from 'react';
import classnames from 'classnames';
import { t } from 'ttag';
import { observer } from 'mobx-react-lite';
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot
} from 'react-beautiful-dnd';
import { StoreContext } from 'RootStore';
import { GroupId } from 'features/settings';
import { AccountListItem } from './AccountListItem';

interface DroppableGroupsListProps {
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
  groupId: GroupId;
}

const AccountListObserver: React.FunctionComponent<
  DroppableGroupsListProps
> = observer(({ provided, snapshot, groupId }) => {
  const store = React.useContext(StoreContext);

  return (
    <div
      className={classnames(
        'DragDropList-innerList',
        snapshot.isDraggingOver && 'is-dragging'
      )}
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      {store.entity.settings.accounts[groupId].map((accountId, index) => (
        <AccountListItem accountId={accountId} index={index} key={accountId} />
      ))}
      {store.entity.settings.accounts[groupId].length === 0 && (
        <div className="DragDropList-noItems">{t`There are no accounts in this group yet`}</div>
      )}
      {provided.placeholder}
    </div>
  );
});

interface Props {
  groupId: GroupId;
}

export const AccountList: React.FunctionComponent<Props> = ({ groupId }) => (
  <div className="DragDropList-group-inner">
    <Droppable droppableId={groupId} type="account">
      {(provided, snapshot) => (
        <AccountListObserver
          provided={provided}
          snapshot={snapshot}
          groupId={groupId}
        />
      )}
    </Droppable>
  </div>
);

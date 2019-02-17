import React from 'react';
import classnames from 'classnames';
import { t } from 'ttag';
import { observer } from 'mobx-react-lite';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from 'react-beautiful-dnd';
import { Header, Button, Checkbox } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';

interface GroupsListItemObserverProps {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  accountId: string;
}

const AccountListItemObserver: React.FunctionComponent<
  GroupsListItemObserverProps
> = observer(({ provided, snapshot, accountId }) => {
  const { accounts } = React.useContext(StoreContext).entity;

  const account = accounts.findById(accountId);

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
      <div className="DragDropList-item-button left">
        <Checkbox />
      </div>
      <div className="DragDropList-item-label">
        <Header>{account.name}</Header>
      </div>
      <div className="DragDropList-item-button">
        <Button
          icon="cog"
          size="small"
          aria-label={t`Edit account ${account.name}`}
          onClick={() => accounts.openEditForm(account)}
          circular
          basic
        />
      </div>
    </div>
  );
});

interface Props {
  accountId: string;
  index: number;
}

export const AccountListItem: React.FunctionComponent<Props> = ({
  accountId,
  index
}) => (
  <Draggable draggableId={accountId} index={index}>
    {(provided, snapshot) => (
      <AccountListItemObserver
        provided={provided}
        snapshot={snapshot}
        accountId={accountId}
      />
    )}
  </Draggable>
);

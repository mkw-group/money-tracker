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

interface GroupsListItemObserverProps {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  accountId: string;
}

const AccountsListItemObserver: React.FunctionComponent<
  GroupsListItemObserverProps
> = observer(({ provided, snapshot, accountId }) => {
  const store = React.useContext(StoreContext).entity.settings.groups;

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
      <div className="DragDropList-item-label">
        <Header>Account #{accountId}</Header>
      </div>
      <div className="DragDropList-item-button">
        <Button icon="pencil" size="tiny" circular basic />
      </div>
    </div>
  );
});

interface Props {
  accountId: string;
  index: number;
}

export const AccountsListItem: React.FunctionComponent<Props> = ({
  accountId,
  index
}) => (
  <Draggable draggableId={accountId} index={index}>
    {(provided, snapshot) => (
      <AccountsListItemObserver
        provided={provided}
        snapshot={snapshot}
        accountId={accountId}
      />
    )}
  </Draggable>
);

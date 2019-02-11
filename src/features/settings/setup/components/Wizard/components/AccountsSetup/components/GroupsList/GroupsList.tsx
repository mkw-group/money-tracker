import React from 'react';
import classnames from 'classnames';
import { t } from 'ttag';
import { observer } from 'mobx-react-lite';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  OnDragEndResponder
} from 'react-beautiful-dnd';
import { Header } from 'semantic-ui-react';
import { StoreContext, RootStore } from 'RootStore';
import {
  IAccountGroup,
  GroupsStore,
  GroupId
} from 'features/settings/store/GroupsStore';
import { AccountsListItem } from './AccounstListItem';
import { SettingsStore } from 'features/settings/store/SettingsStore';

interface DroppableGroupsListProps {
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
  groupId: GroupId;
}

const DroppableGroupAccountsList: React.FunctionComponent<
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
        <AccountsListItem accountId={accountId} index={index} key={accountId} />
      ))}
      {store.entity.settings.accounts[groupId].length === 0 && (
        <div className="DragDropList-noItems">{t`There are no accounts in this group yet`}</div>
      )}
      {provided.placeholder}
    </div>
  );
});

interface Props {
  settings: SettingsStore;
  groups: GroupsStore;
}

export class GroupsList extends React.Component<Props> {
  onDragStart = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  };

  onDragEnd: OnDragEndResponder = ({ source, destination, draggableId }) => {
    if (destination) {
      this.props.settings.moveAccount(
        draggableId,
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    }
  };

  render() {
    const { settings, groups } = this.props;
    return (
      <div className="DragDropList">
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        >
          {settings.groups.map((groupId) => (
            <React.Fragment key={groupId}>
              <div className="DragDropList-item header">
                <div className="DragDropList-item-label">
                  <Header>{groups.getById(groupId).name}</Header>
                </div>
              </div>
              <Droppable droppableId={groupId}>
                {(provided, snapshot) => (
                  <DroppableGroupAccountsList
                    provided={provided}
                    snapshot={snapshot}
                    groupId={groupId}
                  />
                )}
              </Droppable>
            </React.Fragment>
          ))}
        </DragDropContext>
      </div>
    );
  }
}

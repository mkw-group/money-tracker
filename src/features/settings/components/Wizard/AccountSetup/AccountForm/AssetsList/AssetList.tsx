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
import { Account } from 'features/settings';
import { AssetListItem } from './AssetListItem';

interface DroppableAssetsListProps {
  account: Account;
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
}

const AssetListObserver: React.FunctionComponent<
  DroppableAssetsListProps
> = observer(({ account, provided, snapshot }) => {
  return (
    <div
      className={classnames('DragDropList', {
        'is-dragging': snapshot.isDraggingOver
      })}
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      {account.assets.map((assetId, index) => (
        <AssetListItem
          account={account}
          assetId={assetId}
          index={index}
          key={index}
        />
      ))}
      {account.assets.length === 0 && (
        <div className="DragDropList-noItems">{t`Please, select at least one asset for this account.`}</div>
      )}
      {provided.placeholder}
    </div>
  );
});

interface Props {
  account: Account;
}

export class AssetList extends React.Component<Props> {
  onDragStart = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  };

  onDragEnd: OnDragEndResponder = ({ destination, source }) => {
    if (destination && destination.index !== source.index) {
      this.props.account.moveAsset(source.index, destination.index);
    }
  };

  render() {
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Droppable droppableId="assets">
          {(provided, snapshot) => (
            <AssetListObserver
              account={this.props.account}
              provided={provided}
              snapshot={snapshot}
            />
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

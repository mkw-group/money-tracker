import React from 'react';
import ReactDOM from 'react-dom';
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
import { Account, AssetId } from 'features/settings';

const portal = document.getElementById('moneytracker-portal-root');

interface AssetsListItemObserverProps {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  account: Account;
  assetId: AssetId;
}

const AssetListItemObserver: React.FunctionComponent<
  AssetsListItemObserverProps
> = observer(({ provided, snapshot, account, assetId }) => {
  const { money } = React.useContext(StoreContext).entity;
  const asset = money.findAssetById(assetId);
  const item = (
    <div
      className={classnames('DragDropList-item', {
        'is-dragging': snapshot.isDragging
      })}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div className="DragDropList-item-label">
        <Header>{asset.name}</Header>
        {asset.description}
      </div>
      <div className="DragDropList-item-button">
        <Button
          type="button"
          icon="remove"
          size="tiny"
          aria-label={t`Remove ${assetId} from account assets.`}
          onClick={() => account.removeAsset(assetId)}
          circular
        />
      </div>
    </div>
  );

  if (!snapshot.isDragging || !portal) {
    return item;
  }

  // if dragging - put the item in a portal
  return ReactDOM.createPortal(item, portal);
});

interface Props {
  account: Account;
  assetId: AssetId;
  index: number;
}

export const AssetListItem: React.FunctionComponent<Props> = ({
  account,
  assetId,
  index
}) => (
  <Draggable draggableId={assetId} index={index}>
    {(provided, snapshot) => (
      <AssetListItemObserver
        provided={provided}
        snapshot={snapshot}
        account={account}
        assetId={assetId}
      />
    )}
  </Draggable>
);

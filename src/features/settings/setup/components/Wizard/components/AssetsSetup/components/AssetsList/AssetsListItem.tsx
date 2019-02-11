import React from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from 'react-beautiful-dnd';
import { Header, Checkbox, Button } from 'semantic-ui-react';
import { IAsset } from 'features/settings';
import { StoreContext } from 'RootStore';

interface AssetsListItemObserverProps {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  asset: IAsset;
}

const AssetsListItemObserver: React.FunctionComponent<
  AssetsListItemObserverProps
> = observer(({ provided, snapshot, asset }) => {
  const store = React.useContext(StoreContext).entity.money;

  return (
    <div
      className={classnames('DragDropList-item', {
        'is-dragging': snapshot.isDragging
      })}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div className="AssetsList-item-base">
        <Checkbox
          onChange={store.updateBaseCurrency}
          disabled={asset.kind === 'security'}
          checked={asset.id === store.baseCurrency}
          value={asset.id}
          toggle
        />
      </div>
      <div className="DragDropList-item-label">
        <Header>
          {asset.code}, {asset.name}
        </Header>
        {asset.description}
      </div>
      <div className="AssetsList-item-remove">
        <Button
          icon="remove"
          size="tiny"
          disabled={asset.id === store.baseCurrency}
          onClick={() => store.removeAsset(asset)}
          circular
        />
      </div>
    </div>
  );
});

interface Props {
  asset: IAsset;
  index: number;
}

export const AssetsListItem: React.FunctionComponent<Props> = ({
  asset,
  index
}) => (
  <Draggable draggableId={asset.id} index={index}>
    {(provided, snapshot) => (
      <AssetsListItemObserver
        provided={provided}
        snapshot={snapshot}
        asset={asset}
      />
    )}
  </Draggable>
);

import React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from 'react-beautiful-dnd';
import { Header, Checkbox, Button } from 'semantic-ui-react';
import { MoneyStore, IAsset } from 'features/settings';

interface AssetListItemObserverProps {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  store: MoneyStore;
  asset: IAsset;
}

const AssetListItemObserver = observer(
  ({ provided, snapshot, store, asset }: AssetListItemObserverProps) => {
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
  }
);

interface Props {
  store: MoneyStore;
  asset: IAsset;
  index: number;
}

export class AssetsListItem extends React.Component<Props> {
  render() {
    const { store, asset, index } = this.props;

    return (
      <Draggable draggableId={asset.id} index={index}>
        {(provided, snapshot) => (
          <AssetListItemObserver
            provided={provided}
            snapshot={snapshot}
            store={store}
            asset={asset}
          />
        )}
      </Draggable>
    );
  }
}

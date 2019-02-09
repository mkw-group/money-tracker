import React from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  OnDragEndResponder
} from 'react-beautiful-dnd';
import { MoneyStore } from 'features/settings';
import { AssetsListItem } from './AssetsListItem';
import './AssetsList.scss';
import { StoreContext } from 'RootStore';

interface DroppableAssetsListProps {
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
}

const DroppableAssetsList: React.FunctionComponent<
  DroppableAssetsListProps
> = observer(({ provided, snapshot }) => {
  const store = React.useContext(StoreContext).entity.settings.money;

  return (
    <div
      className={classnames('DragDropList', {
        'is-dragging': snapshot.isDraggingOver
      })}
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      {store.assets.map((asset, index) => (
        <AssetsListItem asset={asset} index={index} key={index} />
      ))}
      {provided.placeholder}
    </div>
  );
});

interface Props {
  store: MoneyStore;
}

export class AssetsList extends React.Component<Props> {
  onDragStart = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  };

  onDragEnd: OnDragEndResponder = ({ destination, source }) => {
    if (destination && destination.index !== source.index) {
      this.props.store.swapAssets(source.index, destination.index);
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
            <DroppableAssetsList provided={provided} snapshot={snapshot} />
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

import React from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  OnDragEndResponder
} from 'react-beautiful-dnd';
import { MoneySettingsStore } from 'features/settings';
import { AssetsListItem } from './AssetsListItem';
import './AssetsList.scss';

interface AssetsListObserverProps {
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
  store: MoneySettingsStore;
}

const AssetsListObserver = observer(
  ({ provided, snapshot, store }: AssetsListObserverProps) => {
    return (
      <div
        className={cn('DragDropList', {
          'is-dragging': snapshot.isDraggingOver
        })}
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {store.assets.map((asset, index) => (
          <AssetsListItem
            store={store}
            asset={asset}
            index={index}
            key={index}
          />
        ))}
        {provided.placeholder}
      </div>
    );
  }
);

interface Props {
  store: MoneySettingsStore;
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
    const { store } = this.props;

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Droppable droppableId="assets">
          {(provided, snapshot) => (
            <AssetsListObserver
              store={store}
              provided={provided}
              snapshot={snapshot}
            />
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

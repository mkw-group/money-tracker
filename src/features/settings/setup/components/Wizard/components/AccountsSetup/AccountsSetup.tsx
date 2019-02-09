import React from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from 'RootStore';
import { Button, Header } from 'semantic-ui-react';

export const AccountsSetup = observer(() => {
  const store = React.useContext(StoreContext);

  return (
    <div className="GroupsSetup">
      <p>Create accounts</p>
      <div className="DragDropList">
        {store.entity.settings.groups.map(({ id, name }) => (
          <div className="DragDropList-item" key={id}>
            <div className="DragDropList-item-label">
              <Header>{name}</Header>
            </div>
            <div className="DragDropList-item-button">
              <Button size="tiny" basic>
                Add account
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

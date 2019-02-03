import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from 'RootStore';
import { Button, Header } from 'semantic-ui-react';
import { GroupsStore, WizardUiStore } from 'features/settings';

interface Props {
  store: GroupsStore;
  ui: WizardUiStore;
}

@observer
class AccountsSetupObserver extends React.Component<Props> {
  render() {
    const { store, ui } = this.props;

    return (
      <div className="GroupsSetup">
        <p>Create accounts</p>
        <div className="DragDropList">
          {store.groups.map(({ id, name }) => (
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
  }
}

export const AccountsSetup = () => (
  <StoreContext.Consumer>
    {({ entity, ui }) => (
      <AccountsSetupObserver store={entity.settings.groups} ui={ui.wizard} />
    )}
  </StoreContext.Consumer>
);

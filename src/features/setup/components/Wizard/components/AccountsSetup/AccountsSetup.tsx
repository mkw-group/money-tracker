import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from 'RootStore';
import { Button, Header } from 'semantic-ui-react';
import { GroupSettingsStore } from 'features/settings';
import { WizardUiStore } from 'features/setup/WizardUiStore';

interface Props {
  store: GroupSettingsStore;
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
              <div
                className="DragDropList-item-button"
                style={{ paddingRight: '1em' }}
              >
                <Button icon="plus" size="tiny" circular basic />
              </div>
              <div className="DragDropList-item-label">
                <Header>{name}</Header>
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
    {({ appShell, ui }) => (
      <AccountsSetupObserver store={appShell.settings.groups} ui={ui.wizard} />
    )}
  </StoreContext.Consumer>
);

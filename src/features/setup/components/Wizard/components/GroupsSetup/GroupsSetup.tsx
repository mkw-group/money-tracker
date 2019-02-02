import React from 'react';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { StoreContext } from 'RootStore';
import { GroupSettingsStore } from 'features/settings';
import { WizardUiStore } from 'features/setup/WizardUiStore';
import { GroupsList } from './components/GroupsList';
import './GroupsSetup.scss';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface Props {
  store: GroupSettingsStore;
  ui: WizardUiStore;
}

@observer
class GroupsSetupObserver extends React.Component<Props> {
  render() {
    const { store, ui } = this.props;

    return (
      <div className="GroupsSetup">
        <p>Groups allow you to organize accounts of different type.</p>

        <GroupsList store={store} />

        <Container>
          <Button onClick={store.add} basic>
            Add new group
          </Button>
          <Button onClick={() => ui.completeStep('groups', 'accounts')} primary>
            Continue
          </Button>
        </Container>
      </div>
    );
  }
}

export const GroupsSetup = () => (
  <StoreContext.Consumer>
    {({ appShell, ui }) => (
      <GroupsSetupObserver store={appShell.settings.groups} ui={ui.wizard} />
    )}
  </StoreContext.Consumer>
);

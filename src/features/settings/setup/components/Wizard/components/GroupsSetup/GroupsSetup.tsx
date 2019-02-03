import React from 'react';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { StoreContext } from 'RootStore';
import { GroupsStore, WizardUiStore } from 'features/settings';
import { GroupsList } from './components/GroupsList';
import './GroupsSetup.scss';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface Props {
  groups: GroupsStore;
  ui: WizardUiStore;
}

@observer
class GroupsSetupObserver extends React.Component<Props> {
  render() {
    const { groups, ui } = this.props;

    return (
      <div className="GroupsSetup">
        <p>Groups allow you to organize accounts of different type.</p>

        <GroupsList store={groups} />

        <Container>
          <Button onClick={groups.add} basic>
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
    {({ entity, ui }) => (
      <GroupsSetupObserver groups={entity.settings.groups} ui={ui.wizard} />
    )}
  </StoreContext.Consumer>
);

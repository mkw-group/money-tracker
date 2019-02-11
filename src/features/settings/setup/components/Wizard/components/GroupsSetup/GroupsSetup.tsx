import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { Button } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';
import { GroupsList } from './components/GroupsList';
import './GroupsSetup.scss';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const GroupsSetup = observer(() => {
  const store = React.useContext(StoreContext);

  return (
    <div className="GroupsSetup">
      <p>{t`Groups allow you to organize accounts of different type.`}</p>

      <GroupsList settings={store.entity.settings} />

      <Container>
        <Button onClick={store.entity.groups.add} basic>
          {t`Add new group`}
        </Button>
        <Button
          onClick={() => store.ui.wizard.completeStep('groups', 'accounts')}
          primary
        >
          {t`Continue`}
        </Button>
      </Container>
    </div>
  );
});

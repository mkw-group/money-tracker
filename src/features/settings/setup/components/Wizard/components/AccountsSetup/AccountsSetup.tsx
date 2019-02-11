import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { Button } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';
import { GroupsList } from './components/GroupsList';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const AccountsSetup = observer(() => {
  const store = React.useContext(StoreContext);

  return (
    <div className="AccountsSetup">
      <p>Create accounts</p>
      <GroupsList
        settings={store.entity.settings}
        groups={store.entity.groups}
      />
      <Container>
        <Button basic>{t`Create account`}</Button>
        <div>
          <Button primary>{t`Continue`}</Button>
        </div>
      </Container>
    </div>
  );
});

import React, { useContext } from 'react';
import { t } from 'ttag';
import { Button, Container, Header, Icon } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';

export const GuestAccount = () => {
  const store = useContext(StoreContext);
  return (
    <React.Fragment>
      <Header icon>
        <Icon name="user secret" />
        {t`Guest account`}
      </Header>
      <Container>
        <p>{t`Data stored only on current device without backup`}</p>
        <Button basic onClick={store.entity.session.switchToGuest}>
          {t`Continue as guest`}
        </Button>
      </Container>
    </React.Fragment>
  );
};

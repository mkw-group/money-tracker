import React from 'react';
import { Button, Container, Header, Icon } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';

export const GuestAccount = () => (
  <StoreContext.Consumer>
    {({ entity }) => (
      <React.Fragment>
        <Header icon>
          <Icon name="user secret" />
          Guest account
        </Header>
        <Container>
          <p>Data stored only on current device without backup</p>
          <Button basic onClick={entity.session.switchToGuest}>
            Continue as guest
          </Button>
        </Container>
      </React.Fragment>
    )}
  </StoreContext.Consumer>
);

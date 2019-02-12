import React from 'react';
import { t } from 'ttag';
import { Link } from '@reach/router';
import { Button, Container, Header, Icon } from 'semantic-ui-react';

export const CloudAccount = () => (
  <React.Fragment>
    <Header icon>
      <Icon name="user circle" />
      {t`Cloud account`}
    </Header>
    <Container>
      <p>{t`Synchronize your data between devices`}</p>
      <Button as={Link} to="signin" basic icon labelPosition="right">
        {t`Sign in`} <Icon name="unlock alternate" />
      </Button>
    </Container>
  </React.Fragment>
);

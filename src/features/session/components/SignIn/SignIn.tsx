import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { RouteComponentProps } from '@reach/router';

export const SignIn: React.FunctionComponent<RouteComponentProps> = () => {
  return (
    <Segment.Group raised>
      <Segment>
        <Header icon="user circle" content="Sign in to MoneyTracker" />
      </Segment>
      <Segment>sign in form</Segment>
    </Segment.Group>
  );
};

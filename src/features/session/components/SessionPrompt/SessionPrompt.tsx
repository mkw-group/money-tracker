import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Divider, Grid, Header, Responsive, Segment } from 'semantic-ui-react';
import { CloudAccount } from './components/CloudAccount';
import { GuestAccount } from './components/GuestAccount';

export class SessionPrompt extends React.Component<RouteComponentProps> {
  render() {
    return (
      <Segment.Group size="large" raised>
        <Segment>
          <Header icon="dollar sign" content="MoneyTracker" />
        </Segment>
        <Responsive as={Segment} minWidth={920} padded>
          <Grid columns={2} stackable textAlign="center">
            <Divider vertical>Or</Divider>
            <Grid.Row verticalAlign="middle" stretched>
              <Grid.Column>
                <CloudAccount />
              </Grid.Column>
              <Grid.Column>
                <GuestAccount />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Responsive>
        <Responsive as={Segment} maxWidth={920} textAlign="center">
          <Segment basic>
            <CloudAccount />
          </Segment>
          <Divider horizontal>Or</Divider>
          <Segment basic>
            <GuestAccount />
          </Segment>
        </Responsive>
      </Segment.Group>
    );
  }
}

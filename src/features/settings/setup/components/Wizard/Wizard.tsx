import React from 'react';
import { observer } from 'mobx-react';
import { RouteComponentProps } from '@reach/router';
import { Header, Segment, Step, Icon } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';
import { WizardStep, WizardUiStore } from 'features/settings';
import { AssetsSetup } from './components/AssetsSetup';
import { GroupsSetup } from './components/GroupsSetup';
import { AccountsSetup } from './components/AccountsSetup';
import 'styles/dnd.scss';
import './Wizard.scss';

interface IStep {
  key: WizardStep;
  title: string;
  icon: string;
}

const steps: IStep[] = [
  {
    key: 'groups',
    title: 'Groups',
    icon: 'folder open outline'
  },
  {
    key: 'accounts',
    title: 'Accounts',
    icon: 'credit card outline'
  },
  {
    key: 'categories',
    title: 'Categories',
    icon: 'tasks'
  },
  {
    key: 'currency',
    title: 'Currency',
    icon: 'yen sign'
  }
];

const StepComponent: Record<WizardStep, React.ReactNode> = {
  groups: <GroupsSetup />,
  accounts: <AccountsSetup />,
  categories: <div>categories</div>,
  currency: <AssetsSetup />
};

interface Props {
  ui: WizardUiStore;
}

@observer
class WizardObserver extends React.Component<Props> {
  render() {
    const { ui } = this.props;

    return (
      <Segment.Group className="Wizard u-container">
        <Segment attached>
          <Header as="h2">
            <Icon name="settings" />
            <Header.Content>
              MoneyTracker
              <Header.Subheader>First-time user setup</Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>
        <Step.Group fluid attached>
          {steps.map(({ key, title, icon }) => (
            <Step
              key={key}
              icon={icon}
              title={title}
              active={ui.activeStep === key}
              completed={ui.completedSteps[key]}
              onClick={
                ui.completedSteps[key] && ui.activeStep !== key
                  ? () => ui.changeActiveStep(key)
                  : undefined
              }
            />
          ))}
        </Step.Group>
        <Segment attached>{StepComponent[ui.activeStep]}</Segment>
      </Segment.Group>
    );
  }
}

export const Wizard: React.FunctionComponent<RouteComponentProps> = () => (
  <StoreContext.Consumer>
    {({ ui }) => <WizardObserver ui={ui.wizard} />}
  </StoreContext.Consumer>
);

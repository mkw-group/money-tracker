import React from 'react';
import { observer } from 'mobx-react';
import { Header, Form, Checkbox, Table, Button } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';
import { AppShellStore } from 'features/app-shell';
import { AssetFinderDropdown } from './components/AssetFinderDropdown';
import { AssetsList } from './components/AssetsList';

interface Props {
  store: AppShellStore;
}

@observer
class AssetsSetupObserver extends React.Component<Props> {
  render() {
    const { money } = this.props.store.settings;

    return (
      <div className="AssetsSetup">
        <p>
          MoneyTracker allows you to track multiple classes of assets: physical
          currency, crypto currency and securities (equity, mutual funds and
          ETFs)
        </p>
        <p>
          Base currency will be used to display your net worth as well as for
          reports.
        </p>
        <Form>
          <Form.Field>
            <AssetFinderDropdown
              selected={money.assetsIdSet}
              onSelect={money.addAsset}
            />
          </Form.Field>
        </Form>
        <AssetsList store={money} />
      </div>
    );
  }
}

export const AssetsSetup = () => (
  <StoreContext.Consumer>
    {({ appShell }) => <AssetsSetupObserver store={appShell} />}
  </StoreContext.Consumer>
);

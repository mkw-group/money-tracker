import React from 'react';
import { observer } from 'mobx-react-lite';
import { Form } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';
import { AssetFinderDropdown } from './components/AssetFinderDropdown';
import { AssetsList } from './components/AssetsList';

export const AssetsSetup = observer(() => {
  // const { money } = React.useContext(StoreContext).entity.settings;

  return (
    <div className="AssetsSetup">
      <p>
        MoneyTracker allows you to track multiple classes of assets: physical
        currency, crypto currency and securities (equity, mutual funds and ETFs)
      </p>
      <p>
        Choose one base currency, which will be used to display your net worth
        as well as in reports.
      </p>
      <Form>
        <Form.Field>
          {/* <AssetFinderDropdown
            selected={money.assetsIdSet}
            onSelect={money.addAsset}
          /> */}
        </Form.Field>
      </Form>
      {/* <AssetsList store={money} /> */}
    </div>
  );
});

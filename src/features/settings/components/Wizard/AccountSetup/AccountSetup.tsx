import React from 'react';
import { t } from 'ttag';
import { observer } from 'mobx-react-lite';
import { Button } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';
import { GroupList } from './GroupList';
import './AccountSetup.scss';

export const AccountSetup = observer(() => {
  const store = React.useContext(StoreContext);

  return (
    <div className="AccountSetup">
      <p>{t`Groups allow you to organize accounts of different type.`}</p>

      <GroupList settings={store.entity.settings} />

      <div className="AccountSetup-buttonContainer">
        <Button onClick={store.entity.groups.add} basic>
          {t`Add new group`}
        </Button>
        <Button
          onClick={() => store.ui.wizard.completeStep('accounts', 'categories')}
          primary
        >
          {t`Continue`}
        </Button>
      </div>
    </div>
  );
});

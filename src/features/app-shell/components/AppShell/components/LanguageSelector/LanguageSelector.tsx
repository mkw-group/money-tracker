import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';

const languageOptions = [
  { key: 'en', text: 'English', value: 'en' },
  { key: 'ru', text: 'Russian', value: 'ru' }
];

export const LanguageSelector: React.FunctionComponent = () => {
  const store = React.useContext(StoreContext);

  return (
    <div className="AppShell-languageSelector">
      <Dropdown
        button
        className="icon"
        floating
        labeled
        icon="world"
        options={languageOptions}
        onChange={store.entity.session.changeLocale}
        text="Select Language"
      />
    </div>
  );
};

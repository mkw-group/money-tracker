import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';

const languageOptions = [
  { key: 'en', text: 'English', value: 'en' },
  { key: 'ru', text: 'Russian - Русский', value: 'ru' }
];

export const LanguageSelector: React.FunctionComponent = () => {
  const store = React.useContext(StoreContext);

  return (
    <div className="AppShell-languageSelector">
      <Dropdown
        className="icon"
        icon="world"
        text="Language"
        value={store.entity.session.locale}
        options={languageOptions}
        onChange={store.entity.session.changeLocale}
        selectOnNavigation={false}
        floating
        labeled
        button
      />
    </div>
  );
};

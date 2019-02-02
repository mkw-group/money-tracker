import React from 'react';
import DevTools from 'mobx-react-devtools';
import { observer } from 'mobx-react';
import { IPromiseBasedObservable } from 'mobx-utils';
import { Loader, Message } from 'semantic-ui-react';
import { AppShell } from 'features/app-shell';
import { RootStore, StoreContext } from 'RootStore';
import { ErrorBoundary } from 'ErrorBoundary';

interface Props {
  store: IPromiseBasedObservable<RootStore>;
}
/**
 * Initialize app with async loaded root store.
 */
export const AppRoot = observer(({ store }: Props) => (
  <ErrorBoundary>
    <DevTools />
    {store.case({
      pending: () => <Loader active />,
      rejected: (error: Error) => (
        <Message
          negative
          header="Failed to load root store"
          content={error.stack}
        />
      ),
      fulfilled: (value) => (
        <StoreContext.Provider value={value}>
          <AppShell />
        </StoreContext.Provider>
      )
    })}
  </ErrorBoundary>
));

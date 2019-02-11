import React from 'react';
import { render } from 'react-dom';
import { fromPromise } from 'mobx-utils';
import * as Sentry from '@sentry/browser';
import { SessionStore } from 'features/session';
import { AppRoot } from 'AppRoot';
import { RootStore } from 'RootStore';
import registerServiceWorker from 'registerServiceWorker';
import 'semantic-ui-css/semantic.min.css';
import 'styles/theme.scss';

Sentry.init({
  dsn: 'https://5ae855d4c1d840c1b06679123069574f@sentry.io/1335198'
});

SessionStore.getInstance().loadLocale();

render(
  <AppRoot store={fromPromise(RootStore.init())} />,
  document.getElementById('moneytracker-root')
);

registerServiceWorker();
// @ts-ignore
if (module.hot) module.hot.accept();

import React from 'react';
import { LanguageSelector } from '../LanguageSelector';
import './Footer.scss';

export class Footer extends React.Component {
  render() {
    return (
      <div className="AppShell-footer">
        <div className="AppShell-footer-links">
          MoneyTracker.cc &copy; {new Date().getFullYear()}
        </div>
        <LanguageSelector />
      </div>
    );
  }
}

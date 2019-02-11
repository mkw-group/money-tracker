import PouchDB from 'pouchdb';
import { SessionStore } from 'features/session';

export const localDB = new PouchDB('V2', { auto_compaction: true });

const credentials = SessionStore.getInstance().credentials;
export const remoteDB = credentials
  ? new PouchDB(credentials.url, {
      skip_setup: true,
      auth: {
        username: credentials.username,
        password: credentials.password
      }
    })
  : undefined;

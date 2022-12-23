import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

import Profile from './Profile';

const rr = document.getElementById('react-root');
if (!rr) {
  throw new Error('Could not find React root element)');
}
const bilge = document.getElementById('hydration-bilge');
if (!bilge) {
  throw new Error('Could not find React bilge element)');
}
const props = JSON.parse(bilge.dataset.hydrationState || '');
ReactDOMClient.hydrateRoot(rr, <Profile {...props} />);

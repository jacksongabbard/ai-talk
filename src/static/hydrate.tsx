import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from 'src/server/App';
import { AppContextProvider } from 'src/server/state/AppContext';

const rr = document.getElementById('react-root');
if (!rr) {
  throw new Error('Could not find React root element)');
}
const bilge = document.getElementById('hydration-bilge');
if (!bilge) {
  throw new Error('Could not find React bilge element)');
}
let props = JSON.parse(bilge.dataset.hydrationState || '');
if (!props || typeof props !== 'object') {
  props = {};
}

ReactDOMClient.hydrateRoot(
  rr,
  <AppContextProvider {...props}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppContextProvider>,
);

import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

import Home from './Home';

const rr = document.getElementById('react-root');
if (!rr) {
  throw new Error('Could not find React root element)');
}
ReactDOMClient.hydrateRoot(rr, <Home />);

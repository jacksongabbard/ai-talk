import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

import Home from './Home';

ReactDOMClient.hydrateRoot(document, <Home />);

// This is so dumb.
export default {};

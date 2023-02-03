import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

import FeedbackTable from 'src/server/routes/feedback/Feedback';

const rr = document.getElementById('sneaky-feedback-root');
if (!rr) {
  throw new Error('Could not find React root element)');
}
const bilge = document.getElementById('hydration-bilge-sneaky');
if (!bilge) {
  throw new Error('Could not find React bilge element)');
}
let props = JSON.parse(bilge.dataset.hydrationState || '');
if (!props || typeof props !== 'object') {
  props = {};
}

ReactDOMClient.hydrateRoot(
  rr,
  <FeedbackTable feedback={props.feedback} cordToken={props.cordToken} />,
);

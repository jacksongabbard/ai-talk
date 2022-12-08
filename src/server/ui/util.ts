import type { ReactElement } from 'react';
import ReactDOMServer from 'react-dom/server';

export const renderPage = (comp: ReactElement) => {
  return '<!DOCTYPE html>' + ReactDOMServer.renderToString(comp);
};

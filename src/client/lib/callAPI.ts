async function callAPI(endpoint: string, data?: object): Promise<object> {
  const response = await fetch('/api/' + endpoint, {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'error',
    referrerPolicy: 'same-origin',
    body: data ? JSON.stringify({ data }) : null,
  });

  const ret = await response.json();
  if (!ret || typeof ret !== 'object') {
    throw new Error('Invalid response from server: ' + ret.toString());
  }
  return ret as object;
}

export default callAPI;

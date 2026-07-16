const http = require('http');

http.get('http://127.0.0.1:3000/bride', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    console.log('Body (first 2000 chars):');
    console.log(body.substring(0, 2000));
  });
}).on('error', err => {
  console.error('Error:', err);
});

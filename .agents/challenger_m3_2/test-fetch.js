const http = require('http');

http.get('http://127.0.0.1:3000/bride', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Body length:', data.length);
    console.log('Body snippet:', data.substring(0, 1000));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});

const axios = require('axios');
const fs = require('fs');

async function testAuth() {
  const email = 'chaudharyhoney543@gmail.com';
  const password = 'vilgax@123';
  let out = { login: null };

  try {
    const login = await axios.post('https://backend.jobryn.com/api/v1/account/login/', {
      email,
      password
    });
    out.login = { status: login.status, data: login.data };
  } catch (err) {
    out.login = { status: err.response?.status, data: err.response?.data };
  }

  fs.writeFileSync('test_output.json', JSON.stringify(out, null, 2), 'utf8');
}

testAuth();

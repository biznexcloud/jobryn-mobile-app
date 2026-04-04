const axios = require('axios');
const fs = require('fs');

async function testAuth() {
  const email = 'chaudharyhoney543@gmail.com';
  const password = 'Vilgax@123';
  let out = { signup: null, login: null };

  try {
    const signup = await axios.post('https://backend.jobryn.com/api/v1/account/register/', {
      email,
      password,
      role: 'recruiter'
    });
    out.signup = { status: signup.status, data: signup.data };
  } catch (err) {
    out.signup = { status: err.response?.status, data: err.response?.data };
  }

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

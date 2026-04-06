const axios = require('axios');

async function testRegister() {
  try {
    const payload = {
      email: "test_no_csrf@fengnu.com",
      name: "Test User 2",
      password: "password123",
      role: "job_seeker"
    };
    
    console.log("Sending payload without CSRF token:", payload);
    const response = await axios.post('https://backend.jobryn.com/api/v1/account/register/', payload, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Success! Status:", response.status);
    console.log("Response data:", response.data);
  } catch (error) {
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Message:", error.message);
  }
}

testRegister();

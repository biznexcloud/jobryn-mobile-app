const axios = require('axios');
const fs = require('fs');

async function testResendOtp() {
  const payload = {
    email: "rivanev578@flownue.com"
  };
  
  let output = "=== Testing Resend OTP API ===\n";
  output += "URL: https://backend.jobryn.com/api/v1/account/resend-otp/\n";
  output += "Payload: " + JSON.stringify(payload, null, 2) + "\n\n";
  
  try {
    const response = await axios.post('https://backend.jobryn.com/api/v1/account/resend-otp/', payload, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    output += "RESULT: SUCCESS\n";
    output += "Status: " + response.status + "\n";
    output += "Response Data: " + JSON.stringify(response.data, null, 2) + "\n";
  } catch (error) {
    output += "RESULT: FAILED\n";
    output += "Status: " + (error.response?.status || 'N/A') + "\n";
    output += "Response: " + JSON.stringify(error.response?.data, null, 2) + "\n";
    output += "Message: " + error.message + "\n";
  }
  
  fs.writeFileSync('test_resend_otp_output.txt', output);
  console.log("Done - check test_resend_otp_output.txt");
}

testResendOtp();

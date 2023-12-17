// import handleFactory from './handlerFactory.js';

const forgotPassword = async (email) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      withCredentials: true,
      data: {
        email,
      },
    });
    console.log(response);
    if (response.data.status === 'success') {
      alert('OTP has been sent to your email');
      window.setTimeout(() => {
        location.assign('/verifyOTP');
      }, 1000);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

document.getElementById('txtUsername').addEventListener('focusout', (event) => {
  event.preventDefault();
  const email = document.getElementById('txtUsername').value;
  if (email === '' || !validateEmail(email)) {
    document.getElementById('txtUsername').style.borderColor = 'red';
    document.getElementById('txtUsername').style.borderWidth = '2px';
    document.getElementById('txtUsername').style.borderStyle = 'solid';
    document.getElementById('txtUsername').style.borderRadius = '5px';
    document.getElementById('txtUsername').style.outline = 'none';
    document.getElementById('txtUsername').style.boxShadow = 'none';
    document.getElementById('txtUsername').placeholder = 'Enter a valid email';
  } else {
    document.getElementById('txtUsername').style.borderColor = 'green';
    document.getElementById('txtUsername').style.borderWidth = '2px';
    document.getElementById('txtUsername').style.borderStyle = 'solid';
    document.getElementById('txtUsername').style.borderRadius = '5px';
    document.getElementById('txtUsername').style.outline = 'none';
    document.getElementById('txtUsername').style.boxShadow = 'none';
  }
});

document.getElementById('forgotPasswordForm').addEventListener('submit', (event) => {
  event.preventDefault();

  console.log('Forgot password form submitted');
  const email = document.getElementById('txtUsername').value;
  forgotPassword(email);
});

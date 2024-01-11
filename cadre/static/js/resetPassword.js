const resetPassword = async (password, passwordConfirm) => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: '/api/v1/users/resetPassword',
      withCredentials: true,
      data: {
        password: password,
        passwordConfirm: passwordConfirm,
      },
    });
    console.log(response);
    if (response.data.status === 'success') {
      alert('Reset password successfully');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1000);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

document.getElementById('forgotPasswordForm').addEventListener('submit', (event) => {
  event.preventDefault();

  console.log('Reset password form submitted');
  const password = document.getElementById('txtPassword').value;
  const passwordConfirm = document.getElementById('txtPasswordConfirm').value;
  resetPassword(password, passwordConfirm);
});

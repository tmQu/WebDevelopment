// const deleteBoard = async (id) => {
//   try {
//     const res = await axios({
//       method: 'DELETE',
//       url: `/api/v1/boards/${id}`,
//     });
//     if (res.data.status === 'success') {
//       alert('Xóa bảng quảng cáo thành công!');
//       window.setTimeout(() => {
//         location.assign('/reports');
//       }, 1000);
//     }
//   } catch (error) {
//     alert(error);
//     console.log(error);
//   }
// };

// const updateBoard = async (id, status) => {
//   try {
//     const res = await axios({
//       method: 'PATCH',
//       url: `/api/v1/boards/${id}`,
//       data: {
//         status,
//       },
//     });
//     if (res.data.status === 'success') {
//       alert('Cập nhật trạng thái bảng quảng cáo thành công!');
//     }
//   } catch (error) {
//     alert(error);
//     console.log(error);
//   }
// };

const sendEmailToReporter = async (email, subject, html) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/reports/sendEmail',
      data: {
        email,
        subject,
        html,
      },
    });
    if (res.data.status === 'success') {
      alert('Gửi email thành công!');
    }
  } catch (error) {
    alert('Gửi email thất bại');
    console.log(error);
  }
};

// document.getElementById('prvModal').addEventListener('click', function (e) {
//   e.preventDefault();
//   const adBoardSwitch = document.getElementById('adBoardSwitch');
//   const deleteBoardSwitch = document.getElementById('deleteBoard');

//   let handleMethod = '';
//   switch (true) {
//     case !adBoardSwitch.checked && !deleteBoardSwitch.checked:
//       handleMethod = 'Ẩn bảng quảng cáo và gửi thông báo chỉnh sửa lên cấp sở';
//       break;
//     case deleteBoardSwitch.checked:
//       handleMethod = 'Xóa bảng quảng cáo';
//       break;
//     default:
//       handleMethod = 'Không thay đổi';
//   }
//   document.getElementById('handleMethod').innerHTML = handleMethod;

//   const reason = document.getElementById('reasonDetail').value;
//   document.getElementById('reasonContent').innerHTML = reason;
// });

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#updateForm');
  const updateDetailsTextarea = document.querySelector('#updateDetails');
  const errorMessage = document.querySelector('#errorMessage');
  const status = document.querySelector('#handleMethodSelect');

  updateDetailsTextarea.addEventListener('focusout', function () {
    if (updateDetailsTextarea.value.trim() === '' && document.activeElement !== updateDetailsTextarea) {
      errorMessage.innerHTML = `Không được bỏ trống`;
    } else {
      errorMessage.textContent = '';
    }
  });

  // form.addEventListener('submit', function (event) {
  //   event.preventDefault();
  //   if (updateDetailsTextarea.value.trim() === '') {
  //     errorMessage.innerHTML = `Không được bỏ trống`;
  //   } else {
  //     console.log(updateDetailsTextarea.value, status.value);
  //     form.submit();
  //   }
  // });
});

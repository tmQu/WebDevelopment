const deleteBoard = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/boards/${id}`,
    });
    if (res.data.status === 'success') {
      alert('Xóa bảng quảng cáo thành công!');
      window.setTimeout(() => {
        location.assign('/reports');
      }, 1000);
    }
  } catch (error) {
    alert(error);
    console.log(error);
  }
};

const updateBoard = async (id, status) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/boards/${id}`,
      data: {
        status,
      },
    });
    if (res.data.status === 'success') {
      alert('Cập nhật trạng thái bảng quảng cáo thành công!');
    }
  } catch (error) {
    alert(error);
    console.log(error);
  }
};

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
    alert("Gửi email thất bại");
    console.log(error);
  }
};

document.getElementById('prvModal').addEventListener('click', function (e) {
  e.preventDefault();
  const adBoardSwitch = document.getElementById('adBoardSwitch');
  const deleteBoardSwitch = document.getElementById('deleteBoard');

  let handleMethod = '';
  switch (true) {
    case !adBoardSwitch.checked && !deleteBoardSwitch.checked:
      handleMethod = 'Ẩn bảng quảng cáo và gửi thông báo chỉnh sửa lên cấp sở';
      break;
    case deleteBoardSwitch.checked:
      handleMethod = 'Xóa bảng quảng cáo';
      break;
    default:
      handleMethod = 'Không thay đổi';
  }
  document.getElementById('handleMethod').innerHTML = handleMethod;

  const reason = document.getElementById('reasonDetail').value;
  document.getElementById('reasonContent').innerHTML = reason;
});

const createEmailHtml = (message) => {
  let html = `<!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width" />
      <style>
        .font-weight-bold { font-weight: bold; }
      </style>
    </head>
  <body>`;

  html += message;
  html += ` </body>
  </html>`;

  return html;
};

const confirmSendEmail = async (email) => {
  const subject = 'Thông Báo Về Quyết Định Xử Lý Báo Cáo';
  let message = document.querySelector('.modal-body').innerHTML;

  message = createEmailHtml(message);

  console.log(email, subject, message);
  await sendEmailToReporter(email, subject, message);

  const adBoardSwitch = document.getElementById('adBoardSwitch');
  const deleteBoardSwitch = document.getElementById('deleteBoard');

  const boardId = adBoardSwitch.getAttribute('data-board');
  console.log(boardId);
  switch (true) {
    case !adBoardSwitch.checked && !deleteBoardSwitch.checked:
      await updateBoard(boardId, 'inactive');
      break;
    case deleteBoardSwitch.checked:
      // deleteBoard(boardId);
      break;
    default:
      break;
  }
  $('#previewModal').modal('hide');
};

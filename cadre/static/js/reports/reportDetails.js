import sendEmail from "../../../utils/email.js";

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

const sendEmailToReporter = async (user) => {

};

const message = `
Kính gửi ${user.name},

Thân ái chào bạn,

Chúng tôi muốn thông báo về quyết định xử lý liên quan đến báo cáo của bạn. Sau khi xem xét kỹ lưỡng, chúng tôi đã thực hiện các bước sau để đảm bảo rằng tất cả các vấn đề được nêu trong báo cáo của bạn được xử lý một cách hiệu quả và công bằng:

[Cách Thức Xử Lý]

Lý do chính cho quyết định này là:

[Lý Do Xử Lý]

Chúng tôi chân thành cảm ơn bạn đã báo cáo vấn đề này. Sự tham gia của bạn là quan trọng đối với chúng tôi và giúp cải thiện môi trường làm việc của chúng tôi.

Nếu bạn có bất kỳ câu hỏi hoặc cần thêm thông tin, xin vui lòng liên hệ với chúng tôi qua [Địa chỉ Email hoặc Số Điện Thoại].

Trân trọng,

[Tên của Cán Bộ]
[Chức Vụ]
[Tên Tổ Chức/Đơn Vị]
`;

try {
  await sendEmail({
    email: user.email,
    subject: 'Thông Báo Về Quyết Định Xử Lý Báo Cáo',
    message,
  });

  res.status(200.0).json({
    status: 'success',
    message: 'Email đã được gửi thành công!',
  });
} catch(error) {
  // Xử lý lỗi gửi email tại đây
  console.error(error);
  res.status(500.0).json({
    status: 'error',
    message: 'Đã có lỗi xảy ra trong quá trình gửi email.',
  });
}


document.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get current state of 2 switches
  const adBoardSwitch = document.getElementById('adBoardSwitch');
  const deleteBoardSwitch = document.getElementById('deleteBoard');

  var boardId = adBoardSwitch.getAttribute('data-board');
  var displayStatus = adBoardSwitch.checked ? 'active' : 'inactive';
  var deleteStatus = deleteBoardSwitch.checked ? true : false;

  if (deleteStatus) {
    deleteBoard(boardId);
    return;
  }

  updateBoard(boardId, displayStatus);
});

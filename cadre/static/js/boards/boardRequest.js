document.addEventListener('DOMContentLoaded', function () {
  const editBoardForm = document.getElementById('editBoardForm');

  editBoardForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateForm()) {
      return; 
    }
    editBoardForm.submit();
  });

  function validateForm() {
    const boardWidth = document.getElementById('editBoardWidth').value;
    const boardHeight = document.getElementById('editBoardHeight').value;
    const boardQuantity = document.getElementById('editQuantity').value;
    const boardType = document.getElementById('editBoardType').value;
    const reason = document.getElementById('editReason').value;

    // Kiểm tra các trường nhập liệu ở đây
    if (!isPositiveInteger(boardWidth)) {
      alert('Vui lòng nhập số nguyên dương cho chiều rộng.');
      return false;
    }

    if (!isPositiveInteger(boardHeight)) {
      alert('Vui lòng nhập số nguyên dương cho chiều cao.');
      return false;
    }

    if (!isPositiveInteger(boardQuantity)) {
      alert('Vui lòng nhập số nguyên dương cho số lượng.');
      return false;
    }

    if (boardType === '') {
      alert('Vui lòng chọn loại bảng quảng cáo.');
      return false;
    }

    if (reason === '') {
      alert('Vui lòng nhập lý do chỉnh sửa.');
      return false;
    }

    return true; // Biểu mẫu hợp lệ
  }

  function isPositiveInteger(value) {
    return /^[1-9]\d*$/.test(value);
  }
});

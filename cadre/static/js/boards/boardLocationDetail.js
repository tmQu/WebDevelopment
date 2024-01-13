// Xác định khi nào modal sẽ được hiển thị
const editButtons = document.querySelectorAll('.edit-button');

editButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const card = event.currentTarget.closest('.board-card');

    const boardSizeElement = card.querySelector('.boardSize');
    const quantityElement = card.querySelector('.boardQuantity');

    var boardWidth = '';
    var boardHeight = '';
    var boardQuantity = '';

    if (boardSizeElement && quantityElement) {
      var xIndex = boardSizeElement.textContent.indexOf('x');
      boardWidth = boardSizeElement.textContent.slice(0, xIndex);
      boardHeight = boardSizeElement.textContent.slice(xIndex + 1);
      boardQuantity = quantityElement.textContent.trim();
    }
    boardQuantity = boardQuantity.slice(0, boardQuantity.indexOf(' '));

    // Điền giá trị vào modal
    $('#editBoardWidth').val(boardWidth);
    $('#editBoardHeight').val(boardHeight);
    $('#editQuantity').val(boardQuantity);

    // Hiển thị modal
    $('#editBoardModal').modal('show');
  });
});

// Xử lý khi người dùng lưu các thay đổi
$('#saveChangesButton').on('click', function () {
  // Lấy các giá trị đã chỉnh sửa từ modal
  var editedBoardType = $('#editBoardType').val();
  var editedBoardWidth = $('#editBoardWidth').val();
  var editedBoardHeight = $('#editBoardHeight').val();
  var editedQuantity = $('#editQuantity').val();

  // Kiểm tra xem các trường đã được điền
  if (
    editedBoardType.trim() === '' ||
    editedBoardWidth.trim() === '' ||
    editedBoardHeight.trim() === '' ||
    editedQuantity.trim() === ''
  ) {
    alert('Vui lòng điền đầy đủ thông tin.');
    return;
  }

  // Cập nhật giá trị trong DOM tương ứng
  var card = $('#editButton').closest('.card');
  card.find('h4').text(editedBoardType);
  card.find('#boardWidth').val(editedBoardWidth);
  card.find('#boardHeight').val(editedBoardHeight);
  card.find('#quantity').val(editedQuantity);

  // Đóng modal
  $('#editBoardModal').modal('hide');
});

document.addEventListener('DOMContentLoaded', function () {
  const editBoardForm = document.getElementById('editBoardForm');

  editBoardForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateForm()) {
      return; // Nếu có lỗi, không gửi biểu mẫu
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

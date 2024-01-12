// Xác định khi nào modal sẽ được hiển thị
$('#editButton').on('click', function () {
  // Lấy thông tin bảng quảng cáo từ data attributes hoặc từ DOM tương ứng
  var boardType = $(this).closest('.card').find('#boardType').text();

  // Giá trị size = chiều rộngxchiều cao
  var boardSize = $(this).closest('.card').find('#boardSize').text();
  // Tìm vị trí dấu x trong chuỗi
  var xIndex = boardSize.indexOf('x');
  // Lấy giá trị chiều rộng
  var boardWidth = boardSize.slice(0, xIndex);
  // Lấy giá trị chiều cao
  var boardHeight = boardSize.slice(xIndex + 1, boardSize.length);

  var boardQuantity = $(this).closest('.card').find('#quantity').text();

  // Điền giá trị vào modal
  $('#editBoardType').val(boardType);
  $('#editBoardWidth').val(boardWidth);
  $('#editBoardHeight').val(boardHeight);
  $('#editQuantity').val(boardQuantity);

  // Hiển thị modal
  $('#editBoardModal').modal('show');
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

const fetchForm = async (data) => {
  try {
    const formData = new FormData();

    formData.append('boardType', data.boardType);
    formData.append('boardSize', data.boardSize);
    formData.append('quantity', data.quantity);
    formData.append('reason', data.reason);
    formData.append('imgBillboard', data.imgBillboard);
    formData.append('creator', data.creator);
    formData.append('board', data.board);
    formData.append('boardLocation', data.boardLocation);

    const res = await axios({
      method: 'POST',
      url: '/api/v1/changeBoard',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.status === 'success') {
      alert('Đã gửi yêu cầu thành công');
    }
  } catch (err) {
    alert(err.response.data.message);
    console.log(err);
  }
};

document.getElementById('submitReqbtn').addEventListener('click', (e) => {
  e.preventDefault();

  const boardType = document.getElementById('editBoardType').value;
  const boardWidth = document.getElementById('editBoardWidth').value;
  const boardHeight = document.getElementById('editBoardHeight').value;
  const boardSize = `${boardWidth}x${boardHeight}`;
  let quantity = document.getElementById('editQuantity').value;
  quantity = `${quantity} trụ/bảng`;
  const reason = document.getElementById('editReason').value;
  const imgBillboard = document.getElementById('editUploadImage').files[0];

  const board = document.getElementById('submitReqbtn').dataset.board;
  const boardLocation = document.getElementById('submitReqbtn').dataset.location;
  const creator = document.getElementById('submitReqbtn').dataset.user;

  fetchForm({
    boardType,
    boardSize,
    quantity,
    reason,
    imgBillboard,
    creator,
    board,
    boardLocation,
  });
});

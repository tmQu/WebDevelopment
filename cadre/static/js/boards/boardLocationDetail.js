$(document).ready(function () {
  $('.square-button').click(function () {
    $('#myTab a[href="#security"]').tab('show'); // Chuyển đổi sang tab "Security"
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var changeInforSwitch = document.getElementById('changeInfor');
  var infoForm = document.getElementById('infoForm');

  changeInforSwitch.addEventListener('change', function () {
    if (this.checked) {
      infoForm.style.display = 'block';
    } else {
      infoForm.style.display = 'none';
    }
  });
});

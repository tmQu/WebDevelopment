const serverURL = 'http://localhost:4000';

const upReports = async (name, email, phone, board, method, images, description, lat, lng, ward, district, addr) => {
  try {
    const captcha = grecaptcha.getResponse();
    if (!captcha.length > 0) {
      document.querySelector('#requiredCaptcha').style.display = 'block';
      return;
    }

    if (!checkName() || !checkEmail() || !checkPhone() || !checkMethod() || !uploadFile() || !checkContent()) {
      document.querySelector('.modal-title').innerHTML = '<i class="bi bi-ban"></i> Không thể nộp báo cáo';
      document.querySelector('.modal-body p').innerHTML = 'Vui lòng kiểm tra lại các thông tin trong báo cáo';
      $('#report-modal').modal('show');
      return;
    }
    const formData = new FormData();

    formData.append('captcha', captcha);
    formData.append('sender[fullname]', name);
    formData.append('sender[email]', email);
    formData.append('sender[phone]', phone);
    formData.append('board', board);
    formData.append('method', method);
    formData.append('description', description);

    formData.append('location[lat]', lat);
    formData.append('location[lng]', lng);
    formData.append('ward', ward);
    formData.append('district', district);
    formData.append('addr', addr);

    // Assuming 'images' is a FileList or an array of File objects
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    const response = await axios({
      method: 'POST',
      url: serverURL + '/api/v2/reports',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success === true) {
      var data = response.data.data.report;
      console.log(response.data.data);

      var list_rp = JSON.parse(localStorage.getItem('Report_Ads_Management')) || [];
      var report = {
        _id: data._id,
        location: data.location,
        createdAt: data.createdAt,
        method: data.method.reportMethod,
        sender: data.sender,
        board: data.board,
        addr: data.addr,
      };
      console.log(report);
      list_rp.push(report);
      localStorage.setItem('Report_Ads_Management', JSON.stringify(list_rp));
      // alert("Báo cáo đã được gửi thành công");
      document.querySelector('.modal-title').innerHTML =
        '<img src= "/static/img/icon/icons8-tick.svg" style="height:30px">Báo cáo đã được gửi thành công';
      document.querySelector('.modal-body p').innerHTML =
        'Rất vui vì nhận được báo cáo của bạn.<br> Chúng tôi sẽ xem xét và xử lý báo cáo của bạn trong thời gian sớm nhất. Xin cảm ơn!';
      document.querySelector('#return-btn').style.display = 'block';
      $('#report-modal').modal('show');
    }
  } catch (err) {
    document.querySelector('.modal-title').innerHTML = '<i class="bi bi-ban"></i> Không thể nộp báo cáo';
    document.querySelector('.modal-body p').innerHTML = 'Vui lòng kiểm tra lại các thông tin trong báo cáo';
    $('#report-modal').modal('show');
    console.log(err.response);
  }
};

//get method from database
const getMethod = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: serverURL + '/api/v2/reportMethods',
    });
    if (res.data.success === true) {
      const methods = res.data.data.methods;
      const html = methods
        .map((method) => {
          return `<option value="${method._id}">${method.reportMethod}</option>`;
        })
        .join('');
      document.querySelector('#method').innerHTML = html;
    }
  } catch (err) {
    console.log(err);
  }
};

//check report method
const checkMethod = function () {
  const m = document.querySelector('#method').value;
  const warn = 'Vui lòng chọn hình thức báo cáo';

  if (m === '0') {
    document.querySelector('#method').classList.add('is-invalid');
    document.querySelector('#requiredMethod').innerHTML = warn;
    document.querySelector('#reportForm').addEventListener('submit', (event) => {
      event.preventDefault();
    });
  } else {
    document.querySelector('#method').classList.remove('is-invalid');
    document.querySelector('#requiredMethod').innerHTML = 'Hình thức báo cáo';
    return true;
  }
  return false;
};

//checkName
const checkName = function () {
  const n = document.querySelector('#txtName').value;
  const warn = 'Vui lòng nhập tên';
  const warnEmpty = 'Vui lòng không bỏ trống tên';

  if (n.length === 0) {
    document.querySelector('#txtName').classList.add('is-invalid');
    document.querySelector('#requiredName').innerHTML = warnEmpty;
  } else if (!n.match(/^[a-zA-Z\s]+$/)) {
    document.querySelector('#txtName').classList.add('is-invalid');
    document.querySelector('#requiredName').innerHTML = warn;
    document.querySelector('#reportForm').addEventListener('submit', (event) => {
      event.preventDefault();
    });
  } else {
    document.querySelector('#txtName').classList.remove('is-invalid');
    document.querySelector('#requiredName').innerHTML = 'Họ và tên';
    return true;
  }
  return false;
};

//check email format
const checkEmail = function () {
  const e = document.querySelector('#txtEmail').value;
  const warn = 'Vui lòng điền đúng định dạng email';
  const warnEmpty = 'Vui lòng không bỏ trống email';

  if (e.length === 0) {
    document.querySelector('#txtEmail').classList.add('is-invalid');
    document.querySelector('#requiredEmail').innerHTML = warnEmpty;
  } else if (!e.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    document.querySelector('#txtEmail').classList.add('is-invalid');
    document.querySelector('#requiredEmail').innerHTML = warn;
    document.querySelector('#reportForm').addEventListener('submit', (event) => {
      event.preventDefault();
    });
  } else {
    document.querySelector('#txtEmail').classList.remove('is-invalid');
    document.querySelector('#requiredEmail').innerHTML = 'Email';
    return true;
  }
  return false;
};

//check phone number format
const checkPhone = function () {
  const p = document.querySelector('#txtPhone').value;
  const warn = 'Vui lòng nhập đúng số điện thoại';
  const warnEmpty = 'Vui lòng không bỏ trống số điện thoại';

  if (p.length === 0) {
    document.querySelector('#txtPhone').classList.add('is-invalid');
    document.querySelector('#requiredPhone').innerHTML = warnEmpty;
  } else if (!p.match(/^[0-9]{10,11}$/)) {
    document.querySelector('#txtPhone').classList.add('is-invalid');
    document.querySelector('#requiredPhone').innerHTML = warn;
    document.querySelector('#reportForm').addEventListener('submit', (event) => {
      event.preventDefault();
    });
  } else {
    document.querySelector('#txtPhone').classList.remove('is-invalid');
    document.querySelector('#requiredPhone').innerHTML = 'Điện thoại liên lạc';
    return true;
  }
  return false;
};

const uploadFile = function () {
  //maximum number of files is 2
  const fileInput = document.getElementById('formFile');
  const warn = 'Vui lòng chọn tối đa 2 file';
  const warnEmpty = 'Vui lòng không bỏ trống file';

  if (fileInput.files.length === 0) {
    document.querySelector('#formFile').classList.add('is-invalid');
    document.querySelector('#requiredFile').innerHTML = warnEmpty;
  } else if (fileInput.files.length > 2) {
    document.querySelector('#formFile').classList.add('is-invalid');
    document.querySelector('#requiredFile').innerHTML = warn;
    //disable submit button
    document.querySelector('#submit').classList.add('disabled');
  } else {
    document.querySelector('#submit').classList.remove('disabled');
    document.querySelector('#formFile').classList.remove('is-invalid');
    document.querySelector('#requiredFile').innerHTML = 'Hình ảnh minh hoạ';
    return true;
  }
  return false;
};

tinymce.init({
  selector: '#editor',
  statusbar: false,
});

//check if content in editor is empty
const checkContent = function () {
  const c = tinymce.get('editor').getContent();
  const warnEmpty = 'Vui lòng không bỏ trống nội dung báo cáo';

  if (c.length === 0) {
    document.querySelector('#editor').classList.add('is-invalid');
    document.querySelector('#requiredContent').innerHTML = warnEmpty;
    // document
    //   .querySelector("#reportForm")
    //   .addEventListener("submit", (event) => {
    //     event.preventDefault();
    //   });
    return false;
  } else {
    document.querySelector('#requiredContent').innerHTML = 'Nội dung báo cáo';
    return true;
  }
};

//check if all fields are valid
document.querySelector('#method').addEventListener('focusout', checkMethod);
document.querySelector('#txtName').addEventListener('focusout', checkName);
document.querySelector('#txtEmail').addEventListener('focusout', checkEmail);
document.querySelector('#txtPhone').addEventListener('focusout', checkPhone);
document.querySelector('#formFile').addEventListener('change', uploadFile);
document.querySelector('#editor').addEventListener('focusout', checkContent);

document.querySelector('#reportForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#txtName').value;
  const email = document.querySelector('#txtEmail').value;
  const phone = document.querySelector('#txtPhone').value;

  const urlParams = new URLSearchParams(window.location.search);
  const board = urlParams.get('id');

  const lat = urlParams.get('lat');
  const lng = urlParams.get('lng');
  const addr = urlParams.get('addr');

  var ward = null;
  var district = null;

  if (addr != null) {
    var detailAddress = addr.split(', ');

    var ward;
    var district;
    if (detailAddress.length < 4) {
      ward = '';
    } else {
      ward = detailAddress[detailAddress.length - 4];
    }
    district = detailAddress[detailAddress.length - 3];

    if (district == 'Quận 2' || district == 'Quận 9') {
      district = 'Thủ Đức';
    }
  }

  console.log('board: ', board);
  const method = document.querySelector('#method').value;
  const images = document.querySelector('#formFile').files;
  const description = tinymce.get('editor').getContent();

  console.log(name, email, phone, board, method, images, description);
  upReports(name, email, phone, board, method, images, description, lat, lng, ward, district, addr);
});

getMethod();

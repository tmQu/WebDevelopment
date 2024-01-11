const upReports = async (name, email, phone, board, method, image, description) => {
  try {
    const response = await axios({
      method: "POST",
      url: "http://localhost:4000/api/v1/reports",
      data: {
        sender: {
          fullname: name,
          email: email,
          phone: phone
        },
        board,
        method,
        image,
        description
      },
    });
    console.log(response.data);
    if (response.data.success === true) {
      alert("Báo cáo đã được gửi thành công");
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

//get method from database
const getMethod = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:4000/api/v1/reportMethods",
    });
    if (res.data.success === true) {
      const methods = res.data.data.methods;
      const html = methods.map((method) => {
        return `<option value="${method._id}">${method.reportMethod}</option>`;
      }).join("");
      document.querySelector("#method").innerHTML = html;
    }
  }
  catch (err) {
    console.log(err);
  }
}

// Quill
//customize toolbar

var toolbarOptions = [
  //text style
  ["bold", "italic", "underline"], // toggled buttons
  //header for text
  [{ header: [1, 2, 3, 4, false] }], // custom button values
  //bullet points style
  [{ list: "ordered" }, { list: "bullet" }],
  //sub and super script
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
];

//check report method
const checkMethod = function () {
  const m = document.querySelector("#method").value;
  const warn = "Vui lòng chọn hình thức báo cáo";

  if (m === "0") {
    document.querySelector("#method").classList.add("is-invalid");
    document.querySelector("#requiredMethod").innerHTML = warn;
    document
      .querySelector("#reportForm")
      .addEventListener("submit", (event) => {
        event.preventDefault();
      });
  } else {
    document.querySelector("#method").classList.remove("is-invalid");
    document.querySelector("#requiredMethod").innerHTML = "Hình thức báo cáo";
  }
};

//checkName
const checkName = function () {
  const n = document.querySelector("#txtName").value;
  const warn = "Vui lòng nhập tên";
  const warnEmpty = "Vui lòng không bỏ trống tên";

  if (n.length === 0) {
    document.querySelector("#txtName").classList.add("is-invalid");
    document.querySelector("#requiredName").innerHTML = warnEmpty;
  } else if (!n.match(/^[a-zA-Z\s]+$/)) {
    document.querySelector("#txtName").classList.add("is-invalid");
    document.querySelector("#requiredName").innerHTML = warn;
    document
      .querySelector("#reportForm")
      .addEventListener("submit", (event) => {
        event.preventDefault();
      });
  } else {
    document.querySelector("#txtName").classList.remove("is-invalid");
    document.querySelector("#requiredName").innerHTML = "Họ tên người báo cáo";
  }
};

//check email format
const checkEmail = function () {
  const e = document.querySelector("#txtEmail").value;
  const warn = "Vui lòng điền đúng định dạng email";
  const warnEmpty = "Vui lòng không bỏ trống email";

  if (e.length === 0) {
    document.querySelector("#txtEmail").classList.add("is-invalid");
    document.querySelector("#requiredEmail").innerHTML = warnEmpty;
  } else if (!e.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    document.querySelector("#txtEmail").classList.add("is-invalid");
    document.querySelector("#requiredEmail").innerHTML = warn;
    document
      .querySelector("#reportForm")
      .addEventListener("submit", (event) => {
        event.preventDefault();
      });
  } else {
    document.querySelector("#txtEmail").classList.remove("is-invalid");
    document.querySelector("#requiredEmail").innerHTML = "Email";
  }
};

//check phone number format
const checkPhone = function () {
  const p = document.querySelector("#txtPhone").value;
  const warn = "Vui lòng nhập đúng số điện thoại";
  const warnEmpty = "Vui lòng không bỏ trống số điện thoại";

  if (p.length === 0) {
    document.querySelector("#txtPhone").classList.add("is-invalid");
    document.querySelector("#requiredPhone").innerHTML = warnEmpty;
  } else if (!p.match(/^[0-9]{10,11}$/)) {
    document.querySelector("#txtPhone").classList.add("is-invalid");
    document.querySelector("#requiredPhone").innerHTML = warn;
    document
      .querySelector("#reportForm")
      .addEventListener("submit", (event) => {
        event.preventDefault();
      });
  } else {
    document.querySelector("#txtPhone").classList.remove("is-invalid");
    document.querySelector("#requiredPhone").innerHTML = "Điện thoại liên lạc";
  }
};

const uploadFile = function () {
  //maximum number of files is 2
  const fileInput = document.getElementById("formFile");
  const warn = "Vui lòng chọn tối đa 2 file";
  const warnEmpty = "Vui lòng không bỏ trống file";

  if (fileInput.files.length === 0) {
    document.querySelector("#formFile").classList.add("is-invalid");
    document.querySelector("#requiredFile").innerHTML = warnEmpty;
  }
  else if (fileInput.files.length > 2) {
    document.querySelector("#formFile").classList.add("is-invalid");
    document.querySelector("#requiredFile").innerHTML = warn;
    //disable submit button
    document.querySelector("#submit").classList.add("disabled");
  } else {
    document.querySelector("#submit").classList.remove("disabled");
    document.querySelector("#formFile").classList.remove("is-invalid");
    document.querySelector("#requiredFile").innerHTML = "File đính kèm";
  }
};

var quill = new Quill("#editor", {
  modules: {
    toolbar: toolbarOptions,
  },
  theme: "snow",
});

//check if content in editor is empty
const checkContent = function () {
  const c = quill.getText();
  const warnEmpty = "Vui lòng không bỏ trống nội dung báo cáo";

  if (c.length === 1) {
    document.querySelector("#editor").classList.add("is-invalid");
    document.querySelector("#requiredContent").innerHTML = warnEmpty;
    document
      .querySelector("#reportForm")
      .addEventListener("submit", (event) => {
        event.preventDefault();
      });
  } else {
    document.querySelector("#requiredContent").innerHTML = "Nội dung báo cáo";
  }
}

//check if all fields are valid
document.querySelector("#method").addEventListener("focusout", checkMethod);
document.querySelector("#txtName").addEventListener("focusout", checkName);
document.querySelector("#txtEmail").addEventListener("focusout", checkEmail);
document.querySelector("#txtPhone").addEventListener("focusout", checkPhone);
document.querySelector("#formFile").addEventListener("change", uploadFile);
document.querySelector("#editor").addEventListener("focusout", checkContent);

document.querySelector("#reportForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#txtName").value;
  const email = document.querySelector("#txtEmail").value;
  const phone = document.querySelector("#txtPhone").value;

  const urlParams = new URLSearchParams(window.location.search);
  const board = urlParams.get('id');
  
  const method = document.querySelector("#method").value;
  //get the value attribute of option tag
  // const method = document.querySelector("#method").options[
  //   document.querySelector("#method").selectedIndex
  // ].value;
  const image = document.querySelector("#formFile").value;
  const description = quill.getText();

  upReports(name, email, phone, board, method, image, description);
});

$(function() {
  $('[data-toggle="tooltip"]').tooltip()
})

getMethod();
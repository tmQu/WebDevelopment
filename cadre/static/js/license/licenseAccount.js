//check email format
const checkEmail = function () {
const e = document.querySelector("#email").value;
const warn = "Vui lòng điền đúng định dạng email";
const warnEmpty = "Vui lòng không bỏ trống email";

if (e.length === 0) {
    document.querySelector("#email").classList.add("is-invalid");
    document.querySelector("#requiredEmail").innerHTML = warnEmpty;
} else if (!e.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    document.querySelector("#email").classList.add("is-invalid");
    document.querySelector("#requiredEmail").innerHTML = warn;
    document
    .querySelector("#reportForm")
    .addEventListener("submit", (event) => {
        event.preventDefault();
    });
} else {
    document.querySelector("#email").classList.remove("is-invalid");
    document.querySelector("#requiredEmail").innerHTML = "Email";
    return true;
}
return false;
};
  
//check password
const checkPassword = function () {
    const p = document.querySelector("#password").value;
    const warn = "Vui lòng điền đúng mật khẩu";
    const warnEmpty = "Vui lòng không bỏ trống mật khẩu";

    if (p.length === 0) {
        document.querySelector("#password").classList.add("is-invalid");
        document.querySelector("#requiredPassword").innerHTML = warnEmpty;
    }
    else {
        document.querySelector("#password").classList.remove("is-invalid");
        document.querySelector("#requiredPassword").innerHTML = "Mật khẩu";
        return true;
    }
    return false;
}

//check confirm password
const checkConfirmPassword = function () {
    const p = document.querySelector("#password").value;
    const cp = document.querySelector("#passwordConfirm").value;
    const warn = "Mật khẩu không khớp";
    const warnEmpty = "Vui lòng xác nhận mật khẩu";

    if (cp.length === 0) {
        document.querySelector("#passwordConfirm").classList.add("is-invalid");
        document.querySelector("#requiredConfirmPassword").innerHTML = warnEmpty;
    }

    else if (p !== cp) {
        document.querySelector("#passwordConfirm").classList.add("is-invalid");
        document.querySelector("#requiredConfirmPassword").innerHTML = warn;
        document
        .querySelector("#reportForm")
        .addEventListener("submit", (event) => {
            event.preventDefault();
        });
    }
    else {
        document.querySelector("#passwordConfirm").classList.remove("is-invalid");
        document.querySelector("#requiredConfirmPassword").innerHTML = "Xác nhận mật khẩu";
        return true;
    }
return false;
}

//check name
const checkName = function () {
    const name = document.querySelector("#name").value;
    const warn = "Vui lòng điền đúng họ tên";
    const warnEmpty = "Vui lòng không bỏ trống họ tên";

    if (name.length === 0) {
        document.querySelector("#name").classList.add("is-invalid");
        document.querySelector("#requiredName").innerHTML = warnEmpty;
    }
    else {
        document.querySelector("#name").classList.remove("is-invalid");
        document.querySelector("#requiredName").innerHTML = "Họ tên";
        return true;
    }
    return false;
}

//check phone number
const checkPhone = function () {
    const p = document.querySelector("#phoneNumber").value;
    const warn = "Vui lòng nhập đúng số điện thoại";
    const warnEmpty = "Vui lòng không bỏ trống số điện thoại";
  
    if (p.length === 0) {
      document.querySelector("#phoneNumber").classList.add("is-invalid");
      document.querySelector("#requiredPhone").innerHTML = warnEmpty;
    } else if (!p.match(/^[0-9]{10,11}$/) || p[0] !== "0") {
      document.querySelector("#phoneNumber").classList.add("is-invalid");
      document.querySelector("#requiredPhone").innerHTML = warn;
      document
        .querySelector("#reportForm")
        .addEventListener("submit", (event) => {
          event.preventDefault();
        });
    } else {
      document.querySelector("#phoneNumber").classList.remove("is-invalid");
      document.querySelector("#requiredPhone").innerHTML = "Điện thoại";
      return true;
    }
    return false;
  };

  //check DOB
    const checkDOB = function () {
        const dob = document.querySelector("#dateOfBirth").value;
        const warnEmpty = "Vui lòng không bỏ trống ngày sinh";
    
        if (dob.length === 0) {
            document.querySelector("#dateOfBirth").classList.add("is-invalid");
            document.querySelector("#requiredDOB").innerHTML = warnEmpty;
        }
        else {
            document.querySelector("#dateOfBirth").classList.remove("is-invalid");
            document.querySelector("#requiredDOB").innerHTML = "Ngày sinh";
            return true;
        }
        return false;
    }
  
  //check if all fields are valid
document.querySelector("#email").addEventListener("focusout", checkEmail);
document.querySelector("#password").addEventListener("focusout", checkPassword);
document.querySelector("#passwordConfirm").addEventListener("focusout", checkConfirmPassword);
document.querySelector("#name").addEventListener("focusout", checkName);
document.querySelector("#phoneNumber").addEventListener("focusout", checkPhone);
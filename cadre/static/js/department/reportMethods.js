const checkMethod = function () {
    const m = document.querySelector("#reportMethod").value;
    const warn = "Vui lòng nhập phương thức báo cáo";
  
    if (m.length === 0) {
      document.querySelector("#reportMethod").classList.add("is-invalid");
      document.querySelector("#requiredReportMethod").innerHTML = warn;

    } else {
      document.querySelector("#reportMethod").classList.remove("is-invalid");
      document.querySelector("#requiredReportMethod").innerHTML = "Phương thức báo cáo";
    }
  };

  document.querySelector("#reportMethod").addEventListener("focusout", checkMethod);
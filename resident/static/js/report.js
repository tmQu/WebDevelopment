// uploadFile(() => {
//     const reportFile = document.getElementById('formFile');
//     for (let i = 0; i < reportFile.length; i++) {
//         reportFile.append(reportFile[i].name, reportFile[i])
//       }
//     if (files > 2) {
//         alert("Please upload maximum 2 files")
//     }
// })

// Quill
//customize toolbar
var toolbarOptions = [
    //text style
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    //header for text
    [{ header: [1,2,3,4,5,6,false] }],               // custom button values
    //bullet points style
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    //sub and super script
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
]

//check report method
const checkMethod = function() {
    const m = document.querySelector('#method').value;
    const warn = 'Vui lòng chọn hình thức báo cáo';

    if (m === "0") {
        document.querySelector('#method').classList.add('is-invalid');
        document.querySelector('#requiredMethod').innerHTML = warn;
    }

    else {
        document.querySelector('#method').classList.remove('is-invalid');
        document.querySelector('#requiredMethod').innerHTML = 'Hình thức báo cáo';
    }
}

//checkName
const checkName = function() {
    const n = document.querySelector('#name').value;
    const warn = 'Vui lòng nhập tên';
    const warnEmpty = 'Vui lòng không bỏ trống tên';

    if (n.length === 0) {
        document.querySelector('#name').classList.add('is-invalid');
        document.querySelector('#requiredName').innerHTML = warnEmpty;
    }

    else if (!n.match(/^[a-zA-Z\s]+$/)) {
        document.querySelector('#name').classList.add('is-invalid');
        document.querySelector('#requiredName').innerHTML = warn;
    }

    else {
        document.querySelector('#name').classList.remove('is-invalid');
        document.querySelector('#requiredName').innerHTML = 'Họ tên người báo cáo';
    }
}

//check email format
const checkEmail = function() {
    const e = document.querySelector('#email').value;
    const warn = 'Vui lòng điền đúng định dạng email';
    const warnEmpty = 'Vui lòng không bỏ trống email';

    if (e.length === 0) {
        document.querySelector('#email').classList.add('is-invalid');
        document.querySelector('#requiredEmail').innerHTML = warnEmpty;
    }

    else if (!e.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        document.querySelector('#email').classList.add('is-invalid');
        document.querySelector('#requiredEmail').innerHTML = warn;
    }

    else {
        document.querySelector('#email').classList.remove('is-invalid');
        document.querySelector('#requiredEmail').innerHTML = 'Email';
    }
}

//check phone number format
const checkPhone = function() {
    const p = document.querySelector('#phone').value;
    const warn = 'Vui lòng nhập đúng số điện thoại';
    const warnEmpty = 'Vui lòng không bỏ trống số điện thoại';

    if (p.length === 0) {
        document.querySelector('#phone').classList.add('is-invalid');
        document.querySelector('#requiredPhone').innerHTML = warnEmpty;
    }

    else if (!p.match(/^[0-9]{10,11}$/)) {
        document.querySelector('#phone').classList.add('is-invalid');
        document.querySelector('#requiredPhone').innerHTML = warn;
    }

    else {
        document.querySelector('#phone').classList.remove('is-invalid');
        document.querySelector('#requiredPhone').innerHTML = 'Điện thoại liên lạc';
    }
}

const uploadFile = function(files) {
    const reportFile = document.getElementById('formFile');
    for (let i = 0; i < reportFile.length; i++) {
        reportFile.append(reportFile[i].name, reportFile[i])
        }
    if (files > 2) {
        alert("Please upload maximum 2 files")
    }
}

// const handlingSubmit = function() {
//     const reportForm = document.querySelector('#report-form');
//     document.getElementById('report-form').addEventListener('Submit', event => {
//         event.preventDefault();
        
//         const method = document.querySelector('#method').value;
//         const name = document.querySelector('#name').value;
//         const email = document.querySelector('#email').value;
//         const phone = document.querySelector('#phone').value;
//         const content = JSON.stringify(delta);
//         const captcha = document.querySelector('#g-recaptcha').value;

//         document.querySelector('#method').addEventListener('focusout', checkMethod);
//         document.querySelector('#name').addEventListener('focusout', checkName);
//         document.querySelector('#email').addEventListener('focusout', checkEmail);
//         document.querySelector('#phone').addEventListener('focusout', checkPhone);

//         const data = {
//             method: method,
//             name: name,
//             email: email,
//             phone: phone,
//             content: content,
//             captcha: captcha
//         }

//         // fetch('/report', {
//         //     method: 'POST',
//         //     body: JSON.stringify(data),
//         //     headers: {
//         //         'Content-Type': 'application/json',
//         //         'X-CSRFToken': csrftoken,
//         //     }
//         // })
//         // .then(response => response.json())

//         console.log(data);
//     })
// }

function setReport(map) {
    const reportCover = document.getElementById('report');
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(reportCover);
    
    // fileInput.addEventListener("change", event => {
    //     const files = event.target.files;
    //     uploadFile(files);
    // });

    let quill = new Quill('#editor', {
        modules: {
            toolbar: toolbarOptions,
        },
        theme: 'snow'
    })

    //var delta = quill.getContents();

    //document.querySelector('#report-form').addEventListener('submit', handlingSubmit);
}

export default setReport
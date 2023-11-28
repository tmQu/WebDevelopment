// uploadFile(() => {
//     const reportFile = document.getElementById('formFile');
//     for (let i = 0; i < reportFile.length; i++) {
//         reportFile.append(reportFile[i].name, reportFile[i])
//       }
//     if (files > 2) {
//         alert("Please upload maximum 2 files")
//     }
// })

function setReport(map) {
    const reportCover = document.getElementById('report');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(reportCover);
    
    // fileInput.addEventListener("change", event => {
    //     const files = event.target.files;
    //     uploadFile(files);
    // });
}

export default setReport
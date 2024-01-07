const renderReports = (reports) => {
  const reportsList = document.getElementById('reportsList');

  reports.forEach((report) => {
    const reportEl = document.createElement('div');
    reportEl.classList.add('card', 'mb-3');
    reportEl.innerHTML = `
      <tr>
      <td>
        <img src='https://bootdey.com/img/Content/avatar/avatar1.png' alt='' />
        <a href='#' class='user-link'>
          Mila Kunis
        </a>
        <span class='user-subhead'>
          Admin
        </span>
      </td>
      <td>
        ${report.createdAt}
      </td>
      <td class='text-center'>
        <span class='label label-default'>
          Inactive
        </span>
      </td>
      <td>
        <a href='#'>
          mila@kunis.com
        </a>
      </td>
      <td style='width: 20%;'>
        <a href='#' class='table-link'>
          <span class='fa-stack'>
            <i class='fa fa-square fa-stack-2x'></i>
            <i class='fa fa-search-plus fa-stack-1x fa-inverse'></i>
          </span>
        </a>
        <a href='#' class='table-link'>
          <span class='fa-stack'>
            <i class='fa fa-square fa-stack-2x'></i>
            <i class='fa fa-pencil fa-stack-1x fa-inverse'></i>
          </span>
        </a>
        <a href='#' class='table-link danger'>
          <span class='fa-stack'>
            <i class='fa fa-square fa-stack-2x'></i>
            <i class='fa fa-trash-o fa-stack-1x fa-inverse'></i>
          </span>
        </a>
      </td>
    </tr>
    <tr>
    `;
    reportsList.appendChild(reportEl);
  });
}


const fetchReports = async () => {
  try {
    const res = await axios.get('/api/v1/reports');
    console.log(res.data);
    const reports = res.data.data.reports;
    console.log(reports);
    renderReports(reports);
  } catch (err) {
    console.log(err);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  fetchReports();
});

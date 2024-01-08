// Format the date as needed
const formattedDate = (sentTime) => {
  return (result =
    sentTime.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) +
    ' ' +
    sentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }));
};

const renderReports = (reports) => {
  const reportsList = document.querySelector('.reports-list');
  reportsList.innerHTML = '';

  let html = '';
  reports.forEach((report) => {
    html += `
      <tr>
        <td>
          <img src='https://bootdey.com/img/Content/avatar/avatar1.png' alt='' />
          <a href='#' class='user-link'>
            ${report.method}
          </a>
          <span class='user-subhead'>
            Board Location Details 
          </span>
        </td>
        <td>
          ${formattedDate(new Date(report.createdAt))}
        </td>
        <td class='text-center'>
          <span class='label label-default'>
            Inactive
          </span>
        </td>
        <td>
          <div class='d-flex flex-column'>
            <a class='text-bg-danger'>
              UserName
            </a>
            <span class='user-subhead'>
              Email
            </span>
          </div>
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
    reportsList.insertAdjacentHTML('beforeend', html);
  });
};

const fetchReports = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/reports',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Yes');
    const reports = res.data.data.reports;
    console.log(reports);
    renderReports(reports);
  } catch (err) {
    console.log(err);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('Yes');
  fetchReports();
});

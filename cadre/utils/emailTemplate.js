const sendOTPemailHTML = (otp) => {
  return `
<head>
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007BFF;
            color: #ffffff;
            text-align: center;
            padding: 10px 0;
        }
        h2 {
            color: #333;
        }
        p {
            color: #555;
        }
        strong {
            color: #007BFF;
        }
        .footer {
            text-align: center;
            background-color: #f4f4f4;
            padding: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Password Reset</h2>
        </div>
        <p>Your password reset code is: <strong>${otp}</strong></p>
        <p>Please use this code to reset your password on our site. It's valid for 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <div class="footer">
            © 2024 Ads Management Organization. All rights reserved.
        </div>
    </div>
</body>
`;
};

const sendEmailReport = (sender, status, reason, officer) => {
  let statusDetail = '';
  if (status === 'pending') {
    statusDetail = '<span class="badge badge-danger">Chưa xử lý</span>';
  } else if (status === 'inprogress') {
    statusDetail = '<span class="badge badge-warning">Đang xử lý</span>';
  } else {
    statusDetail = '<span class="badge badge-success">Đã xử lý</span>';
  }
  let role = '';
  if (officer === 'districts') role = 'Cán bộ Quận';
  else if (officer === 'wards') role = 'Cán bộ Phường';
  else role = 'Cán bộ Sở';

  return `
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cập nhật tình trạng báo cáo</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #fff;
            }
            .header {
                background-color: #007bff;
                color: #fff;
                text-align: center;
                padding: 10px 0;
            }
            .email-content {
                padding: 20px 0;
            }
            .font-weight-bold {
                font-weight: bold;
            }
            .alert {
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container email-container">
            <div class="header">
                <h2>Cập nhật tình trạng báo cáo</h2>
            </div>
            <div class="email-content">
                <p>Kính gửi ${sender},</p>
                <p>Thân ái chào bạn,</p>
                <p>Chúng tôi muốn thông báo về quyết định xử lý liên quan đến báo cáo của bạn. Sau khi xem xét kỹ lưỡng, chúng tôi đã thực hiện các bước sau để đảm bảo rằng tất cả các vấn đề được nêu trong báo cáo của bạn được xử lý một cách hiệu quả và công bằng:</p>

                <p class="font-weight-bold">Chi tiết cách thức xử lý:</p>
                <p>${reason}</p>

                <p class="font-weight-bold">Tình trạng xử lý:</p>
                <p>
                    ${statusDetail}
                </p>

                <p>Chúng tôi chân thành cảm ơn bạn đã báo cáo vấn đề này. Sự tham gia của bạn là quan trọng đối với chúng tôi và giúp cải thiện môi trường thành phố ngày một tốt hơn.</p>                        

                <p>Trân trọng,</p>
                <p>
                   ${role}  
                </p>
            </div>
        </div>
    </body>
    </html>`;
};

const emailTemplate = { sendOTPemailHTML, sendEmailReport };
export default emailTemplate;

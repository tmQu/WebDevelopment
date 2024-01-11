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

export default sendOTPemailHTML;

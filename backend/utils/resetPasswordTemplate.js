

const passwordResetTemplate = (resetToken) => {

    const resetUrl = `http://localhost:3000/user/reset-password/${resetToken}`;
  
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            text-align: center;
            color: #333;
          }
          .email-header h1 {
            color: #3498db;
          }
          .email-body {
            font-size: 16px;
            color: #555;
            margin: 20px 0;
          }
          .reset-link {
            display: inline-block;
            padding: 12px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #3498db;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .reset-link:hover {
            background-color: #2980b9;
          }
          .email-footer {
            font-size: 14px;
            text-align: center;
            color: #aaa;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="email-body">
            <p>Hi there,</p>
            <p>You requested to reset your password. To do so, please click the link below to reset it:</p>
            <a href="${resetUrl}" class="reset-link">Reset Your Password</a>
          </div>
          <div class="email-footer">
            <p>If you did not request a password reset, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
    `;
  };
  
  module.exports = passwordResetTemplate;
  
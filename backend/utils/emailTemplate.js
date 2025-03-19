module.exports = function generateEmailHTML(name, email, password) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Login Credentials</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
            line-height: 1.6;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            overflow: hidden;
          }
          .header {
            background-color: #4CAF50;
            color: #ffffff;
            text-align: center;
            padding: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 20px;
          }
          .content h3 {
            color: #4CAF50;
            margin-bottom: 10px;
          }
          .content p {
            margin: 10px 0;
          }
          .content ul {
            padding-left: 20px;
          }
          .content ul li {
            margin: 5px 0;
          }
          .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
          }
          .footer a {
            color: #4CAF50;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Welcome to Our Platform</h1>
          </div>
          <div class="content">
            <h3>Hello ${name}</h3>
            <p>We are excited to have you on board. Here are your login credentials:</p>
            <ul>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Password:</strong> ${password}</li>
            </ul>
            <p>Please log in to your account and change your password after your first login.</p>
          </div>
          <div class="footer">
            <p>If you have any questions, please contact us at 
              <a href="mailto:support@yourdomain.com">support@yourdomain.com</a>.
            </p>
            <p>&copy; 2024 Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
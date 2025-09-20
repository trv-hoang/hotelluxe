<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Hotel Luxe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #16a34a;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #16a34a;
            margin-bottom: 10px;
        }
        .content {
            margin-bottom: 30px;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background-color: #16a34a;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .btn:hover {
            background-color: #15803d;
        }
        .token-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #16a34a;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
            text-align: center;
        }
        .warning {
            background-color: #fff3cd;
            color: #856404;
            padding: 15px;
            border: 1px solid #ffeeba;
            border-radius: 4px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏨 Hotel Luxe</div>
            <h1 style="margin: 0; color: #333;">Reset Password</h1>
        </div>

        <div class="content">
            <p>Xin chào,</p>
            
            <p>Chúng tôi nhận được yêu cầu reset mật khẩu cho tài khoản của bạn tại <strong>Hotel Luxe</strong> với email: <strong>{{ $email }}</strong></p>

            <p>Để tạo mật khẩu mới, vui lòng click vào nút bên dưới:</p>

            <div style="text-align: center;">
                <a href="{{ $resetUrl }}" class="btn">Tạo Mật Khẩu Mới</a>
            </div>

            <div class="warning">
                <strong>⚠️ Lưu ý quan trọng:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Link này chỉ có hiệu lực trong <strong>24 giờ</strong></li>
                    <li>Chỉ có thể sử dụng <strong>1 lần duy nhất</strong></li>
                    <li>Nếu bạn không yêu cầu reset password, vui lòng bỏ qua email này</li>
                </ul>
            </div>

            <div class="token-info">
                <p><strong>Hoặc copy link sau vào trình duyệt:</strong></p>
                <p style="word-break: break-all; font-family: monospace; background: #f1f3f4; padding: 10px; border-radius: 4px;">
                    {{ $resetUrl }}
                </p>
            </div>

            <p>Nếu bạn gặp khó khăn, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:support@hotelluxe.com">support@hotelluxe.com</a></p>
        </div>

        <div class="footer">
            <p>Trân trọng,<br><strong>Đội ngũ Hotel Luxe</strong></p>
            <p style="font-size: 12px; margin-top: 20px;">
                © {{ date('Y') }} Hotel Luxe. All rights reserved.<br>
                Email này được gửi tự động, vui lòng không reply.
            </p>
        </div>
    </div>
</body>
</html>
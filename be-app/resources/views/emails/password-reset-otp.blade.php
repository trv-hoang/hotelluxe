<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã xác thực reset password - Hotel Luxe</title>
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
        .otp-container {
            text-align: center;
            margin: 30px 0;
            padding: 25px;
            background: linear-gradient(135deg, #16a34a, #22c55e);
            border-radius: 10px;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: white;
            letter-spacing: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            margin: 10px 0;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            display: inline-block;
        }
        .otp-label {
            color: white;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .warning {
            background-color: #fff3cd;
            color: #856404;
            padding: 15px;
            border: 1px solid #ffeeba;
            border-radius: 4px;
            margin: 20px 0;
        }
        .info-box {
            background-color: #e7f3ff;
            color: #0c5aa6;
            padding: 15px;
            border-left: 4px solid #2196F3;
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
        .highlight {
            background-color: #fff2cc;
            padding: 2px 6px;
            border-radius: 3px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏨 Hotel Luxe</div>
            <h1 style="margin: 0; color: #333;">Mã xác thực reset password</h1>
        </div>

        <div class="content">
            <p>Xin chào,</p>
            
            <p>Chúng tôi nhận được yêu cầu reset mật khẩu cho tài khoản của bạn tại <strong>Hotel Luxe</strong> với email: <strong>{{ $email }}</strong></p>

            <div class="otp-container">
                <div class="otp-label">MÃ XÁC THỰC CỦA BẠN</div>
                <div class="otp-code">{{ $otpCode }}</div>
            </div>

            <div class="info-box">
                <p><strong>📱 Hướng dẫn sử dụng:</strong></p>
                <ol style="margin: 10px 0; padding-left: 20px;">
                    <li>Quay lại trang web Hotel Luxe</li>
                    <li>Nhập mã <span class="highlight">{{ $otpCode }}</span> vào 6 ô xác thực</li>
                    <li>Click "Xác nhận" để tiếp tục</li>
                    <li>Tạo mật khẩu mới cho tài khoản</li>
                </ol>
            </div>

            <div class="warning">
                <strong>⚠️ Lưu ý quan trọng:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Mã OTP có hiệu lực trong <strong>10 phút</strong></li>
                    <li>Chỉ có thể sử dụng <strong>1 lần duy nhất</strong></li>
                    <li>Không chia sẻ mã này với bất kỳ ai</li>
                    <li>Nếu bạn không yêu cầu reset password, vui lòng bỏ qua email này</li>
                </ul>
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
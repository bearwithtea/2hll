<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $firstName = htmlspecialchars($_POST["first_name"]);
    $email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
    $retailer = htmlspecialchars($_POST["retailer"]);

    $recaptchaResponse = $_POST["recaptcha_response"];
    $secretKey = "6LePDsoqAAAAANxlqQbL9Hy8XVFSUs4_uC43v_rY";
    $url = "https://www.google.com/recaptcha/api/siteverify";

    $data = [
        "secret" => $secretKey,
        "response" => $recaptchaResponse,
    ];

    $options = [
        "http" => [
            "header" => "Content-type: application/x-www-form-urlencoded\r\n",
            "method" => "POST",
            "content" => http_build_query($data),
        ],
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    $response = json_decode($result, true);

    if ($response["success"] && $response["score"] >= 1.0) {
        $to = "your-email@example.com";
        $subject = "New Form Submission";
        $message = "First Name: $firstName\nEmail: $email\nRetailer: $retailer";
        $headers = "From: no-reply@example.com";

        if (mail($to, $subject, $message, $headers)) {
            echo "Form submitted successfully!";
        } else {
            echo "There was an error processing your submission.";
        }
    } else {
        echo "reCAPTCHA validation failed. Please try again.";
    }
}
?>

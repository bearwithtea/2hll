import mailchimp from "@mailchimp/mailchimp_marketing";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (req.body.website) {
    return res.status(400).json({ error: "Bot detected" });
  }

  const { email, firstName, orderSource, recaptchaToken } = req.body;

  try {
    // Verify reCAPTCHA token first
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      { method: "POST" },
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    if (
      !process.env.MAILCHIMP_API_KEY ||
      !process.env.MAILCHIMP_SERVER ||
      !process.env.MAILCHIMP_LIST_ID
    ) {
      throw new Error("Missing required environment variables");
    }

    mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_SERVER.trim(),
    });

    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_LIST_ID.trim(),
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          SOURCE: orderSource,
        },
      },
    );

    console.log("Subscription successful:", response.id);
    res.status(200).json({ message: "Successfully subscribed" });
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    res.status(500).json({
      error: error.message,
      code: error.code || "UNKNOWN_ERROR",
    });
  }
}

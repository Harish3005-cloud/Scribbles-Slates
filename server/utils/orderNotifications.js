const safeJsonParse = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const postToWebhook = async (url, payload) => {
  if (!url) return { skipped: true };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await safeJsonParse(response);
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

const notifyOrderStatus = async ({ order, user }) => {
  const payload = {
    orderId: order._id?.toString(),
    status: order.status,
    totalAmount: order.totalAmount,
    customer: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone || order?.shippingAddress?.phone || null,
    },
    updatedAt: new Date().toISOString(),
  };

  const [emailResult, smsResult] = await Promise.all([
    postToWebhook(process.env.ORDER_STATUS_EMAIL_WEBHOOK_URL, payload),
    postToWebhook(process.env.ORDER_STATUS_SMS_WEBHOOK_URL, payload),
  ]);

  if (!process.env.ORDER_STATUS_EMAIL_WEBHOOK_URL && payload.customer.email) {
    console.log(`Email notification fallback: ${payload.customer.email} -> ${payload.status}`);
  }

  if (!process.env.ORDER_STATUS_SMS_WEBHOOK_URL && payload.customer.phone) {
    console.log(`SMS notification fallback: ${payload.customer.phone} -> ${payload.status}`);
  }

  return { emailResult, smsResult };
};

module.exports = { notifyOrderStatus };

import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Webhook endpoint
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    // TODO: Add your webhook processing logic here
    console.log('Received webhook payload:', payload);

    // Send a success response
    res.status(200).json({ message: 'Webhook received successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Optional: Add webhook verification endpoint
router.get('/webhook', (req: Request, res: Response) => {
  // You can implement verification logic here if needed
  res.status(200).send('Webhook endpoint is active');
});

export default router;

import Booking from '../models/booking.model.js';
import Slot from '../models/slot.model.js';
import { verifyRazorpaySignature } from '../services/razorpay.service.js';
import { BadRequestError, NotFoundError } from '../utils/appError.js';
import appResponse from '../utils/appResponse.js';

export async function verifyPayment(req, res, next) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const isPaymentVerified = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isPaymentVerified) {
      throw new BadRequestError('Payment verification failed.');
    }

    const booking = await Booking.findOne({
      razorOrderId: razorpay_order_id,
    });

    if (!booking) {
      throw new NotFoundError('Booking not found for this order.');
    }

    // Check if booking is already confirmed
    if (booking.status === 'confirmed') {
      return appResponse(res, {
        statusCode: 200,
        message: 'Payment already verified.',
        data: { bookingId: booking._id },
      });
    }

    const updatedSlot = await Slot.findOneAndUpdate(
      {
        _id: booking.slot,
        $expr: {
          $gte: [
            { $subtract: ['$totalSeats', '$bookedSeats'] },
            booking.quantity,
          ],
        },
      },
      {
        $inc: { bookedSeats: booking.quantity },
      },
      {
        new: true,
      }
    );

    if (!updatedSlot) {
      booking.status = 'failed';
      await booking.save();

      const currentSlot = await Slot.findById(booking.slot);
      const availableSeats = currentSlot
        ? currentSlot.totalSeats - currentSlot.bookedSeats
        : 0;

      throw new BadRequestError(
        `Only ${availableSeats} seats available. Booking cancelled. Refund will be processed.`
      );
    }

    booking.status = 'confirmed';
    booking.razorPaymentId = razorpay_payment_id;
    await booking.save();

    return appResponse(res, {
      statusCode: 200,
      message: 'Payment verified successfully.',
      data: { bookingId: booking._id },
    });
  } catch (error) {
    next(error);
  }
}

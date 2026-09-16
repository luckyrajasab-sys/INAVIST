import { PaymentService } from "../services/paymentService.js";
import { Booking } from "../models/Booking.js";
import { RewardsService } from "../services/rewardsService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * Validate VPA / UPI ID
 */
export const validateUPI = async (req, res, next) => {
  try {
    const { upiId } = req.body;
    const result = PaymentService.validateUPIId(upiId);
    if (!result.isValid) {
      return sendError(res, result.message, 400, "INVALID_UPI_ID");
    }
    return sendSuccess(res, result, "UPI ID validated.");
  } catch (error) {
    next(error);
  }
};

/**
 * Create UPI Intent & Dynamic QR Code payload
 */
export const createUPIIntent = async (req, res, next) => {
  try {
    const { bookingId = `INV-${Date.now()}`, amount, customerName } = req.body;

    if (!amount || Number(amount) <= 0) {
      return sendError(res, "Valid payment amount is required.", 400);
    }

    const intent = PaymentService.generateUPIIntent({
      bookingId,
      amount: Number(amount),
      customerName
    });

    return sendSuccess(res, intent, "UPI Payment session initialized.");
  } catch (error) {
    next(error);
  }
};

/**
 * Verify UPI Payment Server-Side
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { bookingId, amount, upiId, transactionId } = req.body;

    if (!bookingId || !amount) {
      return sendError(res, "Booking ID and amount are required for verification.", 400);
    }

    const verificationResult = await PaymentService.verifyPayment({
      bookingId,
      amount: Number(amount),
      upiId,
      transactionId
    });

    // Update booking if exists
    const booking = await Booking.findOne({
      $or: [{ bookingId }, { pnr: bookingId }]
    });

    if (booking) {
      booking.paymentDetails = {
        method: "UPI",
        upiId: upiId || "Dynamic QR Scan",
        transactionId: verificationResult.transactionId,
        gatewayRef: verificationResult.bankReferenceNumber,
        status: "VERIFIED",
        paidAt: new Date()
      };
      booking.status = "Confirmed";
      await booking.save();

      // Ensure rewards credited
      try {
        await RewardsService.creditBookingRewards({
          userId: booking.userId,
          bookingId: booking.bookingId,
          amount: booking.amount,
          transportType: booking.type,
          destination: booking.destinationCity
        });
      } catch (err) {
        console.warn("Rewards auto credit warning:", err.message);
      }
    }

    return sendSuccess(res, verificationResult, "Payment verified successfully by backend.");
  } catch (error) {
    next(error);
  }
};

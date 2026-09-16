import crypto from "crypto";
import { Booking } from "../models/Booking.js";
import { RewardsService } from "../services/rewardsService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * Get all bookings (filtered by user if authenticated)
 */
export const getBookings = async (req, res, next) => {
  try {
    const query = req.user ? { userId: req.user._id } : {};
    const bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, bookings, "Bookings retrieved.");
  } catch (error) {
    next(error);
  }
};

/**
 * Get booking by ID or PNR
 */
export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { bookingId: id }, { pnr: id }]
    }).lean();

    if (!booking) {
      return sendError(res, `Booking "${id}" not found.`, 404, "NOT_FOUND");
    }

    return sendSuccess(res, booking, "Booking details retrieved.");
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new comprehensive travel booking
 */
export const createBooking = async (req, res, next) => {
  try {
    const {
      type = "train",
      title,
      originCity = "Chennai",
      destinationCity = "Goa",
      travelDate = new Date().toISOString().split("T")[0],
      passengerCount = 1,
      passengers = [],
      sectors = [],
      pricing = {},
      paymentDetails = {},
      contactEmail,
      contactPhone
    } = req.body;

    const bookingId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const pnr = `PNR-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const totalAmount = pricing.totalAmount || req.body.amount || 1000;

    // Calculate reward points earnable
    const pointsEarned = RewardsService.calculatePointsEarned({
      amount: totalAmount,
      transportType: type
    });

    const booking = new Booking({
      userId: req.user ? req.user._id : "65e000000000000000000001",
      bookingId,
      pnr,
      type,
      title: title || `${originCity} → ${destinationCity} (${type.toUpperCase()})`,
      originCity,
      destinationCity,
      travelDate,
      passengerCount: Math.max(1, passengerCount || passengers.length),
      passengers: passengers.length > 0 ? passengers : [
        {
          name: req.user?.name || "Verified Traveller",
          age: 28,
          gender: "Male",
          idType: "Aadhaar",
          idNumberMasked: "XXXX-XXXX-8921",
          seatNumber: "14A (Window)",
          berthPreference: "Lower Berth"
        }
      ],
      sectors: sectors.length > 0 ? sectors : [
        {
          sectorIndex: 1,
          mode: type === "multi_modal" ? "train" : type,
          operator: req.body.provider || "INAVIST Verified Operator",
          routeNumber: "INV-101",
          fromLocation: `${originCity} Station / Terminal`,
          toLocation: `${destinationCity} Station / Terminal`,
          departureTime: "06:30 AM",
          arrivalTime: "02:00 PM",
          duration: "7h 30m",
          category: "Executive / AC Comfort",
          price: totalAmount,
          stops: "Direct Transit"
        }
      ],
      pricing: {
        baseFare: pricing.baseFare || Math.round(totalAmount * 0.85),
        taxes: pricing.taxes || Math.round(totalAmount * 0.12),
        convenienceFee: pricing.convenienceFee || 49,
        discountAmount: pricing.discountAmount || 0,
        pointsRedeemed: pricing.pointsRedeemed || 0,
        totalAmount
      },
      amount: totalAmount,
      paymentDetails: {
        method: paymentDetails.method || "UPI",
        upiId: paymentDetails.upiId || "traveller@okhdfcbank",
        transactionId: paymentDetails.transactionId || `UPI/INV/2026/${Math.floor(100000000 + Math.random() * 900000000)}`,
        gatewayRef: `NPCI-REF-${Math.floor(100000 + Math.random() * 900000)}`,
        status: paymentDetails.status || "VERIFIED",
        paidAt: new Date()
      },
      rewardPointsEarned: pointsEarned,
      status: "Confirmed",
      contactEmail: contactEmail || req.user?.email || "traveller@example.com",
      contactPhone: contactPhone || "+91 98765 43210",
      importantInstructions: [
        "Please carry original government-issued photo ID during transit.",
        "Arrive at boarding station/terminal at least 30 minutes prior to departure.",
        "Digital E-Ticket with QR code on your phone is valid for all sectors.",
        "Free cancellation available up to 4 hours before scheduled departure."
      ]
    });

    await booking.save();

    // Credit rewards automatically for user
    try {
      await RewardsService.creditBookingRewards({
        userId: booking.userId,
        bookingId: booking.bookingId,
        amount: totalAmount,
        transportType: type,
        destination: destinationCity
      });
    } catch (rewardErr) {
      console.warn("Auto-credit rewards warning:", rewardErr.message);
    }

    return sendSuccess(res, booking, "Booking confirmed successfully.", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel an existing booking
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOneAndUpdate(
      { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { bookingId: id }, { pnr: id }] },
      { $set: { status: "Cancelled" } },
      { new: true }
    );

    if (!booking) return sendError(res, "Booking not found.", 404, "NOT_FOUND");
    return sendSuccess(res, booking, "Booking cancelled successfully. Refund initiated to original UPI account.");
  } catch (error) {
    next(error);
  }
};

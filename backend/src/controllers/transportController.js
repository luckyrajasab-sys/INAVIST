import { searchAvailableTransport } from "../services/externalTransportService.js";
import { Booking } from "../models/Booking.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const searchTransport = async (req, res, next) => {
  try {
    const { origin, destination, mode, from, to, date, passengers = 1 } = req.query;

    const results = await searchAvailableTransport({
      originCity: origin || from || "",
      destinationCity: destination || to || "",
      mode,
      date,
      passengers
    });

    return sendSuccess(res, results, "Transport schedules retrieved.");
  } catch (error) {
    next(error);
  }
};

export const lookupPNR = async (req, res, next) => {
  try {
    const { pnr } = req.params;
    const booking = await Booking.findOne({ pnr }).lean();

    if (booking) {
      return sendSuccess(res, booking, "PNR status retrieved.");
    }

    // Dynamic simulated lookup for demonstration
    const simulatedStatus = {
      pnr,
      provider: "IRCTC / Indian Railways",
      trainNumber: "22436",
      trainName: "Vande Bharat Express",
      from: "New Delhi (NDLS)",
      to: "Varanasi Jn (BSB)",
      journeyDate: "2026-09-20",
      bookingStatus: "CNF (Confirmed)",
      coach: "C4",
      berth: "42 (Window)",
      chartStatus: "Chart Not Prepared (Will prepare 4 hours prior to departure)"
    };

    return sendSuccess(res, simulatedStatus, "PNR status retrieved.");
  } catch (error) {
    next(error);
  }
};

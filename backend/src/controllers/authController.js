import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/User.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { registerSchema, loginSchema, socialLoginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/index.js";
import { sendEmail } from "../services/emailService.js";

export const register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400, "VALIDATION_ERROR");
    }

    const existingUser = await User.findOne({ email: value.email.toLowerCase() });
    if (existingUser) {
      return sendError(res, "An account with this email already exists.", 400, "EMAIL_EXISTS");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(value.password, salt);

    const user = new User({
      name: value.name,
      email: value.email.toLowerCase(),
      passwordHash,
      phone: value.phone || "",
      isForeigner: !!value.isForeigner,
      nationality: value.nationality || (value.isForeigner ? "International" : "Indian"),
      verificationType: value.isForeigner ? "Passport & e-Visa (Registered)" : "Government ID (Registered)",
      isVerified: true,
      homeCity: value.homeCity || (value.isForeigner ? "New York, USA" : "New Delhi, India"),
      travelStyle: value.travelStyle || "Heritage & Nature",
      passportNumber: value.passportNumber || "",
      visaNumber: value.visaNumber || "",
      visaType: value.visaType || "",
      arrivalPort: value.arrivalPort || ""
    });

    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id });
    user.refreshTokens.push(refreshToken);

    await user.save();

    return sendSuccess(res, {
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        isForeigner: user.isForeigner,
        nationality: user.nationality,
        homeCity: user.homeCity,
        travelStyle: user.travelStyle,
        phone: user.phone
      }
    }, "Registration successful! Welcome to YĀTRI.", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400, "VALIDATION_ERROR");
    }

    const user = await User.findOne({ email: value.email.toLowerCase() });
    if (!user) {
      return sendError(res, "Invalid email address or password.", 401, "INVALID_CREDENTIALS");
    }

    const isMatch = await user.comparePassword(value.password);
    if (!isMatch) {
      return sendError(res, "Invalid email address or password.", 401, "INVALID_CREDENTIALS");
    }

    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Limit stored refresh tokens to 5 active sessions
    if (user.refreshTokens.length >= 5) {
      user.refreshTokens.shift();
    }
    user.refreshTokens.push(refreshToken);
    user.lastLogin = new Date();
    await user.save();

    return sendSuccess(res, {
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        isForeigner: user.isForeigner,
        nationality: user.nationality,
        homeCity: user.homeCity,
        travelStyle: user.travelStyle,
        phone: user.phone,
        emergencyContacts: user.emergencyContacts,
        travelPreferences: user.travelPreferences
      }
    }, "Login successful.");
  } catch (error) {
    next(error);
  }
};

export const demoLogin = async (req, res, next) => {
  try {
    let demoUser = await User.findOne({ email: "arjun@yatri.com" });
    if (!demoUser) {
      const passwordHash = await bcrypt.hash("demo123", 10);
      demoUser = await User.create({
        name: "Arjun Verma",
        email: "arjun@yatri.com",
        passwordHash,
        role: "user",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
        isVerified: true,
        verificationType: "Aadhaar / DigiLocker Verified",
        homeCity: "New Delhi, India",
        travelStyle: "Spiritual & Mountain Heritage"
      });
    }

    const accessToken = generateAccessToken({ userId: demoUser._id, role: demoUser.role });
    const refreshToken = generateRefreshToken({ userId: demoUser._id });

    return sendSuccess(res, {
      token: accessToken,
      refreshToken,
      user: {
        id: demoUser._id,
        name: demoUser.name,
        email: demoUser.email,
        avatar: demoUser.avatar,
        role: demoUser.role,
        isVerified: demoUser.isVerified,
        homeCity: demoUser.homeCity,
        travelStyle: demoUser.travelStyle
      }
    }, "Demo Login successful.");
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    let adminUser = await User.findOne({ email: "admin@yatri.com" });
    if (!adminUser) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      adminUser = await User.create({
        name: "YĀTRI Lead Admin",
        email: "admin@yatri.com",
        passwordHash,
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        isVerified: true,
        homeCity: "New Delhi, India"
      });
    }

    const accessToken = generateAccessToken({ userId: adminUser._id, role: adminUser.role });
    const refreshToken = generateRefreshToken({ userId: adminUser._id });

    return sendSuccess(res, {
      token: accessToken,
      refreshToken,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        avatar: adminUser.avatar,
        role: adminUser.role,
        isVerified: adminUser.isVerified
      }
    }, "Admin Login successful.");
  } catch (error) {
    next(error);
  }
};

export const socialLogin = async (req, res, next) => {
  try {
    const { error, value } = socialLoginSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400, "VALIDATION_ERROR");
    }

    let user = await User.findOne({ email: value.email.toLowerCase() });

    if (!user) {
      user = new User({
        name: value.name,
        email: value.email.toLowerCase(),
        authProvider: value.provider,
        avatar: value.avatar || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80",
        isVerified: true,
        verificationType: `Verified via ${value.provider.toUpperCase()}`
      });
    }

    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id });
    user.refreshTokens.push(refreshToken);
    user.lastLogin = new Date();
    await user.save();

    return sendSuccess(res, {
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified
      }
    }, `${value.provider.toUpperCase()} Login successful.`);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return sendError(res, "Refresh token is required.", 400, "TOKEN_REQUIRED");
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded || !decoded.userId) {
      return sendError(res, "Invalid or expired refresh token.", 401, "INVALID_REFRESH_TOKEN");
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.includes(token)) {
      return sendError(res, "Refresh token has been revoked.", 401, "TOKEN_REVOKED");
    }

    const newAccessToken = generateAccessToken({ userId: user._id, role: user.role });
    return sendSuccess(res, { token: newAccessToken }, "Token refreshed successfully.");
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (token && req.user) {
      req.user.refreshTokens = req.user.refreshTokens.filter((t) => t !== token);
      await req.user.save();
    }
    return sendSuccess(res, {}, "Logged out successfully.");
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, { user: req.user }, "User details fetched.");
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) return sendError(res, error.details[0].message, 400, "VALIDATION_ERROR");

    const user = await User.findOne({ email: value.email.toLowerCase() });
    if (!user) {
      // Return success to avoid email enumeration
      return sendSuccess(res, {}, "If an account exists, a password reset link has been dispatched.");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 mins
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "YĀTRI — Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to set a new password (valid for 30 minutes):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      text: `Reset your YĀTRI password here: ${resetUrl}`
    });

    return sendSuccess(res, {}, "If an account exists, a password reset link has been dispatched.");
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) return sendError(res, error.details[0].message, 400, "VALIDATION_ERROR");

    const hashedToken = crypto.createHash("sha256").update(value.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return sendError(res, "Invalid or expired password reset token.", 400, "INVALID_RESET_TOKEN");
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(value.newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.refreshTokens = []; // Revoke previous sessions
    await user.save();

    return sendSuccess(res, {}, "Password has been successfully updated. You may now log in.");
  } catch (error) {
    next(error);
  }
};

// Update Registered Location
export const updateRegisteredLocation = async (req, res, next) => {
  try {
    const { city, state, country, formattedAddress } = req.body;
    const userId = req.user?.id || req.user?._id;

    const locationObj = {
      city: city || "Bengaluru",
      state: state || "Karnataka",
      country: country || "India",
      formattedAddress: formattedAddress || `${city || "Bengaluru"}, ${state || "Karnataka"}, ${country || "India"}`,
      isApproximate: true,
      updatedAt: new Date()
    };

    if (userId) {
      await User.findByIdAndUpdate(userId, { registeredLocation: locationObj });
    }

    return sendSuccess(res, { registeredLocation: locationObj }, "Registered location updated successfully.");
  } catch (error) {
    next(error);
  }
};

// Saved UPI IDs Management
export const getSavedUpiIds = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return sendSuccess(res, { savedUpiIds: [] }, "Fetched saved UPI IDs.");
    }
    const user = await User.findById(userId);
    return sendSuccess(res, { savedUpiIds: user?.savedUpiIds || [] }, "Fetched saved UPI IDs.");
  } catch (error) {
    next(error);
  }
};

export const addSavedUpiId = async (req, res, next) => {
  try {
    const { upiId, bankHandle, isDefault, maskedName } = req.body;
    if (!upiId) return sendError(res, "UPI ID is required.", 400);

    const userId = req.user?.id || req.user?._id;
    const newUpi = {
      upiId,
      bankHandle: bankHandle || upiId.split("@")[1] || "UPI",
      isDefault: !!isDefault,
      maskedName: maskedName || "Verified Account",
      addedAt: new Date()
    };

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        if (isDefault) {
          user.savedUpiIds.forEach((u) => (u.isDefault = false));
        }
        user.savedUpiIds.push(newUpi);
        await user.save();
      }
    }

    return sendSuccess(res, { newUpi }, "UPI ID saved successfully.", 201);
  } catch (error) {
    next(error);
  }
};

export const removeSavedUpiId = async (req, res, next) => {
  try {
    const { upiId } = req.params;
    const userId = req.user?.id || req.user?._id;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.savedUpiIds = user.savedUpiIds.filter((u) => u.upiId !== upiId);
        await user.save();
      }
    }
    return sendSuccess(res, {}, "UPI ID removed successfully.");
  } catch (error) {
    next(error);
  }
};

import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Link,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";

import {
  Snowflake,
  Sun,
  Flower2,
  CloudRain,
  Smartphone,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


// ================= SEASON CONFIG ==================
const SEASON_CONFIG = {
  winter: {
    name: "Winter Fest",
    primary: "#4f46e5",
    gradient: "linear-gradient(135deg, #4f46e5, #3730a3)",
    glassTint: "rgba(79, 70, 229, 0.15)",
    icon: Snowflake,
    headline: "Cozy Savings",
  },
  summer: {
    name: "Summer Chill",
    primary: "#f97316",
    gradient: "linear-gradient(135deg, #f97316, #c2410c)",
    glassTint: "rgba(249, 115, 22, 0.15)",
    icon: Sun,
    headline: "Fresh & Cool",
  },
  spring: {
    name: "Spring Bloom",
    primary: "#059669",
    gradient: "linear-gradient(135deg, #059669, #047857)",
    glassTint: "rgba(5, 150, 105, 0.15)",
    icon: Flower2,
    headline: "New Beginnings",
  },
  monsoon: {
    name: "Monsoon Sale",
    primary: "#0891b2",
    gradient: "linear-gradient(135deg, #0891b2, #0e7490)",
    glassTint: "rgba(8, 145, 178, 0.15)",
    icon: CloudRain,
    headline: "Rainy Deals",
  },
};

const getSeason = () => {
  const m = new Date().getMonth();
  if (m === 10 || m === 11 || m === 0) return "winter";
  if (m === 1 || m === 2) return "spring";
  if (m >= 3 && m <= 5) return "summer";
  return "monsoon";
};

export default function LoginForm() {
  const muiTheme = useTheme();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("md"));
  const navigate = useNavigate();

  const seasonKey = getSeason();
  const theme = SEASON_CONFIG[seasonKey];
  const SeasonIcon = theme.icon;

  // ===================== STATE =====================
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Backend URL
  const API_URL = "https://api.sribalajistores.com/auth/login";

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    if (!/^[0-9]{10}$/.test(phone)) {
      Toaster.error("Enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      await axios.post(API_URL, { phone, sendOtp: true });

      setOtpSent(true);
      toast.success("OTP Sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async () => {
  if (!otp) return toast.error("Enter OTP");

  try {
    setLoading(true);
    const res = await axios.post(API_URL, { phone, otp });

    if (res.data.status === 1) {
      const user = res.data.user;

      if (user.role !== "admin") {
        toast.error("Access denied. Admins only.");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Invalid OTP");
  } finally {
    setLoading(false);
  }
};

  // =====================================================
  // ===================== UI ============================
  // =====================================================

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        p: { xs: 0, md: 2 },
      }}
    >
      {/* BACKGROUND VIDEO */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          "&:after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
          },
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src="/assets/fruit-video.mp4" type="video/mp4" />
        </video>
      </Box>

      <Card
        sx={{
          zIndex: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: 1000,
          minHeight: { xs: "100vh", md: 600 },
          borderRadius: { xs: 0, md: "30px" },
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(20px)",
          overflow: { xs: "auto", md: "hidden" },
        }}
      >
        {/* LEFT PANEL */}
        <Box
          sx={{
            flex: { xs: "0 0 auto", md: 1 },
            background: theme.glassTint,
            p: { xs: 4, md: 8 },
            textAlign: { xs: "center", md: "left" },
            position: "relative",
          }}
        >
          <Chip
            icon={<SeasonIcon size={16} color="white" />}
            label={theme.name}
            sx={{
              bgcolor: theme.primary,
              color: "white",
              fontWeight: 700,
              mb: 3,
            }}
          />

          <Typography variant={isDesktop ? "h2" : "h3"} fontWeight={800}>
            SBS<br />
            <span style={{ color: theme.primary }}>Grocery</span>
          </Typography>

          <Typography sx={{ mt: 1, fontWeight: 600 }}>
            {theme.headline}
          </Typography>
        </Box>

        {/* RIGHT PANEL – OTP LOGIN */}
        <Box
          sx={{
            flex: 1.1,
            p: { xs: 4, md: 8 },
            bgcolor: "rgba(255,255,255,0.95)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box
              sx={{ p: 1, borderRadius: "12px", bgcolor: `${theme.primary}20` }}
            >
              <ShoppingBag color={theme.primary} size={24} />
            </Box>
            <Typography variant="h5" fontWeight={700}>
              Login
            </Typography>
          </Box>

          {/* PHONE INPUT */}
          <TextField
            fullWidth
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* OTP INPUT */}
          {otpSent && (
            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ mb: 3 }}
            />
          )}

          {/* SEND OTP / VERIFY OTP */}
          {!otpSent ? (
            <Button
              fullWidth
              variant="contained"
              sx={{
                background: theme.gradient,
                color: "white",
                fontWeight: 700,
                py: 1.8,
                borderRadius: "16px",
              }}
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              endIcon={<ArrowRight size={18} />}
              sx={{
                background: theme.gradient,
                color: "white",
                fontWeight: 700,
                py: 1.8,
                borderRadius: "16px",
              }}
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </Button>
          )}

          {/* RESEND + CHANGE NUMBER */}
          {otpSent && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              <Link
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                }}
              >
                Change Number
              </Link>

              <Link sx={{ cursor: "pointer" }} onClick={handleSendOtp}>
                Resend OTP
              </Link>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
}

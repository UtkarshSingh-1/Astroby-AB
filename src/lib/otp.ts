export const OTP_TTL_MINUTES = 10;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const otpExpiry = () => {
  return new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
};

export const secondsUntilResend = (createdAt: Date) => {
  const elapsed = (Date.now() - createdAt.getTime()) / 1000;
  return Math.max(0, Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - elapsed));
};

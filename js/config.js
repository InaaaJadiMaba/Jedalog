// ===========================
// JedaLog - Konfigurasi Chat AI
// ===========================
// CHAT_ENDPOINT:
//   ""           -> mode lokal (balasan empatik sederhana, tanpa server)
//   "/api/chat"  -> pakai backend di folder /server (AI sungguhan)
window.JEDALOG_CONFIG = {
  CHAT_ENDPOINT: "",
  CHAT_TIMEOUT_MS: 25000,
  MAX_MESSAGE_LENGTH: 1000
};

const os = require("os");

// Function to get the local IP address of the machine
// This function iterates through the network interfaces and returns the first non-internal IPv4 address found.
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
}

module.exports = getLocalIP;

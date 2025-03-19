const generateCertificateNumber = () => {
    return Math.random().toString(36).substr(2,11).toUpperCase(); // e.g., "4FZ92QKPL"
};



module.exports = generateCertificateNumber
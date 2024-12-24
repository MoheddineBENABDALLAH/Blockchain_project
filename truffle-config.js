module.exports = {
  networks: {
    ganache: {
      host: "127.0.0.1", // Adresse de votre serveur RPC local
      port: 7545,        // Port par défaut de Ganache
      network_id: "*",   // Match n'importe quel réseau (ou utilisez 1337 pour être spécifique)
    },
  },
  // Configuration supplémentaire pour le compilateur
  compilers: {
    solc: {
      version: "0.8.19", // Spécifiez la version de Solidity (adaptez si nécessaire)
    },
  },
};

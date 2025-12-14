// cardanoMock.jsx
const cardanoMock = {
    // Mock admin wallet balance
    adminWallet: {
        address: "addr_test1vzvga42k86sunktq2hheypu8vrlzd5pj3prwmg8frc9qy7qeayzsc",
        balance: 1000 // in ADA (mock)
    },

    // Mock contract address
    contractAddress: "addr_test1wrer3rgnvcr2ylz22vwsqsxruyhq06u4e4gpz7fuzcrs0hqj32egf",

    // Mock ledger to track all transactions
    ledger: {
        fines: [],
        taxes: [],
        fares: []
    },

    // Mock transaction for paying fine
    payFine: async (fineDetails) => {
        console.log("Simulating Cardano fine transaction:", fineDetails);
        const txId = "mock_tx_fine_" + Math.floor(Math.random() * 1000000);
        cardanoMock.ledger.fines.push({ ...fineDetails, txId, paid: true });
        return { success: true, txId, contractAddress: cardanoMock.contractAddress, datum: fineDetails };
    },

    // Mock transaction for paying driver tax
    payTax: async (taxDetails) => {
        console.log("Simulating Cardano tax transaction:", taxDetails);
        const txId = "mock_tx_tax_" + Math.floor(Math.random() * 1000000);
        cardanoMock.ledger.taxes.push({ ...taxDetails, txId, paid: true });
        return { success: true, txId, contractAddress: cardanoMock.contractAddress, datum: taxDetails };
    },

    // Mock transaction for paying passenger fare
    payFare: async (fareDetails) => {
        console.log("Simulating Cardano fare transaction:", fareDetails);
        const txId = "mock_tx_fare_" + Math.floor(Math.random() * 1000000);
        cardanoMock.ledger.fares.push({ ...fareDetails, txId, paid: true });
        return { success: true, txId, contractAddress: cardanoMock.contractAddress, datum: fareDetails };
    },

    // Mock retrieving contract state
    getContractState: async () => {
        return {
            fines: cardanoMock.ledger.fines,
            taxes: cardanoMock.ledger.taxes,
            fares: cardanoMock.ledger.fares
        };
    }
};

export default cardanoMock;

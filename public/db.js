let db;
let budgetVersion;

// Opening new database request
const request = indexedDB.open('BudgetDB', budgetVersion || 1);
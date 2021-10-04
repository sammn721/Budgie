let db;
let budgetVersion;

// Opening new database request
const request = indexedDB.open('BudgetDB', budgetVersion);


request.onupgradeneeded = function (e) {
    db = e.target.result;
    if (db.objectStoreNames.length === 0) {
        db.createObjectStore('BudgetStore', { autoIncrement: true });
    }
};

request.onsuccess = function (e) {
    db = e.target.result;

    // Check if online before reading from db
    if (navigator.onLine) {
        checkDatabase();
    }
}

request.onerror = function (e) {
    console.log(`ERROR. ${e.target.errorCode}`)
}

function checkDatabase() {
    // Open txn on BudgetStore object
    let transaction  = db.transaction(['BudgetStore'], 'readwrite');
    // Access BudgetStore object store
    const store = transaction.objectStore('BudgetStore');
    // Get all records from store and set to variable
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then(() => {
                // If successful, open txn on BudgetStore object
                if (res.length !== 0) {
                    transaction = db.transaction(['BudgetStore'], 'readwrite');
                    // Access BudgetStore object
                    const currentStore = transaction.objectStore('BudgetStore');
                    // Clear all items in store
                    currentStore.clear();
                }
            });
        }
    };
}

function saveRecord(record) {
    // Create txn on BudgetStore object with readwrite access
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
    // Access BudgetStore
    const store = transaction.objectStore('BudgetStore');
    // Add record to store with add method
    store.add(record);
}

// Listen for app coming back online
window.addEventListener('online', checkDatabase);
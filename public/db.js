let db;
let budgetVersion;

// Opening new database request
const request = indexedDB.open('BudgetDB', budgetVersion || 1);


request.onupgradeneeded = function (e) {
    db.createObjectStore('BudgetStore', { autoIncrement: true });
};

request.onsuccess = function (e) {
    db = e.target.result;

    // Check if online before reading from db
    if (navigator.onLine) {
        checkDatabase();
    }
}

request.onerror = function (e) {
    console.log(`BORK. ${e.target.errorCode}`)
}

function saveRecord(record) {
    // Create txn on BudgetStore object with readwrite access
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
    // Access BudgetStore
    const store = transaction.objectStore('BudgetStore');
    // Add record to store with add method
    store.add(record);
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
                    // Access BudgetStore object
                    // Clear all items in store
                });
        }
    };
}

// Listen for app coming back online
window.addEventListener('online', checkDatabase);


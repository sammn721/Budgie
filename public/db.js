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
    // Create txn on db with readwrite access
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
    // Access BudgetStore object store
    const store = transaction.objectStore('BudgetStore');
    // Add record to store with add method
    store.add(record);
}

function checkDatabase() {
    // Open txn on BedgetStore db
    // Access BudgetStore object
    // Get all records from store and set to variable

    // If successful:
    getAll.onsuccess = function () {
        // Check for items and bulk add when coming back online
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
                    // If success, open txn on BudgetStore db with readwrite access
                    // Access pending object store
                    // Clear store
                });
        }
    };
}

// Listen for app coming back online
window.addEventListener('online', checkDatabase);


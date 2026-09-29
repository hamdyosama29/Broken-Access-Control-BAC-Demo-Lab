document.addEventListener('DOMContentLoaded', () => {
    // 1. Time the table is displayed before hiding (adjustable for video recording)
    const TABLE_DISPLAY_TIME = 700;

    const dataTableContainer = document.getElementById('dataTableContainer');
    const dataTableBody = document.getElementById('dataTableBody');
    const accessDeniedAlert = document.getElementById('accessDeniedAlert');
    
    // Clean up old cookies from previous lab versions so they don't appear in Burp
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "version=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 2. Set a realistic-looking session cookie. No other cookies.
    document.cookie = "session=s%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGVtbyIsInJvbGUiOiJ1c2VyIiwiY3JlYXRlZCI6MTcyNzYyOTQ1Nn0.7Z2Q23; path=/";

    function startVulnerableDemo() {
        // Step A: Show temporary empty table ("Loading...")
        renderEmptyTable();
        dataTableContainer.style.display = 'block';
        accessDeniedAlert.style.display = 'none';

        // Step B: Send the API request in the background
        // IMPORTANT: The frontend DOES NOT wait for the response to hide the table, 
        // nor does it use the response data in the UI!
        fetch('/api/get-users')
            .then(res => res.json())
            .then(data => {
                // We got the data, but we DO NOT show it!
                // It is only visible in Burp Suite / Network Tab.
            })
            .catch(err => console.error(err));

        // Step C: After TABLE_DISPLAY_TIME, the frontend decides the user is not authorized
        setTimeout(() => {
            // Hide the table
            dataTableContainer.style.display = 'none';
            // Show access denied (403 block)
            accessDeniedAlert.style.display = 'flex';
        }, TABLE_DISPLAY_TIME);
    }

    function renderEmptyTable() {
        dataTableBody.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>Loading...</td>
                <td>Loading...</td>
                <td>Loading...</td>
                <td>Loading...</td>
                <td>Loading...</td>
            `;
            dataTableBody.appendChild(tr);
        }
    }

    // Automatically start the demo on page load
    startVulnerableDemo();
});

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.disable('etag'); // Prevent 304 Not Modified so Burp always shows the 200 OK response

// Simulated database with 15 users
const DUMMY_USERS = [
    { id: 1001, name: "Sarah Ahmed", email: "sarah.ahmed@example.test", role: "Security Manager", department: "Security", hash: "$2b$10$xyz123abc456def789ghi0" },
    { id: 1002, name: "Omar Hassan", email: "omar.hassan@example.test", role: "System Administrator", department: "IT", hash: "$2b$10$abc123xyz456def789ghi1" },
    { id: 1003, name: "Mona Ali", email: "mona.ali@example.test", role: "HR Manager", department: "Human Resources", hash: "$2b$10$def123abc456xyz789ghi2" },
    { id: 1004, name: "Laila Youssef", email: "laila.youssef@example.test", role: "Financial Analyst", department: "Finance", hash: "$2b$10$ghi123def456abc789xyz3" },
    { id: 1005, name: "Khaled Saqr", email: "khaled.saqr@example.test", role: "Lead Engineer", department: "Engineering", hash: "$2b$10$xyz123def456ghi789abc4" },
    { id: 1006, name: "Youssef Mohamed", email: "youssef.mohamed@example.test", role: "Developer", department: "Engineering", hash: "$2b$10$abc123ghi456xyz789def5" },
    { id: 1007, name: "Nour Hassan", email: "nour.hassan@example.test", role: "UX Designer", department: "Product", hash: "$2b$10$def123xyz456abc789ghi6" },
    { id: 1008, name: "Ahmed Mahmoud", email: "ahmed.mahmoud@example.test", role: "QA Engineer", department: "Engineering", hash: "$2b$10$ghi123abc456def789xyz7" },
    { id: 1009, name: "Fatima Ali", email: "fatima.ali@example.test", role: "Product Manager", department: "Product", hash: "$2b$10$xyz123abc456ghi789def8" },
    { id: 1010, name: "Tarek Ibrahim", email: "tarek.ibrahim@example.test", role: "DevOps Engineer", department: "IT", hash: "$2b$10$abc123def456xyz789ghi9" },
    { id: 1011, name: "Salma Nabil", email: "salma.nabil@example.test", role: "Data Scientist", department: "Data", hash: "$2b$10$def123ghi456abc789xyz0" },
    { id: 1012, name: "Hassan Youssef", email: "hassan.youssef@example.test", role: "Marketing Lead", department: "Marketing", hash: "$2b$10$ghi123xyz456def789abc1" },
    { id: 1013, name: "Dina Samir", email: "dina.samir@example.test", role: "Sales Manager", department: "Sales", hash: "$2b$10$xyz123def456abc789ghi2" },
    { id: 1014, name: "Amr Khaled", email: "amr.khaled@example.test", role: "Support Specialist", department: "Customer Support", hash: "$2b$10$abc123ghi456def789xyz3" },
    { id: 1015, name: "Rana Tarek", email: "rana.tarek@example.test", role: "Legal Advisor", department: "Legal", hash: "$2b$10$def123abc456xyz789ghi4" }
];

// Single EXACT endpoint as requested: GET /api/get-users
app.get('/api/get-users', (req, res) => {
    // We check the Referer header to invisibly know which demo is running,
    // so the HTTP request in Burp Suite looks 100% natural without fake cookies.
    const referer = req.headers.referer || '';
    const isFixedVersion = referer.includes('/admin-secure');
    
    // Assume the backend parsed the realistic session cookie and found the user is a normal USER
    const userRole = 'USER';

    if (isFixedVersion) {
        // FIXED VERSION LOGIC
        if (userRole !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                error: "Forbidden"
            });
        }
    } else {
        // VULNERABLE VERSION LOGIC
        // Intentionally missing authorization logic!
        // Returns data to anyone regardless of role
    }

    res.json({
        success: true,
        users: DUMMY_USERS
    });
});

// Clean routes for the frontend pages
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vulnerable.html'));
});

app.get('/admin-secure', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'fixed.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`[+] Web Security Demo Lab is running.`);
    console.log(`[+] Access the lab at: http://localhost:${PORT}`);
});

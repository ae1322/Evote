const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

const candidates = {
    1: "TVK",
    2: "DMK",
    3: "ADMK",
    4: "NTK"
};

let votes = { 1: 0, 2: 0, 3: 0, 4: 0 };
let votedUsers = {};

/* Cast Vote */
app.post("/vote", (req, res) => {
    const { voterID, candidateID } = req.body;

    if (votedUsers[voterID]) {
        return res.json({ success: false, message: "Already voted!" });
    }

    votes[candidateID]++;
    votedUsers[voterID] = true;

    res.json({ success: true, message: "Vote recorded successfully!" });
});

/* Admin Login */
app.post("/admin-login", (req, res) => {
    res.json({
        success:
            req.body.username === ADMIN_USER &&
            req.body.password === ADMIN_PASS
    });
});

/* Results */
app.get("/results", (req, res) => {
    let totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    let result = {};
    let maxVotes = -1;
    let winner = "";

    for (let id in candidates) {
        result[candidates[id]] = {
            votes: votes[id],
            percentage: totalVotes === 0
                ? 0
                : ((votes[id] / totalVotes) * 100).toFixed(2)
        };

        if (votes[id] > maxVotes) {
            maxVotes = votes[id];
            winner = candidates[id];
        }
    }

    res.json({ result, winner, maxVotes });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});


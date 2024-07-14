let clickCount = 0;
let clickValue = 1;
let clicksPerSecond = 0;
let upgradeCost = 10;

// Elements
const clickButton = document.getElementById('click-button');
const clickCountDisplay = document.getElementById('click-count');
const upgradeButton = document.getElementById('upgrade-button');
const upgradeCostDisplay = document.getElementById('upgrade-cost');
const rankingList = document.getElementById('ranking-list');

// Click button event
clickButton.addEventListener('click', () => {
    clickCount += clickValue;
    clickCountDisplay.textContent = clickCount;
    updateUserScore();
});

// Upgrade button event
upgradeButton.addEventListener('click', () => {
    if (clickCount >= upgradeCost) {
        clickCount -= upgradeCost;
        clicksPerSecond += 1;
        upgradeCost = Math.floor(upgradeCost * 1.5);  // Increase the cost exponentially
        clickCountDisplay.textContent = clickCount;
        upgradeCostDisplay.textContent = upgradeCost;
    }
});

// Automatically add clicks per second
setInterval(() => {
    clickCount += clicksPerSecond;
    clickCountDisplay.textContent = clickCount;
    updateUserScore();
}, 1000);

// Fetch and display ranking
function fetchRanking() {
    fetch('/ranking')
        .then(response => response.json())
        .then(ranking => {
            rankingList.innerHTML = '';
            ranking.forEach(player => {
                const li = document.createElement('li');
                li.textContent = `${player.username}: ${player.score}`;
                rankingList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching ranking:', error));
}

// Fetch ranking on load
fetchRanking();

// Function to update user score (to be called on certain events, e.g., clicking or buying upgrades)
function updateUserScore() {
    fetch('/update-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score: clickCount })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Score updated:', data);
        fetchRanking();
    })
    .catch(error => console.error('Error updating score:', error));
}

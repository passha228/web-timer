let timerInterval;
let remainingTime = 0;
let startTime = 0;

async function fetchTimer() {
    const response = await fetch('/api/timer');
    const data = await response.json();
    remainingTime = data.time;
    updateTimerDisplay();
}

async function saveTimer() {
    await fetch('/api/timer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ time: remainingTime })
    });
}

function updateTimerDisplay() {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('timer').textContent = display;
}

function startTimer() {
    if (timerInterval) return;

    startTime = Date.now() - (remainingTime * 1000);
    timerInterval = setInterval(() => {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        remainingTime = currentTime;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    saveTimer();
}

function resetTimer() {
    stopTimer();
    remainingTime = 0;
    updateTimerDisplay();
    saveTimer();
}

document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('stopBtn').addEventListener('click', stopTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);

// Загрузка таймера при загрузке страницы
fetchTimer();

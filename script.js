// Modified JS code using Dart's deterministic Latin Square method for generating duty rosters

// Define the deterministic Latin Square for a 5-week cycle
const baseLatinSquare = [
    [1, 2, 3, 4, 5], // Week 0
    [2, 4, 1, 5, 3], // Week 1
    [3, 5, 4, 2, 1], // Week 2
    [4, 1, 5, 3, 2], // Week 3
    [5, 3, 2, 1, 4]  // Week 4
];

function getMondayAndFridayDates() {
    const currentDate = new Date();
    const today = currentDate.getDay();

    const currentMondayDate = new Date(currentDate);
    currentMondayDate.setDate(currentDate.getDate() - ((today + 6) % 7) + (today === 0 ? 7 : 0));

    const currentFridayDate = new Date(currentDate);
    currentFridayDate.setDate(currentDate.getDate() + ((5 - today + 7) % 7));

    const nextMondayDate = new Date(currentDate);
    nextMondayDate.setDate(currentDate.getDate() + 7 - ((today + 6) % 7) + (today === 0 ? 7 : 0));

    const nextFridayDate = new Date(currentDate);
    nextFridayDate.setDate(currentDate.getDate() + 7 + ((5 - today + 7) % 7));

    const formatDate = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}/${day}`;
    };

    return {
        currentMonday: formatDate(currentMondayDate),
        currentFriday: formatDate(currentFridayDate),
        nextMonday: formatDate(nextMondayDate),
        nextFriday: formatDate(nextFridayDate),
    };
}

function getCurrentDate() {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();
    const xingchi = ["一", "二", "三", "四", "五", "六", "日"];
    return `${year}/${month + 1}/${date} 星期${xingchi[(dayOfWeek + 6) % 7]}`;
}

function generateDutyRoster() {
    const currentDate = new Date();
    // Use January 5, 1970 (Monday) as the reference start date
    const startDate = new Date(1970, 0, 5);
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksSinceStart = Math.floor((currentDate - startDate) / millisecondsPerWeek);

    // Determine the week numbers within the 5-week cycle
    const weekNum = weeksSinceStart % 5;
    const nextWeekNum = (weekNum + 1) % 5;

    // Obtain the duty rosters directly from the predefined Latin Square
    const currentWeekArray = baseLatinSquare[weekNum];
    const nextWeekArray = baseLatinSquare[nextWeekNum];

    const { currentMonday, currentFriday, nextMonday, nextFriday } = getMondayAndFridayDates();

    document.getElementById('currentWeekDates').textContent = `${currentMonday}~${currentFriday}`;
    document.getElementById('nextWeekDates').textContent = `${nextMonday}~${nextFriday}`;

    const currentWeekRow = document.getElementById('currentWeekRow');
    const nextWeekRow = document.getElementById('nextWeekRow');

    // Clear existing cells (assuming the first cell is a header)
    while (currentWeekRow.cells.length > 1) {
        currentWeekRow.deleteCell(1);
    }
    while (nextWeekRow.cells.length > 1) {
        nextWeekRow.deleteCell(1);
    }

    // Determine which day to highlight (only for weekdays, Mon-Fri)
    const day = currentDate.getDay();
    const currentDayIndex = (day >= 1 && day <= 5) ? day - 1 : -1;

    currentWeekArray.forEach((duty, index) => {
        const cell = currentWeekRow.insertCell();
        cell.textContent = duty;
        if (index === currentDayIndex) {
            cell.classList.add('highlight');
        }
    });

    nextWeekArray.forEach((duty) => {
        const cell = nextWeekRow.insertCell();
        cell.textContent = duty;
    });

    document.getElementById('currentDate').textContent = getCurrentDate();

    // Add fade-in animation to the cards
    const currentWeekCard = document.getElementById('currentWeekCard');
    const nextWeekCard = document.getElementById('nextWeekCard');
    currentWeekCard.classList.add('fade-in');
    nextWeekCard.classList.add('fade-in');

    setTimeout(() => {
        currentWeekCard.classList.remove('fade-in');
        nextWeekCard.classList.remove('fade-in');
    }, 500);
}

async function discordAlert() {
    const url = "https://discordapp.com/api/webhooks/1187051179901976626/qU_ChQXtFUd_QtRv3SQ6azT5rhKJ0E8WtYVEyUsuszZ-a6-39YJKPyVaeQDJS_UP_LZ5";
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
        alert("今天是週末，沒有值日生。");
        return;
    }

    const currentWeekRow = document.getElementById('currentWeekRow');
    const dutyNumber = currentWeekRow.cells[dayOfWeek].textContent;

    let memes;
    try {
        const memeResponse = await fetch('https://memes.tw/wtf/api');
        memes = await memeResponse.json();
    } catch (error) {
        console.error('Error fetching memes:', error);
        alert('無法獲取迷因圖片，將發送沒有迷因的消息。');
    }

    let selectedMeme;
    if (memes && memes.length > 0) {
        const totalWeight = memes.reduce((sum, meme) => sum + meme.pageview + meme.total_like_count, 0);
        let randomWeight = Math.random() * totalWeight;

        for (let meme of memes) {
            randomWeight -= (meme.pageview + meme.total_like_count);
            if (randomWeight <= 0) {
                selectedMeme = meme;
                break;
            }
        }
    }

    const message = {
        content: `## 今天是${getCurrentDate()}
### 值日生是第${dutyNumber}排
### 詳情請見[link](https://twtom041.github.io/1588-rand-on-duty-row/)

### 1588值日生機器人 更新為v1.2.1`,
        username: "1588值日生機器人",
        embeds: []
    };

    if (selectedMeme) {
        message.embeds.push({
            title: selectedMeme.title,
            url: selectedMeme.url,
            image: {
                url: selectedMeme.src
            },
            footer: {
                text: `作者: ${selectedMeme.author.name} | 按讚: ${selectedMeme.total_like_count} | 瀏覽: ${selectedMeme.pageview} | 標籤: ${selectedMeme.hashtag}`
            }
        });
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 204 || xhr.status === 200) {
                alert("已成功發送至Discord！");
            } else {
                alert("發送失敗，請稍後再試。");
            }
        }
    };
    xhr.send(JSON.stringify(message));
}

document.addEventListener('DOMContentLoaded', () => {
    generateDutyRoster();

    document.getElementById('regenerateButton').addEventListener('click', () => {
        generateDutyRoster();
    });

    document.getElementById('discordButton').addEventListener('click', discordAlert);

    // Add hover effect to table cells
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        table.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'TD') {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.transition = 'transform 0.3s';
            }
        });
        table.addEventListener('mouseout', (e) => {
            if (e.target.tagName === 'TD') {
                e.target.style.transform = 'scale(1)';
            }
        });
    });

    // Add parallax effect to background
    document.addEventListener('mousemove', (e) => {
        const stars = document.querySelector('.stars');
        if (stars) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            stars.style.transform = `translate(${x * 50}px, ${y * 50}px)`;
        }
    });

    // Easter egg: Konami code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow-bg 5s linear infinite';
    const easterEggSound = new Audio('https://www.myinstants.com/media/sounds/mario-coin.mp3');
    easterEggSound.play();
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// Append required CSS styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes rainbow-bg {
            0% { background-color: red; }
            14% { background-color: orange; }
            28% { background-color: yellow; }
            42% { background-color: green; }
            57% { background-color: blue; }
            71% { background-color: indigo; }
            85% { background-color: violet; }
            100% { background-color: red; }
        }
        .fade-in {
            animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .highlight {
            background-color: yellow; /* Example highlight color */
        }
    </style>
`);


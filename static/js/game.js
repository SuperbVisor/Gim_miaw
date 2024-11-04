const playerCar = document.getElementById("playerCar");
const gameArea = document.getElementById("gameArea");
const gameOverMessage = document.getElementById("gameOverMessage");
const restartButton = document.getElementById("restartButton");
const currentScoreText = document.getElementById("currentScore");
const highScoreText = document.getElementById("highScore");
let enemySpawnInterval = 3000; // waktu dalam milidetik

let carPosition = 125;
let gameOver = false;
let currentScore = 0;
let highScore = 0;


function startGame() {
    setInterval(spawnEnemy, enemySpawnInterval); // Spawn enemy setiap 3 detik
}

document.addEventListener("keydown", function(event) {
    if (!gameOver) {
        if (event.key === "ArrowLeft" && carPosition > 0) {
            carPosition -= 10;
        } else if (event.key === "ArrowRight" && carPosition < 250) {
            carPosition += 10;
        }
        playerCar.style.left = carPosition + "px";
    }
});

document.getElementById('toggleMusicButton').addEventListener('click', function() {
    var music = document.getElementById('backgroundMusic');
    if (music.paused) {
        music.play();
        this.textContent = 'Matikan Musik'; // Ubah teks tombol
    } else {
        music.pause();
        this.textContent = 'Hidupkan Musik'; // Ubah teks tombol
    }
});


function spawnEnemyCar() {
    const enemyCar = document.createElement("div");
    enemyCar.classList.add("enemyCar");
    enemyCar.style.left = `${Math.floor(Math.random() * 250)}px`;
    gameArea.appendChild(enemyCar);

    let enemyPosition = 0;
    const enemyInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(enemyInterval);
            enemyCar.remove();
            return;
        }

        if (enemyPosition > 500) {
            clearInterval(enemyInterval);
            enemyCar.remove();
            currentScore += 1; // Tambah skor saat berhasil melewati mobil musuh
            currentScoreText.textContent = `Skor Saat Ini: ${currentScore}`;
            if (currentScore > highScore) {
                highScore = currentScore; // Perbarui skor tertinggi
                highScoreText.textContent = `Skor Tertinggi: ${highScore}`;
            }
        } else {
            enemyPosition += 5;
            enemyCar.style.top = enemyPosition + "px";

            // Deteksi tabrakan
            if (checkCollision(playerCar, enemyCar)) {
                endGame();
                clearInterval(enemyInterval);
            }
        }
    }, 50);
}

function checkCollision(player, enemy) {
    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    return !(
        playerRect.top > enemyRect.bottom ||
        playerRect.bottom < enemyRect.top ||
        playerRect.right < enemyRect.left ||
        playerRect.left > enemyRect.right
    );
}



function endGame() {
    gameOver = true;
    gameOverMessage.classList.remove("hidden");
}

function resetGame() {
    gameOver = false;
    gameOverMessage.classList.add("hidden");
    carPosition = 125;
    playerCar.style.left = carPosition + "px";

    // Hapus semua mobil musuh
    const enemyCars = document.querySelectorAll(".enemyCar");
    enemyCars.forEach(car => car.remove());

    // Reset skor
    currentScore = 0;
    currentScoreText.textContent = `Skor Saat Ini: ${currentScore}`;
}

restartButton.addEventListener("click", () => {
    resetGame();
});

// Mulai spawn mobil musuh
setInterval(() => {
    if (!gameOver) spawnEnemyCar();
}, 2000);


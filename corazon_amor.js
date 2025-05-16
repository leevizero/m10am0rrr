const SpinningHeart = () => {
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Resolución ajustada
    const bufWidth = 100;
    const bufHeight = 40;
    let t = 0;

    // Paleta de tonos rojos
    const charColors = [
        '#1a0000', '#330000', '#4d0000', '#660000',
        '#800000', '#990000', '#b30000', '#cc0000',
        '#e60000', '#ff3333', '#ff6666', '#ff8080'
    ];

    // Búfer para el estado actual
    const zb = new Array(bufWidth * bufHeight).fill(-Infinity);

    const drawFrame = () => {
        // Limpiar el lienzo
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        // Reiniciar búfer
        zb.fill(-Infinity);
        let maxz = 0;
        const c = Math.cos(t);
        const s = Math.sin(t);
        const sinT6 = Math.sin(t * 6);

        // Calcular puntos del corazón con mayor densidad
        for (let y = -0.5; y <= 0.5; y += 0.01) {
            let r = 0.4 + 0.03 * Math.sin(t * 6 + y * 2);
            for (let x = -0.5; x <= 0.5; x += 0.01) {
                let z = -x * x - Math.pow(1.2 * y - Math.abs(x) * 2 / 3, 2) + r * r;
                if (z < 0) continue;
                z = Math.sqrt(z) / (2 - y);
                for (let tz = -z; tz <= z; tz += z / 6) {
                    let nx = x * c - tz * s;
                    let nz = x * s + tz * c;
                    let p = 1 + nz / 2;
                    // Ajustar mapeo para cubrir más área
                    let vx = Math.round((nx * p + 0.5) * (bufWidth - 10) + 5);
                    let vy = Math.round((-y * p + 0.5) * (bufHeight - 2) + 1);
                    let idx = vx + vy * bufWidth;
                    if (vx >= 0 && vx < bufWidth && vy >= 0 && vy < bufHeight && zb[idx] <= nz) {
                        zb[idx] = nz;
                        if (maxz <= nz) maxz = nz;
                    }
                }
            }
        }

        // Dibujar píxeles con solapamiento
        for (let i = 0; i < bufWidth * bufHeight; i++) {
            const x = i % bufWidth;
            const y = Math.floor(i / bufWidth);
            const charIndex = zb[i] === -Infinity ? 0 : Math.round(zb[i] / maxz * (charColors.length - 1));
            ctx.fillStyle = charIndex === 0 ? '#000' : charColors[charIndex];
            ctx.fillRect(x * 8, y * 15, 9, 16); // Solapar para llenar huecos
        }

        t += 0.03;
        // Limitar a ~30 FPS
        setTimeout(() => requestAnimationFrame(drawFrame), 33);
    };

    // Iniciar la animación
    drawFrame();
};

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', SpinningHeart);

document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('background-audio');
    const title = document.getElementById('h1Texto');
    let isPlaying = false;

    if (!audio || !title) {
        console.error('Elementos no encontrados:', { audio, title });
        return;
    }

    window.toggleAudio = function () {
        if (isPlaying) {
            audio.pause();
            title.textContent = 'feliz cumpleaños mi amor';
        } else {
            audio.play().catch(error => {
                console.error("Error al reproducir el audio:", error);
            });
            title.textContent = 'feliz cumpleaños mi amor';
        }
        isPlaying = !isPlaying;
    };
});


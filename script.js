document.addEventListener('DOMContentLoaded', () => {

    const cols = document.querySelectorAll('.col');

    document.addEventListener('keydown', event => {
        event.preventDefault();
        if (event.code.toLowerCase() === 'space') {
            setRandomColors();
        }
    });

    document.addEventListener('click', event => {
        const type = event.target.dataset.type;
        console.log(type);
        if (type === 'lock') {
            const node = event.target.tagName.toLowerCase() === 'i'
                ? event.target
                : event.target.children[0]
            ;
            node.classList.toggle('fa-lock-open');
            node.classList.toggle('fa-lock');
        } else if (type === 'copy') {
            copyText(event.target.textContent);
        }
    });


    // Генерируем рандомный код цвета
    function generateRandomColor() {
        const hexCodes = '0123456789ABCDEF';
        let color = '';

        for (let i = 0; i < 6; i++) {
            color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
        }

        return '#' + color;
    }

    // Задаем рандомный цвет
    function setRandomColors(isInitial) {
        const colors = isInitial ? getColorsFromHash() : [];
        cols.forEach((col, index) => {

            const isLocked = col.querySelector('i').classList.contains('fa-lock');
            const text = col.querySelector('h3');
            const button = col.querySelector('button');
            const color = isInitial ? colors[index] : generateRandomColor();

            if (isLocked) {
                colors.push(text.textContent);
                return;
            }

            if (!isInitial) {
                colors.push(color);
            }

            text.textContent = color;
            col.style.backgroundColor = color;

            identifyTextShadowColor(text, color);
            identifyTextShadowColor(button, color);
        });
        updateColorsHash(colors);
    }

    // Определяем оттенок цвета
    function identifyTextShadowColor(text, color) {
        const luminance = chroma(color).luminance();
        text.style.color = luminance > 0.5 ? 'black' : 'white';
    }

    // Копируем текст в буфер обмена
    function copyText(text) {
        return  navigator.clipboard.writeText(text);
    }

    // Устанавливаем коды цветов в поисковую строку (hash)
    function updateColorsHash(colors) {
        document.location.hash = colors.map(item => item.substring(1)).join('-');
    }

    // Получаем массив цветов из hash
    function getColorsFromHash() {
        if (document.location.hash.length > 1) {
            return document.location.hash.substring(1).split('-').map(item => '#' + item);
        }
        return [];
    }

    setRandomColors(true);
})
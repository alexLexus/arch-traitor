const scale = 3;
const isGreedEnabled = true;
const greedSize = 100;

const app = {
    box: {
        title:{
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 50,
            paddingBottom: 0,
            fontSize: 16,
        },
        description: {
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 50,
            paddingBottom: 0,
            fontSize: 12,
        },
        draw: (canvas, mouseX, mouseY, box) => {
            redrawCanvas(canvas);
            const ctx = canvas.getContext('2d');

            // Привязка к сетке
            if (isGreedEnabled) {
                mouseX = mouseX - (mouseX % greedSize);
                mouseY = mouseY - (mouseY % greedSize);
            }

            // Сохранение исходных стилей
            const origFillStyle = ctx.fillStyle;
            const origStrokeStyle = ctx.strokeStyle;
            const origFont = ctx.font;
            const origTextAlign = ctx.textAlign;
            

            const width = scale * box.width;
            const height = scale * box.height;
            const radius = box.radius;
            const boxPosX = mouseX - width / 2;
            const boxPosY = mouseY - height / 2;

            // Стиль отрисовки
            ctx.strokeStyle = box.ghostColor.border;
            ctx.fillStyle =  box.ghostColor.background;

            // Границы
            ctx.beginPath();
            ctx.roundRect(boxPosX, boxPosY, width, height, radius);
            ctx.stroke();
            ctx.fill();

            // Внутрення часть
            ctx.beginPath();
            ctx.roundRect(boxPosX, boxPosY, width, height, radius);
            ctx.stroke();

            // Заголовок
            const titlePosX = mouseX - (width - scale * app.box.title.paddingLeft) / 2;
            const titlePosY = mouseY - (height - scale * app.box.title.paddingTop) / 2;
            const titleWidth = width
                - scale * app.box.title.paddingLeft
                - scale * app.box.title.paddingRight;
            const titleFont = scale * app.box.title.fontSize + 'px serif';
            ctx.fillStyle = box.ghostColor.text;
            ctx.font = titleFont;
            ctx.textAlign = 'start';
            ctx.fillText(box.title, titlePosX, titlePosY, titleWidth);

            // Описание
            const descPosX = mouseX - (width - scale * app.box.description.paddingLeft) / 2;
            const descPosY = mouseY - (height
                - scale * app.box.title.paddingTop
                - scale * app.box.description.paddingTop) / 2;
            const descWidth = width
                - scale * app.box.description.paddingLeft
                - scale * app.box.description.paddingRight;
            const descFont = scale * app.box.description.fontSize + 'px serif';
            ctx.font = descFont;
            ctx.textAlign = 'start';
            
            let posX = descPosX;
            let posY = descPosY;
            box.description.forEach((element) => {
                ctx.fillText(element, posX, posY, descWidth);
                posY += app.box.description.paddingTop;
            });
        
            // Возвращение исходных стилей
            ctx.fillStyle = origFillStyle;
            ctx.strokeStyle = origStrokeStyle;
            ctx.font = origFont;
            ctx.textAlign = origTextAlign;
        }
    },
    colorScheme: {
        background: '#000000',
        ghostBorder: '#0000ff',
        ghostBackGround: '#00005a',
        ghostText: '#7777ff',
    }
}

const boxTypes = {
    simple: {
        title: 'Simple box',
        description: [
            'Simple box for example app.',
            'Here test how text display.'
        ],
        width: 150,
        height: 100,
        radius: [7, 7, 7, 7],
        ghostColor: {
            background: app.colorScheme.ghostBackGround,
            border: app.colorScheme.ghostBorder,
            text: app.colorScheme.ghostText,
        } 
    }
}

const redrawCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = app.colorScheme.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const handleCanvasMouseEvent = (e: MouseEvent) => {
    const canvas = <HTMLCanvasElement> e.target;
    const box = boxTypes.simple;
    app.box.draw(canvas, e.offsetX, e.offsetY, box);
}

const root = <HTMLDivElement> document.getElementById('app');
const canvas = <HTMLCanvasElement> document.createElement('canvas');
root.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
redrawCanvas(canvas);

canvas.addEventListener('mouseover', (e) => {
    const canvas = <HTMLCanvasElement> e.target;
    canvas.addEventListener('mousemove', handleCanvasMouseEvent);
});

canvas.addEventListener('mouseout', (e) => {
    const canvas = <HTMLCanvasElement> e.target;
    canvas.removeEventListener('mousemove', handleCanvasMouseEvent);
});
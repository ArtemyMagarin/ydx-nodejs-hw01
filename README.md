![build](https://github.com/ArtemyMagarin/ydx-nodejs-hw01/actions/workflows/action.yml/badge.svg)
![jest coverage](badges/coverage-badge.svg)
![Сделано в рамках домашнего задания в Школе разработки интерфейсов](https://img.shields.io/badge/%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81-%D0%A8%D0%A0%D0%98-ff0000)

Cервис для замены фона у изображений: приложение Node.js, которое позволяет:
 - загрузить в сервис изображения в формате jpeg и png
 - заменять фон у заданного изображения на другой
    - фон является изображением такого же размера
    - при наложении фона должна быть возможность задать цвет, который считаем прозрачным

## API
`POST /upload`  — загрузка изображения (сохраняет его на диск и возвращает идентификатор сохраненного изображения)

`GET /list`  - получить список изображений в формате json (должен содержать их id, размер, дата загрузки)

`GET /image/:id`  — скачать изображение с заданным id

`DELETE /image/:id`  — удалить изображение

`GET /merge?front=<id>&back=<id>&color=145,54,32&threshold=5`  — замена фона у изображения


## Запуск
```bash
npm ci && npm start
```

Если нужен live-reload:
```bash
npm ci && npm run dev
```

## Тестировние

Единичный запуск
```bash
npm run test
```

Автозапуск тестов на изменения
```bash
npm run test:watch
```

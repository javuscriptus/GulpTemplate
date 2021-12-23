// Основной модуль
import gulp from "gulp";
// Импорт путей
import { path } from "./gulp/config/path.js";
// Импорт общих плагинов
import { plugins } from './gulp/config/plugins.js';

// Передаем значения в глобальную область
global.app = {
    isBuild: process.argv.includes('--build'),
    isDev: !process.argv.includes('--build'),
    path: path,
    gulp: gulp,
    plugins: plugins
}

// Импорт задач
import { reset } from './gulp/tasks/reset.js';
import { html } from './gulp/tasks/html.js';
import { server } from './gulp/tasks/server.js';
import { scss } from './gulp/tasks/scss.js';
import { js } from './gulp/tasks/js.js';
import { images } from './gulp/tasks/images.js';
import { svgSprive } from './gulp/tasks/svgSprive.js';
import { otfToTtf, ttfToWoff, fontsStyle } from './gulp/tasks/fonts.js';

// Функция Наблюдатель следит за изменениями в файлах
// В случае изменений - переносит файлы из src в dist
function watcher() {
    gulp.watch(path.watch.html, html)
    gulp.watch(path.watch.scss, scss)
    gulp.watch(path.watch.js, js)
    gulp.watch(path.watch.images, images)

};

// Сборка спрайта будет происходить только при запуске команды "gulp svgSprive" или "npm run svgSprive" в командной строке
export { svgSprive };

// Последовательная обработка шрифтов
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

// Основные задачи | Выполняем паралельно!
const mainTasks = gulp.parallel(fonts, gulp.parallel(html, scss, js, images));

// Построение сценариев выполнения задач в режиме разработчика
// 1) Удаляем папку с результатом (reset)
// 2) Переносим файлы из src в папку dist (mainTasks)
// 3) Паралельно выполняются функции Наблюдатель (watcher) и Сервер (server)
const dev = gulp.series(reset, mainTasks,gulp.parallel(watcher, server));
// Построение сценариев выполнения задач в режиме продакшн
// 1) Удаляем папку с результатом (reset)
// 2) Переносим файлы из src в папку dist (mainTasks)
const build = gulp.series(reset, mainTasks)

// Экспорт сценариев
export { dev };
export { build };

// Выполнение задачи (сценария) по умолчанию
gulp.task('default', dev);

// https://github.com/javuscriptus
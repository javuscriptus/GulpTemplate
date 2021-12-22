// Основной модуль
import gulp from "gulp";
// Импорт путей
import { path } from "./gulp/config/path.js";
// Импорт общих плагинов
import { plugins } from './gulp/config/plugins.js';

// Передаем значения в глобальную область
global.app = {
    path: path,
    gulp: gulp,
    plugins: plugins
}

// Импорт задач
import { copy } from './gulp/tasks/copy.js';
import { reset } from './gulp/tasks/reset.js';
import { html } from './gulp/tasks/html.js';

// Функция Наблюдатель следит за изменениями в файлах
// В случае изменений - переносит файлы из src в dist
function watcher() {
    gulp.watch(path.watch.files, dev)
    gulp.watch(path.watch.html, dev)
    // gulp.watch(path.watch.files, copy)
    // gulp.watch(path.watch.html, html)
}

// Выполняем паралельно функции переноса файлов
const mainTasks = gulp.parallel(copy, html)

// Построение сценариев выполнения задач
// 1) Удаляем папку с результатом (reset)
// 2) Переносим файлы из src в папку dist (mainTasks)
// 3) Запускаем функцию Наблюдатель (watcher)
const dev = gulp.series(reset, mainTasks,watcher) 

// Выполнение задачи (сценария) по умолчанию
gulp.task('default', dev);
// Получаем и Записываем в переменную имя папки проекта
import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./dist`; // Путь к папке с результатом
const srcFolder = `./src`; // Путь к папке с исходниками

// Общий объект path в котором хранится вся информация о путях к тем или иным файлам или папкам
export const path = {
    build: {
        html: `${buildFolder}/`,
        files: `${buildFolder}/files/`,
    },
    src: {
        html: `${srcFolder}/*.html`,
        files: `${srcFolder}/files/**/*.*`, 
    },
    watch: {
        html: `${srcFolder}/**/*.html`,
        files: `${srcFolder}/files/**/*.*`, 
    },
    clean: buildFolder,
    buildFolder: buildFolder,
    srcFolder: srcFolder,
    rootFolder: rootFolder,
}
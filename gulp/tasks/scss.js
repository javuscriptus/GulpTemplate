import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css'; // Сжатие CSS файла
import webpcss from 'gulp-webpcss'; // Вывод WEBP изображений
import autoprefixer from 'gulp-autoprefixer'; // Добавление вендорных префиксов / кросбраузерность
import groupCssMediaQueries from 'gulp-group-css-media-queries' // Автоматическая группировка @медиа запросов

const sass = gulpSass(dartSass);

export const scss = () => {
    // получаем доступ к файлу (style.scss), включаем возможность создания карты исходников
    return app.gulp.src(app.path.src.scss, {
            sourcemaps: true
        })
        // обработка ошибок
        .pipe(app.plugins.plumber(
            // уведомление об ошибке
            app.plugins.notify.onError({
                title: "SCSS",
                message: "Error: <%= error.message %>"
            })
        ))
        // заменяем @img на путь к изображениям img/
        .pipe(app.plugins.replace(/@img\//g, '../img/')) 
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        // Автоматическая группировка @медиа запросов
        .pipe(groupCssMediaQueries())
        .pipe(webpcss(
            {
                // Если браузер поддерживает webp изображения, то на изображение будет добавляться класс .webp
                webpClass: ".webp",
                // Если браузер не поддерживает webp изображения, то на изображение будет добавляться класс .no-webp
                noWebpClass: ".no-webp"
            }
        ))
        .pipe(autoprefixer({
            // Включаем поддержку grid, чтобы свойства обрабатывались автопрефиксором
            grid: true,
            // Колличество версий у браузера (Последние 3 версии)
            overrideBrowserslist: ["last 3 versions"],
            // Включаем возможность каскадировать префиксы, добавляя пробелы, чтобы префиксы выставлялись в линию (для красоты)
            cascade: true
        }))
        // Выгружаем не сжатый дубль файла стилей
        .pipe(app.gulp.dest(app.path.build.css))
        // Осуществляем сжатие стиля
        .pipe(cleanCss())
        // Переименовываем сжатый файл 
        .pipe(rename({
            extname: ".min.css"
        }))
        // Выгружаем файл в папку с резульататом dist/css
        .pipe(app.gulp.dest(app.path.build.css))
        // Обновляем браузер
        .pipe(app.plugins.browsersync.stream());
}
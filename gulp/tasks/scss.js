import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css'; // Сжатие CSS файла
import webpcss from 'gulp-webpcss'; // Вывод WEBP изображений
import autoprefixer from 'gulp-autoprefixer'; // Добавление вендорных префиксов / кросбраузерность
import groupCssMediaQueries from 'gulp-group-css-media-queries' // Автоматическая группировка @медиа запросов

const sass = gulpSass(dartSass);

export const scss = () => {
    // получаем доступ к файлу (scss/style.scss), включаем возможность создания карты исходников (если мы в режиме разработчика)
    return app.gulp.src(app.path.src.scss, {
            sourcemaps: app.isDev
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
        // Проверяем, если это режим продакшн, тогда выполняем действие (groupCssMediaQueries)
        .pipe(
            app.plugins.if(
                app.isBuild,
                // Автоматическая группировка @медиа запросов
                groupCssMediaQueries()
            )

        )
        // Проверяем, если это режим продакшн, тогда выполняем действие (webpcss)
        .pipe(
            app.plugins.if(
                app.isBuild,
                webpcss({
                    // Если браузер поддерживает webp изображения, то на изображение будет добавляться класс .webp
                    webpClass: ".webp",
                    // Если браузер не поддерживает webp изображения, то на изображение будет добавляться класс .no-webp
                    noWebpClass: ".no-webp"
                })
            )
        )
        // Проверяем, если это режим продакшн, тогда выполняем действие (autoprefixer)
        .pipe(
            app.plugins.if(
                app.isBuild,
                autoprefixer({
                    // Включаем поддержку grid, чтобы свойства обрабатывались автопрефиксором
                    grid: true,
                    // Колличество версий у браузера (Последние 3 версии)
                    overrideBrowserslist: ["last 3 versions"],
                    // Включаем возможность каскадировать префиксы, добавляя пробелы, чтобы префиксы выставлялись в линию (для красоты)
                    cascade: true
                })
            )
        )
        // Выгружаем не сжатый дубль файла стилей
        .pipe(app.gulp.dest(app.path.build.css))
        // Проверяем, если это режим продакшн, тогда выполняем действие (cleanCss)
        .pipe(
            app.plugins.if(
                app.isBuild,
                // Осуществляем сжатие стиля
                cleanCss()
            )
        )
        // Переименовываем сжатый файл 
        .pipe(rename({
            extname: ".min.css"
        }))
        // Выгружаем файл в папку с резульататом dist/css
        .pipe(app.gulp.dest(app.path.build.css))
        // Обновляем браузер
        .pipe(app.plugins.browsersync.stream());
}

// https://github.com/javuscriptus
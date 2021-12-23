import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin'

export const images = () => {
    // Получаем доступ к файлам в папке src/img
    return app.gulp.src(app.path.src.images)
        // Обработка ошибок
        .pipe(app.plugins.plumber(
            // Уведомление об ошибке
            app.plugins.notify.onError({
                title: "IMAGES",
                message: "Error: <%= error.message %>"
            })
        ))
        // Проверяем наличие изображения в папке с результатом (dist)
        .pipe(app.plugins.newer(app.path.build.images))
        // Сжимаем картинки
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            interlaced: true,
            optimizationLevel: 3 // от 0 до 7
        }))
        // Выгружаем файл в папку с резульататом dist/img
        .pipe(app.gulp.dest(app.path.build.images))
        // Проверяем, если это режим продакшн, тогда выполняем действие (webp)
        .pipe(
            app.plugins.if(
                app.isBuild,
                // Создаем из изображения, картинку webp формата
                webp()
            )
        )
        // Проверяем, если это режим продакшн, тогда выполняем действие (выгрузка файла)
        .pipe(
            app.plugins.if(
                app.isBuild,
                // Выгружаем файл в папку с резульататом dist/img
                app.gulp.dest(app.path.build.images)
            )
        )
        // Проверяем, если это режим продакшн, тогда выполняем действие (проверка наличия изображения)
        .pipe(
            app.plugins.if(
                app.isBuild,
                // Проверяем наличие изображения в папке с результатом (dist)
                app.plugins.newer(app.path.build.images)
            )
        )
        // Проверяем, если это режим продакшн, тогда выполняем действие (imagemin)
        .pipe(
            app.plugins.if(
                app.isBuild,
                // Сжимаем картинки webp
                imagemin({
                    progressive: true,
                    svgoPlugins: [{
                        removeViewBox: false
                    }],
                    interlaced: true,
                    optimizationLevel: 3 // от 0 до 7
                })
            )

        )
        // Выгружаем файл в папку с резульататом dist/img
        .pipe(app.gulp.dest(app.path.build.images))
        // Получаем svg изображения в папке с исходниками
        .pipe(app.gulp.src(app.path.src.svg))
        // Выгружаем файл в папку с резульататом dist/img
        .pipe(app.gulp.dest(app.path.build.images))
        // Обновляем браузер
        .pipe(app.plugins.browsersync.stream())
}

// https://github.com/javuscriptus
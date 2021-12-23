import webpack from 'webpack-stream';

export const js = () => {
    // получаем доступ к файлу (js/app.js) и включаем возможность создания карты исходников (если мы в режиме разработчика)
    return app.gulp.src(app.path.src.js, {
            sourcemaps: app.isDev
        })
        // обработка ошибок
        .pipe(app.plugins.plumber(
            // уведомление об ошибке
            app.plugins.notify.onError({
                title: "JS",
                message: "Error: <%= error.message %>"
            })
        ))
        .pipe(webpack({
            // Если мы в режиме продакшена, то 'production', иначе 'development'.
            mode: app.isBuild ? 'production' : 'development',
            output: {
                filename: 'app.min.js'
            }
        }))
        // Выгружаем файл в папку с резульататом dist/js/
        .pipe(app.gulp.dest(app.path.build.js))
        // Обновляем браузер
        .pipe(app.plugins.browsersync.stream())
}

// https://github.com/javuscriptus
import webpack from 'webpack-stream';

export const js = () => {
    // получаем доступ к файлу (app.js) и включаем возможность создания карты исходников
    return app.gulp.src(app.path.src.js, {
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
        .pipe(webpack({
            mode: 'development',
            output: {
                filename: 'app.min.js'
            }
        }))
        // Выгружаем файл в папку с резульататом dist/js
        .pipe(app.gulp.dest(app.path.build.js))
        // Обновляем браузер
        .pipe(app.plugins.browsersync.stream())
}
import svgSprite from 'gulp-svg-sprite';

export const svgSprive = () => {
    // получаем доступ к файлам (в папке svgicons)
    return app.gulp.src(app.path.src.svgicons)
        // обработка ошибок
        .pipe(app.plugins.plumber(
            // уведомление об ошибке
            app.plugins.notify.onError({
                title: "SVG",
                message: "Error: <%= error.message %>"
            })
        ))
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: `../icons/icons.svg`,
                    // Создавать страницу с перечнем иконок
                    example: true
                }
            }
        }))
        // Выгружаем файл в папку с резульататом dist/img/
        .pipe(app.gulp.dest(app.path.build.images))
}

// https://github.com/javuscriptus
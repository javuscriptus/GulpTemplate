import fileInclude from 'gulp-file-include';
import webpHtmlNosvg from 'gulp-webp-html-nosvg';
import versionNumber from 'gulp-version-number';

export const html = () => {
    return app.gulp.src(app.path.src.html)
        // обработка ошибок
        .pipe(app.plugins.plumber(
            // уведомление об ошибке
            app.plugins.notify.onError({
                title: "HTML",
                message: "Error: <%= error.message %>"
            })
        ))
        // везде где используется @@include - происходит сборка в один файл
        .pipe(fileInclude())
        // заменяем @img на путь к картинкам img/
        .pipe(app.plugins.replace(/@img\//g, 'img/'))
        // Проверяем, если это режим продакшн, тогда выполняем действие (webpHtmlNosvg)
        .pipe(
            app.plugins.if(
                app.isBuild,
                webpHtmlNosvg()
            )
        )
        // Проверяем, если это режим продакшн, тогда выполняем действие (versionNumber)
        .pipe(
            app.plugins.if(
                app.isBuild,
                versionNumber({
                    // добавляет к адресу стилей и js файлов текущую дату и время + создается файл version.json где будет хранится этот ключ
                    'value': '%DT%',
                    'append': {
                        'key': '_v',
                        'cover': 0,
                        'to': [
                            'css',
                            'js',
                        ]
                    },
                    'output': {
                        'file': 'gulp/version.json'
                    }
                })
            )
        )
        .pipe(app.gulp.dest(app.path.build.html))
        .pipe(app.plugins.browsersync.stream())
}

// https://github.com/javuscriptus
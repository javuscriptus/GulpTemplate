import fileInclude from 'gulp-file-include';
import webpHtmlNosvg from 'gulp-webp-html-nosvg';
import versionNumber from 'gulp-version-number';


export const html = () => {
    return app.gulp.src(app.path.src.html)
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "HTML",
                message: "Error: <%= error.message %>"
            })
        ))
        .pipe(fileInclude()) // везде где используется @@include - происходит сборка в один файл
        .pipe(app.plugins.replace(/@img\//g, 'img/')) // заменяем @img на путь к картинкам img/
        .pipe(webpHtmlNosvg())
        .pipe(versionNumber({
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
        })) // добавляет к адресу стилей и js файлов текущую дату и время + создается файл version.json где будет хранится этот ключ
        .pipe(app.gulp.dest(app.path.build.html))
}
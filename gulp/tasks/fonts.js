import fs from 'fs'; // работает с файловой системой
import fonter from 'gulp-fonter'; // преобразовывает шрифты из формата otf в ttf и woff
import ttf2woff2 from 'gulp-ttf2woff2'; // создает шрифт woff2 из шрифта ttf

export const otfToTtf = () => {
    // получаем доступ к файлам с форматом otf
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`)
        // обработка ошибок
        .pipe(app.plugins.plumber(
            // уведомление об ошибке
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
            })
        ))
        // Конвертируем в .ttf
        .pipe(fonter({
            formats: ['ttf']
        }))
        // Выгружаем файл в папку с исходниками src/fonts
        .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}

export const ttfToWoff = () => {
    // Ищем файлы с форматом ttf
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`)
        // обработка ошибок
        .pipe(app.plugins.plumber(
            // уведомление об ошибке
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
            })
        ))
        // Конвертируем в .woff
        .pipe(fonter({
            formats: ['woff']
        }))
        // Выгружаем в папку с резульататом dist/fonts
        .pipe(app.gulp.dest(app.path.build.fonts))
        // Ищем файл шрифтов .ttf
        .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
        // Конвертируем в .woff2
        .pipe(ttf2woff2())
        // Выгружаем в папку с резульататом dist/fonts
        .pipe(app.gulp.dest(app.path.build.fonts))
}

export const fontsStyle = () => {
    // Файл стилей подключения шрифтов
    let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
    // Проверяем существует ли файлы шрифтов
    fs.readdir(app.path.build.fonts, (err, fontsFiles) => {
        if (fontsFiles) {
            // Проверяем существует ли файл стилей для подключения шрифтов
            if (!fs.existsSync(fontsFile)) {
                // Если файла нет, создаем его
                fs.writeFile(fontsFile, '', cb);
                let newFileOnly;
                for (var i = 0; i < fontsFiles.length; i++) {
                    // Записываем подключения шрифтов в файл стилей
                    let fontFileName = fontsFiles[i].split('.')[0];
                    if (newFileOnly !== fontFileName) {
                        let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
                        let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
                        if (fontWeight.toLowerCase() === 'thin') {
                            fontWeight = 100;
                        } else if (fontWeight.toLowerCase() === 'extralight') {
                            fontWeight = 200;
                        } else if (fontWeight.toLowerCase() === 'light') {
                            fontWeight = 300;
                        } else if (fontWeight.toLowerCase() === 'medium') {
                            fontWeight = 500;
                        } else if (fontWeight.toLowerCase() === 'semibold') {
                            fontWeight = 600;
                        } else if (fontWeight.toLowerCase() === 'bold') {
                            fontWeight = 700;
                        } else if (fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
                            fontWeight = 800;
                        } else if (fontWeight.toLowerCase() === 'black') {
                            fontWeight = 900;
                        } else {
                            fontWeight = 400;
                        }
                        fs.appendFile(fontsFile,
                            `@font-face {
                                        font-family: ${fontName};
                                        font-display: swap;
                                        src: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");
                                        font-weight: ${fontWeight};
                                        font-style: normal;
                                    } \r\n`, cb);
                        newFileOnly = fontFileName;
                    }
                }
            } else {
                // Если файл есть, выводим сообщение
                console.log("Файл scss/fonts/fonts.scss уже существует. Для обновления файла нужно его удалить!");

            }
            // Добавляем подключение файла стилей в HTML
            // fs.writeFile(`${app.path.srcFolder}/html/fonts.html`, '<link rel="stylesheet" href="css/fonts.min.css">', cb);
        }
    })
    return app.gulp.src(`${app.path.srcFolder}`);
    function cb() { }
};

// https://github.com/javuscriptus
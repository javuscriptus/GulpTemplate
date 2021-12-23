export const server = (done) => {
    app.plugins.browsersync.init({
        // Базовая папка откуда будут запускаться файлы
        server: {
            baseDir: `${app.path.build.html}`
        },
        // убираем сообщения в браузере
        notify: false,
        // порт для локального сервера
        port: 3000,
    })
}

// https://github.com/javuscriptus
import del from "del";

// Удаляет папку с результатом (dist)
export const reset = () => {
    return del(app.path.clean);
}

// https://github.com/javuscriptus
//corta la request con 400 si los datos no cumplen el esquema, antes de llegar al controller y a MongoDB.
export const validate = (schema, source = 'body') => (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
        const message = result.error.issues
            .map((issue) => (issue.path.length ? `${issue.path.join('.')}: ${issue.message}` : issue.message))
            .join('; ');
        const error = new Error(message);
        error.status = 400;
        return next(error);
    }

    // el body queda reemplazado por los datos ya validados (sin campos desconocidos)
    if (source === 'body') {
        req.body = result.data;
    }
    next();
};

let Environment = {
    db: process.env.MONGODB_URL_DEV || 'mongodb://localhost/altv_dev'
};

export {Environment};
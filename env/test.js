let Environment = {
    db: process.env.MONGODB_URL_TEST || 'mongodb://localhost/altv_test'
};

export {Environment};
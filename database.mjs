import mongoose from 'mongoose';
import state from './state.js';

var currentConnection;

export default class ConnectionInfo {
    constructor(
        CallBack,
        CallBackError
    ) {
        const connection = (CallBack, CallBackError) => {
            mongoose.connection
                .on('error', CallBackError ? CallBackError : console.log)
                .on('disconnected', connection)
                .on("close", ()=> console.log('Mongoose connection disconnected'))
                .once('open', CallBack,currentConnection = this);
            return mongoose.connect(state.Environment.db, {
                keepAlive: 1,
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        if (currentConnection === undefined) {
        
            connection(CallBack, CallBackError);

        } else {
            console.log(currentConnection)
        }
        return currentConnection;
    }

    /**
     * Look up a document by the fieldName and fieldValue in a repo by name.
     * @param fieldName String of the field name.
     * @param fieldValue String of the field value.
     * @param repoName ie. "Account"
     * @param callback undefined | document
     */

    fetchData(fieldName, fieldValue, repoName, callback) {
        const repo = mongoose.model(repoName);
        repo.findOne({ where: { [fieldName]: fieldValue } })
            .then(res => {
                return callback(res);
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Async Version
     * Look up a document by the fieldName and fieldValue in a repo by name.
     * @param fieldName String of the field name.
     * @param fieldValue String of the field value.
     * @param repoName ie. "Account"
     */
    async fetchDataAsync(fieldName, fieldValue, repoName) {
        return new Promise((resolve, reject) => {
            const repo = mongoose.model(repoName);

            repo.findOne({ where: { [fieldName]: fieldValue } })
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
        });
    }

    /**
     * Look up document with the highest id in repo
     * @param repoName ie "Account"
     * @param callback undefined | document
     */
    fetchLastId(repoName, callback) {
        const repo = mongoose.model(repoName);
        repo.findOne({order: {id: "DESC"}})
            .then(res => {
                callback(res);
            })
            .catch(err => {
                console.log(err);
                callback(undefined);
            });
    }

    /**
     * Async Version
     * Look up document with the highest id in repo.
     * @param repoName ie "Account"
     */
    async fetchLastIdAsync(repoName) {
        return new Promise((resolve, reject) => {
            const repo = mongoose.model(repoName);
            repo.findOne({order: {id: "DESC"}})
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.log(err);
                    return reject(undefined);
                });
        });
    }

    /**
     *
     * @param fieldName The name of the field.
     * @param fieldValue The value of that field.
     * @param repoName The reponame where to look.
     * @param callback Result is an array or undefined.
     */
    fetchAllByField(fieldName, fieldValue, repoName, callback) {
        const repo = mongoose.model(repoName);

        repo.find({ where: { [fieldName]: fieldValue } })
            .then(res => {
                return callback(res);
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     *
     * @param fieldName The name of the field.
     * @param fieldValue The value of that field.
     * @param repoName The reponame where to look.
     */
    async fetchAllByFieldAsync(fieldName, fieldValue, repoName) {
        return new Promise((resolve, reject) => {
            const repo = mongoose.model(repoName);

            repo.find({ where: { [fieldName]: fieldValue } })
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
        });
    }

    /**
     * Update or Insert a new document.
     * @param document Document pulled down from table.
     * @param repoName The name of the table.
     * @param callback Returns Updated/Inserted document with id or UNDEFINED.
     */
    upsertData(document, repoName, callback) {
        const repo = mongoose.model(repoName);

        repo.save(document)
            .then(res => {
                return callback(res);
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Async Version
     * Update or Insert a new document.
     * @param document Document pulled down from table.
     * @param repoName The name of the table.
     */
    async upsertDataAsync(document, repoName) {
        return new Promise((resolve, reject) => {
            const repo = mongoose.model(repoName);

            repo.save(document)
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
        });
    }

    /**
     * Update or Insert a new document.
     * @param document Document pulled down from table.
     * @param repoName The name of the table.
     * @param callback Returns Updated/Inserted document with id.
     */
    insertData(document, repoName, callback) {
        const repo = mongoose.model(repoName);

        repo.insert(document)
            .then(res => {
                return callback(res);
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Async Version
     * @param document Document pulled down from table.
     * @param repoName The name of the table.
     */
    async insertDataAsync(document, repoName) {
        return new Promise((resolve, reject) => {
            const repo = mongoose.model(repoName);

            repo.insert(document)
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
        });
    }

    /**
     * Update partial data for a document; based on object data based.
     * @param id ID of Document
     * @param partialObjectData Object
     * @param repoName The name of the table.
     * @param callback Result is undefined | object if updated
     */
    updatePartialData(id, partialObjectData, repoName, callback) {
        const repo = mongoose.model(repoName);

        repo.findByIds([id])
            .then(res => {
                if (res.length <= 0) return callback(undefined);
                // Results after this.

                repo.updateOne(id, partialObjectData)
                    .then(res => {
                        return callback(res);
                    })
                    .catch(err => {
                        console.error(err);
                        return callback(undefined);
                    });
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Async Version
     * Update partial data for a document; based on object data based.
     * @param id ID of Document
     * @param partialObjectData Object
     * @param repoName The name of the table.
     */
    async updatePartialDataAsync(id, partialObjectData, repoName) {
        return new Promise((resolve, reject) => {
            const repo = mongoose.model(repoName);

            repo.findByIds([id])
                .then(res => {
                    // Resolve undefined if no documents found
                    if (res.length <= 0) return resolve(undefined);

                    repo.updateOne(id, partialObjectData)
                        .then(res => {
                            return resolve(res);
                        })
                        .catch(err => {
                            console.log(err);
                            return reject(undefined);
                        });
                })
                .catch(err => {
                    console.log(err);
                    return reject(undefined);
                });
        });
    }

    /**
     * Fetch documents by ID or IDs.
     * @param ids
     * @param repoName The name of the table.
     * @param callback Returns undefined | Array<documents>
     */
    fetchByIds(ids, repoName, callback) {
        const repo = mongoose.model(repoName);
        let idRef = ids;

        if (!Array.isArray(ids)) {
            idRef = [ids];
        }

        repo.findByIds(idRef)
            .then(res => {
                if (res.length <= 0) return callback(undefined);
                return callback(res);
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Async Version
     * Fetch documents by ID or IDs.
     * @param ids
     * @param repoName The name of the table.
     */
    async fetchByIdsAsync(ids, repoName) {
        return new Promise((resolve, reject) => {
            const repo = mongoose.model(repoName);
            let idRef = ids;

            if (!Array.isArray(ids)) {
                idRef = [ids];
            }

            repo.findByIds(idRef)
                .then(res => {
                    if (res.length <= 0) return resolve(undefined);
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
        });
    }

    /**
     * Delete documents from the database by ID.
     * @param ids Can be array or single id.
     * @param repoName The name of the table.
     * @param callback
     */
    deleteByIds(ids, repoName, callback) {
        const repo = mongoose.model(repoName);

        let idRef = ids;

        if (!Array.isArray(ids)) {
            idRef = [ids];
        }

        repo.delete(idRef)
            .then(res => {
                return callback(res);
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Async Version
     * Delete documents from the database by ID.
     * @param ids Can be array or single id.
     * @param repoName The name of the table.
     */
    async deleteByIdsAsync(ids, repoName) {
        return new Promise((resolve, reject) => {
            const repo = mongoose.model(repoName);

            let idRef = ids;

            if (!Array.isArray(ids)) {
                idRef = [ids];
            }

            repo.delete(idRef)
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
        });
    }

    /**
     * Fetch all documents by repo name.
     * @param repoName The name of the table.
     * @param callback returns undefined | array of results
     */
    fetchAllData(repoName, callback) {
        const repo = mongoose.model(repoName);
        repo.find()
            .then(res => {
                console.log(res)
                if (res.length <= 0) return callback(undefined);
                return callback(res);
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Fetch all documents by repo name.
     * @param repoName The name of the table.
     */
    async fetchAllDataAsync(repoName) {
        return new Promise((resolve, reject) => {
            const repo = mongoose.model(repoName);

            repo.find()
                .then(res => {
                    if (res.length <= 0) return reject(undefined);
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
        });
    }

    /**
     * Select a table by fieldNames that apply.
     * @param repoName
     * @param fieldNamesArray
     * @param callback Returns undefined | Array of documents
     */
    selectData(repoName, fieldNamesArray, callback) {
        const repo = mongoose.model(repoName);

        let selectionRef = fieldNamesArray;

        if (!Array.isArray(fieldNamesArray)) {
            selectionRef = [selectionRef];
        }

        repo.find({ select: selectionRef })
            .then(res => {
                if (res.length <= 0) return callback(undefined);
                return callback(res);
            })
            .catch(err => {
                console.error(err);
                return callback(undefined);
            });
    }

    /**
     * Async Version
     * Select a table by fieldNames that apply.
     * @param repoName
     * @param fieldNamesArray
     */
    async selectDataAsync(repoName, fieldNamesArray) {
        return new Promise((resolve, reject) => {
            const repo = mongoose.model(repoName);

            let selectionRef = fieldNamesArray;

            if (!Array.isArray(fieldNamesArray)) {
                selectionRef = [selectionRef];
            }

            repo.find({ select: selectionRef })
                .then(res => {
                    if (res.length <= 0) return reject(undefined);
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
        });
    }
}

function requestFileUploadTokenPromise() {
    return new Promise((resolve, reject) => {
        JeeWeb && JeeWeb.requestFileUploadToken((result: any) => {
            if (result && result.result.token) {
                resolve(result.result.token)
            } else {
                reject(new Error("jeeweb token get failed"))
            }
        })
    })
}


export {
    requestFileUploadTokenPromise
}

var url = "http://localhost/api_crud/index.php/"

export const executeConsult = async (id, route) => {
    return new Promise(async function (resolve, reject) {
        var data;
        var consultUrl = url;

        if (id !== null) consultUrl += `${id}`

        consultUrl += `?route=${route}`;

        try {
            const response = await fetch(consultUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                }
            })

            data = response.text()
            const data_json = await data.then(res => {
                return JSON.parse(res);
            })

            if (data_json.status != null) {
                reject(data_json)
            }

            resolve(data_json)

        } catch (error) {
            reject(exceptionCode500)
        }
    })
}

export const executeInsert = async (data, route) => {
    const insertUrl = url + `?route=${route}`;

    return new Promise(async function (resolve, reject) {
        try {
            const data_json = JSON.parse(data);
            const response = await fetch(insertUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(data_json)
            })

            data = response.text()
            const data_response = await data.then(res => {
                return JSON.parse(res);
            })

            if (data_response.status != 200) {
                reject(data_response)
            }

            resolve(data_response)
        } catch (error) {
            reject(exceptionCode500)
        }
    })
}

export const executeDelete = async (id, route) => {
    var data;
    const deleteRoute = url + `${id}?route=${route}`

    return new Promise(async function (resolve, reject) {
        try {
            const response = await fetch(deleteRoute, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });

            data = response.text()
            const data_json = await data.then(res => {
                return JSON.parse(res);
            })

            if (data_json.status != null) {
                reject(data_json)
            }

            resolve(data_json)
        } catch (error) {
            reject(exceptionCode500);
        }
    })
}

export const executeUpdate = async (data, id, route) => {
    const updateUrl = url + `${id}?route=${route}`

    return new Promise(async function (resolve, reject) {
        try {
            const data_json = JSON.parse(data);
            const response = await fetch(updateUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(data_json)
            });

            data = response.text();
            const data_response = await data.then(res => {
                return JSON.parse(res);
            })

            if (data_response.status != 200) {
                reject(data_response)
            }

            resolve(data_response)
        } catch (error) {
            reject(exceptionCode500)
        }
    })
}

export const consultLogin = async (data) => {
    const loginUrl = url + `?route=user_login`

    return new Promise(async function (resolve, reject) {
        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(data)
            });

            data = response.text();
            const data_response = await data.then(res => {
                return JSON.parse(res);
            })

            switch (data_response.status) {
                case 204:
                    resolve(data_response.status);
                    break;
                case 205:
                    resolve(data_response.status);
                    break;
                case 202:
                    reject({ message: 'El usuario no existe' });
                    break;
                case 203:
                    reject({ message: 'Contraseña incorrecta' });
                    break;
                case 206:
                    reject({ message: 'El usuario está deshabilitado' })
                    break;
                case 500:
                    reject({ message: 'Error en el servidor' })
                    break;
            }
        } catch (error) {
            reject(exceptionCode500)
        }
    })
}

const exceptionCode500 = {
    'status': 500,
    'message': 'Error en el servidor'
}
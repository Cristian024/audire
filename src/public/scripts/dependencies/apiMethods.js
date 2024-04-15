var url = "http://localhost/api_crud/index.php/"

export const executeConsult = async (id, route) => {
    var data;
    var consultUrl = url;

    if (id !== null) consultUrl += `${id}`

    consultUrl += `?route=${route}`;

    try {
        const response = await fetch(consultUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })

        if (!response.ok) {
            throw new Error(response.status)
        }

        data = response.text()
        const data_json = await data.then(res => {
            return JSON.parse(res);
        })

        if (data_json.status != null) {
            switch (data.status) {
                case 500:
                    exceptionCode500()
                    break;
            }
            return null;
        }

        return data_json;
    } catch (error) {
        exceptionCode500()
        return null
    }
}

export const executeInsert = async (data, route) => {
    const insertUrl = url + `?route=${route}`;

    try {
        const data_json = JSON.parse(data);
        const response = await fetch(insertUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(data_json)
        })

        if(!response.ok){
            throw new Error(response.statusText)
        }

        data = response.text()
        const data_response = await data.then(res => {
            return JSON.parse(res);
        })

        return data_response;
    } catch (error) {
        return {
            'status': 500,
            'message': `Internal error: ${error.message}`
        };
    }
}

export const executeDelete = async(id, route) =>{
    const deleteRoute = url + `${id}?route=${route}`

    try{
        const response = await fetch(deleteRoute, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });

        if(!response.ok){
            throw new Error(response.statusText);
        };

        const data = response.text()
        const data_response = await data.then(res => {
            return JSON.parse(res);
        });

        return data_response;
    }catch(error){
        return {
            'status': 500,
            'message': `Internal error: ${error.message}`
        };
    }
}
    
export const executeUpdate = async(data, id, route) =>{
    const updateUrl = url + `${id}?route=${route}`

    try {
        const data_json = JSON.parse(data);
        const response = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(data_json)
        });

        if(!response.ok){
            throw new Error(response.statusText);
        }

        data = response.text();
        const data_response = await data.then(res => {
            return JSON.parse(res);
        })

        return data_response;
    } catch (error) {
        return {
            'status': 500,
            'message': `Internal error: ${error.message}`
        };
    }
}

const exceptionCode500 = () => {
    
}
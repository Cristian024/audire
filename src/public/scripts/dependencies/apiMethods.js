var url = "http://localhost/api_crud/index.php/"

export const executeConsult = async (id, route) => {
    var data;

    if (id != null) url += `${id}`

    url += `?route=${route}`;

    try {
        const response = await fetch(url, {
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
                case 400:
                    break;
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
    const data_json = JSON.parse(data)

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: data_json
        })

        if(!response.ok){
            throw new Error(response.status)
        }

        data = response.text()
        const data_response = await data.then(res => {
            return JSON.parse(res);
        })

        return data_response;
    } catch (error) {
        return null;
    }
}

const exceptionCode500 = () => {
    
}
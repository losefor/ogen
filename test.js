const obj = {
    title: "This is the title of",
    tags: ["Tag1", "Tag2", "Tag3"]
}


// const tags = queryStringParameters?.tags
// ? decodeURIComponent(queryStringParameters.tags).split(",")
// : [];



const parseObjIntoScript = (obj) => {
    let data = ``
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            data = data.concat(`window._base.${key}="${obj[key]}";`)
            continue
        }
    }



    return data
}

console.log(parseObjIntoScript(obj));
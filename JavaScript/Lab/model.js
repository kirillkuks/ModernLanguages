const fs = require('fs');

exports.RequestToString = (body, id) => {
    let book = {
        id: id,
        title: body.title,
        author: body.author,
        year: !body.year ? null : body.year
    };

    return JSON.stringify(book);
}

exports.FindBookById = (booksData, id, jsonFormat = true) => {
    datalines = booksData.split('\n');

    for (line of datalines) {
        if (line.length == 0) {
            return null;
        }

        let bookInfoJson = JSON.parse(line);

        if (bookInfoJson.id == id) {
            return jsonFormat ? bookInfoJson : line;
        }
    }

    return null;
}

exports.DeleteBookById = (booksData, id) => {
    let deleted = false;

    newBooksData = booksData
                    .split('\n')
                    .filter((line) => {
                        if (line.length == 0) {
                            return true;
                        }

                        let lineDeleted = JSON.parse(line).id == id;

                        if (lineDeleted) {
                            deleted = true;
                        }

                        return !lineDeleted;
                    })
                    .join('\n');

    return deleted ? newBooksData : null;
}

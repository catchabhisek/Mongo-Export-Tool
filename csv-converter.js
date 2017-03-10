var fs=require('fs');

var csvConverter = {
    convertToCSV: function(objArray) {

        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        var attribute = '';
        for (var index in array[0]) {

            if (typeof(array[0][index]) == "object") {

                if (Array.isArray(array[0][index])) {
                    for (var j = 0; j < array[0][index].length; j++) {
                        if (typeof(array[0][index][j]) == "object") {
                            for (var m in array[0][index][j]) {
                                attribute += String(index + '[' + j + ']' + '.' + m).replace(/\n/g, " ").replace(/,/g, ".");
                                attribute += ',';
                            }
                        } else {
                            attribute += String(index + '.' + j).replace(/\n/g, " ").replace(/,/g, ".");
                            attribute += ',';
                        }
                    }
                } else {
                    for (var l in array[0][index]) {
                        attribute += String(index + '.' + l).replace(/\n/g, " ").replace(/,/g, ".");
                        attribute += ',';
                    }
                }
            } else {
                attribute += String(index).replace(/\n/g, " ").replace(/,/g, ".");
                attribute += ',';
            }
        }
        str += attribute + '\r\n';
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {

                if (typeof(array[i][index]) == "object") {

                    if (Array.isArray(array[i][index])) {
                        for (var j = 0; j < array[i][index].length; j++) {
                            if (typeof(array[i][index][j]) == "object") {
                                for (var m in array[i][index][j]) {
                                    line += String(array[i][index][j][m]).replace(/\n/g, " ").replace(/,/g, ".");
                                    line += ',';
                                }
                            } else {
                                line += String(array[i][index][j]).replace(/\n/g, " ").replace(/,/g, ".");
                                line += ',';
                            }
                        }
                    } else {
                        for (var l in array[i][index]) {
                            line += String(array[i][index][l]).replace(/\n/g, " ").replace(/,/g, ".");
                            line += ',';
                        }
                    }
                } else {
                    line += String(array[i][index]).replace(/\n/g, " ").replace(/,/g, ".");
                    line += ',';
                }
            }
            str += line + '\r\n';
        }
        fs.writeFile("data.csv", str, function(err, data) {
            if (err) {
                console.log(err);
            }
        })
    }
}

module.exports = csvConverter;

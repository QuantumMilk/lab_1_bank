const path = require('path');
const fs = require('fs');
const qs = require('querystring');
const http = require('http');

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "bank",
  password: "admin"
});

connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    } else {
      console.log("Подключение к серверу MySQL успешно установлено");
    }
});

function handlePostRequest(request, response) {
    if (request.method === 'POST') {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            const post = qs.parse(body);
            const sInsert = `INSERT INTO individuals (first_name, last_name, middle_name, passport, inn, snils, drivers_license, additional_documents, notes) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [post['firstName'], post['lastName'], post['middleName'], post['passport'], post['inn'], post['snils'], post['driversLicense'], post['additionalDocuments'], post['notes']];
            
            connection.query(sInsert, values, function(err, results) {
                if (err) console.log(err);
                else console.log('Insert Query:', sInsert);
            });

            response.writeHead(302, { 'Location': '/' });
            response.end();
        });
    }
}

function handleDeleteRequest(request, response) {
    const sDelete = `DELETE FROM individuals ORDER BY id DESC LIMIT 10`;
    connection.query(sDelete, function(err, results) {
        if (err) console.log(err);
    });
    console.log('Delete Query:', sDelete);
    response.writeHead(302, { 'Location': '/' });
    response.end();
}

function renderTableRows(res, callback) {
    connection.query('SHOW COLUMNS FROM individuals', function(err, columns) {
        if (err) {
            console.log(err);
            res.end();
            return;
        }
        let tableRows = '<tr>';
        columns.forEach(column => {
            tableRows += `<th>${column.Field}</th>`;
        });
        tableRows += '</tr>';

        connection.query('SELECT * FROM individuals ORDER BY id DESC', function(err, data) {
            if (err) {
                console.log(err);
                res.end();
                return;
            }
            data.forEach(row => {
                tableRows += '<tr>';
                Object.values(row).forEach(value => {
                    tableRows += `<td>${value || ''}</td>`;
                });
                tableRows += '</tr>';
            });
            callback(tableRows);
        });
    });
}

function renderVersion(res, callback) {
    connection.query('SELECT VERSION() AS ver', function(err, results) {
        if (err) {
            console.log(err);
            res.end();
            return;
        }
        callback(results[0].ver);
    });
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        handlePostRequest(req, res);
    } else if (req.method === 'GET' && req.url === '/delete') {
        handleDeleteRequest(req, res);
    } else {
        res.statusCode = 200;
        const filePath = path.join(__dirname, 'select.html');
        let content = fs.readFileSync(filePath, 'utf8');
        
        renderTableRows(res, (tableRows) => {
            content = content.replace('@tr', tableRows);
            renderVersion(res, (version) => {
                content = content.replace('@ver', version);
                res.write(content);
                res.end();
            });
        });
    }
});

const hostname = '127.0.0.1';
const port = 3000;
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
const express = require('express');
const app = express();
const { Connection, Request } = require("tedious");

const config = {
    authentication: {
        options: {
            userName: "admin-habbiner",
            password: "Mudar123**"
        },
        type: "default"
    },
    server: "banco-fatec.database.windows.net",
    options: {
        database: "banco-fatec",
        encrypt: true,
        trustServerCertificate: false
    }
};

const connection = new Connection(config);

function executeStatement() {
    const request = new Request("SELECT * FROM users", (err, rowCount, rows) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
        } else {
            console.log(`${rowCount} linhas retornadas.`);
            rows.forEach(row => {
                console.log(row);
            });
        }
        connection.close();
    });

    connection.execSql(request);
}

connection.on("connect", err => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conexão bem-sucedida ao banco de dados");
    }
});

app.get('/', (req, res) => {
    executeStatement();

    res.status(200).send("Conexão bem-sucedida ao banco de dados");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor Express está rodando na porta ${port}`);
});

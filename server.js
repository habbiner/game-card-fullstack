const express = require('express');
const path = require('path');
const sql = require('mssql');

const app = express();
const PORT = 3000;

const config = {
    user: 'admin-habbiner',
    password: 'Mudar123**',
    server: 'banco-fatec.database.windows.net',
    database: 'banco-fatec',
    options: {
        encrypt: true
    }
};

app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.post('/signup', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Aqui você pode adicionar lógica para verificar se o usuário já existe no banco de dados
        
        // Lógica para inserir o novo usuário no banco de dados
        await sql.connect(config);
        const request = new sql.Request();
        await request.query(`
            INSERT INTO Usuarios (Email, Senha) 
            VALUES ('${email}', '${senha}');
        `);
        
        res.status(200).send('Usuário cadastrado com sucesso.');
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).send('Erro ao cadastrar usuário.');
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Lógica para verificar se o usuário existe no banco de dados e se a senha está correta
        await sql.connect(config);
        const request = new sql.Request();
        const result = await request.query(`
            SELECT * FROM Usuarios 
            WHERE Email = '${email}' AND Senha = '${senha}';
        `);

        if (result.recordset.length > 0) {
            res.status(200).send('Login bem-sucedido.');
        } else {
            res.status(401).send('Credenciais inválidas.');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).send('Erro ao fazer login.');
    }
});


app.post('/atualizarVida', async (req, res) => {
    const { vidaHeroi, vidaVilao } = req.body;

    try {
        await sql.connect(config);
        const request = new sql.Request();
        await request.query(`
      MERGE INTO Personagens AS target
      USING (VALUES ('heroi', ${vidaHeroi}), ('vilao', ${vidaVilao})) AS source (Nome, Vida)
      ON target.Nome = source.Nome
      WHEN MATCHED THEN
        UPDATE SET Vida = source.Vida
      WHEN NOT MATCHED THEN
        INSERT (Nome, Vida) VALUES (source.Nome, source.Vida);
      `);
        res.status(200).send('Vida do herói e do vilão atualizada com sucesso.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar a vida do herói e do vilão.');
    }
});

app.get('/characters', async (req, res) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();

        const heroResult = await request.query("SELECT * FROM Personagens WHERE Nome = 'heroi'");
        const heroi = heroResult.recordset[0];

        const villainResult = await request.query("SELECT * FROM Personagens WHERE Nome = 'vilao'");
        const vilao = villainResult.recordset[0];

        res.json({ heroi, vilao });
    } catch (error) {
        console.error('Erro ao buscar dados do herói e do vilão:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do herói e do vilão.' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, '/game/index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/game/dashboard.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
});

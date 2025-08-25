# API de Autenticação com Node.js, JWT e MongoDB

Este projeto é uma **API de autenticação** que utiliza **JWT (JSON Web Token)** para proteger rotas privadas e **MongoDB Atlas** para armazenamento de usuários.

## 🚀 Tecnologias Utilizadas
- **Node.js** – Ambiente de execução
- **Express.js** – Framework para criação da API
- **MongoDB + Mongoose** – Banco de dados e ODM
- **JWT (jsonwebtoken)** – Autenticação com tokens
- **bcrypt** – Criptografia de senhas
- **dotenv** – Gerenciamento de variáveis de ambiente

## 📚 Conhecimentos Aplicados
- Criação de rotas públicas e privadas
- Middleware para validação de **tokens JWT**
- Registro e login de usuários com **hash de senha**
- Uso de variáveis de ambiente com **dotenv**
- Conexão com banco de dados **MongoDB Atlas**
- Tratamento de erros e respostas HTTP

## ⚙️ Endpoints Principais
- **GET /** → Rota pública de boas-vindas  
- **POST /auth/register** → Registro de usuário  
- **POST /auth/login** → Login e geração de token  
- **GET /user/:id** → Rota privada (necessário **Bearer Token**)  
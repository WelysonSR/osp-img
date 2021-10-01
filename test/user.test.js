let app = require("../src/app");
let supertest = require("supertest");
let request = supertest(app);

describe("Cadastro de usuário",()=>{

    test("Deve cadastrar um usuário com sucesso",()=>{
        
        let time = Date.now();
        let email = `${time}@gmail.com`;
        let user ={name:"Welyson", email, password:"123456"};

        return request.post("/user")
        .send(user)
        .then(res =>{

            expect(res.body.email).toEqual(email);
            expect(res.statusCode).toEqual(200);

        }).catch(err =>{
            fail(err);
        });

    });

});
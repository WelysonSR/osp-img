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
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);
        }).catch(err =>{
            throw new Error(err);
        });
    });

    test("Devera impedir dados vazio",()=>{
        let user ={name:"", email:"" , password:""};

        return request.post("/user")
        .send(user)
        .then(res =>{
            expect(res.statusCode).toEqual(400);
        }).catch(err =>{
            throw new Error(err);
        });
    });

    test("Deve impedir repetição de e-mail",()=>{
        let time = Date.now();
        let email = `${time}@gmail.com`;
        let user ={name:"Welyson", email, password:"123456"};

        return request.post("/user")
        .send(user)
        .then(res =>{
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

            return request.post("/user")
            .send(user)
            .then(res=>{
                expect(res.statusCode).toEqual(400);
                expect(res.body.error).toEqual("E-mail já cadstrado!");
            }).catch(err=>{
                throw new Error(err);
            });

        }).catch(err=>{
            throw new Error(err);
        });
    });


});
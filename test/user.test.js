let app = require("../src/app");
let supertest = require("supertest");
let request = supertest(app);

let maiUser = {name:"Welyson", email:"welyson12@hotmail.com", password:"123456"};

beforeAll(()=>{
    return request.post("/user")
    .send(maiUser)
    .then(res => {})
    .catch(err=>{console.log(err)});
});

afterAll(()=>{
    return request.delete(`/user/${maiUser.email}`)
    .then(res => {})
    .catch(err=>{console.log(err)});
})

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

describe("Autenticação", ()=>{
    test("Deve retornar um token quando logar",()=>{
        return request.post("/auth")
        .send({email: maiUser.email, password: maiUser.password})
        .then(res=>{
            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toBeDefined();
        })
        .catch(err=>{
            throw new Error(err);
        });
    });

    test("Deve impedir que um usuário não cadastrado se logue", ()=>{
        return request.post("/auth")
        .send({email: "test@gmail.com", password: "qwerty"})
        .then(res=>{
            expect(res.statusCode).toEqual(403);
            expect(res.body.errors.email).toEqual("E-mail não cadastrado!");
        })
        .catch(err=>{
            throw new Error(err);
        });
    });

    test("Deve impedir que um usuário loge com senha errada", ()=>{
        return request.post("/auth")
        .send({email: maiUser.email, password: "qwerty"})
        .then(res=>{
            expect(res.statusCode).toEqual(403);
            expect(res.body.errors.password).toEqual("Senha incorreta!");
        })
        .catch(err=>{
            throw new Error(err);
        });
    });
});
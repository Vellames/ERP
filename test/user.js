const request = require("supertest");
const app = require("./../app");
const chai = require("chai");

const expect = chai.expect;
const returnUtils = require("./../utils/return")(app);

describe("Routes for User", function(){

    beforeEach(function(done){
        app.db.sequelize.sync({force:true}).done(function(){
            done();
        })
    });
    
    /*
      ======================== PUT | /api/user =========================
    */
    describe("PUT | /api/user", function(){
        it("Should create a new user in database", function(done){
            const phone = "+557188888888";
            request(app)
                .put('/api/user')
                .send({
                    phone: phone
                })
                .expect(200)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("USER_INSERTED", phone, true));
                    done();
                });
        });

        it("Should generate a new activation code", function(done){
            const Users = app.db.models.Users;
            const phone = "+557188888888";
            Users.create({
                phone: phone
            }).then(function(user){
                request(app)
                    .put("/api/user")
                    .send({
                        phone: phone
                    })
                    .expect(200)
                    .end(function(err, res){
                        expect(res.body.message).to.eql(returnUtils.getI18nMessage("ACTIVATION_CODE_RESENT"));
                        expect(res.body.content).to.eql(null);
                        done()
                    })
            });
        });

        it("Should send missing param error | No phone sent", function(done){
            request(app)
                .put('/api/user')
                .send({
                    phoooneeee: "1234"
                })
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("MISSING_PARAM"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });
    });

    /*
     ======================== GET | /api/user =========================
     */

    describe("GET | /api/user", function(){

        it("Should return an user", function(done){
            const Users = app.db.models.Users;
            const phone = "+557188888888";
            Users.create({
                phone: phone,
                accessToken: "1234"
            }).then(function(user){
                request(app)
                    .get("/api/user")
                    .set("Authorization", "1234")
                    .expect(200)
                    .end(function(err, res){
                        expect(res.body.message).to.eql(null);
                        expect(res.body.content.id).to.eql(user.id);
                        expect(res.body.content.name).to.eql(null);
                        expect(res.body.content.phone).to.eql(user.phone);
                        expect(res.body.content.activationCode.toString()).to.eql(user.activationCode.toString());
                        expect(res.body.content.accessToken).to.eql(user.accessToken);
                        done()
                    })
            });
        });

        it("Should return a forbidden message | No Authorization sent", function(done){
            request(app)
                .get('/api/user')
                .expect(402)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("FORBIDDEN_REQUEST"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });

        it("Should return a forbidden message | Wrong Authorization header", function(done){
            request(app)
                .get('/api/user')
                .set("Authorization", "1234")
                .expect(402)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("FORBIDDEN_REQUEST"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });

    });
    
     /*
      ======================== PATCH | /api/user =========================
    */
    
    describe("PATCH | /api/user", function(){
        
        it("Should update the user name", function(done){
            
            const Users = app.db.models.Users;
            const accessToken = "1234";
            const phone = "+557188888888";
            const newName = "Cassiano";
            
            Users.create({
                phone: phone,
                accessToken: accessToken
            }).then(function(user){
                request(app)
                .patch('/api/user')
                .set("Authorization", accessToken)
                .send({
                    name: newName
                })
                .expect(200)
                .end(function(err, res){
                    Users.findOne({accessToken: accessToken}).then(function(user){
                        expect(res.body.message).to.eql(returnUtils.getI18nMessage("USER_UPDATED"));
                        expect(res.body.content).to.eql(null);
                        expect(user.name).to.eql(newName);
                        done(); 
                    });
                });
            });
            
         });
        
        it("Should send forbidden error", function(done){
             request(app)
                .patch('/api/user')
                .send({
                    name : "1234"
                })
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("FORBIDDEN_REQUEST"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
         });
        
         it("Should send missing param error | No params sent", function(done){
             request(app)
                .patch('/api/user')
                .send({})
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("MISSING_PARAM"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
         });
    });
    
    /*
      ======================== POST | /api/user/activate =========================
    */

    describe("POST | /api/user/activate", function(){

        it("Should activate the user", function(done){
            const Users = app.db.models.Users;
            const phone = "+557188888888";
            Users.create({
                phone: phone
            }).then(function(user){
                request(app)
                    .post('/api/user/activate')
                    .send({
                        phone: phone,
                        activationCode: user.activationCode
                    })
                    .expect(200)
                    .end(function(err, res){
                        Users.findOne({phone: phone}).then(function(user){
                            expect(res.body.message).to.eql(returnUtils.getI18nMessage("USER_ACTIVATED"));
                            expect(res.body.content.accessToken).to.eql(user.accessToken);
                            done();
                        });
                    });
            });
        });

        it("Should return miss match activation code and phone number | Test with empty database", function(done){
            request(app)
                .post('/api/user/activate')
                .send({
                    phone: "1",
                    activationCode: "1"
                })
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("ACTIVATION_CODE_DOES_NOT_MATCH"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });

        it("Should return miss match activation code and phone number | Wrong phone and activation code", function(done){
            const Users = app.db.models.Users;
            const phone = "+557188888888";
            Users.create({
                phone: phone
            }).then(function(user){
                request(app)
                    .post('/api/user/activate')
                    .send({
                        phone: "1",
                        activationCode: "1"
                    })
                    .expect(400)
                    .end(function(err, res){
                        expect(res.body.message).to.eql(returnUtils.getI18nMessage("ACTIVATION_CODE_DOES_NOT_MATCH"));
                        expect(res.body.content).to.eql(null);
                        done();
                    });
            });
        });

        it("Should send missing param error | No params sent", function(done){
            request(app)
                .post('/api/user/activate')
                .send({})
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("MISSING_PARAM"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });

        it("Should send missing param error | No activation code sent", function(done){
            request(app)
                .post('/api/user/activate')
                .send({
                    phone: "+55718888888"
                })
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("MISSING_PARAM"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });

        it("Should send missing param error | No phone sent", function(done){
            request(app)
                .post('/api/user/activate')
                .send({
                    activationCode: "1234"
                })
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("MISSING_PARAM"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });
    })
});
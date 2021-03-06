const request = require("supertest");
const app = require("./../app");
const chai = require("chai");

const expect = chai.expect;
const returnUtils = require("./../utils/return")(app);

describe("Routes for Contact", function(){

    const userTest = {
        id: 1,
        phone: "+557788888888",
        name: "Testing",
        accessToken: "abc.123"
    };

    const contactTest = {
        id: 1,
        name: "Contact Test",
        phone: "+557199999999",
        user_id: 1
    };

    const Contacts = app.db.models.Contacts;
    const Users = app.db.models.Users;

    before(function (done) {
        app.on("serverStarted", function () {
            done();
        });
    });

    beforeEach(function(done){
        app.db.sequelize.sync({force:true}).done(function(){
            Users.create(userTest).then(function(){
                done();
            });
        });
    });
    
    describe("DELETE | /api/contact", function(){
       it("Should delete the contact", function(done){
           
           Contacts.create(contactTest).then(function(contact){
               request(app)
                .delete("/api/contact")
                .set("Authorization", userTest.accessToken)
                .send({
                    id: contactTest.id
               })
               .expect(200)
               .end(function(err,res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("CONTACT_DELETED"));
                    expect(res.body.content).to.eql(null);
                    done();
               });
           });          
       });
       
       it("Should return forbidden request | No Authorization", function(done){
               request(app)
                .delete("/api/contact")
                .send({
                    id: contactTest
                })
                .expect(403)
                .end(function(err,res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("FORBIDDEN_REQUEST"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
                   
       });
       
       it("Should return forbidden request | Trying to delete another user's contact", function(done){
           
           const anotherUser = {
                id: 2,
                phone: "+557788888889",
                name: "Testing2",
                accessToken: "abc.1232" 
           };
           
           Users.create(anotherUser).then(function(user){
                Contacts.create(contactTest).then(function(contact){
                    request(app)
                        .delete("/api/contact")
                        .set("Authorization", anotherUser.accessToken)
                        .send({
                            id: contactTest.id
                        })
                        .expect(403)
                        .end(function(err,res){
                            expect(res.body.message).to.eql(returnUtils.getI18nMessage("FORBIDDEN_REQUEST"));
                            expect(res.body.content).to.eql(null);
                            done();
                        });
                });
           });
           
                     
       });
       
       it("Should return error of missing param | No params sent", function(done){
            request(app)
             .delete("/api/contact")
             .set("Authorization", userTest.accessToken)
             .expect(400)
             .end(function(err,res){
                 expect(res.body.message).to.eql(returnUtils.getI18nMessage("MISSING_PARAM"));
                 expect(res.body.content).to.eql(null);
                 done();
             });         
       });
    });
    
    describe("PUT | /api/contact", function(){
       it("Should update the contact", function(done){
           
           Contacts.create(contactTest).then(function(contact){
               request(app)
                .put("/api/contact")
                .set("Authorization", userTest.accessToken)
                .send({
                    name: "New Contact Test",
                    phone: "+55712525252",
                    id: 1
               })
               .expect(200)
               .end(function(err,res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("CONTACT_UPDATED"));
                    expect(res.body.content).to.eql(null);
                    done();
               });
           });          
       });
       
       it("Should return forbidden request | No Authorization", function(done){
           
           Contacts.create(contactTest).then(function(contact){
               request(app)
                .put("/api/contact")
                .send({
                    name: "New Contact Test",
                    phone: "+55712525252",
                    id: 1
                })
                .expect(403)
                .end(function(err,res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("FORBIDDEN_REQUEST"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
           });          
       });
       
       it("Should return forbidden request | Trying to update another user's contact", function(done){
           
           const anotherUser = {
                id: 2,
                phone: "+557788888889",
                name: "Testing2",
                accessToken: "abc.1232" 
           };
           
           Users.create(anotherUser).then(function(user){
                Contacts.create(contactTest).then(function(contact){
                    request(app)
                        .put("/api/contact")
                        .set("Authorization", anotherUser.accessToken)
                        .send({
                            name: "New Contact Test",
                            phone: "+55712525252",
                            id: 1
                        })
                        .expect(403)
                        .end(function(err,res){
                            expect(res.body.message).to.eql(returnUtils.getI18nMessage("FORBIDDEN_REQUEST"));
                            expect(res.body.content).to.eql(null);
                            done();
                        });
                });
           });
           
                     
       });
       
       it("Should return error of missing param | No params sent", function(done){
           
           Contacts.create(contactTest).then(function(contact){
               request(app)
                .put("/api/contact")
                .set("Authorization", userTest.accessToken)
                .expect(400)
                .end(function(err,res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("MISSING_PARAM"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
           });          
       });
       
       it("Should not update the contact because the contact number and user number cant be the same", function(done){
           request(app)
                .put("/api/contact")
                .set("Authorization", userTest.accessToken)
                .send({
                    name: "Vellames",
                    phone : userTest.phone,
                    id: userTest.id
                })
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("INVALID_CONTACT"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
       });
       
       it("Should not update the contact. Same number", function(done){
           Contacts.create(contactTest).then(function(contact){
               request(app)
                .put("/api/contact")
                .set("Authorization", userTest.accessToken)
                .send(contactTest)
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("CONTACT_EXISTS"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
           });
       
       });
    });
    
    describe("POST | /api/contact", function(){

        it("Should insert the contact", function(done){
            request(app)
                .post("/api/contact")
                .set("Authorization", userTest.accessToken)
                .send(contactTest)
                .expect(200)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("CONTACT_INSERTED"));
                    done();
                });
        });

        it("Should not insert the contact because the contact number and user number cant be the same", function(done){
            request(app)
                .post("/api/contact")
                .set("Authorization", userTest.accessToken)
                .send({
                    name: "Vellames",
                    phone : userTest.phone
                })
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("INVALID_CONTACT"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });

        it("Should return forbidden request", function(done){
            request(app)
                .post("/api/contact")
                .expect(403)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("FORBIDDEN_REQUEST"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });

        it("Should return error of missing param | No params sent", function(done){
            request(app)
                .post("/api/contact")
                .set("Authorization", userTest.accessToken)
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("MISSING_PARAM"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });

        it("Should return error of missing param | No name sent", function(done){
            request(app)
                .post("/api/contact")
                .set("Authorization", userTest.accessToken)
                .send({
                    phone: "12345"
                })
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("MISSING_PARAM"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });

        it("Should return error of missing param | No phone sent", function(done){
            request(app)
                .post("/api/contact")
                .set("Authorization", userTest.accessToken)
                .send({
                    name: "name"
                })
                .expect(400)
                .end(function(err, res){
                    expect(res.body.message).to.eql(returnUtils.getI18nMessage("MISSING_PARAM"));
                    expect(res.body.content).to.eql(null);
                    done();
                });
        });
    });
});
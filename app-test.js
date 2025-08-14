const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./app');
const should = chai.should();

chai.use(chaiHttp);

describe('Planets API Suite', () => {
    before(async function () {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/solar-system', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    after(async function () {
        await mongoose.connection.close();
    });

    describe('Fetching Planet Details', () => {
        it('it should fetch a planet named Mercury', (done) => {
            let payload = { id: 1 };
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(1);
                    res.body.should.have.property('name').eql('Mercury');
                    done();
                });
        });

        it('it should fetch a planet named Venus', (done) => {
            let payload = { id: 2 };
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(2);
                    res.body.should.have.property('name').eql('Venus');
                    done();
                });
        });

        it('it should fetch a planet named Earth', (done) => {
            let payload = { id: 3 };
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(3);
                    res.body.should.have.property('name').eql('Earth');
                    done();
                });
        });

        it('it should fetch a planet named Mars', (done) => {
            let payload = { id: 4 };
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(4);
                    res.body.should.have.property('name').eql('Mars');
                    done();
                });
        });

        it('it should fetch a planet named Jupiter', (done) => {
            let payload = { id: 5 };
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(5);
                    res.body.should.have.property('name').eql('Jupiter');
                    done();
                });
        });

        it('it should fetch a planet named Saturn', (done) => {
            let payload = { id: 6 };
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(6);
                    res.body.should.have.property('name').eql('Saturn');
                    done();
                });
        });

        it('it should fetch a planet named Uranus', (done) => {
            let payload = { id: 7 };
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(7);
                    res.body.should.have.property('name').eql('Uranus');
                    done();
                });
        });

        it('it should fetch a planet named Neptune', (done) => {
            let payload = { id: 8 };
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(8);
                    res.body.should.have.property('name').eql('Neptune');
                    done();
                });
        });

        // it('it should fetch a planet named Pluto', (done) => {
        //     let payload = { id: 9 };
        //     chai.request(server)
        //         .post('/planet')
        //         .send(payload)
        //         .end((err, res) => {
        //             res.should.have.status(200);
        //             res.body.should.have.property('id').eql(9);
        //             res.body.should.have.property('name').eql('Pluto');
        //             done();
        //         });
        // });
    });

    describe('Testing Other Endpoints', () => {
        it('it should fetch OS details', (done) => {
            chai.request(server)
                .get('/os')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it checks Liveness endpoint', (done) => {
            chai.request(server)
                .get('/live')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('live');
                    done();
                });
        });

        it('it checks Readiness endpoint', (done) => {
            chai.request(server)
                .get('/ready')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('ready');
                    done();
                });
        });
    });
});
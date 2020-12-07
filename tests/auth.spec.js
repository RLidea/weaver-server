const chai = require('chai');
const chaiHttp = require('chai-http');
// const jsdom = require('jsdom');

const test = require('../app/utils/testHelper');
const app = require('../app');

chai.use(chaiHttp);
const { expect, request } = chai;
const agent = chai.request.agent(app);

chai.should();

// const { JSDOM } = jsdom;
// const jsdom_options = {
//   runScripts: 'dangerously',
//   resources: 'usable',
// };

describe('POST /auth/login', () => {
  it('Login Failed Test: no params', done => {
    request(app)
      .post('/auth/login')
      .end((err, res) => (test.failed({ err, res, done, chai })));
  });

  it('Login Failed Test: validate password', done => {
    const message = 'password_validate';
    request(app)
      .post('/auth/login')
      .send({
        email: 'dev@weaver.com',
      })
      .end((err, res) => (test.failed({ err, res, done, chai, message })));
  });

  it('Login Failed Test: validate email', done => {
    const message = 'email_validate';
    request(app)
      .post('/auth/login')
      .send({
        password: 'bd2b1aaf7ef4f09be9f52ce2d8d599674d81aa9d6a4421696dc4d93dd0619d682ce56b4d64a9ef097761ced99e0f67265b5f76085e5b0ee7ca4696b2ad6fe2b2',
      })
      .end((err, res) => (test.failed({ err, res, done, chai, message })));
  });

  it('Login Failed Test: incorrect email', done => {
    request(app)
      .post('/auth/login')
      .send({
        email: 'not_registed@weaver.com',
        password: 'bd2b1aaf7ef4f09be9f52ce2d8d599674d81aa9d6a4421696dc4d93dd0619d682ce56b4d64a9ef097761ced99e0f67265b5f76085e5b0ee7ca4696b2ad6fe2b2',
      })
      .end((err, res) => (test.failed({ err, res, done, chai })));
  });

  // it('Login Failed Test: incorrect password', done => {
  //   request(app)
  //     .post('/auth/login')
  //     .send({
  //       email: 'dev@weaver.com',
  //       password: 'secret',
  //     })
  //     .end((err, res) => (test.failed({ err, res, done, chai })));
  // });

  // it('Login Success Test', done => {
  //   agent
  //     .post('/auth/login')
  //     .send({
  //       email: 'dev@weaver.com',
  //       password: 'bd2b1aaf7ef4f09be9f52ce2d8d599674d81aa9d6a4421696dc4d93dd0619d682ce56b4d64a9ef097761ced99e0f67265b5f76085e5b0ee7ca4696b2ad6fe2b2',
  //     })
  //     .end((err, res) => {
  //       // cookies = `\tjwt=${res.body.data?.cookie?.value}; Path=/; SameSite=Strict; Domain=localhost`;
  //       test.success({ err, res, done, chai });
  //     });
  // });
});

// describe('POST /auth/register', () => {
//   const email = `tester${new Date().getTime()}@weaver.com`;
//
//   it('Register Failed Test: no params', done => {
//     request(app)
//       .post('/auth/register')
//       .end((err, res) => (test.failed({ err, res, done, chai })));
//   });
//
//   it('Register Failed Test: validate email', done => {
//     request(app)
//       .post('/auth/register')
//       .send({
//         password: 'bd2b1aaf7ef4f09be9f52ce2d8d599674d81aa9d6a4421696dc4d93dd0619d682ce56b4d64a9ef097761ced99e0f67265b5f76085e5b0ee7ca4696b2ad6fe2b2',
//         name: 'tester',
//         phone: '01011112222',
//       })
//       .end((err, res) => (test.failed({ err, res, done, chai })));
//   });
//
//   it('Register Failed Test: validate password', done => {
//     request(app)
//       .post('/auth/register')
//       .send({
//         email,
//         name: 'tester',
//         phone: '01011112222',
//       })
//       .end((err, res) => (test.failed({ err, res, done, chai })));
//   });
//
//   it('Register Failed Test: user_exist', done => {
//     request(app)
//       .post('/auth/register')
//       .send({
//         email: 'dev@weaver.com',
//         name: 'Master Developer',
//         password: 'bd2b1aaf7ef4f09be9f52ce2d8d599674d81aa9d6a4421696dc4d93dd0619d682ce56b4d64a9ef097761ced99e0f67265b5f76085e5b0ee7ca4696b2ad6fe2b2',
//         phone: '01011112222',
//       })
//       .end((err, res) => (test.failed({ err, res, done, chai })));
//   });
//
//   it('Register Success', done => {
//     request(app)
//       .post('/auth/register')
//       .send({
//         email,
//         name: 'tester',
//         password: 'bd2b1aaf7ef4f09be9f52ce2d8d599674d81aa9d6a4421696dc4d93dd0619d682ce56b4d64a9ef097761ced99e0f67265b5f76085e5b0ee7ca4696b2ad6fe2b2',
//       })
//       .end((err, res) => (test.success({ err, res, done, chai })));
//   });
// });

describe('POST /auth/whoami', () => {
  it('whoami Failed', done => {
    request(app)
      .post('/auth/whoami')
      .end((err, res) => {
        res.body.should.have.property('message');
        expect(res.body.message).to.equal('access denied');
        done();
      });
  });
//
//   it('whoami Success', done => {
//     agent
//       .post('/auth/whoami')
//       .end((err, res) => {
//         res.body.should.have.property('error');
//         res.body.should.have.property('message');
//         res.body.should.have.property('data');
//         expect(res.body.message).to.equal('success');
//         done();
//       });
//   });
});

// describe('GET /auth/login', () => {
//   it('Login on View Success', done => {
//     request(app)
//       .get('/auth/login')
//       .end((err, res) => {
//         if (err) done(err);
//
//         const DOM = new JSDOM(res.res.text, jsdom_options);
//         const csrf = DOM.window.document.getElementsByName('_csrf')[0].value;
//         request(app)
//           .post('/auth/login')
//           .set('cookie', res.headers['set-cookie'])
//           .send({
//             _csrf: csrf,
//             email: 'dev@weaver.com',
//             password: 'secret',
//           })
//           .end((error, response) => {
//             if (error) done(error);
//             console.log(response);
//             done();
//           });
//       });
//   });
// });

module.exports = {
  app,
  request,
  agent,
};

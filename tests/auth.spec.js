const app = require('./../app');
const chai = require('chai');
chai.should();
const request = require('supertest');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const jsdom_options = {
  runScripts: 'dangerously',
  resources: 'usable',
};

describe('POST /auth/login', () => {
  // it('Login Failed Test', done => {
  //   request(app)
  //     .post('/auth/login')
  //     .end((err, res) => {
  //       // if (err) done(err);
  //
  //       console.log(res.body);
  //       res.body.should.be.instanceOf(Object);
  //       res.body.should.have.property('success');
  //       res.body.should.have.property('message');
  //     });
  //   done();
  // });

  it('Login Success Test', done => {
    request(app)
      .get('/auth/login')
      .end((err, res) => {
        if (err) done(err);

        const DOM = new JSDOM(res.res.text, jsdom_options);
        const csrf = DOM.window.document.getElementsByName('_csrf')[0].value;
        // console.log('csrf: ', csrf);
        request(app)
          .post('/auth/login')
          .set('cookie', res.headers['set-cookie'])
          .send({
            _csrf: csrf,
            email: 'dev@weaver.com',
            password: 'secret',
          })
          .end((err, res) => {
            if (err) done(err);
            // console.log(res);
            done();
          });
      });
    done();
  });
});

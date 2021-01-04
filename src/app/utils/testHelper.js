const util = {};

util.failed = ({ err, res, done, chai, message }) => {
  if (err) done(err);

  res.body.should.be.instanceOf(Object);
  res.body.should.have.property('error');
  res.body.should.have.property('message');
  chai.expect(res.body.error).to.equal(true);
  if (message) {
    chai.expect(res.body.message).to.equal(message);
  }

  done();
};

util.success = ({ err, res, done, chai, message }) => {
  if (err) done(err);

  res.body.should.have.property('error');
  res.body.should.have.property('message');
  res.body.should.have.property('data');
  chai.expect(res.body.error).to.equal(false);
  if (message) {
    chai.expect(res.body.message).to.equal(message);
  }

  done();
};

module.exports = util;

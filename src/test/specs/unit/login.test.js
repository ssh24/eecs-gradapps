'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var Login = require('../../views/login-view');
var Role = require('../../views/role-view');
var Utils = require('../../lib/utils/shared-utils');
var Welcome = require('../../views/welcome-view');

var config = require('../../lib/utils/config');

describe('Login Test', function() {
	this.timeout(20000);

	var login = new Login();
	var role = new Role();
	var utils = new Utils();
	var welcome = new Welcome();

	before(function () {
		require('../../pretest');
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
		welcome.clickSignInButton();
	});

	after(function (done) {
		require('../../pretest');
		browser.restart();
		utils.stopApp(done);
	});
    
	it('- get login text', function() {
		expect(login.getLoginText.call(login)).to.eventually
			.equal('Login');
	});

	it('- log in with only username no password', function() {
		login.enterUsername(config.credentials.app.username)
			.then(login.clickLogIn.call(login))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('login'));
	});
    
	it('- log in with only password no username', function() {
		login.enterPassword(config.credentials.app.password)
			.then(login.clickLogIn.call(login))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('login'));
	});
    
	it('- log in with invalid password', function() {
		login.enterUsername(config.credentials.app.username)
			.then(login.enterPassword.call(login, config.credentials.app
				.password + '1'))
			.then(login.clickLogIn.call(login))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('login'))
			.then(expect(login.getErrorMessage.call(login)).to.eventually
				.equal('Invalid password. Please try again.'));
	});
    
	it('- log in with invalid username', function() {
		login.enterUsername(config.credentials.app.username + 'a')
			.then(login.enterPassword.call(login, config.credentials.app
				.password))
			.then(login.clickLogIn.call(login))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('login'))
			.then(expect(login.getErrorMessage.call(login)).to.eventually
				.equal('Invalid username. Please try again.'));
	});
    
	it('- log in with invalid username and invalid password', function() {
		login.enterUsername(config.credentials.app.username + 'a')
			.then(login.enterPassword.call(login, config.credentials.app
				.password + '1'))
			.then(login.clickLogIn.call(login))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('login'))
			.then(expect(login.getErrorMessage.call(login)).to.eventually
				.equal('Invalid username. Please try again.'));
	});

	it('- log in with a locked account', function() {
		var newUser = {
			username: 'arri',
			password: config.credentials.app.password
		};
		login.fullSignIn(newUser)
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('roles'))
			.then(utils.openView.call(utils, '#'))
			.then(welcome.clickSignInButton.call(welcome))
			.then(login.fullSignIn.call(login, newUser))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('login'))
			.then(expect(login.getErrorMessage.call(login)).to.eventually
				.equal('Account locked due to user "' + 
				newUser.username + '" not logging ' + 
				'out properly. Please contact the system administrator ' + 
				'for help.'));
	});

	it('- log in correct credentials and then logout', function() {
		login.fullSignIn(config.credentials.app)
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('roles'))
			.then(role.selectRole.call(role, 'Professor'))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('professor'))
			.then(expect(utils.getUser.call(utils)).to.eventually.contain(config.
				credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Professor'))
			.then(utils.logOut.call(utils))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('/'));
	});
});

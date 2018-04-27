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
		require('../../seed');
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
		welcome.clickSignInButton();
	});

	after(function (done) {
		browser.restart();
		utils.stopApp(done);
	});

	it('- check system user manual', function() {
		utils.openUserManual(utils.userManual)
			.then(utils.switchTab.call(utils, 1))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('user-manual'))
			.then(utils.goToTab.call(utils, 0));
	});
    
	it('- get login text', function() {
		expect(login.getLoginText.call(login)).to.eventually
			.equal('Login');
	});

	it('- log in with only username no password', function() {
		login.enterUsername(config.credentials.app.admin.username)
			.then(login.clickLogIn.call(login))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('login'));
	});
    
	it('- log in with only password no username', function() {
		login.enterPassword(config.credentials.app.admin.password)
			.then(login.clickLogIn.call(login))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('login'));
	});
    
	it('- log in with invalid password', function() {
		login.enterUsername(config.credentials.app.admin.username)
			.then(login.enterPassword.call(login, config.credentials.app.admin
				.password + '1'))
			.then(login.clickLogIn.call(login))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('login'))
			.then(expect(login.getErrorMessage.call(login)).to.eventually
				.equal('Invalid password. Please try again.'));
	});
    
	it('- log in with invalid username', function() {
		login.enterUsername(config.credentials.app.admin.username + 'a')
			.then(login.enterPassword.call(login, config.credentials.app.admin
				.password))
			.then(login.clickLogIn.call(login))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('login'))
			.then(expect(login.getErrorMessage.call(login)).to.eventually
				.equal('Invalid username. Please try again.'));
	});
    
	it('- log in with invalid username and invalid password', function() {
		login.enterUsername(config.credentials.app.admin.username + 'a')
			.then(login.enterPassword.call(login, config.credentials.app.admin
				.password + '1'))
			.then(login.clickLogIn.call(login))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('login'))
			.then(expect(login.getErrorMessage.call(login)).to.eventually
				.equal('Invalid username. Please try again.'));
	});

	it('- log in correct credentials and then logout', function() {
		login.fullSignIn(config.credentials.app.admin)
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('roles'))
			.then(role.selectRole.call(role, 'Professor'))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('professor'))
			.then(expect(utils.getUser.call(utils)).to.eventually.contain(config.
				credentials.app.admin.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Professor'))
			.then(utils.logOut.call(utils))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('/'));
	});

	describe('- login sessions', function() {
		before(function setUp() {
			welcome.clickSignInButton()
				.then(login.fullSignIn.call(login, config.credentials.app.admin))
				.then(role.selectRole.call(role, 'Professor'));
		});

		after(function cleanUp() {
			utils.logOut()
				.then(expect(browser.getCurrentUrl()).to.eventually
					.contain('/'));
		});

		it('- open another tab and go to professor page: same user should persist', 
			function() {
				utils.openNewTab('/roles/professor')
					.then(expect(browser.getCurrentUrl()).to.eventually
						.contain('professor'))
					.then(expect(utils.getUser.call(utils)).to.eventually.contain(config.
						credentials.app.admin.fullname))
					.then(expect(utils.getRole.call(utils)).to.eventually.
						contain('Professor'))
					.then(utils.goToTab.call(utils, 0));
			});

		// this test simulates the behavior of two users logging in from two different machines
		// it logs out the user from the first machine and creates the session on the second machine
		it('- open a new tab with cache cleared: same user should not persist', 
			function() {
				utils.openNewTab('#')
					.then(utils.clearBrowserCache.call(utils))
					.then(utils.openView.call(utils, '/roles'))
					.then(expect(browser.getCurrentUrl()).to.eventually
						.contain('/'))
					.then(welcome.clickSignInButton.call(welcome))
					.then(login.fullSignIn.call(login, config.credentials.app.admin))
					.then(expect(browser.getCurrentUrl()).to.eventually
						.contain('roles'))
					.then(role.selectRole.call(role, 'Professor'))
					.then(expect(browser.getCurrentUrl()).to.eventually
						.contain('professor'))
					.then(expect(utils.getUser.call(utils)).to.eventually.contain(config.
						credentials.app.admin.fullname))
					.then(expect(utils.getRole.call(utils)).to.eventually.
						contain('Professor'));
			});
	});
});

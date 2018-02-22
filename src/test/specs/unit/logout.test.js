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

describe('Logout Test', function() {
	this.timeout(20000);

	var login = new Login();
	var role = new Role();
	var utils = new Utils();
	var welcome = new Welcome();

	before(function overallSetup() {
		require('../../pretest');
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
	});
    
	beforeEach(function setUp() {
		welcome.clickSignInButton()
			.then(login.fullSignIn.bind(login, config.credentials.app));
	});

	after(function overallCleanUp(done) {
		browser.restart();
		utils.stopApp(done);
	});
    
	it('- logout from role selection page', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('/roles')
			.then(utils.logOut.call(utils))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('/'));
	});
    
	it('- select admin role and logout', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('/roles')
			.then(role.selectRole.call(role, 'Admin'))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('admin'))
			.then(utils.logOut.call(utils))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('/'));
	});
    
	it('- select professor role and logout', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('/roles')
			.then(role.selectRole.call(role, 'Professor'))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('professor'))
			.then(utils.logOut.call(utils))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('/'));
	});
    
	it('- select committee role and logout', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('/roles')
			.then(role.selectRole.call(role, 'Committee Member'))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('committee'))
			.then(utils.logOut.call(utils))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('/'));
	});
});

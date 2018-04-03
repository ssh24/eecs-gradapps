'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var Admin = require('../../views/admin-view');
var Login = require('../../views/login-view');
var Role = require('../../views/role-view');
var Utils = require('../../lib/utils/shared-utils');
var Welcome = require('../../views/welcome-view');

var config = require('../../lib/utils/config');

describe('Admin Test', function() {
	this.timeout(20000);

	var admin = new Admin(20000);
	var login = new Login();
	var role = new Role();
	var utils = new Utils();
	var welcome = new Welcome();

	before(function setUp() {
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
		welcome.clickSignInButton()
			.then(login.fullSignIn.bind(login, config.credentials.app.admin))
			.then(role.selectRole.call(role, 'Admin'));
	});

	after(function cleanUp(done) {
		utils.logOut()
			.then(function() {
				require('../../pretest');
				browser.restart();
				utils.stopApp(done);
			});
	});
    
	it('- go to manage users from dashboard and back', function() {
		admin.manageUsers()
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/users'))
			.then(admin.goToDashboard.call(admin))
			.then(expect(browser.getCurrentUrl()).to.not.eventually.contain('/users'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/admin'));
	});
    
	it('- go to manage apps from dashboard and back', function() {
		admin.manageApps()
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/applications'))
			.then(admin.goToDashboard.call(admin))
			.then(expect(browser.getCurrentUrl()).to.not.eventually.contain('/applications'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/admin'));
	});
    
	it('- go to manage reviews from dashboard and back', function() {
		admin.manageReviews()
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/reviews'))
			.then(admin.goToDashboard.call(admin))
			.then(expect(browser.getCurrentUrl()).to.not.eventually.contain('/reviews'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/admin'));
	});
    
});

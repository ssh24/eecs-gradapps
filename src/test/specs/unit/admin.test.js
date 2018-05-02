'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var ms = require('ms');

var Admin = require('../../views/admin-view');
var Login = require('../../views/login-view');
var Role = require('../../views/role-view');
var Utils = require('../../lib/utils/shared-utils');
var Welcome = require('../../views/welcome-view');

var config = require('../../lib/utils/config');

describe('Admin Test', function() {
	var timeout = ms('20s');
	this.timeout(timeout);

	var admin = new Admin(timeout);
	var login = new Login(timeout);
	var role = new Role(timeout);
	var utils = new Utils(timeout);
	var welcome = new Welcome(timeout);

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

	it('- check user manual', function() {
		utils.openUserManual(admin.userManual)
			.then(utils.switchTab.call(utils, 1))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('admin-manual'))
			.then(utils.goToTab.call(utils, 0))
			.then(utils.scollUpPage.call(utils));
	});
});

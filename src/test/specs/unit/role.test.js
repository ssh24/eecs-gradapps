'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var ms = require('ms');

var Login = require('../../views/login-view');
var Role = require('../../views/role-view');
var Utils = require('../../lib/utils/shared-utils');
var Welcome = require('../../views/welcome-view');

var config = require('../../lib/utils/config');

var timeout;

describe('Role Test', function() {
	timeout = ms('20s');
	this.timeout(timeout);

	var login = new Login(timeout);
	var role = new Role(timeout);
	var utils = new Utils(timeout);
	var welcome = new Welcome(timeout);

	before(function setUp() {
		require('../../pretest');
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
		welcome.clickSignInButton()
			.then(login.fullSignIn.bind(login, config.credentials.app));
	});

	after(function cleanUp(done) {
		browser.restart();
		utils.stopApp(done);
	});
    
	it('- get admin role text', function() {
		expect(role.getAdminText.call(role)).to.eventually
			.contain('Continue as an Admin');
	});
    
	it('- get professor role text', function() {
		expect(role.getProfessorText.call(role)).to.eventually
			.contain('Continue as a Professor');
	});
    
	it('- get committee role text', function() {
		expect(role.getCommitteeText.call(role)).to.eventually
			.contain('Continue as a Committee Member');
	});
    
	it('- choose admin role then return to role page', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('roles')
			.then(role.selectRole.call(role, 'Admin'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('admin'))
			.then(expect(utils.getUser.call(utils)).to.eventually
				.contain(config.credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Admin'))
			.then(utils.openView.bind(utils, '/roles'));
	});
    
	it('- choose professor role then return to role page', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('roles')
			.then(role.selectRole.call(role, 'Professor'))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('professor'))
			.then(expect(utils.getUser.call(utils)).to.eventually.contain(config.
				credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Professor'))
			.then(utils.openView.bind(utils, '/roles'));
	});
    
	it('- choose committee member role then return to role page', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('roles')
			.then(role.selectRole.call(role, 'Committee Member'))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('committee'))
			.then(expect(utils.getUser.call(utils)).to.eventually.contain(config.
				credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Committee Member'))
			.then(utils.openView.bind(utils, '/roles'));
	});

	it('- switch from admin to professor', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('roles')
			.then(role.selectRole.call(role, 'Admin'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('admin'))
			.then(expect(utils.getUser.call(utils)).to.eventually
				.contain(config.credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Admin'))
			.then(utils.openRoleDropDown.call(utils))
			.then(role.changeRole.call(role, 'Professor'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('professor'))
			.then(expect(utils.getUser.call(utils)).to.eventually
				.contain(config.credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Professor'))
			.then(utils.openRoleDropDown.call(utils))
			.then(role.changeRole.call(role, 'Admin'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('admin'));
	});

	it('- switch from admin to committee member', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('admin')
			.then(expect(utils.getUser.call(utils)).to.eventually
				.contain(config.credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Admin'))
			.then(utils.openRoleDropDown.call(utils))
			.then(role.changeRole.call(role, 'Committee Member'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('committee'))
			.then(expect(utils.getUser.call(utils)).to.eventually
				.contain(config.credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Committee Member'))
			.then(utils.openRoleDropDown.call(utils))
			.then(role.changeRole.call(role, 'Admin'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('admin'));
	});

	it('- switch from professor to admin', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('admin')
			.then(utils.openRoleDropDown.call(utils))
			.then(role.changeRole.call(role, 'Professor'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('professor'))
			.then(expect(utils.getUser.call(utils)).to.eventually
				.contain(config.credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Professor'))
			.then(utils.openRoleDropDown.call(utils))
			.then(role.changeRole.call(role, 'Admin'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('admin'))
			.then(expect(utils.getUser.call(utils)).to.eventually
				.contain(config.credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Admin'))
			.then(utils.openRoleDropDown.call(utils))
			.then(role.changeRole.call(role, 'Professor'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('professor'));
	});

	it('- switch from professor to committee member', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(expect(utils.getUser.call(utils)).to.eventually
				.contain(config.credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Professor'))
			.then(utils.openRoleDropDown.call(utils))
			.then(role.changeRole.call(role, 'Committee Member'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('committee'))
			.then(expect(utils.getUser.call(utils)).to.eventually
				.contain(config.credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Committee Member'))
			.then(utils.openRoleDropDown.call(utils))
			.then(role.changeRole.call(role, 'Professor'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('professor'));
	});

	it('- switch from committee to admin', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(utils.openRoleDropDown.call(utils))
			.then(role.changeRole.call(role, 'Committee Member'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('committee'))
			.then(expect(utils.getUser.call(utils)).to.eventually
				.contain(config.credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Committee Member'))
			.then(utils.openRoleDropDown.call(utils))
			.then(role.changeRole.call(role, 'Admin'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('admin'))
			.then(expect(utils.getUser.call(utils)).to.eventually
				.contain(config.credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Admin'))
			.then(utils.openRoleDropDown.call(utils))
			.then(role.changeRole.call(role, 'Committee Member'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('committee'));
	});

	it('- switch from committee to professor', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('committee')
			.then(expect(utils.getUser.call(utils)).to.eventually
				.contain(config.credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Committee Member'))
			.then(utils.openRoleDropDown.call(utils))
			.then(role.changeRole.call(role, 'Professor'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('professor'))
			.then(expect(utils.getUser.call(utils)).to.eventually
				.contain(config.credentials.app.fullname))
			.then(expect(utils.getRole.call(utils)).to.eventually.
				contain('Professor'))
			.then(utils.openRoleDropDown.call(utils))
			.then(role.changeRole.call(role, 'Committee Member'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('committee'))
			.then(utils.logOut.call(utils))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('/'));
	});
});

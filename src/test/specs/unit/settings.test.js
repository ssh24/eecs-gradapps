'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var ms = require('ms');

var Admin = require('../../views/admin-view');
var Application = require('../../views/app-view');
var Filter = require('../../views/filter-view');
var Login = require('../../views/login-view');
var Role = require('../../views/role-view');
var Settings = require('../../views/settings-view');
var User = require('../../views/user-view');
var Utils = require('../../lib/utils/shared-utils');
var Welcome = require('../../views/welcome-view');

var config = require('../../lib/utils/config');

describe('User Settings Test', function() {
	var timeout = ms('60s');
	this.timeout(timeout);

	var admin = new Admin(timeout);
	var app = new Application(timeout);
	var filter = new Filter(timeout);
	var login = new Login(timeout);
	var role = new Role(timeout);
	var settings = new Settings(timeout);
	var user = new User(timeout);
	var utils = new Utils(timeout);
	var welcome = new Welcome(timeout);
    
	var default_user = {
		username: 'abcd123',
		password: 'abcd123',
		lname: 'Bar',
		fname: 'Foo',
		email: 'foo@bar.com',
		fos: [{
			index: 0,
			name: 'Artificial Intelligence'
		}, {
			index: 2,
			name: 'Biomedical Engineering'
		}],
		roles: [{
			index: 0,
			name: 'Admin'
		}, {
			index: 2,
			name: 'Professor'
		}],
	};
	var userIndex = 78;

	before(function setUp() {
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
		welcome.clickSignInButton()
			.then(login.fullSignIn.bind(login, config.credentials.app.admin))
			.then(role.selectRole.call(role, 'Admin'))
			.then(admin.manageUsers.call(admin))
			.then(user.openNewUserForm.call(user))
			.then(user.fillUser.call(user, default_user))
			.then(user.selectRoles.call(user, default_user.roles[0].index))
			.then(expect(user.isOptionSelected.call(user, default_user.roles[0]
				.name)).to.eventually.be.true)
			.then(user.submitUser.call(user))
			.then(utils.logOut.call(utils))
			.then(welcome.clickSignInButton.call(welcome))
			.then(login.fullSignIn.bind(login, default_user));
	});

	after(function cleanUp(done) {
		utils.logOut()
			.then(welcome.clickSignInButton.call(welcome))
			.then(login.fullSignIn.bind(login, config.credentials.app.admin))
			.then(role.selectRole.call(role, 'Admin'))
			.then(admin.manageUsers.call(admin))
			.then(user.editUser.call(user, userIndex))
			.then(user.deleteUser.call(user))
			.then(utils.closeBrowserAlert.call(utils))
			.then(utils.logOut.call(utils))
			.then(function() {
				require('../../pretest');
				browser.restart();
				utils.stopApp(done);
			});
	});
    
	it('- open edit user and exit out w/o changes', function() {
		utils.openSettings()
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/settings'))
			.then(settings.closeEditUserForm.call(settings))
			.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/settings'));
	});
    
	describe('- validating password fields', function() {
		var p1 = 'abcd';
		var p2 = 'dcba';

		before(function setUp() {
			utils.openSettings()
				.then(expect(browser.getCurrentUrl()).to.eventually.contain('/settings'));
		});
        
		after(function cleanUp() {
			settings.closeEditUserForm()
				.then(utils.closeBrowserAlert.call(utils))
				.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/settings'))
				.then(expect(browser.getCurrentUrl()).to.eventually.contain('/roles'));
		});

		it('- enter password that do not match', function() {
			settings.setPassword(p1)
				.then(settings.setPasswordConfirmation.call(settings, p2))
				.then(expect(settings.getPassword.call(settings)).to.eventually.equal(p1))
				.then(expect(settings.getPasswordConfirmation.call(settings)).to
					.eventually.equal(p2))
				.then(expect(settings.getPasswordMessage.call(settings)).to.eventually.equal('Password does not match'))
				.then(expect(settings.isSaveBtnEnabled.call(settings)).to.eventually.be.false);
		});

		it('- enter password that do match', function() {
			settings.setPassword(p1)
				.then(settings.setPasswordConfirmation.call(settings, p1))
				.then(expect(settings.getPassword.call(settings)).to.eventually.equal(p1))
				.then(expect(settings.getPasswordConfirmation.call(settings)).to
					.eventually.equal(p1))
				.then(expect(settings.getPasswordMessage.call(settings)).to.eventually.equal('Password matches'))
				.then(expect(settings.isSaveBtnEnabled.call(settings)).to.eventually.be.true);
		});
	});
    
	describe('- check for all fields', function() {
		before(function setUp() {
			utils.openSettings()
				.then(expect(browser.getCurrentUrl()).to.eventually.contain('/settings'));
		});
        
		after(function cleanUp() {
			settings.closeEditUserForm()
				.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/settings'))
				.then(expect(browser.getCurrentUrl()).to.eventually.contain('/roles'));
		});

		describe('- login information section', function() {
			it('- check for username field', function() {
				expect(settings.checkForUsername.call(settings)).to.eventually.be.true;
			});
            
			it('- check for password field', function() {
				expect(settings.checkForPassword.call(settings)).to.eventually.be.true;
			});
            
			it('- check for password confirmation field', function() {
				expect(settings.checkForPasswordConfirmation.call(settings)).to
					.eventually.be.true;
			});
		});

		describe('- general information section', function() {
			it('- check for last name field', function() {
				expect(settings.checkForLName.call(settings)).to.eventually.be.true;
			});

			it('- check for first name field', function() {
				expect(settings.checkForFName.call(settings)).to.eventually.be.true;
			});
                
			it('- check for email field', function() {
				expect(settings.checkForEmail.call(settings)).to.eventually.be.true;
			});
		});

		describe('- user information section', function() {
			it('- check for fos field', function() {
				expect(settings.checkForFOS.call(settings)).to.eventually.be.true;
			});
		});
        
		describe('- user filter section', function() {
			it('- check for admin preset field', function() {
				expect(settings.checkForAdminPreset.call(settings)).to.eventually.be.true;
			});
		});
	});
    
	describe('- edit an user', function() {
		var new_username = '123abcd';
		var new_password = new_username;
		var new_lname = 'Bar Change';
		var new_fname = 'Foo Change';
		var new_email = 'foochange@barchange.com';
        
		describe('- authentication settings', function() {
			beforeEach(function setUp() {
				utils.openSettings()
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('/settings'));
			});

			it('- edit username', function() {
				settings.setUsername(new_username)
					.then(expect(settings.getUsername.call(settings)).to.eventually.equal(new_username))
					.then(settings.saveUser.call(settings))
					.then(welcome.clickSignInButton.call(welcome))
					.then(login.fullSignIn.bind(login, {username: new_username, password: default_user.password}));
			});

			it('- edit password', function() {
				settings.setPassword(new_password)
					.then(settings.setPasswordConfirmation.call(settings, new_password))
					.then(expect(settings.getPassword.call(settings)).to.eventually.equal(new_password))
					.then(expect(settings.getPasswordConfirmation.call(settings)).to
						.eventually.equal(new_password))
					.then(settings.saveUser.call(settings))
					.then(welcome.clickSignInButton.call(welcome))
					.then(login.fullSignIn.bind(login, {username: new_username, password: new_password}));
			});
		});
        
		describe('- other settings', function() {
			before(function setUp() {
				utils.openSettings()
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('/settings'));
			});
            
			after(function cleanUp() {
				settings.closeEditUserForm()
					.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/settings'))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('/roles'));
			});

			it('- edit last name', function() {
				settings.setLName(new_lname)
					.then(expect(settings.getLName.call(settings)).to.eventually.equal(new_lname))
					.then(settings.saveUser.call(settings))
					.then(utils.openSettings.call(utils))
					.then(expect(settings.getLName.call(settings)).to.eventually.equal(new_lname));
			});
            
			it('- edit first name', function() {
				settings.setFName(new_fname)
					.then(expect(settings.getFName.call(settings)).to.eventually.equal(new_fname))
					.then(settings.saveUser.call(settings))
					.then(utils.openSettings.call(utils))
					.then(expect(settings.getFName.call(settings)).to.eventually.equal(new_fname));
			});
            
			it('- edit email', function() {
				settings.setEmail(new_email)
					.then(expect(settings.getEmail.call(settings)).to.eventually.equal(new_email))
					.then(settings.saveUser.call(settings))
					.then(utils.openSettings.call(utils))
					.then(expect(settings.getEmail.call(settings)).to.eventually.equal(new_email));
			});
            
			it('- edit field of specialization', function() {
				settings.selectFOS(default_user.fos[0].index)
					.then(expect(settings.isOptionSelected.call(settings, default_user.fos[0].name))
						.to.eventually.be.true)
					.then(settings.selectFOS.call(settings, default_user.fos[1].index))
					.then(expect(settings.isOptionSelected.call(settings, default_user.fos[1].name))
						.to.eventually.be.true)
					.then(settings.saveUser.call(settings))
					.then(utils.openSettings.call(utils))
					.then(expect(settings.isOptionSelected.call(settings, default_user.fos[0].name))
						.to.eventually.be.true)
					.then(expect(settings.isOptionSelected.call(settings, default_user.fos[1].name))
						.to.eventually.be.true);
			});
		});
        
		describe('- preset setting', function() {
			var filter_name = 'To be updated later....';

			before (function setUp() {
				role.selectRole('Admin')
					.then(admin.manageApps.call(admin))
					.then(filter.openFilterModal.call(filter))
					.then(filter.waitForModalOpen.call(filter))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.applicant))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.degree))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.sid))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.applicant.index)).to
						.eventually.contain('1'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.degree.index)).to
						.eventually.contain('2'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.sid.index)).to
						.eventually.contain('3'))
					.then(expect(filter.columnIsSelected.call(filter, 'Applicant Name'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'Degree Applied For'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'Student Number'))
						.to.eventually.be.true)
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.degree.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.degree.openDD)).to.eventually.be.true)
					.then(filter.searchText.call(filter, 'm'))
					.then(filter.selectIthElement.call(filter, 3))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('MASc'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Degree Applied For = MASc'))
					.then(filter.saveFilter.call(filter, filter_name))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('filter'))
					.then(expect(app.applicationTableIsDisplayed.call(app)).to.eventually.be.true)
					.then(expect(app.tableHeaderExists.call(app)).to.eventually.be.true)
					.then(expect(app.tableBodyExists.call(app)).to.eventually.be.true)
					.then(expect(app.getTableColumns.call(app)).to.eventually.equal(4))
					.then(expect(app.getColumnName.call(app, 0)).to.eventually.equal('Applicant Name'))
					.then(expect(app.getColumnName.call(app, 1)).to.eventually.equal('Degree Applied For'))
					.then(expect(app.getColumnName.call(app, 2)).to.eventually.equal('Student Number'))
					.then(expect(app.getColumnName.call(app, 3)).to.eventually.equal('Actions'))
					.then(filter.openFilterModal())
					.then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.preset.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter.preset.openDD)).to.eventually.be.true)
					.then(filter.searchText.call(filter,filter_name))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to.eventually.contain('To be updated later....'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.applicant.index)).to
						.eventually.contain('1'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.degree.index)).to
						.eventually.contain('2'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.sid.index)).to
						.eventually.contain('3'))
					.then(expect(filter.columnIsSelected.call(filter, 'Applicant Name'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'Degree Applied For'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'Student Number'))
						.to.eventually.be.true)
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Degree Applied For = MASc'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- remove an admin preset', function() {
				utils.openSettings()
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('/settings'))
					.then(settings.selectAdminPreset.call(settings, 0))
					.then(expect(settings.isOptionSelected.call(settings, filter_name))
						.to.eventually.be.false)
					.then(settings.saveUser.call(settings))
					.then(utils.openSettings.call(utils))
					.then(expect(settings.isOptionSelected.call(settings, filter_name))
						.to.eventually.be.false)
					.then(settings.closeEditUserForm.call(settings))
					.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/settings'))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('/roles'));
			});
		});
	});
});

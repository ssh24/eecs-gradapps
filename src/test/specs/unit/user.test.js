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
var User = require('../../views/user-view');
var Utils = require('../../lib/utils/shared-utils');
var Welcome = require('../../views/welcome-view');

var config = require('../../lib/utils/config');

describe('Manage Users Test', function() {
	var timeout = ms('60s');
	this.timeout(timeout);

	var admin = new Admin(timeout);
	var app = new Application(timeout);
	var filter = new Filter(timeout);
	var login = new Login(timeout);
	var role = new Role(timeout);
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
	var userIndex = 76;

	before(function setUp() {
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
		welcome.clickSignInButton()
			.then(login.fullSignIn.bind(login, config.credentials.app.admin))
			.then(role.selectRole.call(role, 'Admin'))
			.then(admin.manageUsers.call(admin));
	});

	after(function cleanUp(done) {
		utils.logOut()
			.then(function() {
				require('../../seed');
			}).then(function() {
				browser.restart();
			}).then(function() {
				utils.stopApp(done);
			});
	});

	it('- table loads properly', function() {
		expect(user.applicationTableIsDisplayed.call(user)).to.eventually.be.true;
	});
		
	it('- table header loads properly', function() {
		expect(user.tableHeaderExists.call(user)).to.eventually.be.true;
	});
		
	it('- table body loads properly', function() {
		expect(user.tableBodyExists.call(user)).to.eventually.be.true;
	});
		
	it('- get refresh table text', function() {
		expect(user.getRefreshTableText.call(user)).to.eventually
			.contain('Refresh Current Table');
	});
	
	it('- perform refresh table action', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('/users')
			.then(user.refreshTable.call(user));
	});
    
	describe('- order applications', function() {
		describe('- name column', function() {
			afterEach(function cleanUpEach() {
				user.refreshTable();
			});
	
			it('- order column in ascending order', function() {
				expect(user.getSortType.call(user, 0)).to.eventually.equal('none')
					.then(user.orderColumn.call(user, 0, 1))
					.then(expect(user.getSortType.call(user, 0)).to.eventually.equal('ascending'));
			});
	
			it('- order column in ascending order and then descending order', function() {
				expect(user.getSortType.call(user, 0)).to.eventually.equal('none')
					.then(user.orderColumn.call(user, 0, 1))
					.then(expect(user.getSortType.call(user, 0)).to.eventually.equal('ascending'))
					.then(user.orderColumn.call(user, 0, -1))
					.then(expect(user.getSortType.call(user, 0)).to.eventually.equal('descending'));
			});
	
			it('- order column in descending order', function() {
				expect(user.getSortType.call(user, 0)).to.eventually.equal('none')
					.then(user.orderColumn.call(user, 0, -1))
					.then(expect(user.getSortType.call(user, 0)).to.eventually.equal('descending'));
			});
				
			it('- order column in descending order and then ascending order', function() {
				expect(user.getSortType.call(user, 0)).to.eventually.equal('none')
					.then(user.orderColumn.call(user, 0, -1))
					.then(expect(user.getSortType.call(user, 0)).to.eventually.equal('descending'))
					.then(user.orderColumn.call(user, 0, 1))
					.then(expect(user.getSortType.call(user, 0)).to.eventually.equal('ascending'));
			});
		});
			
		describe('- email column', function() {
			afterEach(function cleanUpEach() {
				user.refreshTable();
			});
	
			it('- order column in ascending order', function() {
				expect(user.getSortType.call(user, 1)).to.eventually.equal('none')
					.then(user.orderColumn.call(user, 1, 1))
					.then(expect(user.getSortType.call(user, 1)).to.eventually.equal('ascending'));
			});
	
			it('- order column in ascending order and then descending order', function() {
				expect(user.getSortType.call(user, 1)).to.eventually.equal('none')
					.then(user.orderColumn.call(user, 1, 1))
					.then(expect(user.getSortType.call(user, 1)).to.eventually.equal('ascending'))
					.then(user.orderColumn.call(user, 1, -1))
					.then(expect(user.getSortType.call(user, 1)).to.eventually.equal('descending'));
			});
	
			it('- order column in descending order', function() {
				expect(user.getSortType.call(user, 1)).to.eventually.equal('none')
					.then(user.orderColumn.call(user, 1, -1))
					.then(expect(user.getSortType.call(user, 1)).to.eventually.equal('descending'));
			});
				
			it('- order column in descending order and then ascending order', function() {
				expect(user.getSortType.call(user, 1)).to.eventually.equal('none')
					.then(user.orderColumn.call(user, 1, -1))
					.then(expect(user.getSortType.call(user, 1)).to.eventually.equal('descending'))
					.then(user.orderColumn.call(user, 1, 1))
					.then(expect(user.getSortType.call(user, 1)).to.eventually.equal('ascending'));
			});
		});
	});
    
	describe('- create new user', function() {
		it('- start a new user and exit out w/o changes', function() {
			user.openNewUserForm()
				.then(expect(browser.getCurrentUrl()).to.eventually.contain('/new'))
				.then(user.closeNewUserForm.call(user))
				.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/new'));
		});
        
		describe('- check for all fields', function() {
			before(function setUp() {
				user.openNewUserForm();
			});
            
			after(function cleanUp() {
				user.closeNewUserForm();
			});

			describe('- login information section', function() {
				it('- check for username field', function() {
					expect(user.checkForUsername.call(user)).to.eventually.be.true;
				});
                
				it('- check for password field', function() {
					expect(user.checkForPassword.call(user)).to.eventually.be.true;
				});
                
				it('- check for password generate button', function() {
					expect(user.checkForPasswordGenerate.call(user)).to.eventually.be.true;
				});
                
				it('- check for password copy button', function() {
					expect(user.checkForPasswordCopy.call(user)).to.eventually.be.true;
				});
			});

			describe('- general information section', function() {
				it('- check for last name field', function() {
					expect(user.checkForLName.call(user)).to.eventually.be.true;
				});
	
				it('- check for first name field', function() {
					expect(user.checkForFName.call(user)).to.eventually.be.true;
				});
					
				it('- check for email field', function() {
					expect(user.checkForEmail.call(user)).to.eventually.be.true;
				});
			});

			describe('- user information section', function() {
				it('- check for fos field', function() {
					expect(user.checkForFOS.call(user)).to.eventually.be.true;
				});
	
				it('- check for roles field', function() {
					expect(user.checkForRoles.call(user)).to.eventually.be.true;
				});
			});
		});
        
		describe('- fill out an user and submit', function() {
			before(function setUp() {
				user.openNewUserForm();
			});
            
			after(function cleanUp() {
				user.submitUser()
					.then(expect(browser.getCurrentUrl()).to.eventually.not
						.equal('/new'))
					.then(user.editUser.call(user, userIndex))
					.then(expect(user.getUsername.call(user)).to.eventually.equal(default_user.username))
					.then(expect(user.getLName.call(user)).to.eventually.equal(default_user.lname))
					.then(expect(user.getFName.call(user)).to.eventually.equal(default_user.fname))
					.then(user.deleteUser.call(user))
					.then(utils.closeBrowserAlert.call(utils));
			});

			it('- input username', function() {
				user.setUsername(default_user.username)
					.then(expect(user.getUsername.call(user)).to.eventually
						.equal(default_user.username));
			});
            
			it('- generate password', function() {
				user.setPassword(default_user.password)
					.then(expect(user.getPassword.call(user)).to.eventually
						.equal(default_user.password));
			});
            
			it('- input last name', function() {
				user.setLName(default_user.lname)
					.then(expect(user.getLName.call(user)).to.eventually
						.equal(default_user.lname));
			});
            
			it('- input first name', function() {
				user.setFName(default_user.fname)
					.then(expect(user.getFName.call(user)).to.eventually
						.equal(default_user.fname));
			});
            
			it('- input email', function() {
				user.setEmail(default_user.email)
					.then(expect(user.getEmail.call(user)).to.eventually
						.equal(default_user.email));
			});
            
			it('- select fos', function() {
				user.selectFOS(default_user.fos[0].index)
					.then(expect(user.isOptionSelected.call(user, default_user.fos[0].name))
						.to.eventually.be.true)
					.then(user.selectFOS.call(user, default_user.fos[1].index))
					.then(expect(user.isOptionSelected.call(user, default_user.fos[1].name))
						.to.eventually.be.true);
			});
            
			it('- select roles', function() {
				user.selectRoles(default_user.roles[0].index)
					.then(expect(user.isOptionSelected.call(user, default_user.roles[0]
						.name)).to.eventually.be.true)
					.then(user.selectRoles.call(user, default_user.roles[1].index))
					.then(expect(user.isOptionSelected.call(user, default_user.roles[1].name))
						.to.eventually.be.true);
			});
		});
	});
    
	describe('- delete an user', function() {
		before(function setUp() {
			user.openNewUserForm()
				.then(user.fillUser.call(user, default_user))
				.then(user.selectRoles.call(user, default_user.roles[0].index))
				.then(expect(user.isOptionSelected.call(user, default_user.roles[0]
					.name)).to.eventually.be.true)
				.then(user.submitUser.call(user));
		});

		it('- delete the user', function() {
			user.editUser(userIndex)
				.then(expect(user.getUsername.call(user)).to.eventually.equal(default_user.username))
				.then(expect(user.getLName.call(user)).to.eventually.equal(default_user.lname))
				.then(expect(user.getFName.call(user)).to.eventually.equal(default_user.fname))
				.then(user.deleteUser.call(user))
				.then(utils.closeBrowserAlert.call(utils));
		});
	});
    
	describe('- edit an user', function() {
		var new_username = '123abcd';
		var new_password = new_username;
		var new_lname = 'Bar Change';
		var new_fname = 'Foo Change';
		var new_email = 'foochange@barchange.com';

		before(function setUp() {
			user.openNewUserForm()
				.then(user.fillUser.call(user, default_user))
				.then(user.selectRoles.call(user, default_user.roles[0].index))
				.then(expect(user.isOptionSelected.call(user, default_user.roles[0]
					.name)).to.eventually.be.true)
				.then(user.submitUser.call(user));
		});
        
		after(function cleanUp() {
			user.editUser(userIndex)
				.then(expect(user.getUsername.call(user)).to.eventually.equal(new_username))
				.then(expect(user.getLName.call(user)).to.eventually.equal(new_lname))
				.then(expect(user.getFName.call(user)).to.eventually.equal(new_fname))
				.then(user.deleteUser.call(user))
				.then(utils.closeBrowserAlert.call(utils));
		});

		it('- edit username', function() {
			user.editUser(userIndex)
				.then(user.setUsername.call(user, new_username))
				.then(expect(user.getUsername.call(user)).to.eventually.equal(new_username))
				.then(user.saveUser.call(user))
				.then(user.editUser.call(user, userIndex))
				.then(expect(user.getUsername.call(user)).to.eventually.equal(new_username))
				.then(user.closeEditUserForm.call(user));
		});
        
		it('- edit password', function() {
			user.editUser(userIndex)
				.then(user.setPassword.call(user, new_password))
				.then(expect(user.getPassword.call(user)).to.eventually.equal(new_password))
				.then(user.saveUser.call(user))
				.then(utils.logOut.call(utils))
				.then(welcome.clickSignInButton.call(welcome))
				.then(login.fullSignIn.bind(login, {username: new_username, password: new_password}))
				.then(expect(browser.getCurrentUrl()).to.eventually.contain('/roles'))
				.then(utils.logOut.call(utils))
				.then(welcome.clickSignInButton.call(welcome))
				.then(login.fullSignIn.bind(login, config.credentials.app.admin))
				.then(role.selectRole.call(role, 'Admin'))
				.then(admin.manageUsers.call(admin));
		});
        
		it('- edit last name', function() {
			user.editUser(userIndex)
				.then(user.setLName.call(user, new_lname))
				.then(expect(user.getLName.call(user)).to.eventually.equal(new_lname))
				.then(user.saveUser.call(user))
				.then(user.editUser.call(user, userIndex))
				.then(expect(user.getLName.call(user)).to.eventually.equal(new_lname))
				.then(user.closeEditUserForm.call(user));
		});
        
		it('- edit first name', function() {
			user.editUser(userIndex)
				.then(user.setFName.call(user, new_fname))
				.then(expect(user.getFName.call(user)).to.eventually.equal(new_fname))
				.then(user.saveUser.call(user))
				.then(user.editUser.call(user, userIndex))
				.then(expect(user.getFName.call(user)).to.eventually.equal(new_fname))
				.then(user.closeEditUserForm.call(user));
		});
        
		it('- edit email', function() {
			user.editUser(userIndex)
				.then(user.setEmail.call(user, new_email))
				.then(expect(user.getEmail.call(user)).to.eventually.equal(new_email))
				.then(user.saveUser.call(user))
				.then(user.editUser.call(user, userIndex))
				.then(expect(user.getEmail.call(user)).to.eventually.equal(new_email))
				.then(user.closeEditUserForm.call(user));
		});
        
		it('- edit field of specialization', function() {
			user.editUser(userIndex)
				.then(user.selectFOS.call(user, default_user.fos[0].index))
				.then(expect(user.isOptionSelected.call(user, default_user.fos[0].name))
					.to.eventually.be.true)
				.then(user.selectFOS.call(user, default_user.fos[1].index))
				.then(expect(user.isOptionSelected.call(user, default_user.fos[1].name))
					.to.eventually.be.true)
				.then(user.saveUser.call(user))
				.then(user.editUser.call(user, userIndex))
				.then(expect(user.isOptionSelected.call(user, default_user.fos[0].name))
					.to.eventually.be.true)
				.then(expect(user.isOptionSelected.call(user, default_user.fos[1].name))
					.to.eventually.be.true)
				.then(user.closeEditUserForm.call(user));
		});
        
		it('- edit roles', function() {
			user.editUser(userIndex)
				.then(user.selectRoles.call(user, default_user.roles[1].index))
				.then(expect(user.isOptionSelected.call(user, default_user.roles[1]
					.name)).to.eventually.be.true)
				.then(user.saveUser.call(user))
				.then(user.editUser.call(user, userIndex))
				.then(expect(user.isOptionSelected.call(user, default_user.roles[1]
					.name)).to.eventually.be.true)
				.then(user.closeEditUserForm.call(user));
		});
        
		describe('- edit preset', function() {
			var filter_name = 'To be updated later....';

			before (function setUp() {
				utils.logOut()
					.then(welcome.clickSignInButton.call(welcome))
					.then(login.fullSignIn.bind(login, {username: new_username, password: new_password}))
					.then(role.selectRole.call(role, 'Admin'))
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
					.then(filter.closeFilterModal.call(filter))
					.then(utils.logOut.call(utils))
					.then(welcome.clickSignInButton.call(welcome))
					.then(login.fullSignIn.bind(login, config.credentials.app.admin))
					.then(role.selectRole.call(role, 'Admin'))
					.then(admin.manageUsers.call(admin));
			});

			it('- remove an admin preset', function() {
				user.editUser(userIndex)
					.then(user.selectAdminPreset.call(user, 0))
					.then(expect(user.isOptionSelected.call(user, filter_name))
						.to.eventually.be.false)
					.then(user.saveUser.call(user))
					.then(user.editUser.call(user, userIndex))
					.then(expect(user.isOptionSelected.call(user, filter_name))
						.to.eventually.be.false)
					.then(user.closeEditUserForm.call(user));
			});
		});
	});
});

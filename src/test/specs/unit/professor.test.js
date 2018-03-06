'use strict';

var async = require('async');
var config = require('../../lib/utils/config');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var ms = require('ms');
var mysql = require('mysql2');

var Application = require('../../../controller/application');
var Auth = require('../../../controller/auth');

var Filter = require('../../views/filter-view');
var Login = require('../../views/login-view');
var Professor = require('../../views/professor-view');
var Role = require('../../views/role-view');
var Utils = require('../../lib/utils/shared-utils');
var Welcome = require('../../views/welcome-view');

var application, auth, connection, timeout;
var creds = config.credentials.database;

describe('Professor Test', function() {
	timeout = ms('30s');
	this.timeout(timeout);

	var filter = new Filter(timeout);
	var login = new Login(timeout);
	var prof = new Professor(timeout);
	var role = new Role(timeout);
	var utils = new Utils(timeout);
	var welcome = new Welcome(timeout);
	var newUser = {
		username: 'boneham',
		password: 'boneham',
		fullname: 'Sheff Boneham'
	};

	before(function setUp() {
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
		welcome.clickSignInButton()
			.then(login.fullSignIn.bind(login, config.credentials.app))
			.then(role.selectRole.bind(role, 'Professor'));
	});

	after(function cleanUp(done) {
		utils.logOut()
			.then(function() {
				require('../../pretest');
				browser.restart();
				utils.stopApp(done);
			});
	});
    
	it('- table loads properly', function() {
		expect(prof.applicationTableIsDisplayed.call(prof)).to.eventually.be.true;
	});
    
	it('- table header loads properly', function() {
		expect(prof.tableHeaderExists.call(prof)).to.eventually.be.true;
	});
    
	it('- table body loads properly', function() {
		expect(prof.tableBodyExists.call(prof)).to.eventually.be.true;
	});
    
	it('- get contact status text', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.getContactedText.call(prof, true)).to.eventually
				.contain('Contacted'))
			.then(prof.closeSetToDropDown.call(prof));
	});
    
	it('- get request status text', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.getRequestedText.call(prof, true)).to.eventually
				.contain('Requested'))
			.then(prof.closeSetToDropDown.call(prof));
	});
    
	it('- get interest status text', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.getInterestedText.call(prof, true)).to.eventually
				.contain('Interested'))
			.then(prof.closeSetToDropDown.call(prof));
	});
    
	it('- open set to drop down menu', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(prof.closeSetToDropDown.call(prof));
	});
    
	it('- close set to drop down menu', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(prof.closeSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.false);
	});
    
	it('- set to contacted', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getContactedText.call(prof, true)).to.eventually
				.contain('Contacted'))
			.then(prof.setContacted.call(prof, true))
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getContactedText.call(prof, false)).to.eventually
				.contain('Not Contacted'))
			.then(prof.closeSetToDropDown.call(prof));
	});
    
	it('- set to requested', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getRequestedText.call(prof, true)).to.eventually
				.contain('Requested'))
			.then(prof.setRequested.call(prof, true))
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getRequestedText.call(prof, false)).to.eventually
				.contain('Not Requested'))
			.then(prof.closeSetToDropDown.call(prof));
	});
    
	it('- set to interested', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getInterestedText.call(prof, true)).to.eventually
				.contain('Interested'))
			.then(prof.setInterested.call(prof, true))
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getInterestedText.call(prof, false)).to.eventually
				.contain('Not Interested'))
			.then(prof.closeSetToDropDown.call(prof));
	});
    
	it('- set to not contacted', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getContactedText.call(prof, false)).to.eventually
				.contain('Not Contacted'))
			.then(prof.setContacted.call(prof, false))
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getContactedText.call(prof, true)).to.eventually
				.contain('Contacted'))
			.then(prof.closeSetToDropDown.call(prof));
	});
    
	it('- set to not requested', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getRequestedText.call(prof, false)).to.eventually
				.contain('Not Requested'))
			.then(prof.setRequested.call(prof, false))
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getRequestedText.call(prof, true)).to.eventually
				.contain('Requested'))
			.then(prof.closeSetToDropDown.call(prof));
	});
    
	it('- set to not interested', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getInterestedText.call(prof, false)).to.eventually
				.contain('Not Interested'))
			.then(prof.setInterested.call(prof, false))
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getInterestedText.call(prof, true)).to.eventually
				.contain('Interested'))
			.then(prof.closeSetToDropDown.call(prof));
	});
    
	it('- set to contacted and check data', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getContactedText.call(prof, true)).to.eventually
				.contain('Contacted'))
			.then(prof.setContacted.call(prof, true))
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getContactedText.call(prof, false)).to.eventually
				.contain('Not Contacted'))
			.then(prof.closeSetToDropDown.call(prof))
			.then(expect(prof.getContactedData.call(prof)).to.eventually
				.contain(config.credentials.app.fullname));
	});
    
	it('- set to requested and check data', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getRequestedText.call(prof, true)).to.eventually
				.contain('Requested'))
			.then(prof.setRequested.call(prof, true))
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getRequestedText.call(prof, false)).to.eventually
				.contain('Not Requested'))
			.then(prof.closeSetToDropDown.call(prof))
			.then(expect(prof.getRequestedData.call(prof)).to.eventually
				.contain(config.credentials.app.fullname));
	});
    
	it('- set to interested and check data', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getInterestedText.call(prof, true)).to.eventually
				.contain('Interested'))
			.then(prof.setInterested.call(prof, true))
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getInterestedText.call(prof, false)).to.eventually
				.contain('Not Interested'))
			.then(prof.closeSetToDropDown.call(prof))
			.then(expect(prof.getInterestedData.call(prof)).to.eventually
				.equal('Interested'));
	});
    
	it('- set to not contacted and check data', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getContactedText.call(prof, false)).to.eventually
				.contain('Not Contacted'))
			.then(prof.setContacted.call(prof, false))
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getContactedText.call(prof, true)).to.eventually
				.contain('Contacted'))
			.then(prof.closeSetToDropDown.call(prof))
			.then(expect(prof.getContactedData.call(prof)).to.eventually.not
				.contain(config.credentials.app.fullname));
	});
    
	it('- set to not requested and check data', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getRequestedText.call(prof, false)).to.eventually
				.contain('Not Requested'))
			.then(prof.setRequested.call(prof, false))
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getRequestedText.call(prof, true)).to.eventually
				.contain('Requested'))
			.then(prof.closeSetToDropDown.call(prof))
			.then(expect(prof.getRequestedData.call(prof)).to.eventually.not
				.contain(config.credentials.app.fullname));
	});
    
	it('- set to not interested and check data', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('professor')
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getInterestedText.call(prof, false)).to.eventually
				.contain('Not Interested'))
			.then(prof.setInterested.call(prof, false))
			.then(prof.openSetToDropDown.call(prof))
			.then(expect(prof.isSetToDDOpen.call(prof)).to.eventually.be.true)
			.then(expect(prof.getInterestedText.call(prof, true)).to.eventually
				.contain('Interested'))
			.then(prof.closeSetToDropDown.call(prof))
			.then(expect(prof.getInterestedData.call(prof)).to.eventually.not
				.equal('Interested'));
	});

	describe('- refresh table', function() {
		before(function overallSetup(done) {
			connection = mysql.createConnection(creds);
			application = new Application(connection);
			auth = new Auth(connection);
			async.series([
				function(callback) {
					connection.connect(callback);
				},
				function(callback) {
					auth.logIn(3, callback);
				},
				function(callback) {
					auth.selectRole(3, 'Professor', callback);
				},
				function(callback) {
					application.updateRequestedStatus(1, 3, newUser.fullname, 0, 
						callback);
				},
				function(callback) {
					application.updateContactedStatus(1, 3, newUser.fullname, 0, 
						callback);
				}
			], done);
		});
		
		after(function overallCleanUp(done) {
			async.series([
				function(callback) {
					auth.logOut(3, callback);
				},
				function(callback) {
					connection.end(callback);
				}
			], done);
		});

		it('- check contacted data to contain name', function() {
			expect(prof.getContactedData.call(prof)).to.eventually
				.contain(newUser.fullname);
		});

		it('- check requested data to contain name', function() {
			expect(prof.getRequestedData.call(prof)).to.eventually
				.contain(newUser.fullname);
		});
		
		it('- get refresh table text', function() {
			expect(prof.getRefreshTableText.call(prof)).to.eventually
				.contain('Refresh Current Table');
		});

		it('- perform refresh table action', function() {
			expect(browser.getCurrentUrl()).to.eventually.contain('professor')
				.then(prof.refreshTable.call(prof));
		});

		it('- check contacted data to not contain name', function() {
			expect(prof.getContactedData.call(prof)).to.eventually.not
				.contain(newUser.fullname);
		});

		it('- check requested data to not contain name', function() {
			expect(prof.getRequestedData.call(prof)).to.eventually.not
				.contain(newUser.fullname);
		});
	});

	describe('- order applications', function() {
		describe('- name column', function() {
			afterEach(function cleanUpEach() {
				prof.refreshTable();
			});

			it('- order column in ascending order', function() {
				expect(prof.getSortType.call(prof, 0)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 0, 1))
					.then(expect(prof.getSortType.call(prof, 0)).to.eventually.equal('ascending'));
			});

			it('- order column in ascending order and then descending order', function() {
				expect(prof.getSortType.call(prof, 0)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 0, 1))
					.then(expect(prof.getSortType.call(prof, 0)).to.eventually.equal('ascending'))
					.then(prof.orderColumn.call(prof, 0, -1))
					.then(expect(prof.getSortType.call(prof, 0)).to.eventually.equal('descending'));
			});

			it('- order column in descending order', function() {
				expect(prof.getSortType.call(prof, 0)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 0, -1))
					.then(expect(prof.getSortType.call(prof, 0)).to.eventually.equal('descending'));
			});
			
			it('- order column in descending order and then ascending order', function() {
				expect(prof.getSortType.call(prof, 0)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 0, -1))
					.then(expect(prof.getSortType.call(prof, 0)).to.eventually.equal('descending'))
					.then(prof.orderColumn.call(prof, 0, 1))
					.then(expect(prof.getSortType.call(prof, 0)).to.eventually.equal('ascending'));
			});
		});

		describe('- gender column', function() {
			afterEach(function cleanUpEach() {
				prof.refreshTable();
			});

			it('- order column in ascending order', function() {
				expect(prof.getSortType.call(prof, 1)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 1, 1))
					.then(expect(prof.getSortType.call(prof, 1)).to.eventually.equal('ascending'));
			});

			it('- order column in ascending order and then descending order', function() {
				expect(prof.getSortType.call(prof, 1)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 1, 1))
					.then(expect(prof.getSortType.call(prof, 1)).to.eventually.equal('ascending'))
					.then(prof.orderColumn.call(prof, 1, -1))
					.then(expect(prof.getSortType.call(prof, 1)).to.eventually.equal('descending'));
			});

			it('- order column in descending order', function() {
				expect(prof.getSortType.call(prof, 1)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 1, -1))
					.then(expect(prof.getSortType.call(prof, 1)).to.eventually.equal('descending'));
			});
			
			it('- order column in descending order and then ascending order', function() {
				expect(prof.getSortType.call(prof, 1)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 1, -1))
					.then(expect(prof.getSortType.call(prof, 1)).to.eventually.equal('descending'))
					.then(prof.orderColumn.call(prof, 1, 1))
					.then(expect(prof.getSortType.call(prof, 1)).to.eventually.equal('ascending'));
			});
		});

		describe('- committee rank column', function() {
			afterEach(function cleanUpEach() {
				prof.refreshTable();
			});

			it('- order name column in ascending order', function() {
				expect(prof.getSortType.call(prof, 4)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 4, 1))
					.then(expect(prof.getSortType.call(prof, 4)).to.eventually.equal('ascending'));
			});

			it('- order name column in ascending order and then descending order', function() {
				expect(prof.getSortType.call(prof, 4)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 4, 1))
					.then(expect(prof.getSortType.call(prof, 4)).to.eventually.equal('ascending'))
					.then(prof.orderColumn.call(prof, 4, -1))
					.then(expect(prof.getSortType.call(prof, 4)).to.eventually.equal('descending'));
			});

			it('- order name column in descending order', function() {
				expect(prof.getSortType.call(prof, 4)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 4, -1))
					.then(expect(prof.getSortType.call(prof, 4)).to.eventually.equal('descending'));
			});
			
			it('- order name column in descending order and then ascending order', function() {
				expect(prof.getSortType.call(prof, 4)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 4, -1))
					.then(expect(prof.getSortType.call(prof, 4)).to.eventually.equal('descending'))
					.then(prof.orderColumn.call(prof, 4, 1))
					.then(expect(prof.getSortType.call(prof, 4)).to.eventually.equal('ascending'));
			});
		});

		describe('- gpa column', function() {
			afterEach(function cleanUpEach() {
				prof.refreshTable();
			});

			it('- order column in ascending order', function() {
				expect(prof.getSortType.call(prof, 5)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 5, 1))
					.then(expect(prof.getSortType.call(prof, 5)).to.eventually.equal('ascending'));
			});

			it('- order column in ascending order and then descending order', function() {
				expect(prof.getSortType.call(prof, 5)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 5, 1))
					.then(expect(prof.getSortType.call(prof, 5)).to.eventually.equal('ascending'))
					.then(prof.orderColumn.call(prof, 5, -1))
					.then(expect(prof.getSortType.call(prof, 5)).to.eventually.equal('descending'));
			});

			it('- order column in descending order', function() {
				expect(prof.getSortType.call(prof, 5)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 5, -1))
					.then(expect(prof.getSortType.call(prof, 5)).to.eventually.equal('descending'));
			});
			
			it('- order column in descending order and then ascending order', function() {
				expect(prof.getSortType.call(prof, 5)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 5, -1))
					.then(expect(prof.getSortType.call(prof, 5)).to.eventually.equal('descending'))
					.then(prof.orderColumn.call(prof, 5, 1))
					.then(expect(prof.getSortType.call(prof, 5)).to.eventually.equal('ascending'));
			});
		});

		describe('- degree column', function() {
			afterEach(function cleanUpEach() {
				prof.refreshTable();
			});

			it('- order column in ascending order', function() {
				expect(prof.getSortType.call(prof, 6)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 6, 1))
					.then(expect(prof.getSortType.call(prof, 6)).to.eventually.equal('ascending'));
			});

			it('- order column in ascending order and then descending order', function() {
				expect(prof.getSortType.call(prof, 6)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 6, 1))
					.then(expect(prof.getSortType.call(prof, 6)).to.eventually.equal('ascending'))
					.then(prof.orderColumn.call(prof, 6, -1))
					.then(expect(prof.getSortType.call(prof, 6)).to.eventually.equal('descending'));
			});

			it('- order column in descending order', function() {
				expect(prof.getSortType.call(prof, 6)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 6, -1))
					.then(expect(prof.getSortType.call(prof, 6)).to.eventually.equal('descending'));
			});
			
			it('- order column in descending order and then ascending order', function() {
				expect(prof.getSortType.call(prof, 6)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 6, -1))
					.then(expect(prof.getSortType.call(prof, 6)).to.eventually.equal('descending'))
					.then(prof.orderColumn.call(prof, 6, 1))
					.then(expect(prof.getSortType.call(prof, 6)).to.eventually.equal('ascending'));
			});
		});

		describe('- visa status column', function() {
			afterEach(function cleanUpEach() {
				prof.refreshTable();
			});

			it('- order column in ascending order', function() {
				expect(prof.getSortType.call(prof, 7)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 7, 1))
					.then(expect(prof.getSortType.call(prof, 7)).to.eventually.equal('ascending'));
			});

			it('- order column in ascending order and then descending order', function() {
				expect(prof.getSortType.call(prof, 7)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 7, 1))
					.then(expect(prof.getSortType.call(prof, 7)).to.eventually.equal('ascending'))
					.then(prof.orderColumn.call(prof, 7, -1))
					.then(expect(prof.getSortType.call(prof, 7)).to.eventually.equal('descending'));
			});

			it('- order column in descending order', function() {
				expect(prof.getSortType.call(prof, 7)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 7, -1))
					.then(expect(prof.getSortType.call(prof, 7)).to.eventually.equal('descending'));
			});
			
			it('- order column in descending order and then ascending order', function() {
				expect(prof.getSortType.call(prof, 7)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 7, -1))
					.then(expect(prof.getSortType.call(prof, 7)).to.eventually.equal('descending'))
					.then(prof.orderColumn.call(prof, 7, 1))
					.then(expect(prof.getSortType.call(prof, 7)).to.eventually.equal('ascending'));
			});
		});

		describe('- program decision column', function() {
			afterEach(function cleanUpEach() {
				prof.refreshTable();
			});

			it('- order column in ascending order', function() {
				expect(prof.getSortType.call(prof, 8)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 8, 1))
					.then(expect(prof.getSortType.call(prof, 8)).to.eventually.equal('ascending'));
			});

			it('- order column in ascending order and then descending order', function() {
				expect(prof.getSortType.call(prof, 8)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 8, 1))
					.then(expect(prof.getSortType.call(prof, 8)).to.eventually.equal('ascending'))
					.then(prof.orderColumn.call(prof, 8, -1))
					.then(expect(prof.getSortType.call(prof, 8)).to.eventually.equal('descending'));
			});

			it('- order column in descending order', function() {
				expect(prof.getSortType.call(prof, 8)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 8, -1))
					.then(expect(prof.getSortType.call(prof, 8)).to.eventually.equal('descending'));
			});
			
			it('- order column in descending order and then ascending order', function() {
				expect(prof.getSortType.call(prof, 8)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 8, -1))
					.then(expect(prof.getSortType.call(prof, 8)).to.eventually.equal('descending'))
					.then(prof.orderColumn.call(prof, 8, 1))
					.then(expect(prof.getSortType.call(prof, 8)).to.eventually.equal('ascending'));
			});
		});

		describe('- my interest status column', function() {
			afterEach(function cleanUpEach() {
				prof.refreshTable();
			});

			it('- order column in ascending order', function() {
				expect(prof.getSortType.call(prof, 0)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 11, 1))
					.then(expect(prof.getSortType.call(prof, 11)).to.eventually.equal('ascending'));
			});

			it('- order column in ascending order and then descending order', function() {
				expect(prof.getSortType.call(prof, 11)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 11, 1))
					.then(expect(prof.getSortType.call(prof, 11)).to.eventually.equal('ascending'))
					.then(prof.orderColumn.call(prof, 11, -1))
					.then(expect(prof.getSortType.call(prof, 11)).to.eventually.equal('descending'));
			});

			it('- order column in descending order', function() {
				expect(prof.getSortType.call(prof, 11)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 11, -1))
					.then(expect(prof.getSortType.call(prof, 11)).to.eventually.equal('descending'));
			});
			
			it('- order column in descending order and then ascending order', function() {
				expect(prof.getSortType.call(prof, 11)).to.eventually.equal('none')
					.then(prof.orderColumn.call(prof, 11, -1))
					.then(expect(prof.getSortType.call(prof, 11)).to.eventually.equal('descending'))
					.then(prof.orderColumn.call(prof, 11, 1))
					.then(expect(prof.getSortType.call(prof, 11)).to.eventually.equal('ascending'));
			});
		});
	});

	describe('- filter applications', function() {

		describe('- check for all fields', function() {
			it('- get applicant name field', function() {
				filter.openFilterModal()
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.applicant)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- get field of interest field', function() {
				filter.openFilterModal()
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.foi)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- get professor name field', function() {
				filter.openFilterModal()
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.professor)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- get gender field', function() {
				filter.openFilterModal()
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.gender)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- get committee rank field', function() {
				filter.openFilterModal()
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.crank)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- get gpa field', function() {
				filter.openFilterModal()
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.gpa)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- get degree applied for field', function() {
				filter.openFilterModal()
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.degree)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- get visa status field', function() {
				filter.openFilterModal()
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.vstatus)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- get program decision field', function() {
				filter.openFilterModal()
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.pdecision)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- get contacted by field', function() {
				filter.openFilterModal()
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.contacted)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- get requested by field', function() {
				filter.openFilterModal()
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.requested)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- get interested by field', function() {
				filter.openFilterModal()
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.interested)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});
		});

		describe('- select an element from each field using drop down', function() {
			after(function cleanUp() {
				prof.refreshTable();
			});

			it('- open applicant name drop down and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.applicant.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.applicant.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 8))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Chrysa Really'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Name = Chrysa Really'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open gender drop down and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.gender.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.gender.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('M'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Gender = M'))
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- open field of interest drop down and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.foi.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.foi.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Bioinformatics'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Field of Interest = Bioinformatics'))
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- open professor name drop down and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.professor.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.professor.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Aijun An'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Preferred Professor = Aijun An'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open committee rank drop down and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.crank.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.crank.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('= A'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Committee Ranking = A'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open gpa drop down and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.gpa.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.gpa.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('> A'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('GPA > A'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open degree applied for drop down and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.degree.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.degree.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 3))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('MASc'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Degree Applied For = MASc'))
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- open visa status drop down and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.vstatus.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.vstatus.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Domestic'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Visa Status = Domestic'))
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- open program decision drop down and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.pdecision.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.pdecision.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Accepted'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Program Decision = Accepted'))
					.then(filter.closeFilterModal.call(filter));
			});


			it('- open contacted by drop down and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.contacted.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.contacted.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Aijun An'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Contacted By = Aijun An'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open requested by drop down and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.requested.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.requested.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Aijun An'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Requested By = Aijun An'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open interested by drop down and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.interested.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.interested.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 3))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Not Interested'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('My Interest Status = Not Interested'))
					.then(filter.closeFilterModal.call(filter));
			});
		});

		describe('- select an element from each field by sending keys', function() {
			after(function cleanUp() {
				prof.refreshTable();
			});

			it('- open applicant name drop down, type and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.applicant.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.applicant.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'ea'))
					.then(filter.selectIthElement.call(filter, 8))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Chrysa Really'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Name = Chrysa Really'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open gender drop down, type and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.gender.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.gender.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'M'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('M'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Gender = M'))
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- open field of interest drop down, type and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.foi.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.foi.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'in'))
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Bioinformatics'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Field of Interest = Bioinformatics'))
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- open professor name drop down, type and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.professor.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.professor.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'an'))
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Aijun An'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Preferred Professor = Aijun An'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open committee rank drop down, type and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.crank.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.crank.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'a'))
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('= A'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Committee Ranking = A'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open gpa drop down, type and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.gpa.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.gpa.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'A'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('> A'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('GPA > A'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open degree applied for drop down, type and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.degree.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.degree.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'm'))
					.then(filter.selectIthElement.call(filter, 3))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('MASc'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Degree Applied For = MASc'))
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- open visa status drop down, type and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.vstatus.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.vstatus.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 's'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Domestic'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Visa Status = Domestic'))
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- open program decision drop down, type and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.pdecision.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.pdecision.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'ce'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Accepted'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Program Decision = Accepted'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open contacted by drop down, type and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.contacted.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.contacted.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'an'))
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Aijun An'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Contacted By = Aijun An'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open requested by drop down, type and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.requested.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.requested.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'an'))
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Aijun An'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Requested By = Aijun An'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open interested by drop down, type and select an element', function() {
				filter.openFilterModal()
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.interested.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.interested.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'INT'))
					.then(filter.selectIthElement.call(filter, 3))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Not Interested'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('My Interest Status = Not Interested'))
					.then(filter.closeFilterModal.call(filter));
			});
		});

		describe('- select columns', function() {
			after(function cleanUp() {
				prof.refreshTable();
			});

			it('- select name column', function() {
				filter.openFilterModal()
					.then(expect(filter.columnIsSelected.call(filter, 'Name'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.applicant))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.applicant.index)).to
						.eventually.contain('1'))
					.then(expect(filter.columnIsSelected.call(filter, 'Name'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select gender column', function() {
				filter.openFilterModal()
					.then(expect(filter.columnIsSelected.call(filter, 'Gender'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.gender))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.gender.index)).to
						.eventually.contain('2'))
					.then(expect(filter.columnIsSelected.call(filter, 'Gender'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select foi column', function() {
				filter.openFilterModal()
					.then(expect(filter.columnIsSelected.call(filter, 'Fields of Interest'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.foi))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.foi.index)).to
						.eventually.contain('3'))
					.then(expect(filter.columnIsSelected.call(filter, 'Fields of Interest'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select professor column', function() {
				filter.openFilterModal()
					.then(expect(filter.columnIsSelected.call(filter, 'Preferred Professor'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.professor))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.professor.index)).to
						.eventually.contain('4'))
					.then(expect(filter.columnIsSelected.call(filter, 'Preferred Professor'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select committee rank column', function() {
				filter.openFilterModal()
					.then(expect(filter.columnIsSelected.call(filter, 'Committee Ranking'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.crank))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.crank.index)).to
						.eventually.contain('5'))
					.then(expect(filter.columnIsSelected.call(filter, 'Committee Ranking'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select gpa column', function() {
				filter.openFilterModal()
					.then(expect(filter.columnIsSelected.call(filter, 'GPA'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.gpa))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.gpa.index)).to
						.eventually.contain('6'))
					.then(expect(filter.columnIsSelected.call(filter, 'GPA'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select degree column', function() {
				filter.openFilterModal()
					.then(expect(filter.columnIsSelected.call(filter, 'Degree Applied For'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.degree))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.degree.index)).to
						.eventually.contain('7'))
					.then(expect(filter.columnIsSelected.call(filter, 'Degree Applied For'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select visa status column', function() {
				filter.openFilterModal()
					.then(expect(filter.columnIsSelected.call(filter, 'Visa Status'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.vstatus))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.vstatus.index)).to
						.eventually.contain('8'))
					.then(expect(filter.columnIsSelected.call(filter, 'Visa Status'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select contact status column', function() {
				filter.openFilterModal()
					.then(expect(filter.columnIsSelected.call(filter, 'Program Decision'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.pdecision))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.pdecision.index)).to
						.eventually.contain('9'))
					.then(expect(filter.columnIsSelected.call(filter, 'Program Decision'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select contact status column', function() {
				filter.openFilterModal()
					.then(expect(filter.columnIsSelected.call(filter, 'Contacted By'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.contacted))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.contacted.index)).to
						.eventually.contain('10'))
					.then(expect(filter.columnIsSelected.call(filter, 'Contacted By'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select request status column', function() {
				filter.openFilterModal()
					.then(expect(filter.columnIsSelected.call(filter, 'Requested By'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.requested))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.requested.index)).to
						.eventually.contain('11'))
					.then(expect(filter.columnIsSelected.call(filter, 'Requested By'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select interest status column', function() {
				filter.openFilterModal()
					.then(expect(filter.columnIsSelected.call(filter, 'My Interest Status'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.interested))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.interested.index)).to
						.eventually.contain('12'))
					.then(expect(filter.columnIsSelected.call(filter, 'My Interest Status'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select actions column', function() {
				filter.openFilterModal()
					.then(expect(filter.columnIsSelected.call(filter, 'Actions'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.actions))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.actions.index)).to
						.eventually.contain('13'))
					.then(expect(filter.columnIsSelected.call(filter, 'Actions'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});
		});

		describe('- refresh/reset filtered table', function() {
			beforeEach(function setUpEach() {
				filter.openFilterModal()
					.then(filter.submitFilter.call(filter));
			});

			it('- refresh filtered table', function() {
				filter.refreshFilteredTable()
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('filter'))
					.then(filter.resetFilteredTable.call(filter));
			});

			it('- reset filtered table', function() {
				filter.resetFilteredTable()
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('professor'));
			});
		});

		describe.skip('- filter presets', function() {
			// stub for filter preset tests
		});

		describe.skip('- filter highlights', function() {
			// stub for filter highlight tests
		});
		
		describe('- filtering', function() {
			afterEach(function cleanUpEach() {
				filter.resetFilteredTable();
			});

			it('- apply filtering that returns resulted table', function() {
				filter.openFilterModal()
					.then(filter.toggleColumn.call(filter, filter.filter.cols.applicant))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.crank))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.gpa))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.foi))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.applicant.index)).to
						.eventually.contain('1'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.crank.index)).to
						.eventually.contain('2'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.gpa.index)).to
						.eventually.contain('3'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.foi.index)).to
						.eventually.contain('4'))
					.then(expect(filter.columnIsSelected.call(filter, 'Name'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'Committee Ranking'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'GPA'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'Fields of Interest'))
						.to.eventually.be.true)
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.gpa.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.gpa.openDD)).to.eventually.be.true)
					.then(filter.searchText.call(filter, 'B'))
					.then(filter.selectIthElement.call(filter, 5))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('> B'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('GPA > B'))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.foi.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.foi.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'in'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Artificial Intelligence'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Field of Interest = Artificial Intelligence'))
					.then(filter.submitFilter.call(filter))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('filter'))
					.then(expect(prof.applicationTableIsDisplayed.call(prof)).to.eventually.be.true)
					.then(expect(prof.tableHeaderExists.call(prof)).to.eventually.be.true)
					.then(expect(prof.tableBodyExists.call(prof)).to.eventually.be.true)
					.then(expect(prof.getTableColumns.call(prof)).to.eventually.equal(5))
					.then(expect(prof.getColumnName.call(prof, 0)).to.eventually.equal('Applicant Name'))
					.then(expect(prof.getColumnName.call(prof, 1)).to.eventually.equal('Committee Rank'))
					.then(expect(prof.getColumnName.call(prof, 2)).to.eventually.equal('GPA'))
					.then(expect(prof.getColumnName.call(prof, 3)).to.eventually.equal('Fields of Interest'))
					.then(expect(prof.getColumnName.call(prof, 4)).to.eventually.equal('Actions'));
			});

			it('- apply filtering that returns no table', function() {
				filter.openFilterModal()
					.then(filter.toggleColumn.call(filter, filter.filter.cols.applicant))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.crank))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.gpa))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.foi))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.applicant.index)).to
						.eventually.contain('1'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.crank.index)).to
						.eventually.contain('2'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.gpa.index)).to
						.eventually.contain('3'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.foi.index)).to
						.eventually.contain('4'))
					.then(expect(filter.columnIsSelected.call(filter, 'Name'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'Committee Ranking'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'GPA'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'Fields of Interest'))
						.to.eventually.be.true)
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.gpa.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.gpa.openDD)).to.eventually.be.true)
					.then(filter.searchText.call(filter, 'A'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('> A'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('GPA > A'))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.crank.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.crank.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'B'))
					.then(filter.selectIthElement.call(filter, 6))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('= B'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Committee Ranking = B'))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.foi.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.foi.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'in'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Artificial Intelligence'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Field of Interest = Artificial Intelligence'))
					.then(filter.submitFilter.call(filter))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('filter'))
					.then(expect(prof.applicationTableIsDisplayed.call(prof)).to.eventually.be.false)
					.then(expect(prof.tableHeaderExists.call(prof)).to.eventually.be.false)
					.then(expect(prof.tableBodyExists.call(prof)).to.eventually.be.false)
					.then(expect(prof.getTableError.call(prof)).to.eventually.contain('Error loading table.'));
			});
		});
	});
});

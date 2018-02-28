'use strict';

var async = require('async');
var config = require('../../lib/utils/config');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var mysql = require('mysql2');

var Application = require('../../../controller/application');

var Filter = require('../../views/filter-view');
var Login = require('../../views/login-view');
var Professor = require('../../views/professor-view');
var Role = require('../../views/role-view');
var Utils = require('../../lib/utils/shared-utils');
var Welcome = require('../../views/welcome-view');

var application, connection;
var creds = config.credentials.database;

describe('Professor Test', function() {
	this.timeout(20000);

	var filter = new Filter();
	var login = new Login();
	var prof = new Professor();
	var role = new Role();
	var utils = new Utils();
	var welcome = new Welcome();
	var newUser = {
		username: 'boneham',
		password: 'boneham',
		fullname: 'Sheff Boneham'
	};

	before(function setUp() {
		require('../../pretest');
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
		welcome.clickSignInButton()
			.then(login.fullSignIn.bind(login, config.credentials.app))
			.then(role.selectRole.bind(role, 'Professor'));
	});

	after(function cleanUp(done) {
		expect(browser.getCurrentUrl()).to.eventually
			.contain('professor')
			.then(utils.logOut.call(utils))
			.then(function() {
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
			async.series([
				function(callback) {
					connection.connect(callback);
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
			connection.end(done);
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

	describe('- filter applications', function() {
		it('- get applicant name field', function() {
			filter.openFilterModal()
				.then(expect(filter.getApplicantNameFilter.call(filter)).to
					.eventually.be.true)
				.then(filter.closeFilterModal.call(filter));
		});

		it('- get field of interest field', function() {
			filter.openFilterModal()
				.then(expect(filter.getFoiFilter.call(filter)).to
					.eventually.be.true)
				.then(filter.closeFilterModal.call(filter));
		});

		it('- get professor name field', function() {
			filter.openFilterModal()
				.then(expect(filter.getProfessorNameFilter.call(filter)).to
					.eventually.be.true)
				.then(filter.closeFilterModal.call(filter));
		});

		it('- open applicant name drop down and select an element', function() {
			filter.openFilterModal()
				.then(filter.openApplicantDD.call(filter))
				.then(expect(filter.isApplicantDDOpen.call(filter)).to
					.eventually.be.true)
				.then(filter.selectIthElement.call(filter, 8))
				.then(expect(filter.getSelectedElement.call(filter)).to
					.eventually.contain('Chrysa Really'))
				.then(filter.closeFilterModal.call(filter));
		});

		it('- open field of interest drop down and select an element', function() {
			filter.openFilterModal()
				.then(filter.openFoiDD.call(filter))
				.then(expect(filter.isFoiDDOpen.call(filter)).to
					.eventually.be.true)
				.then(filter.selectIthElement.call(filter, 2))
				.then(expect(filter.getSelectedElement.call(filter)).to
					.eventually.contain('Bioinformatics'))
				.then(filter.closeFilterModal.call(filter));
		});

		it('- open professor name drop down and select an element', function() {
			filter.openFilterModal()
				.then(filter.openProfessorDD.call(filter))
				.then(expect(filter.isProfessorDDOpen.call(filter)).to
					.eventually.be.true)
				.then(filter.selectIthElement.call(filter, 2))
				.then(expect(filter.getSelectedElement.call(filter)).to
					.eventually.contain('Aijun An'))
				.then(filter.closeFilterModal.call(filter));
		});
	});
});

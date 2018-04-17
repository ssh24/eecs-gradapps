'use strict';

var _ = require('lodash');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var ms = require('ms');
var path = require('path');

var Admin = require('../../views/admin-view');
var Application = require('../../views/app-view');
var Filter = require('../../views/filter-view');
var Login = require('../../views/login-view');
var Role = require('../../views/role-view');
var Utils = require('../../lib/utils/shared-utils');
var Welcome = require('../../views/welcome-view');

var config = require('../../lib/utils/config');

describe('Manage Applications Test', function() {
	var timeout = ms('60s');
	this.timeout(timeout);

	var admin = new Admin(timeout);
	var app = new Application(timeout);
	var filter = new Filter(timeout);
	var login = new Login(timeout);
	var role = new Role(timeout);
	var utils = new Utils(timeout);
	var welcome = new Welcome(timeout);

	var sample = {
		heavy: path.resolve(__dirname, '..', '..', 'lib', 'data', 'heavy-sample.pdf'),
		correct: path.resolve(__dirname, '..', '..', 'lib', 'data', 'correct-sample.pdf'),
		incorrect: path.resolve(__dirname, '..', '..', 'lib', 'data', 'sample-img.jpg')
	};
	var student = {
		file: sample.correct,
		session: {
			index: 2,
			name: 'Winter'
		},
		sid: '123456789',
		lname: 'Bar',
		fname: 'Foo',
		email: 'foo@bar.com',
		gender: {
			index: 1,
			name: 'Male'
		},
		gpa: {
			index: 3,
			name: 'B+',
			status: 'interim'
		},
		scores: {
			gre: '130/6.5/130',
			toefl: '65',
			ielts: '7.5',
			yelt: '3'
		},
		visa: {
			index: 2,
			name: 'Visa'
		},
		degree: {
			index: 3,
			name: 'PhD'
		},
		foi: [{
			index: 0,
			name: 'Artificial Intelligence'
		}, {
			index: 2,
			name: 'Biomedical Engineering'
		}],
		profs: [{
			index: 1,
			name: 'Aijun An'
		}, {
			index: 5,
			name: 'Amir Sodagar'
		}],
		ygs: 'yes'
	};
	var appId=24;

	before(function setUp() {
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
		welcome.clickSignInButton()
			.then(login.fullSignIn.bind(login, config.credentials.app.admin))
			.then(role.selectRole.call(role, 'Admin'))
			.then(admin.manageApps.call(admin));
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
		expect(app.applicationTableIsDisplayed.call(app)).to.eventually.be.true;
	});
		
	it('- table header loads properly', function() {
		expect(app.tableHeaderExists.call(app)).to.eventually.be.true;
	});
		
	it('- table body loads properly', function() {
		expect(app.tableBodyExists.call(app)).to.eventually.be.true;
	});
		
	it('- get refresh table text', function() {
		expect(app.getRefreshTableText.call(app)).to.eventually
			.contain('Refresh Current Table');
	});
	
	it('- perform refresh table action', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('app')
			.then(app.refreshTable.call(app));
	});
		
	describe('- order applications', function() {
		describe('- date column', function() {
			afterEach(function cleanUpEach() {
				app.refreshTable();
			});
	
			it('- order column in ascending order', function() {
				expect(app.getSortType.call(app, 0)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 0, 1))
					.then(expect(app.getSortType.call(app, 0)).to.eventually.equal('ascending'));
			});
	
			it('- order column in ascending order and then descending order', function() {
				expect(app.getSortType.call(app, 0)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 0, 1))
					.then(expect(app.getSortType.call(app, 0)).to.eventually.equal('ascending'))
					.then(app.orderColumn.call(app, 0, -1))
					.then(expect(app.getSortType.call(app, 0)).to.eventually.equal('descending'));
			});
	
			it('- order column in descending order', function() {
				expect(app.getSortType.call(app, 0)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 0, -1))
					.then(expect(app.getSortType.call(app, 0)).to.eventually.equal('descending'));
			});
				
			it('- order column in descending order and then ascending order', function() {
				expect(app.getSortType.call(app, 0)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 0, -1))
					.then(expect(app.getSortType.call(app, 0)).to.eventually.equal('descending'))
					.then(app.orderColumn.call(app, 0, 1))
					.then(expect(app.getSortType.call(app, 0)).to.eventually.equal('ascending'));
			});
		});
			
		describe('- student number column', function() {
			afterEach(function cleanUpEach() {
				app.refreshTable();
			});
	
			it('- order column in ascending order', function() {
				expect(app.getSortType.call(app, 1)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 1, 1))
					.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('ascending'));
			});
	
			it('- order column in ascending order and then descending order', function() {
				expect(app.getSortType.call(app, 1)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 1, 1))
					.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('ascending'))
					.then(app.orderColumn.call(app, 1, -1))
					.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('descending'));
			});
	
			it('- order column in descending order', function() {
				expect(app.getSortType.call(app, 1)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 1, -1))
					.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('descending'));
			});
				
			it('- order column in descending order and then ascending order', function() {
				expect(app.getSortType.call(app, 1)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 1, -1))
					.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('descending'))
					.then(app.orderColumn.call(app, 1, 1))
					.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('ascending'));
			});
		});
	
		describe('- name column', function() {
			afterEach(function cleanUpEach() {
				app.refreshTable();
			});
	
			it('- order column in ascending order', function() {
				expect(app.getSortType.call(app, 2)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 2, 1))
					.then(expect(app.getSortType.call(app, 2)).to.eventually.equal('ascending'));
			});
	
			it('- order column in ascending order and then descending order', function() {
				expect(app.getSortType.call(app, 2)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 2, 1))
					.then(expect(app.getSortType.call(app, 2)).to.eventually.equal('ascending'))
					.then(app.orderColumn.call(app, 2, -1))
					.then(expect(app.getSortType.call(app, 2)).to.eventually.equal('descending'));
			});
	
			it('- order column in descending order', function() {
				expect(app.getSortType.call(app, 2)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 2, -1))
					.then(expect(app.getSortType.call(app, 2)).to.eventually.equal('descending'));
			});
				
			it('- order column in descending order and then ascending order', function() {
				expect(app.getSortType.call(app, 2)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 2, -1))
					.then(expect(app.getSortType.call(app, 2)).to.eventually.equal('descending'))
					.then(app.orderColumn.call(app, 2, 1))
					.then(expect(app.getSortType.call(app, 2)).to.eventually.equal('ascending'));
			});
		});
			
		describe('- gpa column', function() {
			afterEach(function cleanUpEach() {
				app.refreshTable();
			});
	
			it('- order column in ascending order', function() {
				expect(app.getSortType.call(app, 3)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 3, 1))
					.then(expect(app.getSortType.call(app, 3)).to.eventually.equal('ascending'));
			});
	
			it('- order column in ascending order and then descending order', function() {
				expect(app.getSortType.call(app, 3)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 3, 1))
					.then(expect(app.getSortType.call(app, 3)).to.eventually.equal('ascending'))
					.then(app.orderColumn.call(app, 3, -1))
					.then(expect(app.getSortType.call(app, 3)).to.eventually.equal('descending'));
			});
	
			it('- order column in descending order', function() {
				expect(app.getSortType.call(app, 3)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 3, -1))
					.then(expect(app.getSortType.call(app, 3)).to.eventually.equal('descending'));
			});
				
			it('- order column in descending order and then ascending order', function() {
				expect(app.getSortType.call(app, 3)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 3, -1))
					.then(expect(app.getSortType.call(app, 3)).to.eventually.equal('descending'))
					.then(app.orderColumn.call(app, 3, 1))
					.then(expect(app.getSortType.call(app, 3)).to.eventually.equal('ascending'));
			});
		});

		describe('- degree column', function() {
			afterEach(function cleanUpEach() {
				app.refreshTable();
			});
	
			it('- order column in ascending order', function() {
				expect(app.getSortType.call(app, 4)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 4, 1))
					.then(expect(app.getSortType.call(app, 4)).to.eventually.equal('ascending'));
			});
	
			it('- order column in ascending order and then descending order', function() {
				expect(app.getSortType.call(app, 4)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 4, 1))
					.then(expect(app.getSortType.call(app, 4)).to.eventually.equal('ascending'))
					.then(app.orderColumn.call(app, 4, -1))
					.then(expect(app.getSortType.call(app, 4)).to.eventually.equal('descending'));
			});
	
			it('- order column in descending order', function() {
				expect(app.getSortType.call(app, 4)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 4, -1))
					.then(expect(app.getSortType.call(app, 4)).to.eventually.equal('descending'));
			});
				
			it('- order column in descending order and then ascending order', function() {
				expect(app.getSortType.call(app, 4)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 4, -1))
					.then(expect(app.getSortType.call(app, 4)).to.eventually.equal('descending'))
					.then(app.orderColumn.call(app, 4, 1))
					.then(expect(app.getSortType.call(app, 4)).to.eventually.equal('ascending'));
			});
		});

		describe('- visa status column', function() {
			afterEach(function cleanUpEach() {
				app.refreshTable();
			});
	
			it('- order column in ascending order', function() {
				expect(app.getSortType.call(app, 5)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 5, 1))
					.then(expect(app.getSortType.call(app, 5)).to.eventually.equal('ascending'));
			});
	
			it('- order column in ascending order and then descending order', function() {
				expect(app.getSortType.call(app, 5)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 5, 1))
					.then(expect(app.getSortType.call(app, 5)).to.eventually.equal('ascending'))
					.then(app.orderColumn.call(app, 5, -1))
					.then(expect(app.getSortType.call(app, 5)).to.eventually.equal('descending'));
			});
	
			it('- order column in descending order', function() {
				expect(app.getSortType.call(app, 5)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 5, -1))
					.then(expect(app.getSortType.call(app, 5)).to.eventually.equal('descending'));
			});
				
			it('- order column in descending order and then ascending order', function() {
				expect(app.getSortType.call(app, 5)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 5, -1))
					.then(expect(app.getSortType.call(app, 5)).to.eventually.equal('descending'))
					.then(app.orderColumn.call(app, 5, 1))
					.then(expect(app.getSortType.call(app, 5)).to.eventually.equal('ascending'));
			});
		});

		describe('- program decision column', function() {
			afterEach(function cleanUpEach() {
				app.refreshTable();
			});
	
			it('- order column in ascending order', function() {
				expect(app.getSortType.call(app, 6)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 6, 1))
					.then(expect(app.getSortType.call(app, 6)).to.eventually.equal('ascending'));
			});
	
			it('- order column in ascending order and then descending order', function() {
				expect(app.getSortType.call(app, 6)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 6, 1))
					.then(expect(app.getSortType.call(app, 6)).to.eventually.equal('ascending'))
					.then(app.orderColumn.call(app, 6, -1))
					.then(expect(app.getSortType.call(app, 6)).to.eventually.equal('descending'));
			});
	
			it('- order column in descending order', function() {
				expect(app.getSortType.call(app, 6)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 6, -1))
					.then(expect(app.getSortType.call(app, 6)).to.eventually.equal('descending'));
			});
				
			it('- order column in descending order and then ascending order', function() {
				expect(app.getSortType.call(app, 6)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 6, -1))
					.then(expect(app.getSortType.call(app, 6)).to.eventually.equal('descending'))
					.then(app.orderColumn.call(app, 6, 1))
					.then(expect(app.getSortType.call(app, 6)).to.eventually.equal('ascending'));
			});
		});
	});

	describe('- filter applications', function() {
		describe('- check for all fields', function() {
			it('- get applicant name field', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.applicant)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- get gpa field', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.gpa)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- get degree applied for field', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.degree)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- get visa status field', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.vstatus)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- get program decision field', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.pdecision)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});
		});
	
		describe('- select an element from each field using drop down', function() {
			after(function cleanUp() {
				app.refreshTable();
			});
	
			it('- open applicant name drop down and select an element', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.applicant.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.applicant.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 6))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Celestine Sywell'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Applicant Name = Celestine Sywell'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open gpa drop down and select an element', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
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
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
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
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
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
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
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
		});
	
		describe('- select an element from each field by sending keys', function() {
			after(function cleanUp() {
				app.refreshTable();
			});
	
			it('- open applicant name drop down, type and select an element', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.applicant.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.applicant.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'ea'))
					.then(filter.selectIthElement.call(filter, 7))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Chrysa Really'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Applicant Name = Chrysa Really'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open gpa drop down, type and select an element', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
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
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
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
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
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
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
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
		});
	
		describe('- select columns', function() {
			after(function cleanUp() {
				app.refreshTable();
			});
				
			it('- select date column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'Date Uploaded'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.date))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.date.index)).to
						.eventually.contain('1'))
					.then(expect(filter.columnIsSelected.call(filter, 'Date Uploaded'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- select name column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'Applicant Name'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.applicant))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.applicant.index)).to
						.eventually.contain('2'))
					.then(expect(filter.columnIsSelected.call(filter, 'Applicant Name'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- select degree column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'Degree Applied For'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.degree))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.degree.index)).to
						.eventually.contain('3'))
					.then(expect(filter.columnIsSelected.call(filter, 'Degree Applied For'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});
	
			it('- select actions column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'Actions'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.actions))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.actions.index)).to
						.eventually.contain('4'))
					.then(expect(filter.columnIsSelected.call(filter, 'Actions'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select gpa column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'GPA'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.gpa))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.gpa.index)).to
						.eventually.contain('5'))
					.then(expect(filter.columnIsSelected.call(filter, 'GPA'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select student number column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'Student Number'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.sid))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.sid.index)).to
						.eventually.contain('6'))
					.then(expect(filter.columnIsSelected.call(filter, 'Student Number'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select visa status column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'Visa Status'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.vstatus))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.vstatus.index)).to
						.eventually.contain('7'))
					.then(expect(filter.columnIsSelected.call(filter, 'Visa Status'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select program decision column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'Program Decision'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.pdecision))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.pdecision.index)).to
						.eventually.contain('8'))
					.then(expect(filter.columnIsSelected.call(filter, 'Program Decision'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});
		});
	
		describe('- refresh/reset filtered table', function() {
			beforeEach(function setUpEach() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.submitFilter.call(filter));
			});
	
			it('- refresh filtered table', function() {
				filter.refreshFilteredTable()
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('filter'))
					.then(filter.resetFilteredTable.call(filter));
			});
	
			it('- reset filtered table', function() {
				filter.resetFilteredTable()
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('/applications'));
			});
		});
	
		describe('- filter presets', function() {
			afterEach(function cleanUp() {
				filter.resetFilteredTable();
			});
	
			it('- add a new preset', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
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
					.then(filter.saveFilter.call(filter, 'To be updated later....'))
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
					.then(filter.searchText.call(filter, 'To be updated later....'))
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
	
			it('- update an existing preset', function() {
				//first verify the contents of the existing filter (that was set up in the test before)
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.preset.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter.preset.openDD)).to.eventually.be.true)
					.then(filter.searchText.call(filter, 'To be updated later....'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('To be updated later....'))
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
					.then(filter.toggleColumn.call(filter, filter.filter.cols.applicant))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.applicant))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.degree.index)).to
						.eventually.contain('1'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.sid.index)).to
						.eventually.contain('2'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.applicant.index)).to
						.eventually.contain('3'))
					.then(expect(filter.columnIsSelected.call(filter, 'Applicant Name'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'Degree Applied For'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'Student Number'))
						.to.eventually.be.true)
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Degree Applied For = MASc'))
					.then(filter.saveFilter.call(filter, 'To be updated later....'))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('filter'))
					.then(expect(app.applicationTableIsDisplayed.call(app)).to.eventually.be.true)
					.then(expect(app.tableHeaderExists.call(app)).to.eventually.be.true)
					.then(expect(app.tableBodyExists.call(app)).to.eventually.be.true)
					.then(expect(app.getTableColumns.call(app)).to.eventually.equal(4))
					.then(expect(app.getColumnName.call(app, 0)).to.eventually.equal('Degree Applied For'))
					.then(expect(app.getColumnName.call(app, 1)).to.eventually.equal('Student Number'))
					.then(expect(app.getColumnName.call(app, 2)).to.eventually.equal('Applicant Name'))
					.then(expect(app.getColumnName.call(app, 3)).to.eventually.equal('Actions'))
					.then(filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
						.then(filter.openFieldDD.call(filter, filter.filter.preset.openDD))
						.then(expect(filter.isFieldDDOpen.call(filter, filter.filter.preset.openDD)).to.eventually.be.true)
						.then(filter.searchText.call(filter, 'To be updated later....'))
						.then(filter.selectIthElement.call(filter, 1)))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('To be updated later....'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.degree.index)).to
						.eventually.contain('1'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.sid.index)).to
						.eventually.contain('2'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.applicant.index)).to
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
		});
	
		describe('- filter highlights', function() {
			after(function cleanUp() {
				filter.resetFilteredTable();
			});
	
			it('- check for highlights on chosen field', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
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
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.gpa.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.gpa.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'B'))
					.then(filter.selectIthElement.call(filter, 3))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('> B+'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('GPA > B+'))
					.then(filter.submitFilter.call(filter))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('filter'))
					.then(expect(app.applicationTableIsDisplayed.call(app)).to.eventually.be.true)
					.then(expect(app.tableHeaderExists.call(app)).to.eventually.be.true)
					.then(expect(app.tableBodyExists.call(app)).to.eventually.be.true)
					.then(expect(app.isHighlighted.call(app, 0, 4)).to.eventually.equal('A'))
					.then(expect(app.isHighlighted.call(app, 0, 5)).to.eventually.equal('MASc'));
			});
		});
			
		describe('- filtering', function() {
			afterEach(function cleanUpEach() {
				filter.resetFilteredTable();
			});
	
			it('- apply filtering that returns resulted table', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.applicant))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.degree))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.gpa))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.applicant.index)).to
						.eventually.contain('1'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.degree.index)).to
						.eventually.contain('2'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.gpa.index)).to
						.eventually.contain('3'))
					.then(expect(filter.columnIsSelected.call(filter, 'Applicant Name'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'Degree Applied For'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'GPA'))
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
					.then(filter.submitFilter.call(filter))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('filter'))
					.then(expect(app.applicationTableIsDisplayed.call(app)).to.eventually.be.true)
					.then(expect(app.tableHeaderExists.call(app)).to.eventually.be.true)
					.then(expect(app.tableBodyExists.call(app)).to.eventually.be.true)
					.then(expect(app.getTableColumns.call(app)).to.eventually.equal(4))
					.then(expect(app.getColumnName.call(app, 0)).to.eventually.equal('Applicant Name'))
					.then(expect(app.getColumnName.call(app, 1)).to.eventually.equal('Degree Applied For'))
					.then(expect(app.getColumnName.call(app, 2)).to.eventually.equal('GPA'))
					.then(expect(app.getColumnName.call(app, 3)).to.eventually.equal('Actions'));
			});
	
			it('- apply filtering that returns no table', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.applicant))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.degree))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.gpa))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.applicant.index)).to
						.eventually.contain('1'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.degree.index)).to
						.eventually.contain('2'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.gpa.index)).to
						.eventually.contain('3'))
					.then(expect(filter.columnIsSelected.call(filter, 'Applicant Name'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'Degree Applied For'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'GPA'))
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
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.applicant.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.applicant.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'ale'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Alexandro De Hoogh'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Applicant Name = Alexandro De Hoogh'))
					.then(filter.submitFilter.call(filter))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('filter'))
					.then(expect(app.applicationTableIsDisplayed.call(app)).to.eventually.be.false)
					.then(expect(app.tableHeaderExists.call(app)).to.eventually.be.false)
					.then(expect(app.tableBodyExists.call(app)).to.eventually.be.false)
					.then(expect(app.getTableError.call(app)).to.eventually.contain('Error loading table.'));
			});
		});
	});

	describe('- delete an existing application', function() {
		var appToBeDeleted = {
			id: 2,
			name: 'Truett Cirstoforo'
		};

		it('- delete an existing application', function() {
			expect(app.getApplicantLName.call(app, appToBeDeleted.id)).to
				.eventually.equal(appToBeDeleted.name)
				.then(app.editApplication.call(app, appToBeDeleted.id))
				.then(expect(browser.getCurrentUrl()).to.eventually.contain('/edit'))
				.then(app.deleteApplication.call(app))
				.then(utils.closeBrowserAlert.call(utils))
				.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/edit'))
				.then(expect(app.getApplicantLName.call(app, appToBeDeleted.id))
					.to.eventually.not.equal(appToBeDeleted.name));
		});
	});

	describe('- create new application', function() {
		it('- start a new application and exit out w/o changes', function() {
			app.openNewApplicationForm()
				.then(expect(browser.getCurrentUrl()).to.eventually.contain('new'))
				.then(app.closeNewApplicationForm.call(app))
				.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('new'));
		});
        
		describe('- check for all fields', function() {
			before(function setUp() {
				app.openNewApplicationForm();
			});
            
			after(function cleanUp() {
				app.closeNewApplicationForm();
			});

			describe('- upload application section', function() {
				it('- check for application upload field', function() {
					expect(app.checkForUploadFile.call(app)).to.eventually.be.true;
				});
			});

			describe('- general information section', function() {
				it('- check for session field', function() {
					expect(app.checkForSession.call(app)).to.eventually.be.true;
				});
					
				it('- check for student number field', function() {
					expect(app.checkForSID.call(app)).to.eventually.be.true;
				});
	
				it('- check for last name field', function() {
					expect(app.checkForLName.call(app)).to.eventually.be.true;
				});
	
				it('- check for first name field', function() {
					expect(app.checkForFName.call(app)).to.eventually.be.true;
				});
					
				it('- check for email field', function() {
					expect(app.checkForEmail.call(app)).to.eventually.be.true;
				});
					
				it('- check for gender field', function() {
					expect(app.checkForGender.call(app)).to.eventually.be.true;
				});
			});

			describe('- previous grades section', function() {
				it('- check for gpa field', function() {
					expect(app.checkForGPA.call(app)).to.eventually.be.true;
				});
					
				it('- check for gpa final field', function() {
					expect(app.checkForGPAFinal.call(app)).to.eventually.be.true;
				});
	
				it('- check for gre field', function() {
					expect(app.checkForGRE.call(app)).to.eventually.be.true;
				});
	
				it('- check for toefl field', function() {
					expect(app.checkForTOEFL.call(app)).to.eventually.be.true;
				});
					
				it('- check for ielts field', function() {
					expect(app.checkForIELTS.call(app)).to.eventually.be.true;
				});
					
				it('- check for yelt field', function() {
					expect(app.checkForYELT.call(app)).to.eventually.be.true;
				});
			});

			describe('- application information section', function() {
				it('- check for visa status field', function() {
					expect(app.checkForVStatus.call(app)).to.eventually.be.true;
				});
					
				it('- check for degree field', function() {
					expect(app.checkForDegree.call(app)).to.eventually.be.true;
				});
	
				it('- check for foi field', function() {
					expect(app.checkForFOI.call(app)).to.eventually.be.true;
				});
	
				it('- check for pref profs field', function() {
					expect(app.checkForPrefProfs.call(app)).to.eventually.be.true;
				});
					
				it('- check for ygs awrded field', function() {
					expect(app.checkForYGS.call(app)).to.eventually.be.true;
				});
			});
		});
        
		describe('- validating fields', function() {
			describe('- selecting wrong file', function() {
				before(function setUp() {
					app.openNewApplicationForm();
				});
				
				after(function cleanUp() {
					app.closeNewApplicationForm()
						.then(utils.closeBrowserAlert.call(utils));
				});

				it('- select a heavy file (> 4MB)', function() {
					app.selectFile(sample.heavy)
						.then(expect(app.getFileError.call(app)).to.eventually.equal('File too large. Accepted file size: <= 4MB'))
						.then(expect(app.isSubmitBtnEnabled.call(app)).to.eventually.be.false);
				});
    
				it('- select an unsupported file', function() {
					app.selectFile(sample.incorrect)
						.then(expect(app.getFileError.call(app)).to.eventually.equal('Incorrect file type. Accepted file type: application/pdf'))
						.then(expect(app.isSubmitBtnEnabled.call(app)).to.eventually.be.false);
				});
			});

			describe('- entering invalid student number', function() {
				var mod_student = _.cloneDeep(student);
				mod_student.sid = '1234';

				before(function setUp() {
					app.openNewApplicationForm()
						.then(app.fillApplication.call(app, mod_student))
						.then(app.selectFOI.call(app, student.foi[0].index))
						.then(app.selectProfs.call(app, student.profs[0].index));
				});
				
				after(function cleanUp() {
					app.closeNewApplicationForm()
						.then(utils.closeBrowserAlert.call(utils));
				});

				it('- cannot submit application with invalid student number', function(){
					app.submitApplication()
						.then(expect(browser.getCurrentUrl()).to.eventually.contain('/new'));
				});
			});

			describe('- entering invalid gre', function() {
				var mod_student = _.cloneDeep(student);
				mod_student.scores.gre = '1/1/1';

				before(function setUp() {
					app.openNewApplicationForm()
						.then(app.fillApplication.call(app, mod_student))
						.then(app.selectFOI.call(app, student.foi[0].index))
						.then(app.selectProfs.call(app, student.profs[0].index));
				});
				
				after(function cleanUp() {
					app.closeNewApplicationForm()
						.then(utils.closeBrowserAlert.call(utils));
				});

				it('- cannot submit application with invalid gre', function(){
					app.submitApplication()
						.then(expect(browser.getCurrentUrl()).to.eventually
							.contain('/new'));
				});
			});
		});

		describe('- fill out an application and submit', function() {
			before(function setUp() {
				app.openNewApplicationForm();
			});
            
			after(function cleanUp() {
				app.submitApplication()
					.then(expect(browser.getCurrentUrl()).to.eventually.not
						.equal('/new'))
					.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('none'))
					.then(app.orderColumn.call(app, 1, 1))
					.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('ascending'))
					.then(app.editApplication.call(app, appId))
					.then(expect(app.getStudentNumber.call(app)).to.eventually.equal(student.sid))
					.then(expect(app.getLName.call(app)).to.eventually.equal(student.lname))
					.then(expect(app.getFName.call(app)).to.eventually.equal(student.fname))
					.then(app.deleteApplication.call(app))
					.then(utils.closeBrowserAlert.call(utils));
			});
            
			it('- select a file', function() {
				app.selectFile(student.file)
					.then(expect(app.getFileError.call(app)).to.eventually.not
						.equal('File too large. Accepted file size: <= 4MB'))
					.then(expect(app.getFileError.call(app)).to.eventually.not
						.equal('Incorrect file type. Accepted file type: application/pdf'))
					.then(expect(app.isSubmitBtnEnabled.call(app)).to.eventually
						.not.be.false);
			});
            
			it('- select session', function() {
				app.selectSession(student.session.index)
					.then(expect(app.isOptionSelected.call(app, student.session
						.name)).to.eventually.be.true);
			});
            
			it('- input student number', function() {
				app.setStudentNumber(student.sid)
					.then(expect(app.getStudentNumber.call(app)).to.eventually
						.equal(student.sid));
			});
            
			it('- input last name', function() {
				app.setLName(student.lname)
					.then(expect(app.getLName.call(app)).to.eventually
						.equal(student.lname));
			});
            
			it('- input first name', function() {
				app.setFName(student.fname)
					.then(expect(app.getFName.call(app)).to.eventually
						.equal(student.fname));
			});
            
			it('- input email', function() {
				app.setEmail(student.email)
					.then(expect(app.getEmail.call(app)).to.eventually
						.equal(student.email));
			});
            
			it('- select gender', function() {
				app.selectGender(student.gender.index)
					.then(expect(app.isOptionSelected.call(app, student.gender
						.name)).to.eventually.be.true);
			});
            
			it('- select gpa', function() {
				app.selectGPA(student.gpa.index)
					.then(expect(app.isOptionSelected.call(app, student.gpa.name))
						.to.eventually.be.true);
			});
            
			it('- select gpa status', function() {
				app.setGPAStatus(student.gpa.status)
					.then(expect(app.isGPAFinal.call(app)).to.eventually.be.false);
			});
            
			it('- input gre', function() {
				app.setGRE(student.scores.gre)
					.then(expect(app.getGRE.call(app)).to.eventually
						.equal(student.scores.gre));
			});
            
			it('- input toefl', function() {
				app.setTOEFL(student.scores.toefl)
					.then(expect(app.getTOEFL.call(app)).to.eventually
						.equal(student.scores.toefl));
			});
            
			it('- input ielts', function() {
				app.setIELTS(student.scores.ielts)
					.then(expect(app.getIELTS.call(app)).to.eventually
						.equal(student.scores.ielts));
			});
            
			it('- input yelt', function() {
				app.setYELT(student.scores.yelt)
					.then(expect(app.getYELT.call(app)).to.eventually
						.equal(student.scores.yelt));
			});
            
			it('- select visa status', function() {
				app.selectVisa(student.visa.index)
					.then(expect(app.isOptionSelected.call(app, student.visa.name))
						.to.eventually.be.true);
			});
            
			it('- select degree', function() {
				app.selectDegree(student.degree.index)
					.then(expect(app.isOptionSelected.call(app, student.degree.name))
						.to.eventually.be.true);
			});
            
			it('- select foi', function() {
				app.selectFOI(student.foi[0].index)
					.then(expect(app.isOptionSelected.call(app, student.foi[0].name))
						.to.eventually.be.true)
					.then(app.selectFOI.call(app, student.foi[1].index))
					.then(expect(app.isOptionSelected.call(app, student.foi[1].name))
						.to.eventually.be.true);
			});
            
			it('- select pref profs', function() {
				app.selectProfs(student.profs[0].index)
					.then(expect(app.isOptionSelected.call(app, student.profs[0]
						.name)).to.eventually.be.true)
					.then(app.selectProfs.call(app, student.profs[1].index))
					.then(expect(app.isOptionSelected.call(app, student.profs[1].name))
						.to.eventually.be.true);
			});
            
			it('- select ygs awarded', function() {
				app.setYGSAward(student.ygs)
					.then(expect(app.isYGSAwarded.call(app)).to.eventually.be.true);
			});
		});
	});

	describe('- edit an existing application', function() {
		before(function setUp() {
			app.openNewApplicationForm()
				.then(app.fillApplication.call(app, student))
				.then(app.selectFOI.call(app, student.foi[0].index))
				.then(app.selectFOI.call(app, student.foi[1].index))
				.then(app.selectProfs.call(app, student.profs[0].index))
				.then(app.selectProfs.call(app, student.profs[1].index))
				.then(app.submitApplication.call(app));
		});

		it('- open an edit application and exit out w/o changes', function() {
			expect(app.getSortType.call(app, 1)).to.eventually.equal('none')
				.then(app.orderColumn.call(app, 1, 1))
				.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('ascending'))
				.then(app.editApplication.call(app, appId))
				.then(expect(browser.getCurrentUrl()).to.eventually.contain('/edit'))
				.then(app.closeEditApplicationForm.call(app))
				.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/edit'));
		});
        
		describe('- check for all fields', function() {
			before(function setUp() {
				expect(app.getSortType.call(app, 1)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 1, 1))
					.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('ascending'))
					.then(app.editApplication.call(app, appId))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('/edit'));
			});
            
			after(function cleanUp() {
				app.closeEditApplicationForm();
			});

			describe('- upload application section', function() {
				it('- check for application upload field', function() {
					expect(app.checkForUploadFile.call(app)).to.eventually.be.true;
				});
			});

			describe('- general information section', function() {
				it('- check for session field', function() {
					expect(app.checkForSession.call(app)).to.eventually.be.true;
				});
					
				it('- check for student number field', function() {
					expect(app.checkForSID.call(app)).to.eventually.be.true;
				});
	
				it('- check for last name field', function() {
					expect(app.checkForLName.call(app)).to.eventually.be.true;
				});
	
				it('- check for first name field', function() {
					expect(app.checkForFName.call(app)).to.eventually.be.true;
				});
					
				it('- check for email field', function() {
					expect(app.checkForEmail.call(app)).to.eventually.be.true;
				});
					
				it('- check for gender field', function() {
					expect(app.checkForGender.call(app)).to.eventually.be.true;
				});
			});

			describe('- previous grades section', function() {
				it('- check for gpa field', function() {
					expect(app.checkForGPA.call(app)).to.eventually.be.true;
				});
					
				it('- check for gpa final field', function() {
					expect(app.checkForGPAFinal.call(app)).to.eventually.be.true;
				});
	
				it('- check for gre field', function() {
					expect(app.checkForGRE.call(app)).to.eventually.be.true;
				});
	
				it('- check for toefl field', function() {
					expect(app.checkForTOEFL.call(app)).to.eventually.be.true;
				});
					
				it('- check for ielts field', function() {
					expect(app.checkForIELTS.call(app)).to.eventually.be.true;
				});
					
				it('- check for yelt field', function() {
					expect(app.checkForYELT.call(app)).to.eventually.be.true;
				});
			});

			describe('- application information section', function() {
				it('- check for visa status field', function() {
					expect(app.checkForVStatus.call(app)).to.eventually.be.true;
				});
					
				it('- check for degree field', function() {
					expect(app.checkForDegree.call(app)).to.eventually.be.true;
				});
	
				it('- check for foi field', function() {
					expect(app.checkForFOI.call(app)).to.eventually.be.true;
				});
	
				it('- check for pref profs field', function() {
					expect(app.checkForPrefProfs.call(app)).to.eventually.be.true;
				});

				it('- check for contacted profs field', function() {
					expect(app.checkForProfContacted.call(app)).to.eventually.be.true;
				});

				it('- check for requested profs field', function() {
					expect(app.checkForProfRequested.call(app)).to.eventually.be.true;
				});

				it('- check for rank field', function() {
					expect(app.checkForRank.call(app)).to.eventually.be.true;
				});

				it('- check for application reviewed field', function() {
					expect(app.checkForAppReviewed.call(app)).to.eventually.be.true;
				});
					
				it('- check for ygs awrded field', function() {
					expect(app.checkForYGS.call(app)).to.eventually.be.true;
				});

				it('- check for program decision field', function() {
					expect(app.checkForPDecision.call(app)).to.eventually.be.true;
				});

				it('- check for student decision field', function() {
					expect(app.checkForSDecision.call(app)).to.eventually.be.true;
				});

				it('- check for decline reason field', function() {
					expect(app.checkForDeclineReason.call(app)).to.eventually.be.true;
				});
			});
		});

		describe('- validating fields', function() {
			describe('- selecting wrong file', function() {
				before(function setUp() {
					expect(app.getSortType.call(app, 1)).to.eventually.equal('none')
						.then(app.orderColumn.call(app, 1, 1))
						.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('ascending'))
						.then(app.editApplication.call(app, appId))
						.then(expect(browser.getCurrentUrl()).to.eventually.contain('/edit'));
				});
				
				after(function cleanUp() {
					app.closeEditApplicationForm()
						.then(utils.closeBrowserAlert.call(utils));
				});

				it('- select a heavy file (> 4MB)', function() {
					app.selectFile(sample.heavy)
						.then(expect(app.getFileError.call(app)).to.eventually.equal('File too large. Accepted file size: <= 4MB'))
						.then(expect(app.isSaveBtnEnabled.call(app)).to.eventually.be.false);
				});
    
				it('- select an unsupported file', function() {
					app.selectFile(sample.incorrect)
						.then(expect(app.getFileError.call(app)).to.eventually.equal('Incorrect file type. Accepted file type: application/pdf'))
						.then(expect(app.isSaveBtnEnabled.call(app)).to.eventually.be.false);
				});
			});

			describe('- entering invalid student number', function() {
				var mod_student = _.cloneDeep(student);
				mod_student.sid = '1234';

				before(function setUp() {
					expect(app.getSortType.call(app, 1)).to.eventually.equal('none')
						.then(app.orderColumn.call(app, 1, 1))
						.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('ascending'))
						.then(app.editApplication.call(app, appId))
						.then(expect(browser.getCurrentUrl()).to.eventually.contain('/edit'))
						.then(app.setStudentNumber.call(app, mod_student.sid));
				});
				
				after(function cleanUp() {
					app.closeEditApplicationForm()
						.then(utils.closeBrowserAlert.call(utils));
				});

				it('- cannot save application with invalid student number', function(){
					app.saveApplication()
						.then(expect(browser.getCurrentUrl()).to.eventually
							.contain('/edit'));
				});
			});

			describe('- entering invalid gre', function() {
				var mod_student = _.cloneDeep(student);
				mod_student.scores.gre = '1/1/1';

				before(function setUp() {
					expect(app.getSortType.call(app, 1)).to.eventually.equal('none')
						.then(app.orderColumn.call(app, 1, 1))
						.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('ascending'))
						.then(app.editApplication.call(app, appId))
						.then(expect(browser.getCurrentUrl()).to.eventually.contain('/edit'))
						.then(app.setGRE.call(app, mod_student.scores.gre));
				});
				
				after(function cleanUp() {
					app.closeEditApplicationForm()
						.then(utils.closeBrowserAlert.call(utils));
				});

				it('- cannot save application with invalid gre', function(){
					app.saveApplication()
						.then(expect(browser.getCurrentUrl()).to.eventually
							.contain('/edit'));
				});
			});
		});

		describe('- edit an application and save', function() {
			before(function setUp() {
				expect(app.getSortType.call(app, 1)).to.eventually.equal('none')
					.then(app.orderColumn.call(app, 1, 1))
					.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('ascending'))
					.then(app.editApplication.call(app, appId))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('/edit'));
			});
            
			after(function cleanUp() {
				app.saveApplication()
					.then(expect(browser.getCurrentUrl()).to.eventually.not
						.equal('/edit'))
					.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('none'))
					.then(app.orderColumn.call(app, 1, 1))
					.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('ascending'))
					.then(app.editApplication.call(app, appId))
					.then(expect(app.getStudentNumber.call(app)).to.eventually.equal(student.sid))
					.then(expect(app.getLName.call(app)).to.eventually.equal(student.lname))
					.then(expect(app.getFName.call(app)).to.eventually.equal(student.fname))
					.then(app.deleteApplication.call(app))
					.then(utils.closeBrowserAlert.call(utils));
			});
            
			it('- select prof contacted by', function() {
				student['profContacted'] = [{
					index: 1,
					name: 'Aijun An'
				}, {
					index: 5,
					name: 'Amir Sodagar'
				}];
				app.selectProfContacted(student.profContacted[0].index)
					.then(expect(app.isOptionSelected.call(app, student.profContacted[0].name))
						.to.eventually.be.true)
					.then(app.selectProfContacted.call(app, student.profContacted[1].index))
					.then(expect(app.isOptionSelected.call(app, student.profContacted[1].name))
						.to.eventually.be.true);
			});

			it('- select prof requested by', function() {
				student['profRequested'] = [{
					index: 1,
					name: 'Aijun An'
				}, {
					index: 5,
					name: 'Amir Sodagar'
				}];
				app.selectProfRequested(student.profRequested[0].index)
					.then(expect(app.isOptionSelected.call(app, student.profRequested[0].name))
						.to.eventually.be.true)
					.then(app.selectProfRequested.call(app, student.profRequested[1].index))
					.then(expect(app.isOptionSelected.call(app, student.profRequested[1].name))
						.to.eventually.be.true);
			});

			it('- select rank', function() {
				student['rank'] = [{
					index: 1,
					name: 'A'
				}, {
					index: 3,
					name: 'B'
				}];
				app.selectRank(student.rank[0].index)
					.then(expect(app.isOptionSelected.call(app, student.rank[0].name))
						.to.eventually.be.true)
					.then(app.selectRank.call(app, student.rank[1].index))
					.then(expect(app.isOptionSelected.call(app, student.rank[1].name))
						.to.eventually.be.true);
			});
            
			it('- select application reviewed', function() {
				student['reviewed'] = 'yes';
				app.setApplicationReviewed(student.reviewed)
					.then(expect(app.isApplicationReviewed.call(app)).to
						.eventually.be.true);
			});

			it('- select program decision', function() {
				student['pdecision'] = {
					index: 1,
					name: 'Accepted'
				};
				app.selectPDecision(student.pdecision.index)
					.then(expect(app.isOptionSelected.call(app, student.pdecision.name))
						.to.eventually.be.true);
			});

			it('- select student decision', function() {
				student['sdecision'] = {
					index: 2,
					name: 'Decline'
				};
				app.selectSDecision(student.sdecision.index)
					.then(expect(app.isOptionSelected.call(app, student.sdecision.name))
						.to.eventually.be.true);
			});

			it('- input decline reason', function() {
				student['decline'] = 'Got accepted to another institution.';
				app.setDeclineReason(student.decline)
					.then(expect(app.getDeclineReason.call(app)).to.eventually
						.equal(student.decline));
			});
		});
	});

	describe('- view an application (PDF)', function() {
		before(function setUp() {
			app.openNewApplicationForm()
				.then(app.fillApplication.call(app, student))
				.then(app.selectFOI.call(app, student.foi[0].index))
				.then(app.selectFOI.call(app, student.foi[1].index))
				.then(app.selectProfs.call(app, student.profs[0].index))
				.then(app.selectProfs.call(app, student.profs[1].index))
				.then(app.submitApplication.call(app));
		});

		after(function cleanUp() {
			app.editApplication(appId)
				.then(expect(app.getStudentNumber.call(app)).to.eventually.equal(student.sid))
				.then(expect(app.getLName.call(app)).to.eventually.equal(student.lname))
				.then(expect(app.getFName.call(app)).to.eventually.equal(student.fname))
				.then(app.deleteApplication.call(app))
				.then(utils.closeBrowserAlert.call(utils));
		});

		it('- open application view page', function() {
			expect(app.getSortType.call(app, 1)).to.eventually.equal('none')
				.then(app.orderColumn.call(app, 1, 1))
				.then(expect(app.getSortType.call(app, 1)).to.eventually.equal('ascending'))
				.then(utils.viewApplication.call(utils, appId))
				.then(utils.switchTab.call(utils, 1))
				.then(expect(browser.getCurrentUrl()).to.eventually.contain('/view'))
				.then(utils.goToTab.call(utils, 0));
		});
	});
});

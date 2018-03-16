'use strict';

var config = require('../../lib/utils/config');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var ms = require('ms');

var Filter = require('../../views/filter-view');
var Login = require('../../views/login-view');
var Committee = require('../../views/committee-view');
var Role = require('../../views/role-view');
var Utils = require('../../lib/utils/shared-utils');
var Welcome = require('../../views/welcome-view');

var timeout;

describe('Committee Test', function() {
	timeout = ms('30s');
	this.timeout(timeout);

	var filter = new Filter(timeout);
	var login = new Login(timeout);
	var committee = new Committee(timeout);
	var role = new Role(timeout);
	var utils = new Utils(timeout);
	var welcome = new Welcome(timeout);

	before(function setUp() {
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
		welcome.clickSignInButton()
			.then(login.fullSignIn.bind(login, config.credentials.app.committee))
			.then(role.selectRole.bind(role, 'Committee Member'));
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
		expect(committee.applicationTableIsDisplayed.call(committee)).to.eventually.be.true;
	});
    
	it('- table header loads properly', function() {
		expect(committee.tableHeaderExists.call(committee)).to.eventually.be.true;
	});
    
	it('- table body loads properly', function() {
		expect(committee.tableBodyExists.call(committee)).to.eventually.be.true;
	});
    
	it('- get refresh table text', function() {
		expect(committee.getRefreshTableText.call(committee)).to.eventually
			.contain('Refresh Current Table');
	});

	it('- perform refresh table action', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('committee')
			.then(committee.refreshTable.call(committee));
	});
    
	describe('- order applications', function() {
		describe('- date column', function() {
			afterEach(function cleanUpEach() {
				committee.refreshTable();
			});

			it('- order column in ascending order', function() {
				expect(committee.getSortType.call(committee, 0)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 0, 1))
					.then(expect(committee.getSortType.call(committee, 0)).to.eventually.equal('ascending'));
			});

			it('- order column in ascending order and then descending order', function() {
				expect(committee.getSortType.call(committee, 0)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 0, 1))
					.then(expect(committee.getSortType.call(committee, 0)).to.eventually.equal('ascending'))
					.then(committee.orderColumn.call(committee, 0, -1))
					.then(expect(committee.getSortType.call(committee, 0)).to.eventually.equal('descending'));
			});

			it('- order column in descending order', function() {
				expect(committee.getSortType.call(committee, 0)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 0, -1))
					.then(expect(committee.getSortType.call(committee, 0)).to.eventually.equal('descending'));
			});
			
			it('- order column in descending order and then ascending order', function() {
				expect(committee.getSortType.call(committee, 0)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 0, -1))
					.then(expect(committee.getSortType.call(committee, 0)).to.eventually.equal('descending'))
					.then(committee.orderColumn.call(committee, 0, 1))
					.then(expect(committee.getSortType.call(committee, 0)).to.eventually.equal('ascending'));
			});
		});
        
		describe('- name column', function() {
			afterEach(function cleanUpEach() {
				committee.refreshTable();
			});

			it('- order column in ascending order', function() {
				expect(committee.getSortType.call(committee, 1)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 1, 1))
					.then(expect(committee.getSortType.call(committee, 1)).to.eventually.equal('ascending'));
			});

			it('- order column in ascending order and then descending order', function() {
				expect(committee.getSortType.call(committee, 1)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 1, 1))
					.then(expect(committee.getSortType.call(committee, 1)).to.eventually.equal('ascending'))
					.then(committee.orderColumn.call(committee, 1, -1))
					.then(expect(committee.getSortType.call(committee, 1)).to.eventually.equal('descending'));
			});

			it('- order column in descending order', function() {
				expect(committee.getSortType.call(committee, 1)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 1, -1))
					.then(expect(committee.getSortType.call(committee, 1)).to.eventually.equal('descending'));
			});
			
			it('- order column in descending order and then ascending order', function() {
				expect(committee.getSortType.call(committee, 1)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 1, -1))
					.then(expect(committee.getSortType.call(committee, 1)).to.eventually.equal('descending'))
					.then(committee.orderColumn.call(committee, 1, 1))
					.then(expect(committee.getSortType.call(committee, 1)).to.eventually.equal('ascending'));
			});
		});

		describe('- degree column', function() {
			afterEach(function cleanUpEach() {
				committee.refreshTable();
			});

			it('- order column in ascending order', function() {
				expect(committee.getSortType.call(committee, 2)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 2, 1))
					.then(expect(committee.getSortType.call(committee, 2)).to.eventually.equal('ascending'));
			});

			it('- order column in ascending order and then descending order', function() {
				expect(committee.getSortType.call(committee, 2)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 2, 1))
					.then(expect(committee.getSortType.call(committee, 2)).to.eventually.equal('ascending'))
					.then(committee.orderColumn.call(committee, 2, -1))
					.then(expect(committee.getSortType.call(committee, 2)).to.eventually.equal('descending'));
			});

			it('- order column in descending order', function() {
				expect(committee.getSortType.call(committee, 2)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 2, -1))
					.then(expect(committee.getSortType.call(committee, 2)).to.eventually.equal('descending'));
			});
			
			it('- order column in descending order and then ascending order', function() {
				expect(committee.getSortType.call(committee, 2)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 2, -1))
					.then(expect(committee.getSortType.call(committee, 2)).to.eventually.equal('descending'))
					.then(committee.orderColumn.call(committee, 2, 1))
					.then(expect(committee.getSortType.call(committee, 2)).to.eventually.equal('ascending'));
			});
		});
        
		describe('- my review status column', function() {
			afterEach(function cleanUpEach() {
				committee.refreshTable();
			});

			it('- order column in ascending order', function() {
				expect(committee.getSortType.call(committee, 3)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 3, 1))
					.then(expect(committee.getSortType.call(committee, 3)).to.eventually.equal('ascending'));
			});

			it('- order column in ascending order and then descending order', function() {
				expect(committee.getSortType.call(committee, 3)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 3, 1))
					.then(expect(committee.getSortType.call(committee, 3)).to.eventually.equal('ascending'))
					.then(committee.orderColumn.call(committee, 3, -1))
					.then(expect(committee.getSortType.call(committee, 3)).to.eventually.equal('descending'));
			});

			it('- order column in descending order', function() {
				expect(committee.getSortType.call(committee, 3)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 3, -1))
					.then(expect(committee.getSortType.call(committee, 3)).to.eventually.equal('descending'));
			});
			
			it('- order column in descending order and then ascending order', function() {
				expect(committee.getSortType.call(committee, 3)).to.eventually.equal('none')
					.then(committee.orderColumn.call(committee, 3, -1))
					.then(expect(committee.getSortType.call(committee, 3)).to.eventually.equal('descending'))
					.then(committee.orderColumn.call(committee, 3, 1))
					.then(expect(committee.getSortType.call(committee, 3)).to.eventually.equal('ascending'));
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

			it('- get degree applied for field', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.degree)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- get review status field', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.rstatus)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});
		});

		describe('- select an element from each field using drop down', function() {
			after(function cleanUp() {
				committee.refreshTable();
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
						.eventually.contain('Chrysa Really'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Name = Chrysa Really'))
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

			it('- open review status drop down and select an element', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.rstatus.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.rstatus.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Draft'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('My Review Status = Draft'))
					.then(filter.closeFilterModal.call(filter));
			});
		});

		describe('- select an element from each field by sending keys', function() {
			after(function cleanUp() {
				committee.refreshTable();
			});

			it('- open applicant name drop down, type and select an element', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.applicant.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.applicant.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'ea'))
					.then(filter.selectIthElement.call(filter, 6))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Chrysa Really'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Name = Chrysa Really'))
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

			it('- open review status drop down, type and select an element', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.rstatus.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.rstatus.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'D'))
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Draft'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('My Review Status = Draft'))
					.then(filter.closeFilterModal.call(filter));
			});
		});

		describe('- select columns', function() {
			after(function cleanUp() {
				committee.refreshTable();
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
					.then(expect(filter.columnIsSelected.call(filter, 'Name'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.applicant))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.applicant.index)).to
						.eventually.contain('2'))
					.then(expect(filter.columnIsSelected.call(filter, 'Name'))
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

			it('- select review status column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'My Review Status'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.rstatus))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.rstatus.index)).to
						.eventually.contain('4'))
					.then(expect(filter.columnIsSelected.call(filter, 'My Review Status'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select actions column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'Actions'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.actions))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.actions.index)).to
						.eventually.contain('5'))
					.then(expect(filter.columnIsSelected.call(filter, 'Actions'))
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
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('committee'));
			});
		});

		describe.skip('- filter presets', function() {
			// stub for filter preset tests
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
						.rstatus.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.rstatus.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'D'))
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Draft'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('My Review Status = Draft'))
					.then(filter.submitFilter.call(filter))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('filter'))
					.then(expect(committee.applicationTableIsDisplayed.call(committee)).to.eventually.be.true)
					.then(expect(committee.tableHeaderExists.call(committee)).to.eventually.be.true)
					.then(expect(committee.tableBodyExists.call(committee)).to.eventually.be.true)
					.then(expect(committee.isHighlighted.call(committee, 0, 3)).to.eventually.equal('MASc'))
					.then(expect(committee.isHighlighted.call(committee, 0, 4)).to.eventually.equal('Draft'));
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
					.then(filter.toggleColumn.call(filter, filter.filter.cols.rstatus))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.applicant.index)).to
						.eventually.contain('1'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.degree.index)).to
						.eventually.contain('2'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.rstatus.index)).to
						.eventually.contain('3'))
					.then(expect(filter.columnIsSelected.call(filter, 'Name'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'Degree Applied For'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'My Review Status'))
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
					.then(expect(committee.applicationTableIsDisplayed.call(committee)).to.eventually.be.true)
					.then(expect(committee.tableHeaderExists.call(committee)).to.eventually.be.true)
					.then(expect(committee.tableBodyExists.call(committee)).to.eventually.be.true)
					.then(expect(committee.getTableColumns.call(committee)).to.eventually.equal(4))
					.then(expect(committee.getColumnName.call(committee, 0)).to.eventually.equal('Applicant Name'))
					.then(expect(committee.getColumnName.call(committee, 1)).to.eventually.equal('Degree Applied For'))
					.then(expect(committee.getColumnName.call(committee, 2)).to.eventually.equal('My Review Status'))
					.then(expect(committee.getColumnName.call(committee, 3)).to.eventually.equal('Actions'));
			});

			it('- apply filtering that returns no table', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.applicant))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.degree))
					.then(filter.toggleColumn.call(filter, filter.filter.cols.rstatus))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.applicant.index)).to
						.eventually.contain('1'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.degree.index)).to
						.eventually.contain('2'))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.rstatus.index)).to
						.eventually.contain('3'))
					.then(expect(filter.columnIsSelected.call(filter, 'Name'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'Degree Applied For'))
						.to.eventually.be.true)
					.then(expect(filter.columnIsSelected.call(filter, 'My Review Status'))
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
						.rstatus.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.rstatus.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 't'))
					.then(filter.selectIthElement.call(filter, 3))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Submitted'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('My Review Status = Submitted'))
					.then(filter.submitFilter.call(filter))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('filter'))
					.then(expect(committee.applicationTableIsDisplayed.call(committee)).to.eventually.be.false)
					.then(expect(committee.tableHeaderExists.call(committee)).to.eventually.be.false)
					.then(expect(committee.tableBodyExists.call(committee)).to.eventually.be.false)
					.then(expect(committee.getTableError.call(committee)).to.eventually.contain('Error loading table.'));
			});
		});
	});
});

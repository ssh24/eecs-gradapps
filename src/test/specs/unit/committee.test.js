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
var Review = require('../../views/review-view');
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
	var review = new Review(timeout);
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

	describe('- review applications', function() {
		it('- start a new application and exit out w/o changes', function() {
			expect(review.getStatus.call(review)).to.eventually.equal('New')
				.then(review.startReview.call(review, 17))
				.then(expect(browser.getCurrentUrl()).to.eventually.contain('review'))
				.then(review.closeReview.call(review))
				.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('review'))
				.then(expect(review.getStatus.call(review)).to.eventually.equal('New'));
		});

		it('- start a new application, add a university that exists', function() {
			expect(review.getStatus.call(review)).to.eventually.equal('New')
				.then(review.startReview.call(review, 17))
				.then(review.addNewUniversity.call(review, 'Assam Agricultural University'))
				.then(expect(review.getAddUniversityError.call(review)).to
					.eventually.equal('Institution Assam Agricultural University exists. Please select from the menu.'))
				.then(review.closeReview.call(review))
				.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('review'))
				.then(expect(review.getStatus.call(review)).to.eventually.equal('New'));
		});

		it('- start a new application, add an invalid university name', function() {
			expect(review.getStatus.call(review)).to.eventually.equal('New')
				.then(review.startReview.call(review, 17))
				.then(review.addNewUniversity.call(review, ''))
				.then(expect(review.getAddUniversityError.call(review)).to
					.eventually.equal('Invalid name. Please try again.'))
				.then(review.closeReview.call(review))
				.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('review'))
				.then(expect(review.getStatus.call(review)).to.eventually.equal('New'));
		});

		it('- start a new application, select a university and an existing assessment for the university', function() {
			expect(review.getStatus.call(review)).to.eventually.equal('New')
				.then(review.startReview.call(review, 17))
				.then(review.selectUniversity.call(review, 0))
				.then(review.addUniversityAssessment.call(review, 0, 'Not so well known'))
				.then(expect(review.getAddAssessmentError.call(review)).to
					.eventually.equal('Exact match of assessment found. Please select from the menu.'))
				.then(review.closeReview.call(review))
				.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('review'))
				.then(expect(review.getStatus.call(review)).to.eventually.equal('New'));
		});

		it('- start a new application, select a university and an invalid assessment for the university', function() {
			expect(review.getStatus.call(review)).to.eventually.equal('New')
				.then(review.startReview.call(review, 17))
				.then(review.selectUniversity.call(review, 0))
				.then(review.addUniversityAssessment.call(review, 0, ''))
				.then(expect(review.getAddAssessmentError.call(review)).to
					.eventually.equal('Invalid assessment. Please try again.'))
				.then(review.closeReview.call(review))
				.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('review'))
				.then(expect(review.getStatus.call(review)).to.eventually.equal('New'));
		});

		describe('- check for fields in a new application', function() {
			before(function setUp() {
				review.startReview(17);
			});

			after(function cleanUp() {
				review.closeReview();
			});

			it('- check for name fields', function() {
				expect(review.isLNameDisplayed.call(review)).to.eventually.be.true
					.then(expect(review.isFNameDisplayed.call(review)).to.eventually.be.true);
			});

			it('- check for degree field', function() {
				expect(review.isDegreeDisplayed.call(review)).to.eventually.be.true;
			});

			it('- check for gpa and gre fields', function() {
				expect(review.isGPADisplayed.call(review)).to.eventually.be.true
					.then(expect(review.isGREDisplayed.call(review)).to.eventually.be.true);
			});

			it('- check for uni fields', function() {
				expect(review.isPrevUniDisplayed.call(review)).to.eventually.be.true
					.then(expect(review.isNewUniCheckDisplayed.call(review)).to.eventually.be.true)
					.then(expect(review.isNewUniNameDisplayed.call(review)).to.eventually.be.true)
					.then(expect(review.isNewUniBtnDisplayed.call(review)).to.eventually.be.true);
			});

			it('- check for assessment fields', function() {
				expect(review.isUniAssessmentDisplayed.call(review)).to.eventually.be.true
					.then(expect(review.isAddAssessmentCheckDisplayed.call(review)).to.eventually.be.true)
					.then(expect(review.isUniAssessmentDDDisplayed.call(review)).to.eventually.be.true)
					.then(expect(review.isAddAssessmentFormDisplayed.call(review)).to.eventually.be.true)
					.then(expect(review.isAddAssessmentBtnDisplayed.call(review)).to.eventually.be.true);
			});

			it('- check for background, research and comments field', function() {
				expect(review.isBackgroundDisplayed.call(review)).to.eventually.be.true
					.then(expect(review.isResearchDisplayed.call(review)).to.eventually.be.true)
					.then(expect(review.isCommentsDisplayed.call(review)).to.eventually.be.true);
			});

			it('- check for rank field', function() {
				expect(review.isRankDisplayed.call(review)).to.eventually.be.true;
			});

			it('- check for cancel, draft and submit buttons', function() {
				expect(review.isCancelBtnDisplayed.call(review)).to.eventually.be.true
					.then(expect(review.isDraftBtnDisplayed.call(review)).to.eventually.be.true)
					.then(expect(review.isSubmitBtnDisplayed.call(review)).to.eventually.be.true);
			});
		});

		describe('- check for fields in a submitted application', function() {
			before(function setUp() {
				review.viewReview(18);
			});

			after(function cleanUp() {
				review.closeReview();
			});

			describe('- check for name fields', function() {
				it('- check for name fields displayed', function() {
					expect(review.isLNameDisplayed.call(review)).to.eventually.be.true
						.then(expect(review.isFNameDisplayed.call(review)).to.eventually.be.true);
				});

				it('- check for name fields enabled', function() {
					expect(review.isFNameEnabled.call(review)).to.eventually.be.false
						.then(expect(review.isLNameEnabled.call(review)).to.eventually.be.false);
				});
			});

			describe('- check for degree fields', function() {
				it('- check for degree field displayed', function() {
					expect(review.isDegreeDisplayed.call(review)).to.eventually.be.true;
				});

				it('- check for degree field enabled', function() {
					expect(review.isDegreeEnabled.call(review)).to.eventually.be.false;
				});
			});

			describe('- check for gpa and gre fields', function() {
				it('- check for gpa and gre fields displayed', function() {
					expect(review.isGPADisplayed.call(review)).to.eventually.be.true
						.then(expect(review.isGREDisplayed.call(review)).to.eventually.be.true);
				});

				it('- check for gpa and gre fields enabled', function() {
					expect(review.isGPAEnabled.call(review)).to.eventually.be.false
						.then(expect(review.isGREEnabled.call(review)).to.eventually.be.false);
				});
			});

			describe('- check for uni fields', function() {
				it('- check for uni fields displayed', function() {
					expect(review.isPrevUniDisplayed.call(review)).to.eventually.be.true
						.then(expect(review.isNewUniCheckDisplayed.call(review)).to.eventually.be.true)
						.then(expect(review.isNewUniNameDisplayed.call(review)).to.eventually.be.true)
						.then(expect(review.isNewUniBtnDisplayed.call(review)).to.eventually.be.true);
				});

				it('- check for uni fields enabled', function() {
					expect(review.isPrevUniEnabled.call(review)).to.eventually.be.false
						.then(expect(review.isNewUniCheckEnabled.call(review)).to.eventually.be.false)
						.then(expect(review.isNewUniNameEnabled.call(review)).to.eventually.be.false)
						.then(expect(review.isNewUniBtnEnabled.call(review)).to.eventually.be.false);
				});
			});

			describe('- check for assessment fields', function() {
				it('- check for assessment fields displayed', function() {
					expect(review.isUniAssessmentDisplayed.call(review)).to.eventually.be.true
						.then(expect(review.isAddAssessmentCheckDisplayed.call(review)).to.eventually.be.true)
						.then(expect(review.isUniAssessmentDDDisplayed.call(review)).to.eventually.be.true)
						.then(expect(review.isAddAssessmentFormDisplayed.call(review)).to.eventually.be.true)
						.then(expect(review.isAddAssessmentBtnDisplayed.call(review)).to.eventually.be.true);
				});

				it('- check for assessment fields enabled', function() {
					expect(review.isUniAssessmentEnabled.call(review)).to.eventually.be.false
						.then(expect(review.isAddAssessmentCheckEnabled.call(review)).to.eventually.be.false)
						.then(expect(review.isUniAssessmentDDEnabled.call(review)).to.eventually.be.false)
						.then(expect(review.isAddAssessmentFormEnabled.call(review)).to.eventually.be.false)
						.then(expect(review.isAddAssessmentBtnEnabled.call(review)).to.eventually.be.false);
				});
			});

			describe('- check for background, research and comments field', function() {
				it('- check for background, research and comments field displayed', function() {
					expect(review.isBackgroundDisplayed.call(review)).to.eventually.be.true
						.then(expect(review.isResearchDisplayed.call(review)).to.eventually.be.true)
						.then(expect(review.isCommentsDisplayed.call(review)).to.eventually.be.true);
				});

				it('- check for background, research and comments field enabled', function() {
					expect(review.isBackgroundEnabled.call(review)).to.eventually.be.false
						.then(expect(review.isResearchEnabled.call(review)).to.eventually.be.false)
						.then(expect(review.isCommentsEnabled.call(review)).to.eventually.be.false);
				});
			});

			describe('- check for rank field', function() {
				it('- check for rank field displayed', function() {
					expect(review.isRankDisplayed.call(review)).to.eventually.be.true;
				});

				it('- check for for rank enabled', function() {
					expect(review.isRankEnabled.call(review)).to.eventually.be.false;
				});
			});

			it('- check for exit button', function() {
				expect(review.isCancelBtnDisplayed.call(review)).to.eventually.be.true;
			});
		});

		describe('- fill out an application', function() {
			describe('- draft the application', function() {
				var data = {
					gre: '150',
					university: ['Assam Agricultural University', 'Ferris State University', 'York University'],
					assessment: ['Not so well known', 'Ranked 340th in the world', 'Ranked 17th in Canada'],
					background: 'Has good programming experience. Not good in math',
					research: 'No research experience whatsoever.',
					comments: 'Not a good match to our program. Would not recommend the student.',
					rank: 'B',
				};
				before(function setUp() {
					review.startReview(17);
				});
	
				after(function cleanUp() {
					review.saveReview()
						.then(expect(review.getStatus.call(review)).to.eventually.equal('Draft'))
						.then(review.continueReview.call(review, 17))
						.then(expect(review.getGre.call(review)).to.eventually.equal(data.gre))
						.then(expect(review.getSelectedUniversity.call(review)).to.eventually.contain(data.university[0]))
						.then(expect(review.getSelectedUniversity.call(review)).to.eventually.contain(data.university[1]))
						.then(expect(review.getSelectedUniversity.call(review)).to.eventually.contain(data.university[2]))
						.then(expect(review.getSelectedAssessment.call(review)).to.eventually.contain(data.assessment[0]))
						.then(expect(review.getSelectedAssessment.call(review)).to.eventually.contain(data.assessment[1]))
						.then(expect(review.getSelectedAssessment.call(review)).to.eventually.contain(data.assessment[2]))
						.then(expect(review.getBackground.call(review)).to.eventually.contain(data.background))
						.then(expect(review.getResearch.call(review)).to.eventually.contain(data.research))
						.then(expect(review.getComments.call(review)).to.eventually.contain(data.comments))
						.then(expect(review.getSelectedRank.call(review)).to.eventually.contain(data.rank))
						.then(review.closeReview.call(review));
				});
	
				it('- edit GRE field and save', function() {
					review.setGre(data.gre)
						.then(expect(review.getGre.call(review)).to.eventually.equal(data.gre));
				});
	
				it('- select two existing universities', function() {
					review.selectUniversity(0)
						.then(review.selectUniversity.call(review, 2))
						.then(expect(review.getSelectedUniversity.call(review)).to.eventually.contain(data.university[0]))
						.then(expect(review.getSelectedUniversity.call(review)).to.eventually.contain(data.university[1]));
				});
	
				it('- select assessment for each university', function() {
					review.selectAssessment(0)
						.then(review.selectAssessment.call(review, 2))
						.then(expect(review.getSelectedAssessment.call(review)).to.eventually.contain(data.assessment[0]))
						.then(expect(review.getSelectedAssessment.call(review)).to.eventually.contain(data.assessment[1]));
				});
	
				it('- add a new university w/ assessment', function() {
					review.addNewUniversity(data.university[2])
						.then(expect(review.getSelectedUniversity.call(review)).to.eventually.contain(data.university[2]))
						.then(review.addUniversityAssessment.call(review, 2, data.assessment[2]))
						.then(expect(review.getSelectedAssessment.call(review)).to.eventually.contain(data.assessment[2]));
				});
	
				it('- add background info', function() {
					review.setBackground(data.background)
						.then(expect(review.getBackground.call(review)).to.eventually.contain(data.background));
				});
	
				it('- add research info', function() {
					review.setResearch(data.research)
						.then(expect(review.getResearch.call(review)).to.eventually.contain(data.research));
				});
	
				it('- add comments', function() {
					review.setComments(data.comments)
						.then(expect(review.getComments.call(review)).to.eventually.contain(data.comments));
				});
	
				it('- select committee rank', function() {
					review.selectRank(4)
						.then(expect(review.getSelectedRank.call(review)).to.eventually.contain(data.rank));
				});
			});

			describe('- submit the application', function() {
				before(function setUp() {
					review.continueReview(17);
				});
	
				it('- submit the application', function() {
					review.submitReview()
						.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('review'))
						.then(expect(review.getStatus.call(review)).to.eventually.equal('Submitted'))
						.then(function() {browser.pause();});
				});
	
				describe('- check for fields after submission', function() {
					before(function setUp() {
						review.viewReview(17);
					});
		
					after(function cleanUp() {
						review.closeReview();
					});
		
					describe('- check for name fields', function() {
						it('- check for name fields displayed', function() {
							expect(review.isLNameDisplayed.call(review)).to.eventually.be.true
								.then(expect(review.isFNameDisplayed.call(review)).to.eventually.be.true);
						});
		
						it('- check for name fields enabled', function() {
							expect(review.isFNameEnabled.call(review)).to.eventually.be.false
								.then(expect(review.isLNameEnabled.call(review)).to.eventually.be.false);
						});
					});
		
					describe('- check for degree fields', function() {
						it('- check for degree field displayed', function() {
							expect(review.isDegreeDisplayed.call(review)).to.eventually.be.true;
						});
		
						it('- check for degree field enabled', function() {
							expect(review.isDegreeEnabled.call(review)).to.eventually.be.false;
						});
					});
		
					describe('- check for gpa and gre fields', function() {
						it('- check for gpa and gre fields displayed', function() {
							expect(review.isGPADisplayed.call(review)).to.eventually.be.true
								.then(expect(review.isGREDisplayed.call(review)).to.eventually.be.true);
						});
		
						it('- check for gpa and gre fields enabled', function() {
							expect(review.isGPAEnabled.call(review)).to.eventually.be.false
								.then(expect(review.isGREEnabled.call(review)).to.eventually.be.false);
						});
					});
		
					describe('- check for uni fields', function() {
						it('- check for uni fields displayed', function() {
							expect(review.isPrevUniDisplayed.call(review)).to.eventually.be.true
								.then(expect(review.isNewUniCheckDisplayed.call(review)).to.eventually.be.true)
								.then(expect(review.isNewUniNameDisplayed.call(review)).to.eventually.be.true)
								.then(expect(review.isNewUniBtnDisplayed.call(review)).to.eventually.be.true);
						});
		
						it('- check for uni fields enabled', function() {
							expect(review.isPrevUniEnabled.call(review)).to.eventually.be.false
								.then(expect(review.isNewUniCheckEnabled.call(review)).to.eventually.be.false)
								.then(expect(review.isNewUniNameEnabled.call(review)).to.eventually.be.false)
								.then(expect(review.isNewUniBtnEnabled.call(review)).to.eventually.be.false);
						});
					});
		
					describe('- check for assessment fields', function() {
						it('- check for assessment fields displayed', function() {
							expect(review.isUniAssessmentDisplayed.call(review)).to.eventually.be.true
								.then(expect(review.isAddAssessmentCheckDisplayed.call(review)).to.eventually.be.true)
								.then(expect(review.isUniAssessmentDDDisplayed.call(review)).to.eventually.be.true)
								.then(expect(review.isAddAssessmentFormDisplayed.call(review)).to.eventually.be.true)
								.then(expect(review.isAddAssessmentBtnDisplayed.call(review)).to.eventually.be.true);
						});
		
						it('- check for assessment fields enabled', function() {
							expect(review.isUniAssessmentEnabled.call(review)).to.eventually.be.false
								.then(expect(review.isAddAssessmentCheckEnabled.call(review)).to.eventually.be.false)
								.then(expect(review.isUniAssessmentDDEnabled.call(review)).to.eventually.be.false)
								.then(expect(review.isAddAssessmentFormEnabled.call(review)).to.eventually.be.false)
								.then(expect(review.isAddAssessmentBtnEnabled.call(review)).to.eventually.be.false);
						});
					});
		
					describe('- check for background, research and comments field', function() {
						it('- check for background, research and comments field displayed', function() {
							expect(review.isBackgroundDisplayed.call(review)).to.eventually.be.true
								.then(expect(review.isResearchDisplayed.call(review)).to.eventually.be.true)
								.then(expect(review.isCommentsDisplayed.call(review)).to.eventually.be.true);
						});
		
						it('- check for background, research and comments field enabled', function() {
							expect(review.isBackgroundEnabled.call(review)).to.eventually.be.false
								.then(expect(review.isResearchEnabled.call(review)).to.eventually.be.false)
								.then(expect(review.isCommentsEnabled.call(review)).to.eventually.be.false);
						});
					});
		
					describe('- check for rank field', function() {
						it('- check for rank field displayed', function() {
							expect(review.isRankDisplayed.call(review)).to.eventually.be.true;
						});
		
						it('- check for for rank enabled', function() {
							expect(review.isRankEnabled.call(review)).to.eventually.be.false;
						});
					});
		
					it('- check for exit button', function() {
						expect(review.isCancelBtnDisplayed.call(review)).to.eventually.be.true;
					});
				});
			});
		});
	});
});

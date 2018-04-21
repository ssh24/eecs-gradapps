'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var ms = require('ms');

var Admin = require('../../views/admin-view');
var Filter = require('../../views/filter-view');
var Login = require('../../views/login-view');
var Review = require('../../views/manage-review-view');
var Role = require('../../views/role-view');
var Utils = require('../../lib/utils/shared-utils');
var Welcome = require('../../views/welcome-view');

var config = require('../../lib/utils/config');

describe('Manage Reviews Test', function() {
	var timeout = ms('30s');
	this.timeout(timeout);

	var admin = new Admin(timeout);
	var filter = new Filter(timeout);
	var login = new Login(timeout);
	var review = new Review(timeout);
	var role = new Role(timeout);
	var utils = new Utils(timeout);
	var welcome = new Welcome(timeout);

	before(function setUp() {
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
		welcome.clickSignInButton()
			.then(login.fullSignIn.bind(login, config.credentials.app.admin))
			.then(role.selectRole.call(role, 'Admin'))
			.then(admin.manageReviews.call(admin));
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
		expect(review.applicationTableIsDisplayed.call(review)).to.eventually.be.true;
	});
		
	it('- table header loads properly', function() {
		expect(review.tableHeaderExists.call(review)).to.eventually.be.true;
	});
		
	it('- table body loads properly', function() {
		expect(review.tableBodyExists.call(review)).to.eventually.be.true;
	});
		
	it('- get refresh table text', function() {
		expect(review.getRefreshTableText.call(review)).to.eventually
			.contain('Refresh Current Table');
	});
	
	it('- perform refresh table action', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('/reviews')
			.then(review.refreshTable.call(review));
	});
    
	it('- assign a visa review', function() {
		var appIndex = 7;
		var cmIndex = 1;

		expect(review.getReviewAssigned(appIndex)).to.eventually.contain('0 / 1')
			.then(review.selectReviewer.call(review, appIndex, cmIndex))
			.then(expect(review.isOptionSelected.call(review, 'Byrom Allbones')).to.eventually.be.true)
			.then(review.assignReview.call(review, appIndex))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/reviews'))
			.then(expect(review.getReviewAssigned.call(review, appIndex)).to.eventually.contain('1 / 1'))
			.then(expect(review.getReviewPending.call(review, appIndex)).to.eventually.contain('1 / 1'));
	});
    
	it('- assign a domestic review', function() {
		var appIndex = 6;
		var cmIndex = {first: 1, second: 2};

		expect(review.getReviewAssigned(appIndex)).to.eventually.contain('0 / 2')
			.then(review.selectReviewer.call(review, appIndex, cmIndex.first, true))
			.then(review.selectReviewer.call(review, appIndex, cmIndex.second, true))
			.then(expect(review.isOptionSelected.call(review, 'Byrom Allbones')).to.eventually.be.true)
			.then(expect(review.isOptionSelected.call(review, 'Davine Dahlen')).to.eventually.be.true)
			.then(review.assignReview.call(review, appIndex))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/reviews'))
			.then(expect(review.getReviewAssigned.call(review, appIndex)).to.eventually.contain('2 / 2'))
			.then(expect(review.getReviewPending.call(review, appIndex)).to.eventually.contain('2 / 2'));
	});
    
	it('- open an application pdf', function() {
		review.viewApp(0)
			.then(utils.switchTab.call(utils, 1))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/view'))
			.then(utils.goToTab.call(utils, 0))
			.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/view'));
	});

	it('- open review manage page', function() {
		review.manageReview(0)
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/manage'))
			.then(review.closeReviewForm.call(review))
			.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/manage'));
	});

	describe('- check for fields', function() {
		before(function setUp() {
			review.manageReview(0);
		});

		after(function cleanUp() {
			review.closeReviewForm();
		});

		describe('- general information section', function() {
			it('- check for student number field', function() {
				expect(review.checkForSID.call(review)).to.eventually.be.true;
			});

			it('- check for last name field', function() {
				expect(review.checkForLName.call(review)).to.eventually.be.true;
			});

			it('- check for first name field', function() {
				expect(review.checkForFName.call(review)).to.eventually.be.true;
			});
                
			it('- check for visa status field', function() {
				expect(review.checkForVStatus.call(review)).to.eventually.be.true;
			});

			it('- check for foi field', function() {
				expect(review.checkForFOI.call(review)).to.eventually.be.true;
			});

			it('- check for pref profs field', function() {
				expect(review.checkForPrefProfs.call(review)).to.eventually.be.true;
			});
		});

		describe('- review information section', function() {
			it('- table loads properly', function() {
				expect(review.checkForAssignedTable.call(review)).to.eventually.be.true;
			});
                
			it('- table header loads properly', function() {
				expect(review.tableHeaderExists.call(review)).to.eventually.be.true;
			});
                
			it('- table body loads properly', function() {
				expect(review.tableBodyExists.call(review)).to.eventually.be.true;
			});
		});
	});
    
	describe('- managing reviews', function() {
		var appId = 0;
		var unassign = 0;
		var dismiss = 1;

		var cmIndex = {first: 8, second: 1};

		describe('- unassigning a review', function() {
			before(function setUp() {
				review.manageReview(appId);
			});
    
			after(function cleanUp() {
				expect(browser.getCurrentUrl()).to.eventually.contain('/reviews')
					.then(review.selectReviewer.call(review, appId, cmIndex.first))
					.then(review.assignReview.call(review, appId));
			});

			it('- unassign a review', function() {
				review.unassignReview(unassign)
					.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/manage'));
			});
		});
        
		describe('- dismissing a review', function() {
			before(function setUp() {
				review.manageReview(appId);
			});
    
			after(function cleanUp() {
				expect(browser.getCurrentUrl()).to.eventually.contain('/reviews')
					.then(review.selectReviewer.call(review, appId, cmIndex.second))
					.then(review.assignReview.call(review, appId));
			});

			it('- unassign a review', function() {
				review.dismissReview(dismiss)
					.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/manage'));
			});
		});
	});
    
	describe('- order reviews', function() {
		describe('- visa status column', function() {
			afterEach(function cleanUpEach() {
				review.refreshTable();
			});
	
			it('- order column in ascending order', function() {
				expect(review.getSortType.call(review, 0)).to.eventually.equal('none')
					.then(review.orderColumn.call(review, 0, 1))
					.then(expect(review.getSortType.call(review, 0)).to.eventually.equal('ascending'));
			});
	
			it('- order column in ascending order and then descending order', function() {
				expect(review.getSortType.call(review, 0)).to.eventually.equal('none')
					.then(review.orderColumn.call(review, 0, 1))
					.then(expect(review.getSortType.call(review, 0)).to.eventually.equal('ascending'))
					.then(review.orderColumn.call(review, 0, -1))
					.then(expect(review.getSortType.call(review, 0)).to.eventually.equal('descending'));
			});
	
			it('- order column in descending order', function() {
				expect(review.getSortType.call(review, 0)).to.eventually.equal('none')
					.then(review.orderColumn.call(review, 0, -1))
					.then(expect(review.getSortType.call(review, 0)).to.eventually.equal('descending'));
			});
				
			it('- order column in descending order and then ascending order', function() {
				expect(review.getSortType.call(review, 0)).to.eventually.equal('none')
					.then(review.orderColumn.call(review, 0, -1))
					.then(expect(review.getSortType.call(review, 0)).to.eventually.equal('descending'))
					.then(review.orderColumn.call(review, 0, 1))
					.then(expect(review.getSortType.call(review, 0)).to.eventually.equal('ascending'));
			});
		});
			
		describe('- review assigned column', function() {
			afterEach(function cleanUpEach() {
				review.refreshTable();
			});
	
			it('- order column in ascending order', function() {
				expect(review.getSortType.call(review, 3)).to.eventually.equal('none')
					.then(review.orderColumn.call(review, 3, 1))
					.then(expect(review.getSortType.call(review, 3)).to.eventually.equal('ascending'));
			});
	
			it('- order column in ascending order and then descending order', function() {
				expect(review.getSortType.call(review, 3)).to.eventually.equal('none')
					.then(review.orderColumn.call(review, 3, 1))
					.then(expect(review.getSortType.call(review, 3)).to.eventually.equal('ascending'))
					.then(review.orderColumn.call(review, 3, -1))
					.then(expect(review.getSortType.call(review, 3)).to.eventually.equal('descending'));
			});
	
			it('- order column in descending order', function() {
				expect(review.getSortType.call(review, 3)).to.eventually.equal('none')
					.then(review.orderColumn.call(review, 3, -1))
					.then(expect(review.getSortType.call(review, 3)).to.eventually.equal('descending'));
			});
				
			it('- order column in descending order and then ascending order', function() {
				expect(review.getSortType.call(review, 3)).to.eventually.equal('none')
					.then(review.orderColumn.call(review, 3, -1))
					.then(expect(review.getSortType.call(review, 3)).to.eventually.equal('descending'))
					.then(review.orderColumn.call(review, 3, 1))
					.then(expect(review.getSortType.call(review, 3)).to.eventually.equal('ascending'));
			});
		});
	
		describe('- review pending column', function() {
			afterEach(function cleanUpEach() {
				review.refreshTable();
			});
	
			it('- order column in ascending order', function() {
				expect(review.getSortType.call(review, 4)).to.eventually.equal('none')
					.then(review.orderColumn.call(review, 4, 1))
					.then(expect(review.getSortType.call(review, 4)).to.eventually.equal('ascending'));
			});
	
			it('- order column in ascending order and then descending order', function() {
				expect(review.getSortType.call(review, 4)).to.eventually.equal('none')
					.then(review.orderColumn.call(review, 4, 1))
					.then(expect(review.getSortType.call(review, 4)).to.eventually.equal('ascending'))
					.then(review.orderColumn.call(review, 4, -1))
					.then(expect(review.getSortType.call(review, 4)).to.eventually.equal('descending'));
			});
	
			it('- order column in descending order', function() {
				expect(review.getSortType.call(review, 4)).to.eventually.equal('none')
					.then(review.orderColumn.call(review, 4, -1))
					.then(expect(review.getSortType.call(review, 4)).to.eventually.equal('descending'));
			});
				
			it('- order column in descending order and then ascending order', function() {
				expect(review.getSortType.call(review, 4)).to.eventually.equal('none')
					.then(review.orderColumn.call(review, 4, -1))
					.then(expect(review.getSortType.call(review, 4)).to.eventually.equal('descending'))
					.then(review.orderColumn.call(review, 4, 1))
					.then(expect(review.getSortType.call(review, 4)).to.eventually.equal('ascending'));
			});
		});
	});

	describe('- filter reviews', function() {
		describe('- check for all fields', function() {
			it('- get visa status field', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.vstatus)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- get foi field', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.foi)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- get preferred professor(s) field', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.getField.call(filter, filter.filter.
						fields.professor)).to
						.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});
		});
	
		describe('- select an element from each field using drop down', function() {
			after(function cleanUp() {
				review.refreshTable();
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

			it('- open field of interest drop down and select an element', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.foi.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.foi.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Bioinformatics'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Field(s) of Interest = Bioinformatics'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open professor name drop down and select an element', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.professor.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.professor.openDD)).to
						.eventually.be.true)
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Aijun An'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Preferred Professor(s) = Aijun An'))
					.then(filter.closeFilterModal.call(filter));
			});	
		});
	
		describe('- select an element from each field by sending keys', function() {
			after(function cleanUp() {
				review.refreshTable();
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
	
			it('- open field of interest drop down, type and select an element', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
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
						.contain('Field(s) of Interest = Bioinformatics'))
					.then(filter.closeFilterModal.call(filter));
			});

			it('- open professor name drop down, type and select an element', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
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
						.contain('Preferred Professor(s) = Aijun An'))
					.then(filter.closeFilterModal.call(filter));
			});
		});
	
		describe('- select columns', function() {
			after(function cleanUp() {
				review.refreshTable();
			});
	
			it('- select actions column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'Actions'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.actions))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.actions.index)).to
						.eventually.contain('1'))
					.then(expect(filter.columnIsSelected.call(filter, 'Actions'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select visa status column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'Visa Status'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.vstatus))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.vstatus.index)).to
						.eventually.contain('2'))
					.then(expect(filter.columnIsSelected.call(filter, 'Visa Status'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select foi column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'Field(s) of Interest'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.foi))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.foi.index)).to
						.eventually.contain('3'))
					.then(expect(filter.columnIsSelected.call(filter, 'Field(s) of Interest'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select professor column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'Preferred Professor(s)'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.professor))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.professor.index)).to
						.eventually.contain('4'))
					.then(expect(filter.columnIsSelected.call(filter, 'Preferred Professor(s)'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select review pending column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'Review Pending'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.rPending))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.rPending.index)).to
						.eventually.contain('5'))
					.then(expect(filter.columnIsSelected.call(filter, 'Review Pending'))
						.to.eventually.be.true)
					.then(filter.closeFilterModal.call(filter));
			});

			it('- select review assigned column', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(expect(filter.columnIsSelected.call(filter, 'Review Assigned'))
						.to.eventually.be.false)
					.then(filter.toggleColumn.call(filter, filter.filter.cols.rAssigned))
					.then(expect(filter.getColumnIndex.call(filter, filter.filter.cols.rAssigned.index)).to
						.eventually.contain('6'))
					.then(expect(filter.columnIsSelected.call(filter, 'Review Assigned'))
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
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('/reviews'));
			});
		});
	
		describe('- filter highlights', function() {
			after(function cleanUp() {
				filter.resetFilteredTable();
			});
	
			it('- check for highlights on chosen field', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.vstatus.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.vstatus.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'm'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Domestic'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Visa Status = Domestic'))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.foi.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.foi.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'Machine'))
					.then(filter.selectIthElement.call(filter, 18))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Machine Learning'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Field(s) of Interest = Machine Learning'))
					.then(filter.submitFilter.call(filter))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('filter'))
					.then(expect(review.applicationTableIsDisplayed.call(review)).to.eventually.be.true)
					.then(expect(review.tableHeaderExists.call(review)).to.eventually.be.true)
					.then(expect(review.tableBodyExists.call(review)).to.eventually.be.true)
					.then(expect(review.isHighlighted.call(review, 0, 1)).to.eventually.equal('Domestic'))
					.then(expect(review.isHighlighted.call(review, 0, 2)).to.eventually.contain('Machine Learning'));
			});
		});
			
		describe('- filtering', function() {
			afterEach(function cleanUpEach() {
				filter.resetFilteredTable();
			});
	
			it('- apply filtering that returns resulted table', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.vstatus.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.vstatus.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'm'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Domestic'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Visa Status = Domestic'))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.foi.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.foi.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'Intel'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Artificial Intelligence'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Field(s) of Interest = Artificial Intelligence'))
					.then(filter.submitFilter.call(filter))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('filter'))
					.then(expect(review.applicationTableIsDisplayed.call(review)).to.eventually.be.true)
					.then(expect(review.tableHeaderExists.call(review)).to.eventually.be.true)
					.then(expect(review.tableBodyExists.call(review)).to.eventually.be.true);
			});
	
			it('- apply filtering that returns no table', function() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.vstatus.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.vstatus.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'm'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Domestic'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Visa Status = Domestic'))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.foi.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.foi.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'Intel'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Artificial Intelligence'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Field(s) of Interest = Artificial Intelligence'))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.professor.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.professor.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'Aijun'))
					.then(filter.selectIthElement.call(filter, 2))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Aijun An'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Preferred Professor(s) = Aijun An'))
					.then(filter.submitFilter.call(filter))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('filter'))
					.then(expect(review.applicationTableIsDisplayed.call(review)).to.eventually.be.false)
					.then(expect(review.tableHeaderExists.call(review)).to.eventually.be.false)
					.then(expect(review.tableBodyExists.call(review)).to.eventually.be.false)
					.then(expect(review.getTableError.call(review)).to.eventually.contain('Error loading table.'));
			});
		});
			
		describe('- apply filtering and assign a review', function() {
			var unassign;
			var appIndex = unassign = 0;
			var regAppIndex = 2;
			var cmIndex = 1;
			
			before(function setUp() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.vstatus.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.vstatus.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'm'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Domestic'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Visa Status = Domestic'))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.foi.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.foi.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'Intel'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Artificial Intelligence'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Field(s) of Interest = Artificial Intelligence'))
					.then(filter.submitFilter.call(filter));
			});

			after(function cleanUp() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.vstatus.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.vstatus.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'm'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Domestic'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Visa Status = Domestic'))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.foi.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.foi.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'Intel'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Artificial Intelligence'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Field(s) of Interest = Artificial Intelligence'))
					.then(filter.submitFilter.call(filter))
					.then(review.manageReview.call(review, appIndex))
					.then(review.unassignReview.call(review, unassign))
					.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/manage'));

			});

			it('- assign a review after filtering', function() {
				expect(review.getReviewAssigned(appIndex)).to.eventually.contain('1 / 2')
					.then(review.selectReviewer.call(review, appIndex, cmIndex))
					.then(expect(review.isOptionSelected.call(review, 'Byrom Allbones')).to.eventually.be.true)
					.then(review.assignReview.call(review, appIndex))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('/reviews'))
					.then(expect(review.getReviewAssigned.call(review, regAppIndex)).to.eventually.contain('2 / 2'))
					.then(expect(review.getReviewPending.call(review, regAppIndex)).to.eventually.contain('1 / 2'));
			});
		});

		describe('- apply filtering and unassign a review', function() {
			var unassign;
			var appIndex = unassign = 0;
			var regAppIndex = 2;
			var cmIndex = 5;
			
			before(function setUp() {
				expect(review.getReviewAssigned(regAppIndex)).to.eventually.contain('1 / 2')
					.then(review.selectReviewer.call(review, regAppIndex, cmIndex))
					.then(expect(review.isOptionSelected.call(review, 'Hillier Laville')).to.eventually.be.true)
					.then(review.assignReview.call(review, regAppIndex))
					.then(expect(browser.getCurrentUrl()).to.eventually.contain('/reviews'))
					.then(expect(review.getReviewAssigned.call(review, regAppIndex)).to.eventually.contain('2 / 2'))
					.then(expect(review.getReviewPending.call(review, regAppIndex)).to.eventually.contain('1 / 2'))
					.then(filter.openFilterModal.call(filter))
					.then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.vstatus.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.vstatus.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'm'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Domestic'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Visa Status = Domestic'))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.foi.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.foi.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'Intel'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Artificial Intelligence'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Field(s) of Interest = Artificial Intelligence'))
					.then(filter.submitFilter.call(filter));
			});

			it('- unassign a review after filtering', function() {
				review.manageReview(appIndex)
					.then(review.unassignReview.call(review, unassign))
					.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/manage'))
					.then(expect(review.getReviewAssigned(regAppIndex)).to.eventually.contain('1 / 2'));
			});
		});

		describe('- apply filtering and dismiss a review', function() {
			var dismiss;
			var appIndex = dismiss = 0;
			var regAppIndex = 2;
			
			before(function setUp() {
				filter.openFilterModal().then(filter.waitForModalOpen.call(filter))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.vstatus.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.vstatus.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'm'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Domestic'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Visa Status = Domestic'))
					.then(filter.openFieldDD.call(filter, filter.filter.fields
						.foi.openDD))
					.then(expect(filter.isFieldDDOpen.call(filter, filter.filter
						.fields.foi.openDD)).to
						.eventually.be.true)
					.then(filter.searchText.call(filter, 'Intel'))
					.then(filter.selectIthElement.call(filter, 1))
					.then(expect(filter.getSelectedElement.call(filter)).to
						.eventually.contain('Artificial Intelligence'))
					.then(expect(filter.getSelectedFilter.call(filter)).to.eventually
						.contain('Field(s) of Interest = Artificial Intelligence'))
					.then(filter.submitFilter.call(filter));
			});

			it('- dismiss a review after filtering', function() {
				review.manageReview(appIndex)
					.then(review.dismissReview.call(review, dismiss))
					.then(expect(browser.getCurrentUrl()).to.eventually.not.contain('/manage'))
					.then(expect(review.getReviewAssigned(regAppIndex)).to.eventually.contain('0 / 2'));
			});
		});
	});
});

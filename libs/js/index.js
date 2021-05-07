// ##################################################################################
// ################################ MODALS ##########################################
// ##################################################################################

// MODAL RESET VALUES, TEXT ETC ON CLOSE
$('.modal').on('hidden.bs.modal', function (e) {
    // DETAILS MODAL GOES BACK TO READ ONLY VIEW
    $('.modal-edit-form').addClass('d-none');
    $('.modal-edit-form').removeClass('d-block');
    $('.modal-read-only').addClass('d-block');
    $('.modal-read-only').removeClass('d-none');

    // REMOVE STYLING FROM INPUT BOXES
    $(`#personInputFname, #personInputLname, #personInputJob ,#personInputDep ,#personInputEmail,
    #personEditFname, #personEditLname, #personEditJob ,#personEditDep ,#personEditEmail`).removeClass("input-error");

    // CLEAR FORM MESSAGES
    $(".form-message").text("")
    $('#edit-modal-message').text("");

    // CLEAR INPUT BOX VALUES
    $(`#personInputFname, #personInputLname, #personInputJob ,#personInputDep ,#personInputEmail
    #personEditFname, #personEditLname, #personEditJob, #personEditDep, #personEditEmail`).val("");

})

// EDIT PERSON + CANCEL EDIT PERSON BTNS
$('.editModalPerson').on('click', function() {
    $('.modal-edit-form').toggleClass('d-none d-block');
    $('.modal-read-only').toggleClass('d-block d-none');
})

// EDIT PERSON BTN
$('#modal-edit').on('click', function() {
    // REMOVE STYLING FROM INPUT BOXES
    $("#personEditFname, #personEditLname, #personEditJob ,#personEditDep ,#personEditEmail").removeClass("input-error");
    // CLEAR FORM MESSAGES
    $(".form-message").text("");
    // ADD PLACEHOLDERS TO INPUT BOXES
    $("#personEditFname").val($('#placeholderFN').text());
    $("#personEditLname").val($('#placeholderLN').text());
    $("#personEditJob").val($('#placeholderJob').text());
    $("#personEditEmail").val($('#placeholderEmail').text());
    // TO GET PLACHEOLDER FOR DEP, MUST SELECT FROM DROPDOWN USING TEXT MATCH
    var textToMatch = $('#placeholderDep').text();
    $('#personEditDep option').filter(function() { 
        return ($(this).text() == textToMatch); 
    }).prop('selected', true)

})

// call for getDepartments when modal is opened
$('.more-option-btn').on('click', function() {
    // getallDep call
    getAllDepartments()
    $('#editMoreModal').modal('show');
})

// ##################################################################################
// ################################ INTITAL PAGE LOAD ###############################
// ##################################################################################

pageLoad();
getAllDepartments();

function pageLoad() {

    // SEARCH INPUT
    searchRadio()
    // search by first name
    $('#searchFN').click();

    // SORTER
    mainSorter()
    // sort by first name
    $('#sortFN').click();

    // VIEW CHANGER
    pageViewChanger()

    // PERSONNEL VALIDATION
    personnelForms()                                                                                                       

    // ADD/DEL PERSONNEL
    editButtons()

    scroller()

}

// ##################################################################################
// ################################## SEARCH INPUT ##################################
// ##################################################################################

// SEARCH BY RADIO TOGGLE
function searchRadio() {
    $('input[type=radio][name=searchRadio]').on('click',function() {
        // RESET SEARCH INPUT TEXT
        $("#searchInput").val("");
        // RESET SEARCH FOR TEXT
        $('#searchFor').text('');
        // SHOW ALL PERSONNEL
        $('.personnel-item').show();
        $('.letter-divider').show()
        // HIDE ALL PERSONNEL CARD INFO
        $('.personDep').addClass('d-none')
        $('.personLoc').addClass('d-none')
        $('.personJob').addClass('d-none')

        if (this.value === 'FN') {
            $("#searchInput").attr("placeholder", "First Name Search...");
            searchBy('.personFName', 'First Name');
        } 
        else if (this.value === 'LN') {
            $("#searchInput").attr("placeholder", "Last Name Search...");
            searchBy('.personLName', 'Last Name');
        }
        else if (this.value === 'DP') {
            $("#searchInput").attr("placeholder", "Department Search...");
            searchBy('.personDep', 'Department');
            // SHOW PERSON DEP INFO
            $('.personDep').removeClass('d-none')
        }
        else if (this.value === 'LC') {
            $("#searchInput").attr("placeholder", "Location Search...");
            searchBy('.personLoc', 'Location');

            // SHOW PERSON LOC INFO
            $('.personLoc').removeClass('d-none')
        }
        else if (this.value === 'JT') {
            $("#searchInput").attr("placeholder", "Job Title Search...");
            searchBy('.personJob', 'Job Title');

            // SHOW PERSON JOB INFO
            $('.personJob').removeClass('d-none')
        }
    });

    // SEARCH SHOWS/REMOVES PERSONNEL
    function searchBy(param, title) {

        $('#searchInput').on('input', (e) => {
            // GET SEARCH BAR INPUT
            var value = e.currentTarget.value.toUpperCase();
            // console.log(value);
            // EMPTY INPUT WILL SHOW EVERYTHING
            if (value === "") {
                $.each($('.personnel-item'), function () {
                    $(this).show()
                });
                $.each($('.letter-divider'), function () {
                    $(this).show()
                });
                $('#searchFor').text('');
            // MATCH INPUT WITH PERSONNEL AND SHOW THOSE THAT MATCH
            } else {
                $.each($('.personnel-item'), function () {
                    var strToMatch = $(this).find(param).text();
        
                    if(strToMatch.toUpperCase().indexOf(value) != -1) {
                        // console.log(strToMatch)
                        $(this).show()
                    } else {
                        $(this).hide()
                    }
                });
            $('#searchFor').text(`${title}s with the letters "${e.currentTarget.value}"`);
            $('.letter-divider').hide()
            }
        });
    }
}

// ##################################################################################
// ############################### MAIN SORTER ######################################
// ##################################################################################

function mainSorter() {
    
    $('.sortButton').on('click', function() {
        $('#sortModal').modal('show');
    });

    $('input[type=radio][name=sortRadio]').change(function() {
        
        $('#contentTypes').empty();
        $('#alphaScroll').empty();

        if (this.value === 'FN') {
            firstNameSorter();
            // console.log('%c firstNames A-Z', 'color: orange; font-weight: bold')
        } 
        else if (this.value === 'LN') {
            lastNameSorter();
            // console.log('%c lastNames A-Z', 'color: orange; font-weight: bold')
        }
        else if (this.value === 'DP') {
            departmentSorter();
            // console.log('%c departments A-Z', 'color: orange; font-weight: bold')
        }
        else if (this.value === 'LC') {
            locationSorter();
            // console.log('%c locations A-Z', 'color: orange; font-weight: bold')
        }
        else if (this.value === 'JT') {
            jobTitleSorter();
            // console.log('%c jobs A-Z', 'color: orange; font-weight: bold')
        }

    });

}

    // #######################################################
    // ############################### SPECIFIC SORTERS ######
    // #######################################################
    // SORTS, CREATES AND OUTPUTS HTML TO PAGE

    function firstNameSorter() {

        $.ajax({
            url: "./libs/php/personnel/getAll.php",
            type: "POST",
            dataType: 'json',
            success: function(result) {
                var dataToSort = result.data;

                // SORT FIRSTNAME ALPHABETICALLY
                var firstNames = dataToSort.sort(function(a, b) {
                    var textA = a.firstName.toUpperCase();
                    var textB = b.firstName.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                // `REDUCE` OVER THE DATA TO PRODUCE AN OBJECT
                const obj = firstNames.reduce((acc, c) => {
                    // TAKE FIRST LETTER OF NAME AS KEY
                    const letter = c.firstName[0];
                    // ACC VALUE IS JOINED BY C
                    acc[letter] = (acc[letter] || []).concat(c);
                    return acc;
                }, {});
                
                // `MAP` OVER THE OBJECT ENTRIES TO RETURN AN ARRAY OF OBJECTS
                var firstNamesAtoZ = Object.entries(obj).map(([letter, personnel]) => {
                    return { letter, personnel }
                });

                // CALL ADD TO DOM FUNC
                addHtml(firstNamesAtoZ);

                // CALL PERSON MODAL FUNCTIONALITY
                moreDetails(dataToSort);

                $('#searchFN').click();

                hideShowAlphaArrow();
            }  
        })

    }

    function lastNameSorter() {

        $.ajax({
            url: "./libs/php/personnel/getAll.php",
            type: "POST",
            dataType: 'json',
            success: function(result) {
                var dataToSort = result.data;

                // SORT FIRSTNAME ALPHABETICALLY
                var lastNames = dataToSort.sort(function(a, b) {
                    var textA = a.lastName.toUpperCase();
                    var textB = b.lastName.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                // `REDUCE` OVER THE DATA TO PRODUCE AN OBJECT
                const obj = lastNames.reduce((acc, c) => {
                    // TAKE FIRST LETTER OF NAME AS KEY
                    const letter = c.lastName[0];
                    // ACC VALUE IS JOINED BY C
                    acc[letter] = (acc[letter] || []).concat(c);
                    return acc;
                }, {});
                
                // `MAP` OVER THE OBJECT ENTRIES TO RETURN AN ARRAY OF OBJECTS
                var lastNamesAtoZ = Object.entries(obj).map(([letter, personnel]) => {
                    return { letter, personnel }
                });

                // CALL ADD TO DOM FUNC
                addHtml(lastNamesAtoZ);

                // CALL PERSON MODAL FUNCTIONALITY
                moreDetails(dataToSort);

                $('#searchLN').click();

                hideShowAlphaArrow();
            }  
        })

    }

    function departmentSorter() {
        
        $.ajax({
            url: "./libs/php/personnel/getAll.php",
            type: "POST",
            dataType: 'json',
            success: function(result) {
                var dataToSort = result.data;

                // SORT FIRSTNAME ALPHABETICALLY
                var departments = dataToSort.sort(function(a, b) {
                    var textA = a.department.toUpperCase();
                    var textB = b.department.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                // `REDUCE` OVER THE DATA TO PRODUCE AN OBJECT
                const obj = departments.reduce((acc, c) => {
                    // TAKE FIRST LETTER OF NAME AS KEY
                    const letter = c.department;
                    // ACC VALUE IS JOINED BY C
                    acc[letter] = (acc[letter] || []).concat(c);
                    return acc;
                }, {});
                
                // `MAP` OVER THE OBJECT ENTRIES TO RETURN AN ARRAY OF OBJECTS
                var departmentsAtoZ = Object.entries(obj).map(([letter, personnel]) => {
                    return { letter, personnel }
                });

                // CALL ADD TO DOM FUNC
                addHtml(departmentsAtoZ);

                // CALL PERSON MODAL FUNCTIONALITY
                moreDetails(dataToSort);

                $('#searchDP').click();

                hideShowAlphaArrow();
            }  
        })
    }

    function locationSorter() {

        $.ajax({
            url: "./libs/php/personnel/getAll.php",
            type: "POST",
            dataType: 'json',
            success: function(result) {
                var dataToSort = result.data;

                const obj = dataToSort.reduce(function(acc, c) {

                    // TAKE FIRST LETTER OF NAME AS KEY
                    const location = c.location;
                    // ACC VALUE IS JOINED BY C
                    acc[location] = (acc[location] || []).concat(c)
                    return acc;
                }, {});
            
                var newObj = [];
                $.each(obj, function(key) {
                    var obj2 = this.reduce(function(acc, c) {
            
                        // TAKE FIRST LETTER OF NAME AS KEY
                        const location = c.department;
                        // ACC VALUE IS JOINED BY C
                        acc[location] = (acc[location] || []).concat(c)
                        return acc;
                    }, {});
                    
                    newObj[key] = obj2; 
                })
            
                // `MAP` OVER THE OBJECT ENTRIES TO RETURN AN ARRAY OF OBJECTS
                data = Object.entries(newObj).map(([location, departments]) => {
                    return { location, departments }
                });
            
            
                var locationAtoZ = data.sort(function(a, b) {
                    var textA = a.location.toUpperCase();
                    var textB = b.location.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                // CALL ADD TO DOM FUNC
                addHtmlLoc(locationAtoZ);

                // CALL PERSON MODAL FUNCTIONALITY
                moreDetails(dataToSort);

                $('#searchLC').click();

                hideShowAlphaArrow();
            }  
        })
    }

    function jobTitleSorter() {
        $.ajax({
            url: "./libs/php/personnel/getAll.php",
            type: "POST",
            dataType: 'json',
            success: function(result) {
                var dataToSort = result.data;
                // console.log(result.data)
                // sort jobs alphabetically
                var jobs = dataToSort.sort(function(a, b) {
                    var textA = a.jobTitle.toUpperCase();
                    var textB = b.jobTitle.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                // `REDUCE` OVER THE DATA TO PRODUCE AN OBJECT
                const obj = jobs.reduce((acc, c) => {
                    // TAKE FIRST LETTER OF NAME AS KEY
                    const letter = c.jobTitle;
                    // ACC VALUE IS JOINED BY C
                    acc[letter] = (acc[letter] || []).concat(c);
                    return acc;
                }, {});
                
                // `MAP` OVER THE OBJECT ENTRIES TO RETURN AN ARRAY OF OBJECTS
                var jobAtoZ = Object.entries(obj).map(([letter, personnel]) => {
                    return { letter, personnel }
                });

                // CALL ADD TO DOM FUNC
                addHtml(jobAtoZ);
                // console.log(jobAtoZ)
                // CALL PERSON MODAL FUNCTIONALITY
                moreDetails(dataToSort);

                $('#searchJT').click();

                hideShowAlphaArrow();
            }  
        })
    }

    // #######################################################
    // ############################### HTML ADD ##############
    // #######################################################

    // ADDS SORTED DATA
    function addHtml(data) {

        var htmlToAdd = '<div class="list-unstyled">';
        htmlToAdd += '<h3 class="mb-3" id="searchFor"></h3>';
        var alphaScrollHtml = '<div id="alphaHtml" class="list-group list-group-horizontal">';
        $.each(data, function() {
            // create list title ie A
            var letter = this.letter === "" ? "None": this.letter;
            var hasMorethanOne = letter.length;

            if (hasMorethanOne > 1) {
                // add letter to side scrollbar
                alphaScrollHtml += `<a class="text-nowrap px-2 mx-2 rounded-pill list-group-item list-group-item-action p-0" 
                href="#link${letter}">${letter}</a>`;
            } else {
                // add letter to side scrollbar
                alphaScrollHtml += `<a class="text-nowrap px-2 list-group-item list-group-item-action p-0" 
                href="#link${letter}">${letter}</a>`;
            }

            htmlToAdd += `<h6 id="link${letter}" class="pt-1 letter-divider">${letter}</h6>`;

            
            var divStart = `<div class="personnel-sub-list" id="div${letter}">`
            htmlToAdd += divStart;

            $.each(this.personnel, function() {
                htmlToAdd += createSmallCard(this.id, this.firstName, this.lastName, 
                this.department, this.location, this.jobTitle, this.email)
            });

            var divEnd = '</div>';
            htmlToAdd += divEnd;
            
        })
        //  end list
        htmlToAdd += '</div>';
        alphaScrollHtml += '</div>';

        //  add to DOM
        $('#contentTypes').html(htmlToAdd);
        $('#alphaScroll').html(alphaScrollHtml);
        
        if($('.btnradioGrid').is(':checked'))  {
            $('#btnradioGrid1').click()
            console.log('grid')
        }
}

    // ADDS SORTED LOCATION DATA
    function addHtmlLoc(data) {
        
        var htmlToAdd = '<div class="list-unstyled">';
        htmlToAdd += '<h3 class="mb-3" id="searchFor"></h3>';
        var alphaScrollHtml = '<div id="alphaHtml"  class="list-group list-group-horizontal">';

        $.each(data, function() {
            // create list title ie A
            var location = this.location === "" ? "None": this.location;

            // add letter to side scrollbar
            alphaScrollHtml += `<a class="text-nowrap px-2 mx-2 rounded-pill list-group-item list-group-item-action p-0" 
            href="#${location}link">${location}</a>`

            htmlToAdd += `<h6 id="${location}link" class="pt-1 letter-divider">${location}</h6>`;

            
            var divStart = `<div class="personnel-sub-list" id="div${location}">`
            htmlToAdd += divStart;

            $.each(this.departments, function(key, value) {
                $.each(value, function(key2, value2) {
                    htmlToAdd += createSmallCard(this.id, this.firstName, this.lastName, 
                        this.department, this.location, this.jobTitle, this.email)
                    // console.log(value)
                });
            });

            // console.log(counter)
            var divEnd = '</div>';
            htmlToAdd += divEnd;
            
        })
        //  end list
        htmlToAdd += '</div>';
        alphaScrollHtml += '</div>';

        //  add to DOM
        $('#contentTypes').html(htmlToAdd);
        $('#alphaScroll').html(alphaScrollHtml);

        if($('.btnradioGrid').is(':checked'))  {
            $('#btnradioGrid1').click()
            console.log('grid')
        }
    }

    // CREATE CARD FOR VIEW
    function createSmallCard (uniqueId, firstName, lastName, department, location, jobTitle, email) {
        // RANDOM COLOR FOR PERSON IMG
        var colors = ['#277da1', '#577590', '#4d908e','#43aa8b', '#90be6d','#f9c74f', 
        '#f9844a', '#f8961e','#f3722c', '#a43c3e'];
        var random_color = colors[Math.floor(Math.random() * colors.length)];

        var personCard = (
        `<div class="personnel-item m-1" data-uniqueid=${uniqueId}>
                <div class="person-list d-flex justify-content-between" id="heading${firstName}">
                    <button class="btn px-0 personnel-item-btn personnel-item-btn-list open-details-modal
                    d-flex h-100 w-100 d-block" type="button">
                        <div class="person-pic-list d-block" style="background:${random_color}">
                            <span> ${firstName.charAt(0).toUpperCase()}<span>
                        </div>
                        <ul class="list-unstyled person-text-list d-block">
                            <li class="lh-1">
                                <span class="person-text"><b class="personFName">${firstName}</b> 
                                <b class="personLName">${lastName}</b></span>
                            </li>
                            <li class="">
                                <span class="person-text d-none personJob">${jobTitle ? jobTitle : 'No Job'}</span>
                                <span class="person-text d-none personDep">${department ? department : 'No Department'}</span>
                                <span class="person-text d-none personLoc">${location ? location : 'No Location'}</span>
                            </li>
                        </ul>
                    </button>
                    <button class="btn personnel-item-btn personnel-item-btn-grid open-details-modal d-flex 
                    justify-content-center h-100 w-100 d-none" type="button">
                        <div class="person-pic-grid" style="background:${random_color}">
                            ${firstName.charAt(0).toUpperCase()}
                        </div>
                        <ul class="pt-1 list-unstyled person-text-grid">
                            <li class="">
                                <span class="person-text"><b>${firstName} ${lastName}</b></span>
                            </li>
                            <li class="">
                                <span class="person-text">${jobTitle ? jobTitle : 'No Job'}</span>
                            </li>
                            <li class="">
                                <span class="person-text">${department ? department : 'No Department'}</span>,
                                <span class="person-text">${location ? location : 'No Location'}</span>
                            </li>
                            <li class="">
                                <span class="person-text">${email ? email : 'No Email'}</span>
                            </li>
                        </ul>
                    </button>
                </div>
        </div>`);

        return personCard;
    }

    // #######################################################
    // ############################### MORE DETAILS MODAL ####
    // #######################################################

    function moreDetails(data) {

        // OPEN PERSONNEL DETAILS MODAL
        $('.personnel-item-btn').on('click', function() {

            if ($(this).hasClass('open-details-modal')) {
                var getElem = $(this).closest('div.personnel-item.m-1');
                var personId = $(getElem).data('uniqueid');
                
                $.each(data, function() {
                    if (this.id === personId.toString()) {
                        var personDetails = this;
                        // console.log(personDetails);
                        $('#editModalTitle').html(
                        `<span id="placeholderFN">${personDetails.firstName}</span>
                        <span id="placeholderLN">${personDetails.lastName}</span>`);
                        $('#modalPersonBody').html(
                            `<div class="row mb-3">
                                <div class="col">
                                    <b>Job</b>: <span id="placeholderJob">${personDetails.jobTitle ? personDetails.jobTitle: "None"}</span>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col">
                                    <b>Department</b>: <span id="placeholderDep">${personDetails.department}</span>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col">
                                    <b>Location</b>: <span id="placeholderLoc">${personDetails.location}</span>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col">
                                    <b>Email</b>: <span id="placeholderEmail">${personDetails.email}</span>
                                </div>
                            </div>`
                        );
                        $("#personId").val(`${personDetails.id}`);
                    }
                })

                $('#personnelDetailsModal').modal('show');
            }
        })
    }

// ##################################################################################
// ############################### VIEW CHANGER #####################################
// ##################################################################################

// LIST + GRID VIEWS
function pageViewChanger() {
    // CHECK FOR LIST
    $('.btnradioPersonnel').on("click",function() {
        // GO TO TOP
        $('#contentTypes').scrollTop(0);
        // CHANGE STYLING OF PERSONNEL ITEMS
        // change personnel-item class
        $('.person-grid').addClass('person-list');
        $('.person-grid').removeClass('person-grid');
        // change person-pic and person-text classes
        $('.personnel-item-btn-list').addClass('d-block');
        $('.personnel-item-btn-list').removeClass('d-none');
        $('.personnel-item-btn-grid').addClass('d-none');
        $('.personnel-item-btn-grid').removeClass('d-block');
    });
    // CHECK FOR GRID
    $('.btnradioGrid').on("click",function() {
        // GO TO TOP
        $('#contentTypes').scrollTop(0);
        // CHANGE STYLING OF PERSONNEL ITEMS
        // change personnel-item class
        $('.person-list').addClass('person-grid');
        $('.person-list').removeClass('person-list');
        // change person-pic and person-text classes
        $('.personnel-item-btn-grid').addClass('d-block');
        $('.personnel-item-btn-grid').removeClass('d-none');
        $('.personnel-item-btn-list').addClass('d-none');
        $('.personnel-item-btn-list').removeClass('d-block');
    });

    $('.btnradioPersonnel').click();

}

// ##################################################################################
// ########################## ADD + EDIT PERSONNEL FORMS ############################
// ##################################################################################

// PERSONNEL ADDING AND EDITING
function personnelForms() {
    // ADDING PRESONNEL
    $('#addPersonnelForm').submit(function(event) {
        $(`#personInputFname, #personInputLname, #personInputJob , #personInputDep,
        #personInputEmail`).removeClass("input-error");
        $(".form-message").removeClass("btn-good");
        $(".form-message").removeClass("btn-fail");

        event.preventDefault();
        var nameF = $("#personInputFname").val();
        var nameL = $("#personInputLname").val();
        var job = $("#personInputJob").val();
        var dep = $("#personInputDep").val();
        console.log(job);
        var email = $("#personInputEmail").val();

        $.ajax({
            url: "./libs/php/personnel/newPersonValid.php",
            type: "POST",
            dataType: 'json',
            data: {
                'nameF': nameF,
                'nameL': nameL,
                'job': job,
                'dep': dep,
                'email': email
            },
            success: function(result) {
                console.log(result);
                if (result.data === "new person created") {
                    console.log('%c Adding Person', 'color: blue; font-weigth: bold')
                    // show successful message
                    $(".form-message").addClass("btn-good");
                    $(".form-message").text("EMPLOYEE CREATED");
                    // clear all inputs
                    $(`#personInputFname, #personInputLname, #personInputJob ,#personInputDep ,
                    #personInputEmail`).val("")
                    // refresh data
                    firstNameSorter() 
                    // ensure first name sort radio is checked
                    $('#sortFN').click();
                } else {
                    //  show error messages
                    $(".form-message").addClass("btn-fail");
                    if (result.data === "empty error") {
                        $(`#personInputFname, #personInputLname, #personInputJob ,#personInputDep,
                        #personInputEmail`).addClass("input-error");
                        $(".form-message").text("Fill in all fields");
                    }
                    if (result.data === "name error") {
                        $("#personInputFname, #personInputLname").addClass("input-error");
                        $(".form-message").text(`Name not valid - names cannot include characters such as "@"`);
                    }
                    if (result.data === "email error") {
                        $("#personInputEmail").addClass("input-error");
                        $(".form-message").text("Email not valid");
                    }
                    if (result.data === "job length error") {
                        $("#personInputJob").addClass("input-error");
                        $(".form-message").text("Job must have more than 3 characters");
                    }
                    if (result.data === "person already exists") {
                        $(`#personInputFname, #personInputLname, #personInputJob ,#personInputDep ,
                        #personInputEmail`).addClass("input-error");
                        $(".form-message").text("Employee already exists");
                    } 
                }
 
            },
            error: function (request, status, error) {
                console.log(request.responseText);
                
            }
        });
    }) 

    // EDITING PERSONNEL
    $('#editPersonnelForm').submit(function(event) {
            $(`#personEditFname, #personEditLname, #personEditJob , #personEditDep,
            #personEditEmail`).removeClass("input-error");
            $(".form-message").removeClass("btn-good");
            $(".form-message").removeClass("btn-fail");
    
            event.preventDefault();
            var nameF = $("#personEditFname").val();
            var nameL = $("#personEditLname").val();
            var job = $("#personEditJob").val();
            var dep = $("#personEditDep").val();
            var email = $("#personEditEmail").val();
            var id = $("#personId").val();
    
            $.ajax({
                url: "./libs/php/personnel/updatePerson.php",
                type: "POST",
                dataType: 'json',
                data: {
                    'nameF': nameF,
                    'nameL': nameL,
                    'job': job,
                    'dep': dep,
                    'email': email,
                    'id': id
                },
                success: function(result) {
                    console.log(result);
                    if (result.data === "person updated") {
                        $(".form-message").addClass("btn-good");
                        $("#personEditFname, #personEditLname, #personEditJob ,#personEditDep ,#personEditEmail").val("")
                        $(".form-message").text("EMPLOYEE UPDATED");
                        $('.modal-edit-form').toggleClass('d-none d-block');
                        $('.modal-read-only').toggleClass('d-block d-none');

                        $.ajax({
                            url: "./libs/php/departments/getDepartmentByID.php",
                            type: "POST",
                            dataType: 'json',
                            data: {
                                'id': dep
                            },
                            success: function(result) {
                                console.log(result)
                                var depName = result.data[0].name;
                                var locID = result.data[0].locationID
                                $.ajax({
                                    url: "./libs/php/locations/getLocationByID.php",
                                    type: "POST",
                                    dataType: 'json',
                                    data: {
                                        'id': locID
                                    },
                                    success: function(result) {
                                        console.log(result)
                                        var loc = result.data[0].name;
                                        $('#placeholderFN').text(nameF);
                                        $('#placeholderLN').text(nameL);
                                        $('#placeholderJob').text(job);
                                        $('#placeholderDep').text(depName);
                                        $('#placeholderLoc').text(loc);
                                        $('#placeholderEmail').text(email);
                                        
                                        // reload data
                                        firstNameSorter()
                                        // ensure first name sort radio is checked
                                        $('#sortFN').click();
                                    },
                                    error: function (request, status, error) {
                                        console.log(request.responseText);
                                    }
                                })
                            },
                            error: function (request, status, error) {
                                console.log(request.responseText);
                            }
                        })
        
                    } else {
                        $(".form-message").addClass("btn-fail");
                        if (result.data === "empty error") {
                            $("#personEditFname, #personEditLname, #personEditJob ,#personEditDep ,#personEditEmail").addClass("input-error");
                            $(".form-message").text("Fill in all fields");
                        }
                        if (result.data === "name error") {
                            $("#personEditFname, #personEditLname").addClass("input-error");
                            $(".form-message").text(`Name not valid - names cannot include characters such as "@"`);
                        }
                        if (result.data === "job length error") {
                            $("#personEditJob").addClass("input-error");
                            $(".form-message").text("Job must have more than 3 characters");
                        }
                        if (result.data === "email error") {
                            $("#personEditEmail").addClass("input-error");
                            $(".form-message").text("Email not valid");
                        }
                    }
     
                },
                error: function (request, status, error) {
                    console.log(request.responseText);
                    
                }
            });
    })
}

// ##################################################################################
// ############################## EDIT BTNS #########################################
// ##################################################################################

// ADD + DEL PERSONNEL
function editButtons() {

    // ADD PERSONNEL BTN
    $('.add-person-btn').on('click', function() {
        $('#addPersonModal').modal('show');
    })

    // REMOVE PERSONNEL BTN
    $('.show-del-person-btn').on('click', function() {
        deleteMode();
    })


    // DELETE ALL SELECTED BUTTON
    $('.deleteAll').on('click', function (e) {

        // DELETE ARRAYS
        var delPersonsIds = [];
        var delPersonsNames = [];
        // CHECK EACH PERSON IF THEY HAVE BEEN CHOSEN FOR DELETETION
        $('.personnel-item').each(function() {
            if ($(this).hasClass('to-delete')) {
                // IF CHOSEN ADD TO DELETE ARRAYS
                delPersonsIds.push($(this).data('uniqueid'));
                var fName = $(this).find('.personFName').text();
                var lName = $(this).find('.personLName').text();
                var data = {"firstName": fName, "lastName": lName}
                delPersonsNames.push(data);
            }
        });

        // CHECK IF ARRAY IS EMPTY
        if(delPersonsIds.length === 0) {
            console.log('No personnel have been selected')
        } else {
            //  ADD EACH ELEM IN ARRAY TO DOM 
            htmlToAdd = '<ul>';
            $.each(delPersonsNames, function() {
                htmlToAdd += `<li>${this.firstName} ${this.lastName}</li>`;
            })
            htmlToAdd += '</ul>';

            $('#deleteList').html(htmlToAdd);
            // OPEN CONFIRM DELETE MODAL
            $('#deleteModal').modal('show');
        }

        // CONFRIM DELETE VIA MODAL BUTTON
        $('#confirmDeleteModal').on('click', function () {
            deleteMode();
            // AJAX CALL TO DEL PERSONNEL
            $.ajax({
                url: "./libs/php/personnel/deletePersonnel.php",
                type: "POST",
                dataType: 'json',
                data: {
                    'ids': delPersonsIds,
                },
                success: function(result) {

                    $('.personnel-item').each(function() {
                        if ($(this).hasClass('to-delete')) {
                            // REMOVE FROM DOM
                            $(this).remove();
                        }
                    });
                    console.log('%c Deleted Person', 'color: red; font-weight: bold')
                    // console.log(result);
        
                },
                error: function (request, status, error) {
                console.log(request.responseText);
                }
            });
        })
    })
    

    // CANCEL DELETE PERSONNEL
    $('.cancelDelete').on('click', function (e) {
        deleteMode();

        $('.personnel-item ').each(function() {
            $(this).removeClass('to-delete');
        })
    })

    // TOGGLES VARIOUS ELEMENTS ON/OFF
    function deleteMode() {
        // remove/add disabled to sort button
        $('#sortButton1').prop("disabled", !$('#sortButton1').prop("disabled"));

        // show/hide edit dropdown
        $('#editOptions').toggle();

        // show/hide delete, cancel and text
        $('#delete-btn-group').toggleClass('d-none d-inline');
        $('.deleteText').toggleClass('d-none d-block');
        $('#MOB-cancel').toggleClass('d-none');
        $('#MOB-delete').toggleClass('d-none');

        $('.FAB-sub-btn').toggle()

        // remove/add class which opens person modal
        $('.personnel-item-btn').each(function() {
            $(this).toggleClass('open-details-modal');
        });
        
        $('.personnel-item-btn').on('click', function() {
            var parentElem = $(this).closest('div.personnel-item.m-1');
            parentElem.toggleClass('to-delete');
        });
    }

    // ##########################################
    // MOB SPECIFIC #############################
    // ##########################################

    $('#mobileEditButton').on('click', function() {
        $('.FAB-option').toggleClass('FAB-options-active');
        $('#mobileEditButton').toggleClass('FAB-button-active');
        if(!$('#MOB-delete-text').hasClass('d-none')) {
            deleteMode();

            $('#alphaScroll').show();
            $('.scroll-alpha').show();
            $('#MOB-delete-text').toggleClass('d-none d-block');

            $('.personnel-item ').each(function() {
                $(this).removeClass('to-delete');
            })
        }
    })

    // ALPHA SCROLL HIDE/SHOW
    $('#show-delMOB').on('click', function() {
        $('#alphaScroll').hide();
        $('.scroll-alpha').hide();
        $('#MOB-delete-text').toggleClass('d-none d-block');
    })
    $('#MOB-cancel, #cancelDeleteModal, #confirmDeleteModal').on('click', function() {
        $('#alphaScroll').show();
        $('.scroll-alpha').show();
        $('#MOB-delete-text').removeClass('d-block');
        $('#MOB-delete-text').addClass('d-none');
    })


}

// ##################################################################################
// ############################## SCROLL #########################################
// ##################################################################################

function scroller() {
    $(document).ready(function () {

        $("#scrollLeft").on('click', function() {
            $('#alphaHtml').animate({
                scrollLeft: "-=100px"
             },'slow');
        })

        $("#scrollRight").on('click', function() {
            $('#alphaHtml').animate({
                scrollLeft: "+=100px"
             },'slow');
        })
    });
}

function hideShowAlphaArrow() {
        // container width
        var scrollWidth = $('#alphaScroll').outerWidth();
        // console.log(scrollWidth)
        // children width total
        var width = 0;
        $('#alphaHtml .list-group-item').each(function() {
            width += $(this).outerWidth( true );
        });
        // console.log(width)

        if (scrollWidth > width) {
            $('#scrollRight').addClass('d-none');
            $('#scrollRight').removeClass('d-block');
            $('#scrollLeft').addClass('d-none');
            $('#scrollLeft').removeClass('d-block');
        } else {
            $('#scrollRight').addClass('d-block');
            $('#scrollRight').removeClass('d-none');
            $('#scrollLeft').addClass('d-block');
            $('#scrollLeft').removeClass('d-none');
        }
}

// ##################################################################################
// ############################### DEPARTMENTS AND LOCATIONS ########################
// ##################################################################################

function getAllDepartments() {
    $.ajax({
        url: "./libs/php/departments/getAllDepartments.php",
        type: "POST",
        // data: null,
        success: function(result) {
            
            getAllLocations(result.data)
        },
        error: function (request, status, error) {
        console.log(request.responseText);
        }
    });
}

function getAllLocations(departmentsData) {
    $.ajax({
        url: "./libs/php/locations/getAllLocations.php",
        type: "POST",
        // data: null,
        success: function(result) {
    
            var obj1 = result.data;
            var obj2 = departmentsData;
            // MERGE DEPARTMENT (OBJ1) AND LOCATION (OBJ2)
            $.each(obj1, function() {
                var idToMatch = this['id'];
                this['departments'] = [];
                var location = this['departments'];
                $.each(obj2, function() {
                    if(idToMatch === this.locationID) {
                        location.push(this);
                    }
                })
            })

            // console.log("%c MERGED DATA", "color: purple")
            // console.log(obj1)

            // LOAD HTML TEMPLATES
            addEditLocDep(obj1);

            // ADD OPTIONS TO DROPDOWN MODAL
            $.each(obj1, function() {
                $('#locDropdownEditModal').append(`<option value=${this.id}>${this.name}</option>`);
            })

            // 
            moreEditButtons();
            
            addDepartments(obj1);

            // ##############################################
            // ####### EDIT MODE MORE (LOC,DEP AND JOBS) ####
            // ##############################################

            // moreEditButtons functionality
            function moreEditButtons() {

                $('.cancel-btn').on('click', function() {
                    $(this).parent().prev().show();
                    $(this).parent().toggleClass('d-none d-block')
                    $('#edit-modal-message').text("");
                })

                $('.show-item-delete').on('click', function() {

                    // this toggle
                    $(this).hide();
                    $(this).next().toggleClass('d-none d-block')
                    // remove prev styling
                    $('#edit-modal-message').text("")
                    $("#add-dep-input, #locDropdownEditModal").removeClass("input-error");
                    $('#edit-modal-message').removeClass("btn-good");
                    $('#edit-modal-message').removeClass("btn-fail");
                })

                // DELETING DEPARTMENT
                $('.delete-dep').on('click', function() {
                    var departmentID = $(this).data('uniqueid');
                    var depToRemove = $(this).closest('.row');
                    var departmentList = $(this).closest('.departmentsList');
                    var delDepartment = departmentList.next();

                    $.ajax({
                        url: "./libs/php/departments/deleteDepartmentByID.php",
                        type: "POST",
                        dataType: 'json',
                        data: {
                            'departmentID': departmentID,
                        },
                        success: function(result) {
                            console.log(result);
                
                            if(result.data > 0) {
                                $('#edit-modal-message').text(`
                                Cannot delete department while it still contains personnel.
                                Selected department has ${result.data} personnel.`)
                                $('#edit-modal-message').addClass('btn-fail')
                            } else {
                                console.log('%c Deleted Department', 'color: red; font-weight: bold')
                                depToRemove.remove()
                                $('#edit-modal-message').text(`
                                Department successfully deleted`)
                                $('#edit-modal-message').addClass('btn-good')
                                // check if department is empty
                                departmentIsEmpty(departmentList, delDepartment)
                            }
                
                        },
                        error: function (request, status, error) {
                        console.log(request.responseText);
                        }
                    });
                    
                })

                // ADDING DEPARTMENT
                $('#add-dep-form').submit(function(event) {
                    // remove prev styling  
                    $("#add-dep-input, #add-loc-input, #locDropdownEditModal").removeClass("input-error");
                    $('#edit-modal-message').removeClass("btn-good");
                    $('#edit-modal-message').removeClass("btn-fail");

                    event.preventDefault();
                    var locationID = $('#locDropdownEditModal').val();
                    var locationName = $('#locDropdownEditModal option:selected').text()
                    var newDepartmentName = $("#add-dep-input").val();
                    // console.log(locationID)
                    // console.log(newDepartmentName)
                    // console.log(locationName)

                    $.ajax({
                        url: "./libs/php/departments/insertDepartment.php",
                        type: "POST",
                        dataType: 'json',
                        data: {
                            'locationID': locationID,
                            'departmentName': newDepartmentName,
                        },
                        success: function(result) {
                            console.log('%c Adding Department', 'color: blue; font-weight: bold')
                            console.log(result);
                            if(result.data === "Added") {
                                getAllDepartments()
                                $('#edit-modal-message').text(`
                                Department ${newDepartmentName} has been added to 
                                ${locationName}`);
                                $('#edit-modal-message').addClass('btn-good');
                            } else {
                                $('#edit-modal-message').addClass('btn-fail');
                                $("#add-dep-input, #locDropdownEditModal").addClass("input-error");
                                if (result.data === "dep already exists") {
                                    console.log('gah')
                                    $('#edit-modal-message').text(`Cannot add a department which already exists`)
                                }
                                if (result.data === "dep length error") {
                                    $('#edit-modal-message').text(`Department must have more than 3 characters`)
                                }
                                if (result.data === "name error") {
                                    $("#edit-modal-message").text(`Department not valid - it cannot include characters such as "@"`);
                                }
                                if (result.data === "empty error") {
                                    $('#edit-modal-message').text(`
                                    Fill in all highlighted fields`)
                                }
                            } 
                        },
                        error: function (request, status, error) {
                            console.log(request.responseText);
                            
                        }
                    });
                })

                // DELETING LOCATION
                $('.delete-loc').on('click', function() {
                    var locationID = $(this).data('uniqueid');
                    // var depToRemove = $(this).closest('.row')

                    $.ajax({
                        url: "./libs/php/locations/deleteLocationByID.php",
                        type: "POST",
                        dataType: 'json',
                        data: {
                            'locationID': locationID,
                        },
                        success: function(result) {
                            // console.log('%c Deleted Department', 'color: red; font-weight: bold')
                            // console.log(result);
                
                            if(result.data > 0) {
                                $('#edit-modal-message').text(`
                                Cannot delete location while it still contains departments.`)
                                $('#edit-modal-message').addClass('btn-fail')
                                // call main loop
                            } else {
                                getAllDepartments()
                                // console.log('deleted')
                                // depToRemove.remove()
                                $('#edit-modal-message').text(`
                                Location successfully deleted`)
                                $('#edit-modal-message').addClass('btn-good')
                                // call main loop
                            }
                
                        },
                        error: function (request, status, error) {
                        console.log(request.responseText);
                        }
                    });
                    
                })

                // ADDING LOCATION
                $('#add-loc-form').submit(function(event) {
                    // remove prev styling  
                    $("#add-dep-input, #add-loc-input, #locDropdownEditModal").removeClass("input-error");
                    $('#edit-modal-message').removeClass("btn-good");
                    $('#edit-modal-message').removeClass("btn-fail");

                    event.preventDefault();
                    var newlocationName = $('#add-loc-input').val()

                    $.ajax({
                        url: "./libs/php/locations/insertLocation.php",
                        type: "POST",
                        dataType: 'json',
                        data: {
                            'locationName': newlocationName,
                        },
                        success: function(result) {
                            // console.log('%c Adding Department', 'color: blue; font-weight: bold')
                            // console.log(result);
                            if(result.data === "Added") {
                                getAllDepartments()
                                $('#edit-modal-message').text(`
                                Location ${newlocationName} has been created`);
                                $('#edit-modal-message').addClass('btn-good');
                            } else {
                                $("#add-loc-input").addClass("input-error");
                                $('#edit-modal-message').addClass('btn-fail');
                                if (result.data === "loc already exists") {
                                    $('#edit-modal-message').text(`Cannot add a location which already exists`)
                                } 
                                if (result.data === "loc length error") {
                                    $('#edit-modal-message').text(`Location must have more than 3 characters`)
                                }
                                if (result.data === "name error") {
                                    $("#edit-modal-message").text(`Location not valid - it cannot include characters such as "@"`);
                                }
                                if (result.data === "empty error") {
                                    $('#edit-modal-message').text(`
                                    Fill in all highlighted fields`)
                                }
                            }
                
                        },
                        error: function (request, status, error) {
                            console.log(request.responseText);
                            
                        }
                    });
                })
            }

            // MORE OPTIONS MODAL - HTML TEMPLATES
            function addEditLocDep(data) {
                var htmlToAdd = `<h6 class="text-center border border-1">Locations and Departments</h6>
                <div class="accordion accordion-flush mb-2" id="accordionLocations">`

                $.each(data, function() {
                    // start accord item
                    htmlToAdd += '<div class="accordion-item bg-transparent px-2">';
                    // add accord item title
                    htmlToAdd += 
                    `<h6 class="accordion-header" id="">
                        <button class="btn btn-sm btn-main-outline w-100 my-1 accord-loc mb-0 d-flex justify-content-between" type="button" 
                        data-bs-toggle="collapse" data-bs-target="#${this.name.slice(0, 3)}" aria-expanded="false" 
                        aria-controls="${this.name.slice(0, 3)}">
                        <span>${this.name}</span><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                      </svg></span>
                        </button>
                    </h6>`;

                    // start accord collapse and body
                    htmlToAdd += `<div id="${this.name.slice(0, 3)}" class="collapse" aria-labelledby="${this.name.slice(0, 3)}" 
                    data-bs-parent="#accordionLocations">
                    <div class="location-body mx-2">`

                    // add each department
                    if (this.departments.length === 0) {
                        var visible = 'd-flex';
                    } else {
                        var visible = 'd-none';
                        htmlToAdd += '<div class="departmentsList">';
                        $.each(this.departments, function(key, value) {
                            htmlToAdd += addEditDep(this.name, this.id)
                        });
                        htmlToAdd += '</div>';
                    }

                    htmlToAdd += (`<div class="deleteDepDiv ${visible} row text-center my-1">
                        <div class="col-sm my-1 align-middle">
                            <span>No Departments</span>
                        </div>
                        <div class="col-sm my-1">
                        <div class="show-item-delete text-center">                    
                            <button class="btn btn-sm btn-main">
                                Delete Location
                            </button>
                        </div>
                        <div class="btn-group delete-loc-btns d-none" role="group" 
                        aria-label="Basic example">
                            <button data-uniqueid="${this.id}" class="btn btn-sm btn-main 
                            delete-loc">
                                Confirm
                            </button>
                            <button class="btn btn-sm btn-main cancel-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                    </div>`)

                    //end accord collapse and body
                    htmlToAdd += '</div></div>';
                    // end accord item
                    htmlToAdd += '</div>';
                })

                // end accord
                htmlToAdd += `</div>`

                // add dep and loc
                htmlToAdd += `<h6 class="text-center border border-1">New Department</h6>
                <form id="add-dep-form">
                    <div class="row mb-3">
                        <div class="col-sm mb-1 mb-sm-0">
                            <label for="add-dep-input" class="form-label">Name</label>
                            <input type="text" class="form-control form-control-sm"
                            aria-label="Department Name" id="add-dep-input">
                        </div>
                        <div class="col-sm mb-3 mb-sm-0">
                            <label for="locDropdownEditModal" class="form-label">Location</label>
                            <select class="form-select form-select-sm" id="locDropdownEditModal">
                            <option selected disabled value="">Select...</option>
                            <!-- Add via Js -->
                            </select>
                        </div>
                        <div class="col-sm mb-1 mb-sm-0 text-center d-flex flex-column justify-content-end">
                            <button class="btn btn-sm btn-main w-100" type="submit" id="add-dep">
                                Create
                            </button>
                        </div>
                    </div>
                </form>`

                htmlToAdd += `<h6 class="text-center border border-1">New Location</h6>
                <form id="add-loc-form">
                    <label for="add-loc-input" class="form-label">Name</label>
                    <div class="input-group input-group-sm mb-3">
                        <input type="text" class="form-control" 
                        aria-label="Location Name" id="add-loc-input">
                        <button class="btn btn-sm btn-main" type="submit">
                            Create
                        </button>
                    </div>
                </form>`


                $('#locDepEdit').html(htmlToAdd);
            }

            function addEditDep(department, id) {
                    return (
                        `<div class="row text-center my-1">
                        <div class="col-sm my-1 align-middle">
                            <span>${department}</span>
                        </div>
                        <div class="col-sm my-1">
                            <div class="show-item-delete text-center">                    
                                <button class="btn btn-sm btn-main">
                                    Delete
                                </button>
                            </div>
                            <div class="btn-group delete-dep-btns d-none" role="group" 
                            aria-label="Basic example">
                                <button data-uniqueid="${id}" class="btn btn-sm btn-main 
                                delete-dep">
                                    Confirm
                                </button>
                                <button class="btn btn-sm btn-main cancel-btn">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>`
                    )
            }

            // ADD TO DROPDOWN LISTS IN PERSONNEL FORM
            function addDepartments(data) {

                htmlToAdd1 = '<div class="form-dropdown">';
                htmlToAdd2 = '<div class="form-dropdown">';

                htmlToAdd1 += '<option selected disabled value="">Select</option>'
                htmlToAdd2 += '<option selected disabled value="">Select</option>'

                $.each(data, function() {
                    htmlToAdd1 += (
                        `<optgroup style="background: var(--background-primary); 
                        color:var(--text-secondary); font-weight: bold;" label="${this.name}">`)
                    htmlToAdd2 += (
                        `<optgroup style="background: var(--background-primary); 
                        color:var(--text-secondary); font-weight: bold;" label="${this.name}">`)
                    if (this.departments.length === 0 ) {
                        htmlToAdd1 += (
                            `<option disabled value="">No departments</option>`);
                        htmlToAdd2 += (
                            `<option disabled value=""}>No departments</option>`);
                    } else {
                        $.each(this.departments, function() {
                            htmlToAdd1 += (
                                `<option label="${this.name}" value=${this.id}>${this.name}</option>`);
                            htmlToAdd2 += (
                                `<option label="${this.name}" value=${this.id}>${this.name}</option>`);
                        })
                    }

                    htmlToAdd1 += '</optgroup>'
                    htmlToAdd2 += '</optgroup>'
                })

                htmlToAdd1 += '</div>';
                htmlToAdd2 += '</div>';

                $('#personEditDep').html(htmlToAdd1);
                $('#personInputDep').html(htmlToAdd2);
            }

            function departmentIsEmpty(div, delDiv) {
                if (div.children().length <= 0) {
                    delDiv.addClass('d-flex')
                    delDiv.removeClass('d-none')
                } else {
                    delDiv.addClass('d-none')
                    delDiv.removeClass('d-flex')
                }
            }

        },
        error: function (request, status, error) {
        console.log(request.responseText);
        }
    });
}

// ##################################################################################
// ################################# THEMES #########################################
// ##################################################################################

// THEMES
const themeMap = {
    dark: "light",
    light: "solar",
    solar: "dark"
  };
  
  const theme = localStorage.getItem('theme')
    || (tmp = Object.keys(themeMap)[0],
        localStorage.setItem('theme', tmp),
        tmp);
  const bodyClass = document.body.classList;
  bodyClass.add(theme);
  
  function toggleTheme() {
    const current = localStorage.getItem('theme');
    const next = themeMap[current];
  
    bodyClass.replace(current, next);
    localStorage.setItem('theme', next);
  }
  
  document.getElementById('themeButton').onclick = toggleTheme;





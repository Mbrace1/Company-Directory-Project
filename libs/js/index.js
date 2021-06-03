// ##################################################################################
// ################################ MODALS ##########################################
// ##################################################################################
// MODAL RESET VALUES, TEXT ETC ON CLOSE
$('.modal').on('hidden.bs.modal', function (e) {

    // REMOVE STYLING FROM INPUT BOXES
    $(`#personInputFname, #personInputLname, #personInputJob ,#personInputDep ,#personInputEmail,
    #personEditFname, #personEditLname, #personEditJob ,#personEditDep ,#personEditEmail, #add-dep-input, #locDropdownEditModal`).removeClass("input-error");

    // CLEAR INPUT BOX VALUES
    $(`#personInputFname, #personInputLname, #personInputJob ,#personInputDep ,#personInputEmail, #add-dep-input, #locDropdownEditModal`).val("");

    // edit modal revert
    $('.isDisabled,.isDisabledDep, .isDisabledLoc').prop("disabled", true);
    $('.modal-edit, .modal-edit-dep, .modal-edit-loc').removeClass('d-none');
    $('.modal-edit, .modal-edit-dep, .modal-edit-loc').addClass('d-block');
    $('.modal-submit, .modal-submit-dep, .modal-submit-loc').removeClass('d-block');
    $('.modal-submit, .modal-submit-dep, .modal-submit-loc').addClass('d-none');
})

// EDIT PERSON + CANCEL EDIT PERSON BTNS
$('.editModalPerson').on('click', function() {
    $('.isDisabled').prop("disabled", !$('.isDisabled').prop("disabled"));
    $('.modal-edit').toggleClass('d-block d-none');
    $('.modal-submit').toggleClass('d-block d-none');

    $(`#personEditFname, #personEditLname, #personEditJob , #personEditDep,
    #personEditEmail`).removeClass("input-error");
})

$('.editModalDepartment').on('click', function() {
    $('.isDisabledDep').prop("disabled", !$('.isDisabledDep').prop("disabled"));
    $('.modal-edit-dep').toggleClass('d-block d-none');
    $('.modal-submit-dep').toggleClass('d-block d-none');

    $(`#personEditFname, #personEditLname, #personEditJob , #personEditDep,
    #personEditEmail`).removeClass("input-error");
})

$('.editModalLocation').on('click', function() {
    $('.isDisabledLoc').prop("disabled", !$('.isDisabledLoc').prop("disabled"));
    $('.modal-edit-loc').toggleClass('d-block d-none');
    $('.modal-submit-loc').toggleClass('d-block d-none');

    $(`#personEditFname, #personEditLname, #personEditJob , #personEditDep,
    #personEditEmail`).removeClass("input-error");
})


$(document).ready(function() {

    $(document).on('click', '.delete-mode', function(){
        var parentElem = $(this).closest('div.personnel-item.m-1');
        parentElem.toggleClass('to-delete');
    });

    // modal open btns
    moreDetails()
});
// ##################################################################################
// ################################ INTITAL PAGE LOAD ###############################
// ##################################################################################

pageLoad();

function pageLoad() {

    // SEARCH INPUT
    searchRadio()
    // search by first name

    // SORTER
    mainSorter()
    // initial sort
    reloadData();

    // VIEW CHANGER (list to grid)
    pageViewChanger()

    // PERSONNEL VALIDATION add/edit person
    personnelForms()                                                                                                       

    // ADD/DEL PERSONNEL functionality
    editButtons()

    // alpha scroll
    scroller()

    // pre-loader remove
    $(document).ready(function() { 
        setTimeout(function(){

            $('.reveal-item').toggleClass('reveal-item');
            $('.pre-loader').toggleClass('pre-loader');
        
          }, 1000);
        
        setTimeout(function(){

            $('#pre-loader').addClass('d-none');  
        
          }, 2000);
    })

    
}

// ##################################################################################
// ################################## SEARCH INPUT ##################################
// ##################################################################################

// SEARCH BY RADIO TOGGLE
function searchRadio() {
    $('#searchForDrop').change(function() {
        // RESET SEARCH INPUT TEXT
        $(".searchInput").val("");
        // RESET SEARCH FOR TEXT
        $('.searchFor').text('');
        // SHOW ALL PERSONNEL
        $('.personnel-item').show();
        $('.letter-divider').show()
        // HIDE ALL PERSONNEL CARD INFO
        $('.personDep').addClass('d-none')
        $('.personLoc').addClass('d-none')
        $('.personJob').addClass('d-none')

        if (this.value === 'FN') {
            changeSearchVal('#searchForDrop', 'FN', "First Name...", 'First Name',
            '.personFName')
        } 
        else if (this.value === 'LN') {
            changeSearchVal('#searchForDrop', 'LN', "Last Name...", 'Last Name',
            '.personFName')
        }
        else if (this.value === 'DP') {
            changeSearchVal('#searchForDrop', 'DP', "Department Name...", 
            'Department Name','.personDep', '.personDep')
        }
        else if (this.value === 'LC') {
            changeSearchVal('#searchForDrop', 'LC', "Location Name...", 'Location Name',
            '.personLoc', '.personLoc')
        }
        else if (this.value === 'JT') {
            changeSearchVal('#searchForDrop', 'JT', "Job Title...", 'Job Title',
            '.personJob', '.personJob')
        }
    });

    $('#searchDepForDrop').change(function() {
        // RESET SEARCH INPUT TEXT
        $(".searchInput").val("");
        // RESET SEARCH FOR TEXT
        $('.searchFor').text('');
        // SHOW ALL PERSONNEL
        $('.personnel-item').show();
        $('.letter-divider').show()

        if (this.value === 'DN') {
            changeSearchVal('#searchDepForDrop', 'DN', "Department Name...", 'Department Name',
            '.cardDepName')
        } 
        else if (this.value === 'LC') {
            changeSearchVal('#searchDepForDrop', 'LC', "Location Name...", 'Location Name',
            '.searchLocation')
        }
    });

    $('#searchLocForDrop').change(function() {
        // RESET SEARCH INPUT TEXT
        $(".searchInput").val("");
        // RESET SEARCH FOR TEXT
        $('.searchFor').text('');
        // SHOW ALL PERSONNEL
        $('.personnel-item').show();
        $('.letter-divider').show()

        if (this.value === 'LN') {
            changeSearchVal('#searchLocForDrop', 'LN', "Location Name...", 'Location Name',
            '.cardLocName')
        } 
        else if (this.value === 'DN') {
            changeSearchVal('#searchLocForDrop', 'DN', "Department Name...", 'Department Name',
            '.searchDepartment')
        }
    });
}

// SEARCH SHOWS/REMOVES PERSONNEL
function searchBy(param, title) {
    $('.searchInput').on('input', (e) => {
        // GET SEARCH BAR INPUT
        var value = e.currentTarget.value.toUpperCase();
        // EMPTY INPUT WILL SHOW EVERYTHING
        if (value === "") {
            $.each($('.personnel-item'), function () {
                $(this).show()
            });
            $.each($('.letter-divider'), function () {
                $(this).show()
            });
            $('.searchFor').text('');
        // MATCH INPUT WITH PERSONNEL AND SHOW THOSE THAT MATCH
        } else {
            $.each($('.personnel-item'), function () {
                var strToMatch = $(this).find(param).text();
    
                if(strToMatch.toUpperCase().indexOf(value) != -1) {
                    $(this).show()
                } else {
                    $(this).hide()
                }
            });
        $('.searchFor').text(`${title}s with the letters "${e.currentTarget.value}"`);
        $('.letter-divider').hide()
        }
    });
}

function changeSearchVal(dropdown, value, placeholder, title,textToMatch, furtherOption) {
    if (furtherOption === 'undefined') {
        var doNothing = 'NothingToDo';
    } else {
        $(furtherOption).removeClass('d-none');
    }
    $(dropdown).val(value);
    $(".searchInput").attr("placeholder", placeholder);
    searchBy(textToMatch, title);
}

// ##################################################################################
// ############################### MAIN SORTER ######################################
// ##################################################################################

function mainSorter() {

    $('#sortByDrop').change(function() {
        $('#personTab').empty();
        $('#alphaScroll').empty();
        if (this.value === 'FN') {
            $('#pre-loader').removeClass('d-none'); 
            firstNameSorter();
        } 
        else if (this.value === 'LN') {
            $('#pre-loader').removeClass('d-none'); 
            lastNameSorter();
        }
        else if (this.value === 'DP') {
            $('#pre-loader').removeClass('d-none'); 
            departmentSorter();
        }
        else if (this.value === 'LC') {
            $('#pre-loader').removeClass('d-none'); 
            locationSorter();
        }
        else if (this.value === 'JT') {
            $('#pre-loader').removeClass('d-none'); 
            jobTitleSorter();
        }
    });

    $('#sortDepByDrop').change(function() {
        $('#depTab').empty();
        $('#alphaScrollDep').empty();
        if (this.value === 'DN') {
            $('#pre-loader').removeClass('d-none'); 
            depNameSorter();
        }
        else if (this.value === 'DS') {
            $('#pre-loader').removeClass('d-none'); 
            depSizeSorter();
        }
        else if (this.value === 'LC') {
            $('#pre-loader').removeClass('d-none'); 
            depLocSorter();
        }
    });

    $('#sortLocByDrop').change(function() {
        $('#locTab').empty();
        $('#alphaScrollLoc').empty();
        if (this.value === 'LN') {
            $('#pre-loader').removeClass('d-none'); 
            locNameSorter();
        }
        else if (this.value === 'LS') {
            $('#pre-loader').removeClass('d-none'); 
            locSizeSorter();
        }
    });

}

    // #######################################################
    // ############################### SPECIFIC SORTERS ######
    // #######################################################
    // SORTS, CREATES AND OUTPUTS HTML TO PAGE

    // Personnel sorters
    function firstNameSorter() {
        $.ajax({
            url: "./libs/php/personnel/getAll.php",
            type: "POST",
            dataType: 'json',
            success: function(result) {
                var dataToSort = result.data;
                // console.log(dataToSort)

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

                changeSearchVal('#searchForDrop', 'FN', "First Name...", 'First Name',
                '.personFName')


                setTimeout(function(){
                    $('#pre-loader').addClass('d-none');  
                  }, 2000);
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

                changeSearchVal('#searchForDrop', 'LN', "Last Name...", 'Last Name',
                '.personFName')

                setTimeout(function(){
                    $('#pre-loader').addClass('d-none');  
                  }, 2000);
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

                // CALL ADD TO DOM FUNC
                addHtml(depSort(dataToSort));
                // console.log(depSort(dataToSort))
                changeSearchVal('#searchForDrop', 'DP', "Department Name...", 
                'Department Name','.personDep', '.personDep')

                setTimeout(function(){
                    $('#pre-loader').addClass('d-none');  
                  }, 2000);
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

                // console.log(locationAtoZ)
                // CALL ADD TO DOM FUNC
                addHtmlLoc(locationAtoZ);
                changeSearchVal('#searchForDrop', 'LC', "Location Name...", 'Location Name',
                '.personLoc', '.personLoc')

                setTimeout(function(){
                    $('#pre-loader').addClass('d-none');  
                  }, 2000);
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
                changeSearchVal('#searchForDrop', 'JT', "Job Title...", 'Job Title',
                '.personJob', '.personJob')
                
                setTimeout(function(){
                    $('#pre-loader').addClass('d-none');  
                  }, 2000);
            }  
        })
    }

    // Dep sorters
    function depNameSorter() {
        $.ajax({
            url: "./libs/php/departments/getAllDepartments.php",
            type: "POST",
            dataType: 'json',
            success: function(result) {
                var allDeps = result.data;

                // SORT FIRSTNAME ALPHABETICALLY
                // `REDUCE` OVER THE DATA TO PRODUCE AN OBJECT
                const obj = allDeps.reduce((acc, c) => {
                    // TAKE FIRST LETTER OF NAME AS KEY
                    const letter = c.name[0];
                    // ACC VALUE IS JOINED BY C
                    acc[letter] = (acc[letter] || []).concat(c);
                    return acc;
                }, {});
                
                // `MAP` OVER THE OBJECT ENTRIES TO RETURN AN ARRAY OF OBJECTS
                var letterSorted = Object.entries(obj).map(([letter, dep]) => {
                    return { letter, dep }
                });

                // console.log(letterSorted)
                
                addDepHtml(letterSorted)

                setTimeout(function(){
                    $('#pre-loader').addClass('d-none');  
                  }, 2000);
            }  
        })
    }

    function depSizeSorter() {
        $.ajax({
            url: "./libs/php/departments/getAllDepartments.php",
            type: "POST",
            dataType: 'json',
            success: function(result) {
                var allDeps = result.data;
                console.log(allDeps)
                // `REDUCE` OVER THE DATA TO PRODUCE AN OBJECT
                const obj = allDeps.reduce((acc, c) => {
                    // TAKE FIRST LETTER OF NAME AS KEY
                    const letter = c.personnelCount;
                    // ACC VALUE IS JOINED BY C
                    acc[letter] = (acc[letter] || []).concat(c);
                    return acc;
                }, {});
                
                // `MAP` OVER THE OBJECT ENTRIES TO RETURN AN ARRAY OF OBJECTS
                var letterSorted = Object.entries(obj).map(([letter, dep]) => {
                    return { letter, dep }
                });
                console.log(letterSorted)
                addDepHtml(letterSorted)

                setTimeout(function(){
                    $('#pre-loader').addClass('d-none');  
                  }, 2000);
            }  
        })
    }

    function depLocSorter() {
        $.ajax({
            url: "./libs/php/departments/getAllDepartments.php",
            type: "POST",
            dataType: 'json',
            success: function(result) {
                var allDeps = result.data;

                var sortedData = allDeps.sort(function(a, b) {
                    var textA = a.location.toUpperCase();
                    var textB = b.location.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                // `REDUCE` OVER THE DATA TO PRODUCE AN OBJECT
                const obj = sortedData.reduce((acc, c) => {
                    // TAKE FIRST LETTER OF NAME AS KEY
                    const letter = c.location;
                    // ACC VALUE IS JOINED BY C
                    acc[letter] = (acc[letter] || []).concat(c);
                    return acc;
                }, {});
                
                // `MAP` OVER THE OBJECT ENTRIES TO RETURN AN ARRAY OF OBJECTS
                var letterSorted = Object.entries(obj).map(([letter, dep]) => {
                    return { letter, dep }
                });

                // console.log(letterSorted)
                
                addDepHtml(letterSorted)

                setTimeout(function(){
                    $('#pre-loader').addClass('d-none');  
                  }, 2000);
            }  
        })
    }

    // Loc sorters
    function locNameSorter() {
        $.ajax({
            url: "./libs/php/departments/getAllDepartments.php",
            type: "POST",
            dataType: 'json',
            success: function(result) {
                var dataToSort = result.data;

                $.ajax({
                    url: "./libs/php/locations/getAllLocations.php",
                    type: "POST",
                    // data: null,
                    success: function(result) {
                
                        var obj1 = result.data;
                        var obj2 = dataToSort;
                        // MERGE DEPARTMENT (OBJ1) AND LOCATION (OBJ2)
                        $.each(obj1, function() {
                            var idToMatch = this.name;
                            this['departments'] = [];
                            var location = this.departments;
                            $.each(obj2, function() {
                                if(idToMatch === this.location) {
                                    location.push(this);
                                }
                            })
                        })
                        // remove adding department loc dropdown
                        $('#locDropdownEditModal').empty();
                        // remove adding department loc dropdown
                        $('#editLocForDep').empty();
                        // remove editing person dep/loc dropdown
                        $('#personEditDep').empty();
                        // remove adding person dep/loc dropdown
                        $('#personInputDep').empty();

                        // ADD department OPTIONS TO DROPDOWN MODAL
                        $.each(obj1, function() {
                            $('#locDropdownEditModal').append(`<option value=${this.id}>${this.name}</option>`);
                            $('#editLocForDep').append(`<option value=${this.id}>${this.name}</option>`);
                        })
                        // ADD department and location OPTIONS TO DROPDOWN MODAL
                        addDepartments(obj1);

                        addLocHtml(obj1)

                        setTimeout(function(){
                            $('#pre-loader').addClass('d-none');  
                          }, 2000);
                    }
                })
            }  
        })
    }

    function locSizeSorter() {
        $.ajax({
            url: "./libs/php/departments/getAllDepartments.php",
            type: "POST",
            dataType: 'json',
            success: function(result) {
                var dataToSort = result.data;

                $.ajax({
                    url: "./libs/php/locations/getAllLocations.php",
                    type: "POST",
                    // data: null,
                    success: function(result) {
                
                        var obj1 = result.data;
                        var obj2 = dataToSort;
                        // MERGE DEPARTMENT (OBJ1) AND LOCATION (OBJ2)
                        $.each(obj1, function() {
                            var idToMatch = this.name;
                            this['departments'] = [];
                            var location = this.departments;
                            $.each(obj2, function() {
                                if(idToMatch === this.location) {
                                    location.push(this);
                                }
                            })
                        })
                        
                        obj1.sort(function (a, b) {
                            return a.departments.length - b.departments.length;
                         });
                        
                        // console.log(obj1)

                        addLocHtml(obj1)

                        setTimeout(function(){
                            $('#pre-loader').addClass('d-none');  
                          }, 2000);
                    }
                })
            }  
        })
    }

    // custom sort funcs
    function depSort(data) {
        var departments = data.sort(function(a, b) {
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

        return departmentsAtoZ;
    }
    // #######################################################
    // ############################### HTML ADD ##############
    // #######################################################

    // ADDS SORTED PERSON DATA
    function addHtml(data) {

        var htmlToAdd = '<div class="list-unstyled">';
        htmlToAdd += '<h3 class="mb-3 searchFor"></h3>';
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
            
            htmlToAdd += `<div class="personnel-sub-list" id="div${letter}">`;

            $.each(this.personnel, function() {
                htmlToAdd += createSmallCard(this.id, this.firstName, this.lastName, 
                this.department, this.location, this.jobTitle, this.email)
            });

            htmlToAdd += '</div>';
            
        })
        //  end list
        htmlToAdd += '</div>';
        alphaScrollHtml += '</div>';

        //  add to DOM
        $('#personTab').html(htmlToAdd);
        $('#alphaScroll').html(alphaScrollHtml);
        
        if($('.btnradioGrid').is(':checked'))  {
            $('#btnradioGrid1').click()
        }
        
    }

    // ADDS SORTED PERSON/LOCATION DATA
    function addHtmlLoc(data) {
        
        var htmlToAdd = '<div class="list-unstyled">';
        htmlToAdd += '<h3 class="mb-3 searchFor"></h3>';
        var alphaScrollHtml = '<div id="alphaHtml"  class="list-group list-group-horizontal">';

        $.each(data, function() {
            // create list title ie A
            var location = this.location === "" ? "None": this.location;

            // add letter to side scrollbar
            alphaScrollHtml += `<a class="text-nowrap px-2 mx-2 rounded-pill list-group-item list-group-item-action p-0" 
            href="#link${location}">${location}</a>`

            htmlToAdd += `<h6 id="link${location}" class="pt-1 letter-divider">${location}</h6>`;
            
            htmlToAdd += `<div class="personnel-sub-list" id="div${location}">`;

            $.each(this.departments, function(key, value) {
                $.each(value, function(key2, value2) {
                    htmlToAdd += createSmallCard(this.id, this.firstName, this.lastName, 
                        this.department, this.location, this.jobTitle, this.email)
                    // console.log(value)
                });
            });

            // console.log(counter)
            htmlToAdd += '</div>';
            
        })
        //  end list
        htmlToAdd += '</div>';
        alphaScrollHtml += '</div>';

        //  add to DOM
        $('#personTab').html(htmlToAdd);
        $('#alphaScroll').html(alphaScrollHtml);

        if($('.btnradioGrid').is(':checked'))  {
            $('#btnradioGrid1').click()
        }
    }

    // ADDS SORTED DEP DATA 
    function addDepHtml(data) {
        var htmlToAdd = '<div class="list-unstyled">';
        htmlToAdd += '<h3 class="mb-3 searchFor"></h3>';
        var alphaScrollHtml = '<div id="alphaHtmlDep" class="list-group list-group-horizontal">';
        $.each(data, function() {

            htmlToAdd += `<h6 id="link${this.letter}Dep" class="pt-1 letter-divider">${this.letter}</h6>`;

            // // add letter to side scrollbar
            alphaScrollHtml += `<a class="text-nowrap px-2 list-group-item list-group-item-action p-0" 
            href="#link${this.letter}Dep">${this.letter}</a>`;

            htmlToAdd += `<div class="personnel-sub-list">`;
            $.each(this.dep, function() {
                htmlToAdd += createDepCard(this.id, this.name, this.personnelCount, this.location);
            })
            htmlToAdd += '</div>';
        })
        //  end list
        htmlToAdd += '</div>';
        alphaScrollHtml += '</div>';

        //  add to DOM
        $('#depTab').html(htmlToAdd);
        $('#alphaScrollDep').html(alphaScrollHtml);
        
        if($('.btnradioGrid').is(':checked'))  {
            $('#btnradioGrid1').click()
        }
    }

    function addLocHtml(data) {
        var htmlToAdd = '<div class="list-unstyled">';
        htmlToAdd += '<h3 class="mb-3 searchFor"></h3>';
        var alphaScrollHtml = '<div id="alphaHtmlLoc"  class="list-group list-group-horizontal">';
        htmlToAdd += `<div class="personnel-sub-list">`;
        $.each(data, function() {

            // add letter to side scrollbar
            alphaScrollHtml += `<a class="text-nowrap px-2 list-group-item list-group-item-action p-0" 
            href="#link${this.name}Loc">${this.name}</a>`

            depNames = [];
            $.each(this.departments, function() {
                depNames.push(this.name)
            })
            htmlToAdd += createLocCard(this.id, this.name, depNames);
        })
        //  end list
        htmlToAdd += '</div>';
        htmlToAdd += '</div>';
        alphaScrollHtml += '</div>';

        $('#locTab').html(htmlToAdd);
        $('#alphaScrollLoc').html(alphaScrollHtml);
        
        if($('.btnradioGrid').is(':checked'))  {
            $('#btnradioGrid1').click()
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
                        <div class="person-pic-list d-block d-flex justify-content-center align-items-center" style="background:${random_color}">
                        <span class="badge">${firstName.charAt(0).toUpperCase()}</span>
                        </div>
                        <ul class="list-unstyled person-text-list d-block">
                            <li class="lh-1">
                                <span class="person-text"><b class="personFName">${firstName}</b> 
                                <b class="personLName">${lastName}</b></span>
                            </li>
                            <li class="">
                                <span class="fst-italic depTextSize d-none personJob">${jobTitle ? jobTitle : 'No Job'}</span>
                                <span class="fst-italic depTextSize d-none personDep">${department ? department : 'No Department'}</span>
                                <span class="fst-italic depTextSize d-none personLoc">${location ? location : 'No Location'}</span>
                            </li>
                        </ul>
                    </button>
                    <button class="btn personnel-item-btn personnel-item-btn-grid open-details-modal d-flex 
                    h-100 w-100 d-none" type="button">
                        <div class="person-pic-grid d-flex flex-column justify-content-center" style="background:${random_color}">
                            <span class="badge">${firstName.charAt(0).toUpperCase()}</span>
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

    function createLocCard(uniqueId, name, departmentsList) {
        // RANDOM COLOR FOR PERSON IMG
        var colors = ['#277da1', '#577590', '#4d908e','#43aa8b', '#90be6d','#f9c74f', 
        '#f9844a', '#f8961e','#f3722c', '#a43c3e'];
        var random_color = colors[Math.floor(Math.random() * colors.length)];

        function locOutputGrid(depList) {
            if (depList.length === 0) {
                var output = "None";
            } else if (depList.length < 3) {
                var output = depList.join(', ');
            } else {
                var output = depList.slice(0,3).join(', ') + "...";
            }
            return output;
        }

        var personCard = (
        `<div id="link${name}Loc" class="personnel-item m-1" data-uniqueid=${uniqueId}>
                <div class="person-list d-flex justify-content-between" id="heading${name}">
                    <button class="btn px-0 location-item-btn personnel-item-btn-list open-details-modal
                    d-flex h-100 w-100 d-block" type="button">
                        <div class="person-pic-list d-block d-flex justify-content-center align-items-center" style="background:${random_color}">
                        <span class="badge">${name.charAt(0).toUpperCase()}</span>
                        </div>
                        <ul class="list-unstyled person-text-list d-block">
                            <li class="lh-1">
                                <span class="person-text"><b class="cardLocName">${name}</b></span>
                            </li>
                            <li class="fst-italic depTextSize locationSize">
                                ${departmentsList.length} Departments
                            </li>
                        </ul>
                    </button>
                    <button class="btn location-item-btn personnel-item-btn-grid open-details-modal d-flex 
                    h-100 w-100 d-none" type="button">
                        <div class="person-pic-grid d-flex flex-column justify-content-center" style="background:${random_color}">
                            <span class="badge">${name.charAt(0).toUpperCase()}</span>
                        </div>
                        <ul class="pt-1 list-unstyled person-text-grid">
                        <li class="">
                            <span class="person-text"><b>${name}</b></span>
                        </li>
                        <li class="">
                            <span class="person-text text-decoration-underline">Departments:</span>
                        </li>
                        <li class="">
                            <span class="person-text searchDepartment">${locOutputGrid(departmentsList)}</span>
                        </li>
                        </ul>
                    </button>
                </div>
        </div>`);

        return personCard;
    }

    function createDepCard(uniqueId, name, personnelNum, location) {
        // RANDOM COLOR FOR PERSON IMG
        var colors = ['#277da1', '#577590', '#4d908e','#43aa8b', '#90be6d','#f9c74f', 
        '#f9844a', '#f8961e','#f3722c', '#a43c3e'];
        var random_color = colors[Math.floor(Math.random() * colors.length)];

        var personCard = (
        `<div class="personnel-item m-1" data-uniqueid=${uniqueId}>
                <div class="person-list d-flex justify-content-between" id="heading${name}">
                    <button class="btn px-0 department-item-btn personnel-item-btn-list open-details-modal
                    d-flex h-100 w-100 d-block" type="button">
                        <div class="person-pic-list d-block d-flex justify-content-center align-items-center" style="background:${random_color}">
                        <span class="badge">${name.charAt(0).toUpperCase()}</span>
                        </div>
                        <ul class="list-unstyled person-text-list d-block">
                            <li class="lh-1">
                                <span class="person-text"><b class="cardDepName">${name}</b></span>
                            </li>
                            <li class="fst-italic depTextSize">
                                ${personnelNum} Personnel
                            </li>
                        </ul>
                    </button>
                    <button class="btn department-item-btn personnel-item-btn-grid open-details-modal d-flex 
                    h-100 w-100 d-none" type="button">
                        <div class="person-pic-grid d-flex flex-column justify-content-center" style="background:${random_color}">
                            <span class="badge">${name.charAt(0).toUpperCase()}</span>
                        </div>
                        <ul class="pt-1 list-unstyled person-text-grid">
                        <li class="">
                            <span class="person-text"><b>${name}</b></span>
                        </li>
                        <li class="">
                            <span class="person-text searchLocation">${location}</span>
                        </li>
                        <li class="">
                            <span class="person-text">${personnelNum} Personnel</span>
                        </li>
                        </ul>
                    </button>
                </div>
        </div>`);

        return personCard;
    }

// ##################################################################################
// ############################### VIEW CHANGER #####################################
// ##################################################################################

// LIST + GRID VIEWS
function pageViewChanger() {
    // CHECK FOR LIST
    $('.btnradioPersonnel').on("click",function() {
        // GO TO TOP
        $('.contentTypes').scrollTop(0);
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
        $('.contentTypes').scrollTop(0);
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
        $('#alertModalBody').removeClass('btn-fail btn-good');

        event.preventDefault();
        var nameF = $("#personInputFname").val();
        var nameL = $("#personInputLname").val();
        var job = $("#personInputJob").val();
        var dep = $("#personInputDep").val();
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
                // console.log(result);
                if (result.data === "new person created") {
                    // clear all inputs
                    $(`#personInputFname, #personInputLname, #personInputJob ,#personInputDep ,
                    #personInputEmail`).val("")

                    // show successful message
                    $('#alertModalBody').html('Person has been created')
                    $('#alertModalBody').addClass('btn-good');
                    $('#alertModalTitle').html('Success')
                    // refresh data
                    reloadData() 
                } else {
                    $('#alertModalBody').addClass('btn-fail');
                    //  show error messages
                    if (result.data === "empty error") {
                        $(`#personInputFname, #personInputLname, #personInputJob ,#personInputDep,
                        #personInputEmail`).addClass("input-error");
                        $('#alertModalBody').html("Fill in all fields");
                    }
                    if (result.data === "name error") {
                        $("#personInputFname, #personInputLname").addClass("input-error");
                        $('#alertModalBody').html(`Names cannot include characters such as "@"`);
                    }
                    if (result.data === "email error") {
                        $("#personInputEmail").addClass("input-error");
                        $('#alertModalBody').html("Email not valid");
                    }
                    if (result.data === "job length error") {
                        $("#personInputJob").addClass("input-error");
                        $('#alertModalBody').html("Job title must be 4-25 characters long");
                    }
                    if (result.data === "first name length error") {
                        $("#personInputFname").addClass("input-error");
                        $('#alertModalBody').html("Name must be less than 25 characters");
                    }
                    if (result.data === "last name length error") {
                        $("#personInputLname").addClass("input-error");
                        $('#alertModalBody').html("Name must be less than 25 characters");
                    }
                    if (result.data === "person already exists") {
                        $(`#personInputFname, #personInputLname, #personInputJob ,#personInputDep ,
                        #personInputEmail`).addClass("input-error");
                        $('#alertModalBody').html("Employee already exists");
                    } 
                    $('#alertModalTitle').html('Error')
                }
                $('#alertModal').modal('show');
            },
            error: function (request, status, error) {
                console.log(request.responseText);
                
            }
        });
    }) 

    // EDITING PERSONNEL
    $('#editPersonnelForm').submit(function(event) {
        // reset styling
        $(`#personEditFname, #personEditLname, #personEditJob , #personEditDep,
        #personEditEmail`).removeClass("input-error");
        $('#alertModalBody').removeClass('btn-fail btn-good');

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
                // console.log(result.data)
                if (result.data === "person updated") {
                    $('#alertModalBody').html(`${nameF} ${nameL} has been updated`)
                    $('#alertModalTitle').html('Success')
                    $('#alertModalBody').addClass('btn-good');
                    // reload data
                    reloadData()
                    $('#personnelDetailsModal').modal('hide');
                } else {
                    $('#alertModalBody').addClass('btn-fail');
                    if (result.data === "empty error") {
                        $("#personEditFname, #personEditLname, #personEditJob ,#personEditDep ,#personEditEmail").addClass("input-error");
                        $('#alertModalBody').html("Fill in all fields");
                    }
                    if (result.data === "name error") {
                        $("#personEditFname, #personEditLname").addClass("input-error");
                        $('#alertModalBody').html(`Name not valid - names cannot include characters such as "@"`);
                    }
                    if (result.data === "job length error") {
                        $("#personEditJob").addClass("input-error");
                        $('#alertModalBody').html("Job title must be 4-25 characters long");
                    }
                    if (result.data === "first name length error") {
                        $("#personEditFname").addClass("input-error");
                        $('#alertModalBody').html("Name must be less than 25 characters");
                    }
                    if (result.data === "last name length error") {
                        $("#personEditLname").addClass("input-error");
                        $('#alertModalBody').html("Name must be less than 25 characters");
                    }
                    if (result.data === "email error") {
                        $("#personEditEmail").addClass("input-error");
                        $('#alertModalBody').html("Email not valid");
                    }
                    $('#alertModalTitle').html('Error')
                }
                $('#alertModal').modal('show');
            },
            error: function (request, status, error) {
                console.log(request.responseText);
                
            }
        });
    })

    // ADDING DEPARTMENT
    $('#add-dep-form').submit(function(event) {
        // remove prev styling  
        $("#add-dep-input, #locDropdownEditModal").removeClass("input-error");
        $('#alertModalBody').removeClass('btn-fail btn-good');

        event.preventDefault();
        var locationID = $('#locDropdownEditModal').val();
        var locationName = $('#locDropdownEditModal option:selected').text()
        var newDepartmentName = $("#add-dep-input").val();

        $.ajax({
            url: "./libs/php/departments/insertDepartment.php",
            type: "POST",
            dataType: 'json',
            data: {
                'locationID': locationID,
                'departmentName': newDepartmentName,
            },
            success: function(result) {
                if(result.data === "Added") {
                    $('#add-dep-input, #locDropdownEditModal').val("")
                    $('#alertModalBody').html(`<span>Department <b> ${newDepartmentName} </b> Has Been 
                    Added To <b> ${locationName} </b></span>`)
                    $('#alertModalBody').addClass('btn-good');
                    $('#alertModalTitle').html('Success');
                    reloadData();
                } else {
                    $("#add-dep-input, #locDropdownEditModal").addClass("input-error");
                    $('#alertModalBody').addClass('btn-fail');
                    if (result.data === "dep already exists") {
                        $('#alertModalBody').html(`Department already exists`);
                    }
                    if (result.data === "dep length error") {
                        $('#alertModalBody').html(`Department name must be 4-25 characters long`);
                    }
                    if (result.data === "name error") {
                        $('#alertModalBody').html(`Cannot include characters such as "@"`);
                    }
                    if (result.data === "empty error") {
                        $('#alertModalBody').html(`
                        Fill in all highlighted fields`);
                    }
                    $('#alertModalTitle').html('Error')
                } 
                $('#alertModal').modal('show');
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
        $('#alertModalBody').removeClass('btn-fail btn-good');

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
                if(result.data === "Added") {
                    $('#add-loc-input').val("")
                    $('#alertModalBody').text(`
                    Location ${newlocationName} has been created`);
                    $('#alertModalBody').addClass('btn-good');
                    $('#alertModalTitle').html('Success');
                    reloadData();
                } else {
                    $("#add-loc-input").addClass("input-error");
                    $('#alertModalBody').addClass('btn-fail');
                    if (result.data === "loc already exists") {
                        $('#alertModalBody').text(`Cannot add a location which already exists`);
                    } 
                    if (result.data === "loc length error") {
                        $('#alertModalBody').text(`Location name must be 4-25 characters long`);
                    }
                    if (result.data === "name error") {
                        $('#alertModalBody').text(`Location not valid - it 
                        cannot include characters such as "@"`);
                    }
                    if (result.data === "empty error") {
                        $('#alertModalBody').text(`
                        Fill in all highlighted fields`);
                    }
                    $('#alertModalTitle').html('Error')
                }
                $('#alertModal').modal('show');
            },
            error: function (request, status, error) {
                console.log(request.responseText);
                
            }
        });
    })

    // EDITING DEPARTMENT
    $('#editdepartmentForm').submit(function(event) {
        // reset styling
        $(`#departmentEditName`).removeClass("input-error");
        $('#alertModalBody').removeClass('btn-fail btn-good');

        event.preventDefault();
        var name = $("#departmentEditName").val();
        var id = $("#departmentId").val();
        var locationID = $("#editLocForDep").val();

        $.ajax({
            url: "./libs/php/departments/updateDepartment.php",
            type: "POST",
            dataType: 'json',
            data: {
                'name': name,
                'id': id,
                'locationID': locationID
            },
            success: function(result) {
                if (result.data === "department updated") {
                    $('#alertModalBody').html('Department Has Been Updated')
                    $('#alertModalTitle').html('Success')
                    $('#alertModalBody').addClass('btn-good');
                    // reload data
                    reloadData()
    
                } else {
                    $('#alertModalBody').addClass('btn-fail');
                    if (result.data === "empty error") {
                        $("#departmentEditName").addClass("input-error");
                        $('#alertModalBody').html("Fill in all fields");
                    }
                    if (result.data === "name error") {
                        $("#departmentEditName").addClass("input-error");
                        $('#alertModalBody').html(`Name not valid - names cannot include characters such as "@"`);
                    }
                    if (result.data === "dep length error") {
                        $("#departmentEditName").addClass("input-error");
                        $('#alertModalBody').html(`Department name must be 4-25 characters long`);
                    }
                    if (result.data === "dep already exists") {
                        $('#alertModalBody').text(`Department already exists`);
                    } 
                    $('#alertModalTitle').html('Error')
                }
                $('#alertModal').modal('show');
            },
            error: function (request, status, error) {
                console.log(request.responseText);
                
            }
        });
    })
    // EDITING LOCATION
    $('#editLocationForm').submit(function(event) {
        // reset styling
        $(`#locationEditName`).removeClass("input-error");
        $('#alertModalBody').removeClass('btn-fail btn-good');

        event.preventDefault();
        var name = $("#locationEditName").val();
        var locationID = $("#locationId").val();

        $.ajax({
            url: "./libs/php/locations/updateLocation.php",
            type: "POST",
            dataType: 'json',
            data: {
                'name': name,
                'id': locationID
            },
            success: function(result) {
                if (result.data === "location updated") {
                    $('#alertModalBody').html('Location Has Been Updated')
                    $('#alertModalTitle').html('Success')
                    $('#alertModalBody').addClass('btn-good');
                    // reload data
                    reloadData()
    
                } else {
                    $('#alertModalBody').addClass('btn-fail');
                    if (result.data === "empty error") {
                        $("#locationEditName").addClass("input-error");
                        $('#alertModalBody').html("Fill in all fields");
                    }
                    if (result.data === "name error") {
                        $("#locationEditName").addClass("input-error");
                        $('#alertModalBody').html(`Name not valid - names cannot include characters such as "@"`);
                    }
                    if (result.data === "loc length error") {
                        $("#locationEditName").addClass("input-error");
                        $('#alertModalBody').html(`Location name must be 4-25 characters long`);
                    }
                    if (result.data === "loc already exists") {
                        $('#alertModalBody').text(`Location already exists`);
                    } 
                    $('#alertModalTitle').html('Error')
                }
                $('#alertModal').modal('show');    
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
    var idsToDel = [];
    var namesToDel = [];
    // click personnel tab
    // show delete btns for personnel
    $('#deletePersonnelBtn').on('click', function() {
        $('.personSection').click();
        $('#deleteBtnsPerson').removeClass('d-none')
    })

    // click dep tab
    // show delete btns for dep
    $('#deleteDepartmentBtn').on('click', function() {    
        $('.depSection').click();
        $('#deleteBtnsDep').removeClass('d-none')
    })

    // click loc tab
    // show delete btns for loc
    $('#deleteLocationBtn').on('click', function() {    
        $('.locSection').click();
        $('#deleteBtnsLoc').removeClass('d-none')
    })
    
    // hide edit modal
    // hide scroller etc
    // remove card open modal btn class
    // give each card delete class to toggle on/off
    $('.del-btn').on('click',function() {
        $('#editChoice').modal('hide');
        $('#deleteBtns').removeClass('d-none')

        $('#viewToggler, .scroll-alpha, #scroller').addClass('d-none')
        $('#viewSection').removeClass('d-md-inline-block')
        
        $('.personnel-item-btn, .location-item-btn, .department-item-btn').removeClass('open-details-modal');
        $('.personnel-item-btn, .location-item-btn, .department-item-btn').addClass('delete-mode');

        // disable mobile tab btns
        $('#mobileBottomNav .nav-link').prop('disabled', true);
        $('#mobileBottomNav .nav-link.active').addClass('btn-disabled');

        $('#mobileBottomNav .nav-link').addClass('btn-disabled');
        $('#mobileBottomNav .nav-link.active').removeClass('btn-disabled');
    })

    // CANCEL DELETE PERSONNEL
    // hide delete btns
    // show scroller etc
    // remove delete toggle btns for cards
    $('.cancelDelete').on('click', function () {
        $('#deleteBtns').addClass('d-none');
        $('#deleteBtnsPerson, #deleteBtnsDep, #deleteBtnsLoc').addClass('d-none')

        $('#viewToggler, .scroll-alpha, #scroller').removeClass('d-none')
        $('#viewSection').addClass('d-md-inline-block')

        $('.personnel-item').removeClass('to-delete');

        $('.personnel-item-btn, .location-item-btn, .department-item-btn').addClass('open-details-modal');
        $('.personnel-item-btn, .location-item-btn, .department-item-btn').removeClass('delete-mode');

        // enable mob tab btns
        $('#mobileBottomNav .nav-link').prop('disabled', false);
        $('#mobileBottomNav .nav-link.active').removeClass('btn-disabled');

        $('#mobileBottomNav .nav-link').removeClass('btn-disabled');
    })

    // DELETE ALL SELECTED PERSONNEL BUTTON
    $(document).on('click', '#deleteAllPerson', function (e) {
        
        idsToDel = [];
        namesToDel = [];
        // CHECK EACH PERSON IF THEY HAVE BEEN CHOSEN FOR DELETION
        $('.personnel-item').each(function() {
            if ($(this).hasClass('to-delete')) {
                // IF CHOSEN ADD TO DELETE ARRAYS
                idsToDel.push($(this).data('uniqueid'));
                var opt1 = $(this).find('.personFName').text();
                var opt2 = $(this).find('.personLName').text();
                var data = {"opt1": opt1, "opt2": opt2}
                namesToDel.push(data);
            }
        });

        // DELETE ARRAYS
        openDeleteModal(namesToDel,'#deleteModalPerson', '#deleteListPerson');
        // CONFRIM DELETE VIA MODAL BUTTON
    })
    // CONFRIM DELETE VIA MODAL BUTTON
    $('#confirmDeletePerson').on('click', function () {
        $('.editOpen').prop('disabled', false);
        $('.editOpen').removeClass('btn-disabled');
        // AJAX CALL TO DEL PERSONNEL
        $.ajax({
            url: "./libs/php/personnel/deletePersonnel.php",
            type: "POST",
            dataType: 'json',
            data: {
                'ids': idsToDel,
            },
            success: function(result) {
                if (result['status']['description'] === "success") {
                    $('.personnel-item').each(function() {
                        if ($(this).hasClass('to-delete')) {
                            // REMOVE FROM DOM
                            $(this).remove();
                        }
                    });
                    $('#alertModalBody').html('Person(s) deleted')
                    $('#alertModalBody').addClass('btn-good');
                    $('#alertModalTitle').html('Success')
                    reloadData();
                } else {
                    $('#alertModalBody').html('Unable to delete personnel at this time')
                    $('#alertModalTitle').html('Error')
                    $('#alertModalBody').addClass('btn-fail');
                }
                $('#alertModal').modal('show');

                $('#deleteBtns').addClass('d-none');
                $('#deleteBtnsPerson, #deleteBtnsDep, #deleteBtnsLoc').addClass('d-none')
        
                $('#viewToggler, .scroll-alpha, #scroller').removeClass('d-none')
                $('#viewSection').addClass('d-md-inline-block')

                $('.personnel-item').removeClass('to-delete');
        
                $('.personnel-item-btn, .location-item-btn, .department-item-btn').addClass('open-details-modal');
                $('.personnel-item-btn, .location-item-btn, .department-item-btn').removeClass('delete-mode');            
        
                $('#mobileBottomNav .nav-link').prop('disabled', false);
                $('#mobileBottomNav .nav-link.active').removeClass('btn-disabled');
        
                $('#mobileBottomNav .nav-link').removeClass('btn-disabled');
            },
            error: function (request, status, error) {
                console.log(request.responseText);
            }
        });
    })

    // DELETE ALL SELECTED DEPARTMENTS BUTTON
    $(document).on('click', '#deleteAllDep', function (e) {
        idsToDel = [];
        namesToDel = [];
        // CHECK EACH PERSON IF THEY HAVE BEEN CHOSEN FOR DELETION
        $('.personnel-item').each(function() {
            if ($(this).hasClass('to-delete')) {
                // IF CHOSEN ADD TO DELETE ARRAYS
                idsToDel.push($(this).data('uniqueid'));
                var opt1 = $(this).find('.cardDepName').text();
                var data = {"opt1": opt1}
                namesToDel.push(data);
            }
        });
        // DELETE ARRAYS
        openDeleteModal(namesToDel,'#deleteModalDep', '#deleteListDep');
    })
    // CONFRIM DELETE VIA MODAL BUTTON
    $('#confirmDeleteDep').on('click', function () {
        $('.editOpen').prop('disabled', false);
        $('.editOpen').removeClass('btn-disabled');
        // AJAX CALL TO DEL PERSONNEL
        $.ajax({
            url: "./libs/php/departments/deleteDepartmentByID.php",
            type: "POST",
            dataType: 'json',
            data: {
                'departmentIDs': idsToDel,
            },
            success: function(result) {
                if (result.data === 'has dependencies') {
                    $('#alertModalBody').html('Unable to delete department(s) containing personnel')
                    $('#alertModalTitle').html('Error');
                    $('#alertModalBody').addClass('btn-fail');
                } else {
                    $('.personnel-item').each(function() {
                        if ($(this).hasClass('to-delete')) {
                            // REMOVE FROM DOM
                            $(this).remove();
                        }
                    });
                    $('#alertModalBody').html('Department(s) deleted');
                    $('#alertModalBody').addClass('btn-good');
                    $('#alertModalTitle').html('Success');
                    reloadData();
                }
                $('#alertModal').modal('show');
                
                $('#deleteBtns').addClass('d-none');
                $('#deleteBtnsPerson, #deleteBtnsDep, #deleteBtnsLoc').addClass('d-none')
        
                $('#viewToggler, .scroll-alpha, #scroller').removeClass('d-none')
                $('#viewSection').addClass('d-md-inline-block')

                $('.personnel-item').removeClass('to-delete');
        
                $('.personnel-item-btn, .location-item-btn, .department-item-btn').addClass('open-details-modal');
                $('.personnel-item-btn, .location-item-btn, .department-item-btn').removeClass('delete-mode');            
        
                $('#mobileBottomNav .nav-link').prop('disabled', false);
                $('#mobileBottomNav .nav-link.active').removeClass('btn-disabled');
        
                $('#mobileBottomNav .nav-link').removeClass('btn-disabled');
            },
            error: function (request, status, error) {
                console.log(request.responseText);
            }
        });
    })

    // DELETE ALL SELECTED LOCATIONS BUTTON
    $(document).on('click', '#deleteAllLoc', function (e) {
        idsToDel = [];
        namesToDel = [];
        // CHECK EACH PERSON IF THEY HAVE BEEN CHOSEN FOR DELETION
        $('.personnel-item').each(function() {
            if ($(this).hasClass('to-delete')) {
                // IF CHOSEN ADD TO DELETE ARRAYS
                idsToDel.push($(this).data('uniqueid'));
                var opt1 = $(this).find('.cardLocName').text();
                var data = {"opt1": opt1}
                namesToDel.push(data);
            }
        });
        // DELETE ARRAYS
        openDeleteModal(namesToDel,'#deleteModalLoc', '#deleteListLoc');
    })

    // CONFRIM DELETE VIA MODAL BUTTON
    $('#confirmDeleteLoc').on('click', function () {
        $('.editOpen').prop('disabled', false);
        $('.editOpen').removeClass('btn-disabled');
        // AJAX CALL TO DEL PERSONNEL
        $.ajax({
            url: "./libs/php/locations/deleteLocationByID.php",
            type: "POST",
            dataType: 'json',
            data: {
                'locationIDs': idsToDel,
            },
            success: function(result) {
                if (result.data === 'has dependencies') {
                    $('#alertModalBody').html('Unable to delete location(s) containing departments')
                    $('#alertModalTitle').html('Error')
                    $('#alertModalBody').addClass('btn-fail');
                } else {
                    $('.personnel-item').each(function() {
                        if ($(this).hasClass('to-delete')) {
                            // REMOVE FROM DOM
                            $(this).remove();
                        }
                    });
                    $('#alertModalBody').html('Location(s) Deleted');
                    $('#alertModalBody').addClass('btn-good');
                    $('#alertModalTitle').html('Success');
                    reloadData();
                }
                $('#alertModal').modal('show');
                
                $('#deleteBtns').addClass('d-none');
                $('#deleteBtnsPerson, #deleteBtnsDep, #deleteBtnsLoc').addClass('d-none')
        
                $('#viewToggler, .scroll-alpha, #scroller').removeClass('d-none')
                $('#viewSection').addClass('d-md-inline-block')

                $('.personnel-item').removeClass('to-delete');
        
                $('.personnel-item-btn, .location-item-btn, .department-item-btn').addClass('open-details-modal');
                $('.personnel-item-btn, .location-item-btn, .department-item-btn').removeClass('delete-mode');            
        
                $('#mobileBottomNav .nav-link').prop('disabled', false);
                $('#mobileBottomNav .nav-link.active').removeClass('btn-disabled');
        
                $('#mobileBottomNav .nav-link').removeClass('btn-disabled');
            },
            error: function (request, status, error) {
                console.log(request.responseText);
            }
        });
    })
}

function openDeleteModal(namesToDel, modalType, list) {
    // CHECK IF ARRAY IS EMPTY
    if(namesToDel.length === 0) {
        $('#alertModalBody').html('You have not selected anything to delete!')
        $('#alertModalTitle').html('Error');
        $('#alertModalBody').addClass('btn-fail');
        $('#alertModal').modal('show');
        // modal popup
    } else {
        //  ADD EACH ELEM IN ARRAY TO DOM 
        htmlToAdd = '<ul>';
        $.each(namesToDel, function() {
            htmlToAdd += `<li>${this.opt1} ${this.opt2 === 'undefined' ? this.opt2 : '' }</li>`;
        })
        htmlToAdd += '</ul>';

        $(list).html(htmlToAdd);
        // OPEN CONFIRM DELETE MODAL
        $(modalType).modal('show');
        
    }
}
// ##################################################################################
// ############################## ALPHASCROLLER #####################################
// ##################################################################################

function scroller() {
    $(document).ready(function () {

        $("#scrollLeft").on('click', function() {
            $('#alphaHtml, #alphaHtmlDep, #alphaHtmlLoc').animate({
                scrollLeft: "-=100px"
             },'slow');
        })

        $("#scrollRight").on('click', function() {
            $('#alphaHtml, #alphaHtmlDep, #alphaHtmlLoc').animate({
                scrollLeft: "+=100px"
             },'slow');
        })
    });
}

// function hideShowAlphaArrow(scroll, innerContent) {
//         // container width
//         var scrollWidth = $(scroll).outerWidth();
//         console.log(scrollWidth)
//         // children width total
//         var width = 0;
//         $(innerContent + '.list-group-item').each(function() {
//             width += $(this).outerWidth( true );
//         });
//         console.log(width)

//         if (scrollWidth > width) {
//             $('#scrollRight').addClass('d-none');
//             $('#scrollRight').removeClass('d-block');
//             $('#scrollLeft').addClass('d-none');
//             $('#scrollLeft').removeClass('d-block');
//         } else {
//             $('#scrollRight').addClass('d-block');
//             $('#scrollRight').removeClass('d-none');
//             $('#scrollLeft').addClass('d-block');
//             $('#scrollLeft').removeClass('d-none');
//         }
// }

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
  
  $('.themeButton').on('click', function() {
      toggleTheme();
  })

// ##################################################################################
// ################################# SCROLL TO TOP BTN ##############################
// ##################################################################################

// Scroll to TOP
$('.contentTypes').scroll(function() {

    if ($(this).scrollTop() < 150) {
        $('#scrollToTop').addClass('d-none');
        $('#scrollToTop').removeClass('d-block');
      } else {
        $('#scrollToTop').addClass('d-block');
        $('#scrollToTop').removeClass('d-none');
      }
})

$('#backToTop').on('click', function() {
    $('.contentTypes').animate({ scrollTop: 0 }, "slow");
    return false;
})

// ##################################################################################
// ################################# SWITCHING TABS #################################
// ##################################################################################
// tab show
$('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (event) {
    if ($(this).text() === "Personnel") {
        $('.searchInput').val('');
        $(".searchInput").attr("placeholder", "First Name...");
        searchBy('.personFName', 'First Name');
        // RESET SEARCH FOR TEXT
        $('.searchFor').text('');
        // SHOW ALL PERSONNEL
        $('.personnel-item').show();
        $('.letter-divider').show()
        $('#mainNav-content .input-group').addClass('d-none');
        $('#personnelSearch').removeClass('d-none');

        $('#scroller .scroll').addClass('d-none');
        $('#alphaScroll').removeClass('d-none');

    }   
    if ($(this).text() === "Departments") {  
        $('.searchInput').val('');
        $(".searchInput").attr("placeholder", "Department Name...");
        searchBy('.cardDepName', 'Department');
        // RESET SEARCH FOR TEXT
        $('.searchFor').text('');
        // SHOW ALL PERSONNEL
        $('.personnel-item').show();
        $('.letter-divider').show()

        $('#mainNav-content .input-group').addClass('d-none');
        $('#departmentSearch').removeClass('d-none');

        $('#scroller .scroll').addClass('d-none');
        $('#alphaScrollDep').removeClass('d-none');
    }
    if ($(this).text() === "Locations") {
        $('.searchInput').val('');
        $(".searchInput").attr("placeholder", "Location Name...");
        searchBy('.cardLocName', 'Location');
        // RESET SEARCH FOR TEXT
        $('.searchFor').text('');
        // SHOW ALL PERSONNEL
        $('.personnel-item').show();
        $('.letter-divider').show()

        $('#mainNav-content .input-group').addClass('d-none');
        $('#locationSearch').removeClass('d-none');

        $('#scroller .scroll').addClass('d-none');
        $('#alphaScrollLoc').removeClass('d-none');
    }
})

// ##################################################################################
// ################################# ADD TO DROPDOWNS ###############################
// ##################################################################################
// ADD TO DROPDOWN LISTS IN PERSONNEL FORM
function addDepartments(data) {
    // console.log(data)
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

// ##################################################################################
// ################################# REFRESH DATA ###################################
// ##################################################################################
function reloadData() {
    $('#pre-loader').removeClass('d-none'); 
    firstNameSorter()
    locNameSorter()
    depNameSorter()
    // ensure first name sort radio is checked
    changeSearchVal('#searchForDrop', 'FN', "First Name...", 'First Name',
    '.personFName')

    setTimeout(function(){
        $('#pre-loader').addClass('d-none');  
      }, 2000);
}

// ##################################################################################
// ################################# CARD OPEN MODAL BTN ############################
// ##################################################################################
function moreDetails() {
    // OPEN PERSONNEL DETAILS MODAL
    $(document).on('click', '.department-item-btn', function() {

        if ($(this).hasClass('open-details-modal')) {
            var getElem = $(this).closest('div.personnel-item.m-1');
            var personId = $(getElem).data('uniqueid');

            // // call to server to get person details
            getDepartmentDetails(personId);
            
            $('#departmentDetailsModal').modal('show');
        }
    })
    // OPEN PERSONNEL DETAILS MODAL
    $(document).on('click','.personnel-item-btn', function() {

        if ($(this).hasClass('open-details-modal')) {
            var getElem = $(this).closest('div.personnel-item.m-1');
            var personId = $(getElem).data('uniqueid');
            // console.log(personId)
            // call to server to get person details
            getPersonDetails(personId);

            $('#personnelDetailsModal').modal('show');
        }
    })
    // OPEN PERSONNEL DETAILS MODAL
    $(document).on('click','.location-item-btn', function() {

        if ($(this).hasClass('open-details-modal')) {
            var getElem = $(this).closest('div.personnel-item.m-1');
            var personId = $(getElem).data('uniqueid');

            // call to server to get person details
            getLocationDetails(personId);
            
            $('#locationDetailsModal').modal('show');
        }
    })
}

// ##################################################################################
// ################################# MODAL GET DATA #################################
// ##################################################################################
function getPersonDetails(personId) {
    $.ajax({
        url: "./libs/php/personnel/getPersonByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: personId
        },
        success: function(result) {
            personDetails = result.data[0]
            $('#personEditFname').val(personDetails.firstName);
            $("#personEditLname").val(personDetails.lastName);
            $("#personEditJob").val(personDetails.jobTitle);
            $("#personEditEmail").val(personDetails.email);
            $('#personEditDep').val(personDetails.departmentID);
            $('#personId').val(personDetails.id);
        }  
    })
}

function getLocationDetails(personId) {
    $.ajax({
        url: "./libs/php/locations/getLocationByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: personId
        },
        success: function(result) {
            locationDetails = result.data;

            $('#locationEditName').val(locationDetails[0].location);
            $('#locationId').val(personId);
            var htmlToAdd = `<ul class="list-unstyled">`;
            $.each(locationDetails, function() {
                if (this.id === null) {
                    htmlToAdd += `None`;
                } else {
                    htmlToAdd += `<li class="mb-2" data-uniqueId=${this.id}><button 
                    type="button"
                    class="btn btn-main w-100 open-details-modal2 isDisabledLoc" 
                    disabled>${this.name}</button></li>`;
                }
            
            })
            htmlToAdd += `</ul>`;
            $('#depList').html(htmlToAdd);

            $('.open-details-modal2').on('click', function() {
                var personId = $(this).closest('li').data('uniqueid');
                getDepartmentDetails(personId);
                $('#departmentDetailsModal').modal('show');
            })
        }  
    })
}

function getDepartmentDetails(depId) {
    $.ajax({
        url: "./libs/php/departments/getDepartmentByID.php",
        type: "POST",
        dataType: 'json',
        data: {
            id: depId
        },
        success: function(result) {
            depDetails = result.data;

            $('#departmentEditName').val(depDetails[0].name);
            $('#editLocForDep').val(depDetails[0].locationID);
            $('#departmentId').val(depId);
            var htmlToAdd = `<ul class="list-unstyled">`;
            $.each(depDetails, function() {
                if (this.personID === null) {
                    htmlToAdd += `None`;
                } else {
                    htmlToAdd += `<li class="mb-2" data-uniqueId=${this.personID}><button 
                    type="button"
                    class="btn btn-main w-100 open-details-modal3 isDisabledDep" disabled>
                    ${this.firstName} ${this.lastName}</button></li>`;
                }
            })
            htmlToAdd += `</ul>`;
            $('#depPersonnelList').html(htmlToAdd);

            $('.open-details-modal3').on('click', function() {
                var personId = $(this).closest('li').data('uniqueid');
                getPersonDetails(personId);
                $('#personnelDetailsModal').modal('show');
            })
        }  
    })
}
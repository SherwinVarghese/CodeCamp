var devcampRegister = angular.module('devcampRegister', []);

devcampRegister.directive('sapmailid', function() {
	return {
	    require: 'ngModel',
	    link: function(scope, element, attr, mCtrl) {
	      function validateSAPMailID(value) {
	      	var original = value;	      	
	      	if(value) {
		      	value = value.trim();
		      	if(value.endsWith("sap.com")) {
		      		var count = 0;
		      		var index = 0;
		      		while((index = value.indexOf("sap.com")) != -1) {
		      			value = value.substring(0, index) + value.substring(index + "sap.com".length);
		      			count++;
		      			if(count >=2 ) {
				          mCtrl.$setValidity('charE', false);
				          break;
		      			}
		      		}
		      		if(count == 1)
						mCtrl.$setValidity('charE', true);
					else
						mCtrl.$setValidity('charE', false);
		      	} else {
					mCtrl.$setValidity('charE', false);
		      	} 
	      	}
	        return original;
	      }
	      mCtrl.$parsers.push(validateSAPMailID);
	    }
  };
});

function mainController($scope, $http, $document) {
	$scope.formData = {};
	$scope.crossword = {};
	
	var form = $document.registerform;
	
	$http.get('/api/registrations').
		success(function(data) {
			$scope.registrations = data;
			console.log(data);
		}).
		error(function(data) {
			console.log('Error: ' + data);
		});
		
	$scope.createRegistration = function() {
		var name = $scope.formData.name;
		var iNumber = $scope.formData.inumber;
		var mailID = $scope.formData.mailid;

		if(name==null || name=="" ||
			mailID==null || mailID=="" ||
			iNumber==null || iNumber=="") {
			alert("Enter the mandatory fields");
			return;
		}		

	    if(mailID.indexOf("@sap.com") == -1) {
	       alert("Please enter your SAP e-mail ID");
	       return;
	    }
		
		var inputArr = angular.element($document).find("input");
		if(inputArr) {
			var i = 0;
			var id;
			var wordArr = [20];
			$scope.crossword = {};
			for (i; i< inputArr.length; i++) {
				if(inputArr[i].id && inputArr[i].id.startsWith("cw")) {
					id = inputArr[i].id.substring(2);
					wordArr[id] = inputArr[i].value;
					console.log("Word " + id + "    value " + wordArr[id]);
				}				
			}

			$scope.crossword.cw0 = wordArr[0];			
			$scope.crossword.cw1 = wordArr[1];			
			$scope.crossword.cw2 = wordArr[2];			
			$scope.crossword.cw3 = wordArr[3];			
			$scope.crossword.cw4 = wordArr[4];			
			$scope.crossword.cw5 = wordArr[5];			
			$scope.crossword.cw6 = wordArr[6];			
			$scope.crossword.cw7 = wordArr[7];			
			$scope.crossword.cw8 = wordArr[8];			
			$scope.crossword.cw9 = wordArr[9];			
			$scope.crossword.cw10 = wordArr[10];			
			$scope.crossword.cw11 = wordArr[11];			
			$scope.crossword.cw12 = wordArr[12];			
			$scope.crossword.cw13 = wordArr[13];			
			$scope.crossword.cw14 = wordArr[14];			
			$scope.crossword.cw15 = wordArr[15];			
			$scope.crossword.cw16 = wordArr[16];			
			$scope.crossword.cw17 = wordArr[17];			
			$scope.crossword.cw18 = wordArr[18];			
			$scope.crossword.cw19 = wordArr[19];			
			$scope.crossword.cw20 = wordArr[20];
			$http.post('/api/validate', $scope.crossword)
				.success(function(data) {
					$scope.formData.message = data.message;
					$scope.crossword = {};
					console.log(data);

					$http.post('/api/registrations', $scope.formData)
						.success(function(data) {
							$scope.formData = {}; //clear the form so our user is ready to enter another
							$scope.registrations = data;
							console.log(data);	
							window.location = "./success.html";
						})
						.error(function(data) {
							console.log(data);
							if(data.message.code && data.message.code == "11000") {
								window.location = "./duplicateRegistration.html";
							} else if(data.message.code && data.message.code == "1000") {
								window.location = "./waitinglist.html";						
							} else if(data.message.code && data.message.code == "1001") {
								window.location = "./registrationsclosed.html";						
							} else
								window.location = "./error.html";
						});

				})
				.error(function(data) {
					console.log("Validation Failed::::"+data.message);
					alert(data.message + " Try again!");
					return;
				});			
		}
		
	};
	
	// delete a registration
	$scope.deleteRegistration = function(id) {
		$http.delete('/api/registrations/' + id)
			.success(function(data) {
				$scope.registrations = data;
				console.log(data);
			})
			.error(function(data) {
				console.log(data);
				alert(data.message + " Try again!");
				return;
			});
	};
	
	// reset data
	$scope.resetData = function () {
		if (confirm("Do you really want to reset the data! This action is irreversible")) {
			$http.delete('/api/resetdata/')
				.success(function(data) {
					$scope.registrations = data;
					console.log(data);
					window.location = "./registrations.html";
				})
				.error(function(data) {
					console.log(data);
					alert(data.message + " Try again!");
					return;
				});
		} else {
			window.location = "./registrations.html";
		}
	};

	$scope.showCrossword = function() {
		var strWindowFeatures = "location=no,height=570,width=520,scrollbars=yes,status=yes,titlebar=no";
		var URL = "show_crossword.html";
		var win = window.open(URL, "_blank", strWindowFeatures);
	};

	//Export data to excel
	$scope.excelExport = function(){


        var json = $scope.registrations;
		var fields = Object.keys(json[0]); //JSON Column names
		//Removing un necessary fields. 
		fields.splice(6,1);
		fields.splice(8,1);
		fields.splice(0,1);

		var replacer = function(key, value) { return value === null ? '' : value } 
		var csv = json.map(function(row){
 	 		return fields.map(function(fieldName){
    			return JSON.stringify(row[fieldName], replacer)
  			}).join(',')
		})
		var csvHeaders = ["Name", "I Number", "Email Id", "Message", "Status", "Start Time", "Registration Time"]
		csv.unshift(csvHeaders.join(',')) // add header column

		//Initiate a file download.
		var element = document.createElement('a');
  		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( csv.join('\r\n') ));
  		element.setAttribute('download', "Code Camp Registrations.csv");

  		element.style.display = 'none';
  		document.body.appendChild(element);

  		element.click();

  		document.body.removeChild(element);

		//console.log(csv.join('\r\n'))

        return ;


	};
}
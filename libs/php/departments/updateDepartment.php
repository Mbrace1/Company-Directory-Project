<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=1

	// remove next two lines for production
	
	// ini_set('display_errors', 'On');
	// error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("../config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	
	$departmentName = ucwords(trim($_POST['name']));
    $id = $_POST['id'];
    $locationID = $_POST['locationID'];


	if(empty($departmentName)) {
		$output['data'] = "empty error";
	}
	elseif (!preg_match("/^[a-zA-Z-' ]*$/",$departmentName)) {
        $output['data'] = "name error";
    }
	elseif (strlen($departmentName) < 4 or strlen($departmentName) > 25) {
		$output['data'] = "dep length error";
	} else {
		// QUERY NUMBER OF ROWS WITH SAME NAME
		$query = "SELECT name from department WHERE name =?";

		if ($stmt = $conn->prepare($query)){
	
			$stmt->bind_param("s", $departmentName);
	
			if($stmt->execute()){
				$stmt->store_result();
	
				$email_check= ""; 
				// bind result only works with one selector in query ( eg email)
				$stmt->bind_result($email_check);
				$stmt->fetch();
	
				if ($stmt->num_rows >= 1){
	
				$output['data'] = "dep already exists";
	
				mysqli_close($conn);

				} else {
					// run query
					$sql = "UPDATE department SET name=?, locationID=? WHERE id=?";

					$stmt= $conn->prepare($sql);
					$stmt->bind_param("sii", $departmentName, $locationID, $id);
					$stmt->execute();
				
					if ($stmt) {
				
						$output['status']['code'] = "200";
						$output['status']['name'] = "ok";
						$output['status']['description'] = "success";
						$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
						$output['data'] = "department updated";
					
						mysqli_close($conn);
				
						echo json_encode($output); 
				
						exit;
					}
				}
			}
		}
	}	


	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";	

	echo json_encode($output); 

?>
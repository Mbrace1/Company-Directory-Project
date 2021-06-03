<?php

	// example use from browser
	// use insertDepartment.php first to create new dummy record and then specify it's id in the command below
	// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id= <id>

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

	$locationID = $_POST['locationIDs'];
	foreach ($locationID as $id) {
		$query = 'SELECT count(id) FROM department WHERE locationID=' .$id;

		$result = $conn->query($query);
		$rows = mysqli_fetch_array($result);
		// $count_recall = $ChartRow['totalitems'];
		if ($rows[0] > 0) {
			$output['data'] = 'has dependencies';
			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
	
			mysqli_close($conn);
			
			echo json_encode($output); 

			exit;
		}
	}
	
	foreach ($locationID as $id) {
		$query = 'DELETE FROM location WHERE id = ' . $id;

		$result = $conn->query($query);
		$output['data'] = 'deleted locations';
		if (!$result) {
	
			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
			$output['data'] = [];
	
			mysqli_close($conn);
	
			echo json_encode($output); 
	
			exit;
	
		}
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	
	mysqli_close($conn);


	echo json_encode($output); 
?>
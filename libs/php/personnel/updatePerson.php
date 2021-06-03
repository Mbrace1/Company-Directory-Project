<?php

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

    //  DECLARE VARIABLES
    $nameF = trim(ucwords(strtolower($_POST['nameF'])));
    $nameL = trim(ucwords(strtolower($_POST['nameL'])));
    $job = trim($_POST['job']);
    $dep = $_POST['dep'];
    $email = trim($_POST['email']);
    $id = $_POST['id'];

    // include validation checks 
    if(empty($nameF) || empty($job) || empty($nameL) || empty($dep) || empty($email)) {
        $output['data'] = "empty error";
    }
    elseif (strlen($nameL) > 25) {
        $output['data'] = "last name length error";
    }
    elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $output['data'] = "email error";
    }
    elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $output['data'] = "email error";
    }
    elseif (!preg_match("/^[a-zA-Z-' ]*$/",$nameF) || !preg_match("/^[a-zA-Z-' ]*$/",$nameL)) {
        $output['data'] = "name error";
    } 
    elseif (strlen($job) < 4) {
        $output['data'] = "job length error";
    } else {
        // run query
        $sql = "UPDATE personnel SET firstName=?, lastName=?, jobTitle=?, email=?, departmentId=? WHERE id=?";

        $stmt= $conn->prepare($sql);
        $stmt->bind_param("ssssii", $nameF, $nameL, $job, $email, $dep, $id);
        $stmt->execute();
    
        if ($stmt) {
    
            $output['status']['code'] = "200";
            $output['status']['name'] = "ok";
            $output['status']['description'] = "success";
            $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
            $output['data'] = "person updated";
        
            mysqli_close($conn);
    
            echo json_encode($output); 
    
            exit;
    
        }
    }

    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";	

	echo json_encode($output); 

?>
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

    // DECLARE VARIABLES
    $nameF = trim(ucwords(strtolower($_POST['nameF'])));
    $nameL = trim(ucwords(strtolower($_POST['nameL'])));
    $job = trim($_POST['job']);
    $dep = $_POST['dep'];
    $email = trim($_POST['email']);


    if(empty($nameF) || empty($job) || empty($nameL) || empty($dep) || empty($email)) {
        $output['data'] = "empty error";
    }
    elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $output['data'] = "email error";
    }
    elseif (!preg_match("/^[a-zA-Z-' ]*$/",$nameF) || !preg_match("/^[a-zA-Z-' ]*$/",$nameL)) {
        $output['data'] = "name error";
    }
    elseif (strlen($job) < 4) {
        $output['data'] = "job length error";
    }
    // final check to see if person already exists otherwise add new person
    else {
        // QUERY NUMBER OF ROWS WITH SAME EMAIL
        $query = "SELECT email from personnel WHERE email =?";

        if ($stmt = $conn->prepare($query)){
    
            $stmt->bind_param("s", $email);
    
            if($stmt->execute()){
                $stmt->store_result();
    
                $email_check= ""; 
                // bind result only works with one selector in query ( eg email)
                $stmt->bind_result($email_check);
                $stmt->fetch();
    
                if ($stmt->num_rows >= 1){
    
                $output['data'] = "person already exists";
    
                mysqli_close($conn);

                } else {

                    include_once('./insertPersonnel.php');
                     
                    exit;
                }
            }
        }
    }

    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";	
    

    echo json_encode($output); 

?>

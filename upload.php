<?php
	$target_dir = "uploads/";
	$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
	$uploadOk = 1;
	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
	if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
	    echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
	} else {
	    echo "Sorry, there was an error uploading your file.";
	}
?>
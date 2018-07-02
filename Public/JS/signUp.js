function validation_for_signup() {
    var check_email = /^[\w\.]+@[a-zA-Z_]+?\.[a-zA-Z\.]{2,6}$/;
    var check_username = /^[a-zA-Z0-9_]{3,16}$/;
    var check_name = /^[a-zA-Z]{3,16}$/;
    var check_phone = /^[0-9]{3,16}$/;
    var message1 = document.getElementById("confirmMessage1");
    var message2 = document.getElementById("confirmMessage2");
    var message3 = document.getElementById("confirmMessage3");
    var message4 = document.getElementById("confirmMessage4");
    var message5 = document.getElementById("confirmMessage5");
    var message6 = document.getElementById("confirmMessage6");
    var message7 = document.getElementById("confirmMessage7");
    var message8 = document.getElementById("confirmMessage8");


    if (document.signup.firstname.value == "") {

        message1.innerHTML = "Please enter firstname";
        message1.style.color = "red";
        document.signup.firstname.focus();

        return false;
    }
    else if (check_name.test(document.signup.firstname.value) == false) {

        message1.innerHTML = "Invalid firstname";
        message1.style.color = "red";
        document.signup.firstname.focus();
        return false;
    }
    else {

        message1.innerHTML = " ";
    }
    if (document.signup.lastname.value == "") {

        message2.innerHTML = "Please enter lastname";
        message2.style.color = "red";
        document.signup.lastname.focus();

        return false;
    }
    else if (check_name.test(document.signup.lastname.value) == false) {

        message2.innerHTML = "Invalid lastname";
        message2.style.color = "red";
        document.signup.lastname.focus();
        return false;
    }
    else {

        message2.innerHTML = " ";
    }
    if (document.signup.email.value == "") {

        message3.innerHTML = "Please enter email";
        message3.style.color = "red";
        document.signup.email.focus();

        return false;
    }
    else if (check_email.test(document.signup.email.value) == false) {
        //alert('Invalid email');
        message3.innerHTML = "Invalid email";
        message3.style.color = "red";
        document.signup.email.focus();
        return false;
    }
    else {

        message3.innerHTML = " ";
    }
    if (document.signup.username.value == "") {

        message1.innerHTML = "Please enter username";
        message1.style.color = "red";
        document.signup.username.focus();
        return false;
    }
    else if (check_username.test(document.signup.username.value) == false) {

        message4.innerHTML = "Invalid username";
        message4.style.color = "red";
        document.signup.username.focus();
        return false;
    }
    else {
        message4.innerHTML = " ";

    }
    if (document.signup.password.value == '') {

        message5.innerHTML = "Please enter password";
        message5.style.color = "red";
        document.signup.password.focus();

        return false;
    }
    else if (document.signup.password.value.length < 6) {

        message5.innerHTML = "password is too short";
        message5.style.color = "red";
        document.signup.password.focus();
        return false;
    }
    else {

        message5.innerHTML = "";
    }
    if (document.signup.retypepassword.value == '') {

        message6.innerHTML = "Please confirm password";
        message6.style.color = "red";
        document.signup.retypepassword.focus();

        return false;
    }
    else if (document.signup.password.value != document.signup.retypepassword.value) {

        message6.innerHTML = "Password does not match";
        message6.style.color = "red";
        document.signup.password.focus();
        return false;
    }
    else {

        message6.innerHTML = "matched";
        message6.style.color = "green";
    }

    if (document.signup.phone.value == "") {

        message7.innerHTML = "Please enter firstname";
        message7.style.color = "red";
        document.signup.phone.focus();

        return false;
    }
    else if (check_phone.test(document.signup.phone.value) == false) {

        message7.innerHTML = "Invalid phone";
        message7.style.color = "red";
        document.signup.phone.focus();
        return false;
    }
    else {

        message7.innerHTML = " ";
    }
    if (document.signup.optin.value == "") {

        message8.innerHTML = "Please enter optin";
        message8.style.color = "red";
        document.signup.optin.focus();

        return false;
    }
    else if (check_optin.test(document.signup.optin.value) == false) {

        message8.innerHTML = "Invalid optin";
        message8.style.color = "red";
        document.signup.optin.focus();
        return false;
    }
    else {

        message8.innerHTML = " ";
    }
}

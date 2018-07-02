function submitform() {
    var password = document.getElementById("password");
    var retypepassword = document.getElementById("retypepassword");
    var message = document.getElementById("confirmMessage");
    var match = '#008000';
    var notmatch = "#FF0000";
    if (password.value != retypepassword.value) {
        message.style.color = notmatch;
        message.innerHTML = "password didn't match";



    }
    else {

        message.style.color = match;
        message.innerHTML = "password matched";
        return true;

    }

}

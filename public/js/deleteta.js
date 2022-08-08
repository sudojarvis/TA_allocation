



var facultyForm = document.querySelector("form");



facultyForm.addEventListener("submit", function () {
    var id = document.querySelector("#id").value;
    var password = document.querySelector("#password").value;



    var data = {
        "id": id,
        "password": password
    }
    var url = '/checkpasswordta';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageLoc.textContent = data.error;
            } else {
                console.log(data.check);
                if (data.check == "yes") {

                    var data = {
                        "rollNumber": id
                    }
                    var url = '/deleteta1';
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    }).then((response) => {
                        response.json().then((data) => {
                            if (data.error) {
                                messageLoc.textContent = data.error;
                            }
                        });
                    });
                }
            }
        });
    });
});
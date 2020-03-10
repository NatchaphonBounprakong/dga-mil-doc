var n = Date.now();
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

var url = config.apiUrl

var app = new Vue({
    el: '#app',
    data: {
        username: '',
        password: ''
    },
    methods: {
        login() {
            var data = {
                username: this.username,
                password: this.password,

            }
            $.ajax({
                type: 'POST',
                url: url + "/user/login",
                data: data,
                success: function (response) {
                    console.log(response)
                    if (response.Status) {
                        localStorage.setItem("token", JSON.stringify(response.ResponseObject));
                        config.user = response.ResponseObject.Username
                        window.location.href = "../document-out-list/index.html"
                    }
                    else{
                        alert("เกิดข้อผิดพลาด "+response.Description)
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(textStatus + " ตรวจสอบชื่อผู้ใช้งาน รหัสผ่าน และลองอีกครั้ง");                   
                }
            })
        }
    }
    , mounted() {
        debugger;
        var token = localStorage.getItem("token");
        if (token != null) {
            var tokenObject = JSON.parse(token)
            var date = Date.now()
           var dateToken =parseInt(tokenObject.Expire.substr(6));
            if (dateToken < date) {
                localStorage.clear();
            }
            else {
                config.user = tokenObject.Username
                window.location.href = "../document-out-list/index.html"
            }
        }

    }
})

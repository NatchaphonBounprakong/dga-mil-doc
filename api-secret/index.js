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


function Logout() {
    if (confirm("ต้องการออกจากระบบใช่หรือไม่")) {
        localStorage.clear();
        window.location.reload();
    }
}

var url = config.apiUrl


var app = new Vue({
    el: '#app',
    data: {
        listBook: [],
        organization: ''
    },
    methods: {
        manageBook(id) {
            var location = "../document-in/index.html"
            window.location.href = location + "?bid=" + id;
        },
        requestDocument() {
            $.LoadingOverlay("show");
            var organization = this.organization;
            $.post(url + '/api/RequestReceiveDocument',
                {
                    "to": organization.Url,
                    "messageID": "ทดสอบระบบ"
                },
                function (response, status) {
                    alert("ดึงข้อมูลจากระบบ E-Cms เรียบร้อย");
                    $.LoadingOverlay("hide");
                    window.location.reload();
                }
            );
        }

    }, created() {

    }, mounted() {
        var token = localStorage.getItem("token");
        if (token != null) {
            var tokenObject = JSON.parse(token)
            var date = Date.now()
            var dateToken = parseInt(tokenObject.Expire.substr(6));
            if (dateToken < date) {
                localStorage.clear();
                window.location.href = "../log-in/index.html"
            }
            else {
                this.from = tokenObject.Organization.Id
                this.organization = tokenObject.Organization;
                config.organization = tokenObject.Organization.Id

                $.LoadingOverlay("show");
                axios
                    .get(url + '/api/RequestsecretList?organizationId=' + this.organization.Id)
                    .then(response => {
                        //document.getElementById("json").innerHTML = JSON.stringify(response.data);
                        var oTblReport = $("#tb")
                        oTblReport.DataTable ({
                            "data" : response.data,
                            "columns" : [
                                { "data" : "value" },
                                { "data" : "description" },                                
                            ]
                        });
                        $.LoadingOverlay("hide");
                    })
                    .then
                    (response => {
                        var table = $('#bookTable').dataTable()
                        $.LoadingOverlay("hide");
                    }).catch(error => {
                        alert("ไม่สามารถเชื่อมต่อกับ Service ได้")
                        $.LoadingOverlay("hide");
                    });;;

            }
        }
        else {
            window.location.href = "../log-in/index.html"
        }


    },
})

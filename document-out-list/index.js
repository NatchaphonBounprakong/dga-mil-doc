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

            var location = "../document-out/index.html"
            window.location.href = location + "?bid=" + id;
        },

        requestReceiveNotifierDocument() {
            $.LoadingOverlay("show");
            var organization = this.organization
            $.post(url + '/api/RequestReceiveNotifierDocument',
                {
                    "to": organization.Url,
                    "messageID": "ดึงข้อมูลหนังสือ"
                },
                function (response, status) {
                    $.LoadingOverlay("้hide");
                    alert("เรียกข้อมูลจากระบบ E-Cms เรียบร้อย");
                    window.location.reload();

                }
            );

        }
    }
    , mounted() {
        debugger;
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
                config.user = tokenObject.Username
                config.organization = tokenObject.Organization.Id
                this.organization = tokenObject.Organization
                
                $.LoadingOverlay("show");
                axios
                    .get(url + '/service/GetDocumentListByOrganizeId?organizationId=' + config.organization)
                    .then(response => {
                        if (response.data.Status) {
                            this.listBook = response.data.ResponseObject

                        }
                        else {
                            alert("ไม่สามารถเรียกข้อมูลได้")

                        }
                        $.LoadingOverlay("hide");

                    }).then
                    (response => {
                        var table = $('#bookTable').dataTable()
                        $.LoadingOverlay("hide");
                    })
                    .catch(error => {
                        alert("ไม่สามารถเชื่อมต่อกับ Service ได้")
                        $.LoadingOverlay("hide");
                    });
            }
        }
        else {
            window.location.href = "../log-in/index.html"
        }
    },
})

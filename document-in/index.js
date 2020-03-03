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

var navApp = new Vue({
    el: '#nav-app',
    data: {
        url: url,
    },
    methods: {
        goToOrganization() {
            console.log(111)
        }
    }


})

var app = new Vue({
    el: '#app',
    data: {
        url: url,
        id: 0,
        bookNo: '',
        bookType: '',
        bookDate: formatDate(n),
        bookSubject: '',
        bookSpeed: 001,
        bookSecret: 001,
        bookDescription: '',
        refBooks: [],
        mainAttachment: [],
        otherAttachment: [],
        otherAttachmentName: [],
        senderPosition: '',
        senderName: '',
        senderSurname: '',
        senderDept: '',
        senderDeptId: '',
        receiverPosition: '',
        receiverName: '',
        receiverSurname: '',
        receiverDept: '0',
        receiverDeptId: '',
        organizations: [],
        errors: [],
        mode: null,
        status: '',
        disable: false,
        disableButton: false,
        from: 'http://dev.scp1.ecms.dga.or.th/ecms-ws01/service2',
        fileSize: ''
    },
    methods: {



        setDocumentData(obj) {

            this.id = obj.Id
            this.bookNo = obj.BookId
            this.bookType = obj.Type
            this.bookDate = obj.Date
            this.bookSubject = obj.Subject
            this.bookSpeed = obj.Speed
            this.bookSecret = obj.Secret
            this.mainAttachment = [{ name: obj.MainAttachmentName, size: obj.FileSize }]
            this.senderPosition = obj.SenderPosition

            this.senderName = obj.SenderName
            this.senderSurname = obj.SenderSurname
            this.senderDept = obj.SenderDept
            this.senderDeptId = obj.SenderOrganizationId

            this.receiverPosition = obj.ReceiverPosition
            this.receiverName = obj.ReceiverName
            this.receiverSurname = obj.ReceiverSurname
            this.receiverDeptId = obj.ReceiverOrganizationId
            //this.fileSize = obj.FileSize
            this.bookDescription = obj.Description
            this.status = obj.Status
            this.receiverDept = obj.Organization1.Code
            this.senderDept = obj.Organization.Code
            this.disable = true



            if (obj.Status === "ส่งเลขรับเพื่ออ้างอิง" || obj.Status === "ปฏิเสธการรับหนังสือ" || obj.Status === "ส่งเลขรับเพื่ออ้างอิง" || obj.Status === "แจ้งหนังสือผิด") {
                this.disableButton = true
            }



            for (var i = 0; i < obj.DocumentAttachment.length; i++) {
                var att = obj.DocumentAttachment[i]
                var file = {
                    name: att.AttachmentName,
                    id: att.Id,
                    state: att.State,
                    fileSize: att.FileSize
                }
                this.otherAttachment.push(file)
            }

            for (var i = 0; i < obj.DocumentReference.length; i++) {
                var refObj = {
                    id: obj.DocumentReference[i].Id,
                    refBookNo: obj.DocumentReference[i].ReferenceBookNo,
                    refBookDate: obj.DocumentReference[i].ReferenceBookDate,
                    refBookSubject: obj.DocumentReference[i].ReferenceBookSubject,
                    state: obj.DocumentReference[i].State
                }

                this.refBooks.push(refObj)
            }

        },
        sendNumberDocument() {
            var id = this.id;

            if (confirm("ต้องการส่งหนังสือแจ้งเลขรับใช่หรือไหม")) {
                var text = prompt("กรุณาใส่เลขแจ้งรับ")
                if (text !== null && text !== "") {
                    $.LoadingOverlay("show");
                    $.post(url + '/api/RequestSendNumberDocument',
                        {
                            "id": id,
                            "acceptId": text
                        },
                        function (response, status) {
                            if (response.Status) {
                                alert("ส่งหนังสือแจ้งเลขรับเรียบร้อย");
                                window.location.reload();
                            }
                            else {
                                alert("เกิดข้อผิดพลาด");
                                window.location.reload();
                            }
                            $.LoadingOverlay("hide");
                        }
                    );
                }
            }
        },

        sendInvalidDocument() {
            var id = this.id;

            if (confirm("ต้องการส่งหนังสือแจ้งหนังสือผิดใช่หรือไม่")) {
                $.LoadingOverlay("show");
                $.post(url + '/api/RequestInvalidLetterNotifier',
                    {
                        "id": id,

                    },
                    function (response, status) {
                        if (response.Status) {
                            alert("ส่งหนังสือแจ้งหนังสือผิดเรียบร้อย");
                            window.location.reload();
                        }
                        else {
                            alert("เกิดข้อผิดพลาด");
                            window.location.reload();
                        }
                        $.LoadingOverlay("hide");
                    }
                );

            } else {


            }
        },
        sendWrongDocument() {
            var id = this.id;

            if (confirm("ต้องการปฏิเสธหนังสือใช่หรือไม่")) {
                $.LoadingOverlay("show");
                $.post(url + '/api/RequestRejectLetterNotifier',
                    {
                        "id": id,
                    },
                    function (response, status) {
                        if (response.Status) {
                            alert("ส่งหนังสือปฏิเสธเรียบร้อย");
                            window.location.reload();
                        }
                        else {
                            alert("เกิดข้อผิดพลาด");
                            window.location.reload();
                        }
                        $.LoadingOverlay("hide");
                    }
                );

            } else {


            }
        },
        sendNotifierDocument() {
            var id = this.id;
            var txt;
            if (confirm("ต้องการส่งหนังสือตอบรับใช่หรือไหม")) {
                $.LoadingOverlay("show");
                $.post(url + '/api/RequestSendNotifierDocument',
                    {
                        "id": id,
                    },
                    function (response, status) {
                        if (response.Status) {
                            $.post(url + '/api/RequestDeleteDocumentQueue',
                                {
                                    "id": id,
                                },
                                function (response, status) {
                                    if (response.Status) {
                                        alert("ส่งหนังสือตอบรับเรียบร้อย");
                                        window.location.reload();
                                    }
                                    else {
                                        alert("เกิดข้อผิดพลาด");
                                        window.location.reload();
                                    }
                                    $.LoadingOverlay("hide");
                                }
                            );
                        }
                        else {
                            alert("ส่งหนังสือตอบรับไม่สำเร็จ")
                            $.LoadingOverlay("hide");
                        }
                    }
                );

            } else {


            }
        },
        openMainAttachment() {

            $.post(url + '/api/DownloadMainFile',
                {
                    "id": this.id,
                },
                function (response, status) {
                    //console.log(response);
                    if (response.Status) {
                        var bytes = new Uint8Array(response.ResponseObject.MainAttachmentBinary);
                        var blob = new Blob([bytes], { type: response.ResponseObject.MimeCode });
                        var link = document.createElement("a");
                        link.href = window.URL.createObjectURL(blob);
                        link.download = response.ResponseObject.MainAttachmentName;
                        link.click();
                    }
                    else {
                        alert("ดาวน์โหลดไฟล์ไม่สำเร็จ")
                    }

                }
            );

        },
        openOtherAttachment(id) {

            $.post(url + '/api/DownloadOtherFile',
                {
                    "id": id,
                },
                function (response, status) {
                    //console.log(response);
                    if (response.Status) {
                        var bytes = new Uint8Array(response.ResponseObject.AttachmentBinary);
                        var blob = new Blob([bytes], { type: response.ResponseObject.MimeCode });
                        var link = document.createElement("a");
                        link.href = window.URL.createObjectURL(blob);
                        link.download = response.ResponseObject.AttachmentName;
                        link.click();
                    }
                    else {
                        alert("ดาวน์โหลดไฟล์ไม่สำเร็จ")
                    }

                }
            );

            //console.log(id)
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
                    .get(url + '/service/GetOrganizationList')
                    .then(response => this.organizations = response.data.ResponseObject)

                const params = new URLSearchParams(window.location.search);
                const bid = params.get('bid');

                axios.get(url + '/service/Getdocumentin?' + 'id=' + bid)
                    .then(response => {
                        console.log(response)
                        if (response.data.Status) {
                            this.setDocumentData(response.data.ResponseObject)
                        }
                        else {
                            alert("ไม่สารมารถดึงข้อมูลหนังสือได้")
                        }
                        $.LoadingOverlay("hide");

                    })
                    .then(response => {
                        $.LoadingOverlay("hide");
                    })
                    .catch(error => {
                        alert("ไม่สามารถเชื่อมต่อกับ Service ได้")
                        $.LoadingOverlay("hide");
                    });;
            }
        }
        else {
            window.location.href = "../log-in/index.html"
        }



    },
})

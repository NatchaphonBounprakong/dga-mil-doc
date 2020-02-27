
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
        id: 0,
        bookNo: '',
        bookType: '',
        bookDate: formatDate(n),
        bookSubject: '',
        bookSpeed: 001,
        bookSecret: 001,
        bookDescription: '',
        refBookNo: '',
        refBookDate: '',
        refBookSubject: '',
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
        from: '',
        organization: ''
    },
    methods: {

        addMainAttachment(event) {
            if (event.target.files[0] != null) {
                if (this.mainAttachment.length > 0) {
                    this.mainAttachment.splice(0, 1);
                    this.mainAttachment.push(event.target.files[0])
                }
                else {
                    this.mainAttachment.push(event.target.files[0])
                }
                console.log(this.mainAttachment);
            }

        },
        addOtherAttachment(event) {
            if (event.target.files[0] != null) {
                this.otherAttachment.push(event.target.files[0])
                console.log(this.otherAttachment);
            }

        },
        deleteOtherAttachment(index, id) {
            this.otherAttachment.splice(index, 1)
        },
        deleteOtherAttachmentById(index, id) {
            this.otherAttachment.splice(index, 1)
            if (id != null) {
                $.ajax({
                    type: 'POST',
                    url: url + "/service/DeleteDocumentAttachment",
                    data: {
                        id: id
                    },
                    dataType: 'json',
                })
            }
        },
        deleteMainAttachment(index) {
            this.mainAttachment.splice(index, 1)
        },
        addReference() {
            var object = {
                id: 0,
                refBookNo: this.refBookNo,
                refBookDate: this.refBookDate,
                refBookSubject: this.refBookSubject,
                state: 'เพิ่ม'
            }
            this.refBooks.push(object);
            this.refBookNo = ''
            this.refBookDate = ''
            this.refBookSubject = ''
            $('#refModal').modal('toggle');
        },
        resetReference() {
            this.refBookNo = ''
            this.refBookDate = ''
            this.refBookSubject = ''
        },
        deleteRefBook(index) {
            this.refBooks.splice(index, 1)
        },
        deleteRefBookById(index, id) {
            this.refBooks[index].state = 'รอลบ'
        },
        deleteDocument() {
            if (confirm("ต้องการลบหนังสือนี้ใช่หรือไม่")) {
                if (this.id != null) {
                    $.ajax({
                        type: 'POST',
                        url: url + "/service/deleteDocument",
                        data: {
                            id: this.id
                        },
                        dataType: 'json',
                        success: function (response) {
                            window.location.href = "../document-out-list/index.html"
                        }
                    })
                }
            }

        },
        cancelSaveDocument() {
            if (this.id != null) {
                $.ajax({
                    type: 'POST',
                    url: url + "/service/CancelSaveDocument",
                    data: {
                        id: this.id
                    },
                    dataType: 'json',
                    success: function (response) {
                        window.location.href = "../document-out-list/index.html"
                    }
                })
            }
        },
        addDocument() {

            this.errors = [];
            if (this.bookNo == "") {
                this.errors.push("ระบุเลขที่หนังสือ")
            }
            if (this.bookType == "") {
                this.errors.push("ระบุประเภทหนังสือ")
            }
            if (this.bookDate == "") {
                this.errors.push("ระบุวันที่หนังสือ")
            }
            if (this.bookSubject == "") {
                this.errors.push("ระบุเรื่องหนังสือ")
            }
            if (this.bookSpeed == "") {
                this.errors.push("ระบุชั้นความเร็ว")
            }
            if (this.bookSecret == "") {
                this.errors.push("ระบุชั้นความลับ")
            }
            if (this.bookDescription == "") {
                this.errors.push("ระบุรายละเอียดหนังสือ")
            }
            if (this.senderPosition == "") {
                this.errors.push("ระบุตำแหน่งผู้ส่ง")
            }
            if (this.senderName == "") {
                this.errors.push("ระบุชื่อผู้ส่ง")
            }
            if (this.senderSurname == "") {
                this.errors.push("ระบุนามสกุลผู้ส่ง")
            }
            if (this.receiverPosition == "") {
                this.errors.push("ระบุตำแหน่งผู้รับ")
            }
            if (this.receiverName == "") {
                this.errors.push("ระบุชื่อผู้รับ")
            }
            if (this.receiverSurname == "") {
                this.errors.push("ระบุนามสกุลผู้รับ")
            }
            if (this.receiverDept == "") {
                this.errors.push("ระบุหน่วยงานผู้รับ")
            }

            if (this.errors.length == 0) {

                if (confirm("ต้องการบันทึกข้อมูลหนังสือใช่หรือไม่")) {

                    $.LoadingOverlay("show");
                    let formData = new FormData();

                    for (i = 0; i < this.mainAttachment.length; i++) {
                        formData.append("mainFile" + i, this.mainAttachment[i]);
                    }

                    for (i = 0; i < this.otherAttachment.length; i++) {
                        if (this.id > 0) {
                            formData.append(this.otherAttachment[i].name, this.otherAttachment[i]);
                        }
                        else {
                            formData.append("otherFile" + i, this.otherAttachment[i]);
                        }

                    }

                    var receiverIndex = document.getElementById("ddlReceive").selectedIndex;
                    var receiverInfomation = this.organizations[receiverIndex]

                    var senderIndex = document.getElementById("ddlSender").selectedIndex;
                    var senderInfomation = this.organizations[senderIndex]


                    var doc = {
                        Id: this.id,
                        No: this.bookNo,
                        From: this.from,
                        Type: this.bookType,
                        Date: this.bookDate,
                        Subject: this.bookSubject,
                        Speed: this.bookSpeed,
                        Secret: this.bookSecret,
                        Description: this.bookDescription,
                        MainAttachmentName: this.mainAttachment.length > 0 ? this.mainAttachment[0].name : null,

                        SenderPosition: this.senderPosition,
                        SenderName: this.senderName,
                        SenderSurname: this.senderSurname,
                        SenderDept: senderInfomation.Name,
                        SenderOrganizationId: senderInfomation.Id,

                        ReceiverPosition: this.receiverPosition,
                        ReceiverName: this.receiverName,
                        ReceiverSurname: this.receiverSurname,
                        ReceiverDept: receiverInfomation.Name,
                        ReceiverOrganizationId: receiverInfomation.Id,

                        Status: "บันทึกรอส่ง",

                        DocumentAttachment: [],
                        DocumentReference: [],
                        Type: 1
                    }

                    for (var i = 0; i < this.otherAttachment.length; i++) {
                        var attachmentObj = {
                            AttachmentName: this.otherAttachment[i].name
                        }
                        doc.DocumentAttachment.push(attachmentObj)
                    }

                    for (var i = 0; i < this.refBooks.length; i++) {

                        var refObj = {
                            Id: this.refBooks[i].id,
                            State: this.refBooks[i].state,
                            ReferenceBookNo: this.refBooks[i].refBookNo,
                            ReferenceBookDate: this.refBooks[i].refBookDate,
                            ReferenceBookSubject: this.refBooks[i].refBookSubject,
                        }

                        if (this.refBooks[i].id === 0 || !this.refBooks[i].id) {
                            refObj.State = "เพิ่ม"
                        }

                        doc.DocumentReference.push(refObj)
                    }

                    var id = this.id
                    $.ajax({
                        type: 'POST',
                        url: id === 0 ? url + "/service/AddDocument" : url + "/service/EditDocument",
                        data: {
                            doc: doc,
                            from: senderInfomation.Code,
                            To: doc.ReceiverDeptId

                        },
                        dataType: 'json',
                        success: function (response) {

                            if (response.Status) {
                                formData.append("ID", response.ResponseObject.Id)

                                $.ajax({
                                    type: 'POST',
                                    url: id === 0 ? url + "/service/AddDocumentAttachment" : url + "/service/EditDocumentAttachment",
                                    data: formData,
                                    contentType: false,
                                    processData: false,
                                    success: function (resultData) {
                                        if (resultData.Status) {
                                            if (id === 0) {
                                                window.location.href = "../document-out-list/index.html"
                                            }
                                            else {
                                                window.location.reload();
                                            }
                                        }
                                        else {
                                            alert("อัพโหลดไฟล์ไม่ผ่าน กรุณาอัพโหลดไฟล์ใหม่")
                                        }
                                    }
                                })
                            }
                            else {

                                alert("บันทึกข้อมูลไม่สำเร็จ" + response.Description)
                            }
                            $.LoadingOverlay("hide");

                        },
                        error: function (xhr, textStatus, error) {
                            alert("บันทึกข้อมูลไม่สำเร็จ")
                            $.LoadingOverlay("hide");
                            console.log(xhr.statusText);
                            console.log(textStatus);
                            console.log(error);
                        }
                    });
                }
            }
            else {
                window.scrollTo(0, 0);
            }
        },
        sendWrongNumberDocument() {
            var id = this.id;

            if (confirm("ต้องการแจ้งหนังสือเลขรับผิดใช่หรือไม่")) {
                $.LoadingOverlay("show");
                $.post(url + '/api/RequestInvalidAcceptIDNotifier',
                    {
                        "id": id,

                    },
                    function (response, status) {
                        if (response.Status) {
                            alert("ส่งหนังสือแจ้งเลขรับผิดเรียบร้อย");
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
        setDocumentData(obj) {


            this.id = obj.Id
            this.bookNo = obj.No
            this.bookType = obj.Type
            this.bookDate = obj.Date
            this.bookSubject = obj.Subject
            this.bookSpeed = obj.Speed
            this.bookSecret = obj.Secret
            this.mainAttachment = [{ name: obj.MainAttachmentName }]

            this.senderPosition = obj.SenderPosition
            this.senderName = obj.SenderName
            this.senderSurname = obj.SenderSurname
            this.senderDept = obj.SenderDept

            this.receiverPosition = obj.ReceiverPosition
            this.receiverName = obj.ReceiverName
            this.receiverSurname = obj.ReceiverSurname
            this.receiverDeptId = obj.ReceiverOrganizationId
            this.bookDescription = obj.Description
            this.status = obj.Status


            if (obj.Status !== "บันทึกรอส่ง") {
                this.disable = true
            }
            if (obj.Status === "ปฏิเสธการรับหนังสือ" || obj.Status == 'แจ้งหนังสือผิด') {
                this.disable = false;
            }

            for (var i = 0; i < obj.DocumentAttachment.length; i++) {
                var att = obj.DocumentAttachment[i]
                var file = {
                    name: att.AttachmentName,
                    id: att.Id,
                    state: att.State
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
        requestSendDocument() {
            if (confirm("ต้องการส่งหนังสือไปยังผู้รับปลายทางใช่หรือไม่")) {
                $.LoadingOverlay("show")
                if (this.id != null) {
                    $.ajax({
                        type: 'POST',
                        url: url + "/api/RequestSendDocument",
                        data: {
                            id: this.id
                        },
                        dataType: 'json',
                        success: function (response) {
                            console.log(response)
                            if (response.Status) {
                                alert("ส่งหนังสือเรียบร้อย")
                                window.location.href = "../document-out-list/index.html"
                            }
                            else {
                                alert("เกิดความผิดผลาด")
                            }
                            $.LoadingOverlay("hide")
                        }
                    })
                }
            }

        },

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
                    .then(response => { $.LoadingOverlay("hide"); this.organizations = response.data.ResponseObject })


                const params = new URLSearchParams(window.location.search);
                const bid = params.get('bid');

                if (bid !== null) {
                    axios.get(url + '/service/Getdocument?' + 'id=' + bid)
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
                }
                else {
                    $.LoadingOverlay("hide");
                }
            }
        }
        else{
            window.location.href = "../log-in/index.html"
        }



    },
})

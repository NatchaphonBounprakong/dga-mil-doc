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


var app = new Vue({
    el: '#app',
    data: {
        bookNo: '',
        bookType: '',
        bookDate: formatDate(n),
        bookSubject: '',
        bookSpeed: 1,
        bookSecret: 1,
        bookDescription: '',
        refBookNo: '',
        refBookDate: '',
        refBookSubject: '',
        refBooks: [],
        mainAttachment: [],
        otherAttachment: [],
        otherAttachmentName: [],
        senderPostion: '',
        senderName: '',
        senderSurname: '',
        senderDept: '',
        receiverPostion: '',
        receiverName: '',
        receiverSurname: '',
        receiverDept: '1',
        organizations: [],
        errors: [],
        mode: null
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
        deleteOtherAttachment(index) {
            this.otherAttachment.splice(index, 1)
        },
        deleteMainAttachment(index) {
            this.mainAttachment.splice(index, 1)
        },
        addReference() {
            var object = {
                refBookNo: this.refBookNo,
                refBookDate: this.refBookDate,
                refBookSubject: this.refBookSubject
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
        saveDocument() {

        },

        requestSendDoc() {

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
            if (this.senderPostion == "") {
                this.errors.push("ระบุตำแหน่งผู้ส่ง")
            }
            if (this.senderName == "") {
                this.errors.push("ระบุชื่อผู้ส่ง")
            }
            if (this.senderSurname == "") {
                this.errors.push("ระบุนามสกุลผู้ส่ง")
            }
            if (this.senderDept == "") {
                this.errors.push("ระบุหน่วยงานผู้ส่ง")
            }
            if (this.receiverPostion == "") {
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

                //var confirm = confirm("ต้องการบันทึกข้อมูลใช่หรือไม่");
                if (confirm("ต้องการบันทึกข้อมูลใช่หรือไม่")) {

                    let formData = new FormData();
                    for (i = 0; i < this.mainAttachment.length; i++) {
                        formData.append("mainFile" + i, this.mainAttachment[i]);
                    }
                    for (i = 0; i < this.otherAttachment.length; i++) {
                        formData.append("otherFile" + i, this.otherAttachment[i]);
                    }

                    var doc = {
                        No: this.bookNo,
                        "Type": this.bookType,
                        "Date": this.bookDate,
                        "Subject": this.bookSubject,
                        "Speed": this.bookSpeed,
                        "Secret": this.bookSecret,
                        "Description": this.bookDescription,
                        "MainAttachmentName": this.mainAttachment.length > 0 ? this.mainAttachment[0].name : null,
                        "SenderPosition": this.senderPostion,
                        "SenderName": this.senderName,
                        "SenderSurname": this.senderSurname,
                        "SenderDept": this.senderDept,
                        "ReceiverPosition": this.receiverPostion,
                        "ReceiverName": this.receiverName,
                        "ReceiverSurname": this.receiverSurname,
                        "ReceiverDept": this.receiverDept,
                        "Status": "บันทึกรอส่ง",
                        "From": "scp1",
                        DocumentAttachment: [],
                        DocumentReference: []
                    }

                    for (var i = 0; i < this.otherAttachment.length; i++) {
                        var attachmentObj = {
                            AttachmentName: this.otherAttachment[i].name
                        }
                        doc.DocumentAttachment.push(attachmentObj)
                    }

                    for (var i = 0; i < this.refBooks.length; i++) {
                        var refObj = {
                            ReferenceBookNo: this.refBooks[i].refBookNo,
                            ReferenceBookDate: this.refBooks[i].refBookDate,
                            ReferenceBookSubject: this.refBooks[i].refBookSubject
                        }
                        doc.DocumentReference.push(refObj)
                    }



                    $.ajax({
                        type: 'POST',
                        url: "http://localhost:51618/service/AddDocument",
                        data: {
                            doc
                        },
                        dataType: 'json',
                        success: function (response) {

                            if (response.Status) {
                                formData.append("ID", response.ResponseObject.Id)

                                $.ajax({
                                    type: 'POST',
                                    url: "http://localhost:51618/service/AddDocument2",
                                    data: formData,
                                    contentType: false,
                                    processData: false,
                                    success: function (resultData) {
                                        if (resultData.Status) {
                                            alert("บันทึกข้อมูลเรียบร้อย")
                                            window.location.href = "../documentlist/index.html"
                                        }
                                        else {
                                            alert("อัพโหลดไฟล์ไม่ผ่าน กรุณาอัพโหลดไฟล์ใหม่")
                                        }
                                    }
                                })
                            }
                            else {
                                alert("อัพโหลดไฟล์ไม่ผ่าน กรุณาอัพโหลดไฟล์ใหม่")
                            }


                        },
                        error: function (xhr, textStatus, error) {
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

        setDocumentData(obj) {

            this.bookNo = obj.No
            this.bookType = obj.Type
            this.bookDate = obj.Date
            this.bookSubject = obj.Subject
            this.bookSpeed = obj.Speed
            this.bookDescription = obj.Secret
            this.mainAttachment = [{ name: obj.MainAttachmentName }]
            this.senderPostion = obj.SenderPosition
            this.senderName = obj.SenderName
            this.senderSurname = obj.SenderSurname
            this.senderDept = obj.SenderDept
            this.receiverPostion = obj.ReceiverPostion
            this.receiverName = obj.ReceiverName
            this.receiverSurname = obj.ReceiverSurname
            this.receiverDept = obj.ReceiverDept

            for (var i = 0; i < obj.DocumentAttachment.length; i++) {
                var att =  obj.DocumentAttachment[i]
                var file = {
                    name: att.AttachmentName,
                }
                this.otherAttachment.push(file)
            }

            for (var i = 0; i < obj.DocumentReference.length; i++) {
                var refObj = {
                    refBookNo: obj.DocumentReference[i].ReferenceBookNo,
                    refBookDate: obj.DocumentReference[i].ReferenceBookDate,
                    refBookSubject: obj.DocumentReference[i].ReferenceBookSubject
                }

                this.refBooks.push(refObj)
            }

        }

    }, created() {

    }, mounted() {
        let $vm = this;
        axios
            .get('http://localhost:51618/api/RequestOrganizationList')
            .then(response => this.organizations = response.data)
            .then(response => {

            })



        const params = new URLSearchParams(window.location.search);
        const bid = params.get('bid');


        axios.get('http://localhost:51618/api/Getdocument?' + 'id=' + bid)
            .then(response => {
                console.log(response)
                if (response.data.Status) {
                    this.setDocumentData(response.data.ResponseObject)

                }
                //console.log(response)
            })
            .then(response => {

            })


        // if (bid != null) {
        //     $vm.mode = "edit";
        //     $.ajax({
        //         type: 'POST',
        //         url: "http://localhost:51618/api/Getdocument",
        //         data: { id: bid },
        //         success: function (resultData) {
        //             if (resultData.Status) {
        //                 $vm.setDocumentData(resultData.ResponseObject)


        //             }
        //             else {

        //             }
        //         }
        //     })

        // }




    },
})

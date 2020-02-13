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
        bookSpeed: 2,
        bookSecret: 1,
        bookDescription: '',
        refBookNo: '',
        refBookDate: '',
        refBookSubject: '',
        refBooks: [],
        mainAttachment: [],
        otherAttachment: [],
        senderPostion: '',
        senderName: '',
        senderSurname: '',
        senderDept: '',
        receiverPostion: '',
        receiverName: '',
        receiverSurname: '',
        receiverDept: '1',
        organizations: []
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

            let formData = new FormData();
            for (i = 0; i < this.otherAttachment.length; i++) {
                formData.append("file", this.otherAttachment[i]);
            }

            $.ajax({
                type: 'POST',
                url: "http://localhost:51618/service/AddDocument",
                data: {
                    doc: {
                        "No": this.bookno,
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
                        "ReceiverSurname": this.receiverSurnamed,
                        "ReceiverDept": this.receiverDept,
                        "Status": "บันทึกรอส่ง",
                        "From": "scp1"
                    }
                },
                // data: formData,
                dataType: 'json',
                // contentType: false,
                //processData: false,
                success: function (response) {

                    formData.append("ID", response.ResponseObject.Id)

                    $.ajax({
                        type: 'POST',
                        url: "http://localhost:51618/service/AddDocument2",
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (resultData) {
                            console.log(resultData)
                        }
                    })

                },
                error: function (xhr, textStatus, error) {
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                }
            });
        }

    }, created() {

    }, mounted() {
        axios
            .get('http://localhost:51618/api/RequestOrganizationList')
            .then(response => this.organizations = response.data)
            .then(console.log(this.organizations))


    },
})

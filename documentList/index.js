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
        listBook: []
    },
    methods: {
        manageBook(id) {

            var location = "../documentsout/index.html"
            window.location.href = location + "?bid=" + id;
        },
    }, created() {

    }, mounted() {
        axios
            .get('http://localhost:51618/api/GetDocumentList')
            .then(response => {
                if (response.data.Status) {
                    this.listBook = response.data.ResponseObject

                }
                else {
                    alert("เรียกข้อมูลไม่ได้")
                }

            })
            .then
            (response => {
                var table = $('#bookTable').dataTable()
            });

    },
})

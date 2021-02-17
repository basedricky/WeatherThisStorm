//saveBtn even listener
$(".searchBtn").on("click", function () {
    //get nearby values.
    console.log(this);
    var city = $(this).parent(".form-control").val();

    //set items in local storage.
    localStorage.setItem(city,);
})
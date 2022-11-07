
$("#signup-form").submit((e) => {
    e.preventDefault();
    const username = document.getElementById('username');
    const email = document.getElementById('emailId');
    const pass = document.getElementById('password');
    const phone = document.getElementById('phoneNUmber')
    const error = document.getElementsByClassName('errorClass');

    if (username.value.trim() === "" || username.value.trim().match(/^[0-9]+$/)) {
        error[0].style.display = "block";
        error[0].innerHTML = "please enter valid username"
        username.style.border = "2px solid red";
        return false;
    } else {
        error[0].innerHTML = ""
        username.style.border = "2px solid green";
    }

    if (!(email.value.trim().match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))) {
        error[1].style.display = "block";
        error[1].innerHTML = "Enter correct email";
        email.style.border = "2px solid red";
        return false;
    } else {
        error[1].innerHTML = ""
        email.style.border = "2px solid green";
    }

    if (phone.value.trim() === "" || phone.value.length < 9) {
        error[2].style.display = "block";
        error[2].innerHTML = "Enter valid phone number";
        phone.style.border = "2px solid red";
        return false;
    } else {
        error[2].innerHTML = ""
        phone.style.border = "2px solid green";
    }

    if (pass.value.trim() === "" || pass.value.length < 8) {
        error[3].style.display = "block";
        error[3].innerHTML = "password must be 8 character";
        pass.style.border = "2px solid red";
        return false;
    } else {
        error[2].innerHTML = ""
        pass.style.border = "2px solid green";
    }

    $.ajax({
        url: '/user_registration',
        type: 'post',
        data: $('#signup-form').serialize(),
        success: (response) => {
            if (response.status) {
                swal({
                    title: "Signup Success",
                    confirmButtonText: "Explore elecXo world!",
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            $('#signupForm').modal('hide');
                            $('#signinForm').modal('show');
                        }
                    });
            } else {
                swal({
                    title: "Signup failed",
                    text: "Email is already taken",
                    confirmButtonText: "Explore elecXo world!",
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            error[1].style.display = "block";
                            error[1].innerHTML = "Email Already taken";
                            email.style.border = "2px solid red";
                        }
                    }
                );
            }
        }
    })
})


$("#login-form").submit((e) => {
    e.preventDefault();
    const email = document.getElementById('email');
    const pass = document.getElementById('pass');
    const error = document.getElementsByClassName('invalid-feedback');

    if (!(email.value.trim().match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))) {
        error[0].style.display = "block";
        error[0].innerHTML = "Enter email";
        email.style.border = "2px solid red";
        return false;
    } else {
        error[0].innerHTML = ""
        email.style.border = "2px solid none";
    }

    if (pass.value.trim() === "") {
        error[1].style.display = "block";
        error[1].innerHTML = "Enter password";
        pass.style.border = "2px solid red";
        return false;
    } else {
        error[1].innerHTML = ""
        pass.style.border = "2px solid none";
    }

    $.ajax({
        url: '/user_signin',
        type: 'post',
        data: $('#login-form').serialize(),
        success: (response) => {
            if (response.status) {
                location.reload()
            } else {
                error[0].style.display = "block";
                error[0].innerHTML = "No user found! Enter valid email & password";
                email.style.border = "2px solid red";
            }
        }
    })
})


function otpValidate() {
    const code = document.getElementById('code');
    const error = document.getElementsByClassName('invalid-feedback');

    if (code.value.trim() === "" || code.value.length < 6) {
        error.style.display = "block";
        error.innerHTML = "Enter code";
        pass.style.border = "2px solid red";
        return false;
    } else {
        error.innerHTML = ""
        pass.style.border = "2px solid none";
    }

    return true;
}

function changeImage(id) {
    var img = document.getElementById("image");
    var src = document.getElementById(id).src;
    img.src = src
    return false;
}


// checkout validation

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation')

        // Loop over them and prevent submission
        Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
    }, false)
}())



// add to cart

function addToCart(proId) {
    $.ajax({
        url: '/add-to-cart/' + proId,
        method: 'get',
        success: (response) => {
            console.log(response);
            if (response.status) {
                if (response.count >= 0) {
                    let count = $('#cart-count').html()
                    if (response.count == 0) {
                        count = 0
                    }
                    count = parseInt(count) + 1
                    $('#cart-count').html(count)
                }
                document.getElementById('success').classList.remove("d-none");
                setTimeout(function () {
                    document.getElementById('success').classList.add("d-none");
                }, 2000);
            } else {
                $('#signinForm').modal('show');
            }
        }
    })
}

// add to cart

// Change Quantity

function changeQuantity(cartId, proId, userId, stock, count) {
    let quantity = parseInt(document.getElementById(proId).value)
    count = parseInt(count)
    console.log(quantity);

    quantityCheck = quantity + count
    console.log(quantityCheck);
    stock = parseInt(stock)
    if (quantityCheck <= stock && quantityCheck != 0) {
        document.getElementById("minus" + proId).classList.remove("invisible")
        document.getElementById("plus" + proId).classList.remove("invisible")
        $.ajax({
            url: '/change-product-quantity',
            data: {
                user: userId,
                cart: cartId,
                product: proId,
                count: count,
                quantity: quantity
            },
            method: 'post',
            success: (response) => {
                console.log(response);
                if (response.removeProduct) {
                    location.reload()
                } else {
                    document.getElementById(proId).value = quantity + count;
                    document.getElementById('subtotal').innerHTML = response.total
                    document.getElementById('total').innerHTML = response.total
                }
            }
        })
    }
    if (quantityCheck == 1) {
        document.getElementById("minus" + proId).classList.add("invisible")
    }
    if (quantityCheck == stock) {
        document.getElementById("plus" + proId).classList.add("invisible")
    }
}

// change Quanity

// cart product delete
function deleteCartItem(proId) {
    swal({
        title: "Are you sure to delete!",
        icon: "warning",
        confirmButtonColor: "#ff0000",
        confirmButtonText: "Yes",
        closeOnConfirm: true,
        closeOnCancel: true,
        showCancelButton: true,
        cancelButtonText: "No!",
    },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: '/cart',
                    data: {
                        id: proId
                    },
                    type: 'delete',
                    success: (response) => {
                        if (response.status) {
                            console.log("ajao");
                            $("#item" + proId).remove();
                            $("#cart-count").html(response.count)
                            $("#subtotal").html(response.total)
                            $("#total").html(response.total)
                            if (response.count == 0) {
                                $("#summary").hide()
                                $("#non-empty-cart").hide()
                                $("#empty-cart").show()
                            }
                        }
                    }
                })
            }
        });
}
// cart product delete

// Add to wishlist
function addToWishlist(proId) {
    $.ajax({
        url: '/add-to-wishlist/' + proId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                document.getElementById('add' + proId).classList.add("d-none")
                // $('#add'+proId).hide()
                // $('#remove'+proId).show()
                document.getElementById('remove' + proId).classList.remove("d-none")

                document.getElementById('success-text').innerHTML = "Product added to wishlist"
                document.getElementById('success').classList.remove("d-none");
                setTimeout(function () {
                    document.getElementById('success').classList.add("d-none");
                }, 2000);
            } else {
                document.getElementById('remove' + proId).classList.add("d-none")
                document.getElementById('add' + proId).classList.remove("d-none")
                // $('#remove'+proId).hide()
                // $('#add'+proId).show()


                document.getElementById('success-text').innerHTML = "Product removed to wishlist"
                document.getElementById('success').classList.remove("d-none");
                setTimeout(function () {
                    document.getElementById('success').classList.add("d-none");
                }, 2000);
            }

        }
    })
}
// Add to wishlist

function productModalView(proId) {
    $.ajax({
        url: '/product-view-modal/' + proId,
        type: 'get',
        success: (response) => {
            console.log(response);
            $('#productView').modal('show');
            $('#pro_name').text(response.product_name)
            $('#pro_price').text("₹" + response.offerPrice)
            $('#pro_des').text(response.description)
            $('#productimage').css('background-image', 'url(' + response?.images?.[0] + ')');
        }
    })
}

function deleteBanner(bannerId) {
    $.ajax({
        url: '/admin/admin_panel/banner',
        type: 'delete',
        data: {
            bannerId
        },
        success: (response) => {
            location.reload()
        }
    })
}
// address
$("#add-address-form").submit((e) => {
    e.preventDefault();
    $.ajax({
        url: '/add-address',
        type: 'post',
        data: $('#add-address-form').serialize(),
        success: (response) => {
            if (response) {
                location.href = '/address'
            }
        }
    })
})
// address



// checkout

$("#checkout-form").submit((e) => {
    e.preventDefault();
    $.ajax({
        url: '/add-address',
        type: 'post',
        data: $('#checkout-form').serialize(),
        success: (response) => {
            if (response) {
                location.href = '/checkout'
            }
        }
    })
})


function editAddress(addressId) {
    $.ajax({
        url: '/edit-address/' + addressId,
        method: 'get',
        success: (response) => {
            $('#staticBackdrop1').modal('show');
            $("input[name='editfirstname']").val(response[0].address.firstname);
            $("input[name='editlastname']").val(response[0].address.lastname);
            $("input[name='editaddress']").val(response[0].address.address);
            $("input[name='editlandmark']").val(response[0].address.landmark);
            $("input[name='editphonenumber']").val(response[0].address.phonenumber);
            $('#editcountry').val(response[0].address.country);
            $("#editstate").val(response[0].address.state);
            $("input[name='editpincode']").val(response[0].address.pincode);
            $("input[name='addressId']").val(addressId);
        }
    })
}

function editAddress(addressId) {
    $.ajax({
        url: '/edit-address/' + addressId,
        method: 'get',
        success: (response) => {
            $('#staticBackdrop1').modal('show');
            $("input[name='editfirstname']").val(response[0].address.firstname);
            $("input[name='editlastname']").val(response[0].address.lastname);
            $("input[name='editaddress']").val(response[0].address.address);
            $("input[name='editlandmark']").val(response[0].address.landmark);
            $("input[name='editphonenumber']").val(response[0].address.phonenumber);
            $('#editcountry').val(response[0].address.country);
            $("#editstate").val(response[0].address.state);
            $("input[name='editpincode']").val(response[0].address.pincode);
            $("input[name='addressId']").val(addressId);
        }
    })
}

$("#address-edit-form").submit((e) => {
    e.preventDefault();
    console.log("hjhjgfcvhj");
    console.log($('#address-edit-form').serialize());
    $.ajax({
        url: '/edit-address',
        type: 'post',
        data: $('#address-edit-form').serialize(),
        success: (response) => {
            if (response) {
                // location.href = '/checkout'
                location.reload()
            }
        }
    })
})


function deleteAddress(addressId) {
    $.ajax({
        url: '/delete-address',
        method: 'delete',
        data: {
            addressId
        },
        success: (response) => {
            // location.href = '/checkout'
            location.reload()
        }
    })
}

$("#address-submit").submit((e) => {
    e.preventDefault();
    $.ajax({
        url: '/checkout',
        type: 'post',
        data: $('#address-submit').serialize(),
        success: (response) => {
            if (response.codSuccess) {
                swal({
                    title: "Order Placed Successfully",
                    text: "Order Placed Successfully",
                    icon: "success",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Goto orders",
                    closeOnConfirm: false,
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            location.href = '/order-history'
                        }
                    });
            }
            else if (response.razorpay) {
                razorpayPayment(response.response, response.user)
            } else if (response.paypal) {
                location.href = response.url
            }
        }
    })
})

function razorpayPayment(order, user) {
    var options = {
        "key": 'rzp_test_2ZIIwvfrPDUn5c', // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Elecxo",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            verifyPayment(response, order)
        },
        "prefill": {
            "name": user.username,
            "email": user.email,
            "contact": user.phone_number
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
    // rzp1.on('payment.failed', function (response) {
    //     $.ajax({
    //         url: '/payment-failre',
    //         method: 'delete',
    //         data: {
    //             orderId: order.id
    //         },
    //         success: (response) => {
    //             location.href = '/order-history'
    //         }
    //     })
    // });
}

function verifyPayment(payment, order) {
    $.ajax({
        url: '/verify-payment',
        data: {
            payment,
            order
        },
        method: 'post',
        success: (response) => {
            if (response.status) {
                location.href = '/order-history'
            } else {
                alert('Payment failed')
            }
        }
    })
}


// checkout


// image zoom

var options = {
    width: 400,
    zoomWidth: 100,
    offset: { vertical: 80, horizontal: 0 },
    scale: 0.6,
};
new ImageZoom(document.getElementById("img-container"), options);

// imagezoom


// $('a').click(function () {
//     console.log("hai");
//     $('a.active').each(function () {
//         $(this).removeClass('active');
//     });
//     $(this).addClass('active');
// });


// $(document).ready(function () {
//     $('ul li a').click(function () {
//         $('li a').removeClass("active");
//         $(this).addClass("active");
//     });
// });

// var header = document.getElementById("nav");
// console.log(header);
// var btns = header.getElementsByClassName("nav-item");
// for (var i = 0; i < btns.length; i++) {
//     btns[i].addEventListener("click", function () {
//         var current = document.getElementsByClassName("active");
//         current[0].className = current[0].className.replace(" active", "");
//         this.className += " active";
//     });
// }


// view image

function viewImage(event, imgId, idNum) {
    console.log(event);
    var fileInput =
        document.getElementById('imgInput');

    var filePath = fileInput.value;

    console.log(filePath);

    // Allowing file type
    var allowedExtensions =
        /(\.jpg|\.jpeg|\.png|\.gif|\.jfif|\.webp)$/i;

    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        fileInput.value = '';
        return false;
    }
    else {

        // // Image preview
        // if (fileInput.files && fileInput.files[0]) {
        //     var reader = new FileReader();
        //     reader.onload = function (e) {
        //         document.getElementById(
        //             'imagePreview').innerHTML =
        //             '<img src="' + e.target.result
        //             + '"/>';
        //     };

        //     reader.readAsDataURL(fileInput.files[0]);
        // }
        document.getElementById(imgId + '_' + idNum).classList.remove("d-none")
        document.getElementById(imgId).src = URL.createObjectURL(event.target.files[0])
        // document.getElementById('imgView2').src = URL.createObjectURL(event.target.files[0])
        // document.getElementById('imgView3').src = URL.createObjectURL(event.target.files[0])
        // document.getElementById('imgView4').src = URL.createObjectURL(event.target.files[0])
    }

}

// function salesReport(days, buttonId) {

//     $.ajax({
//         url: '/admin/admin_panel/sales-report/' + days,
//         method: 'get',
//         success: (response) => {
//             if (response) {
//                 const buttons = document.querySelectorAll('button');
//                 buttons.forEach(button => {
//                     button.classList.remove('active');
//                 });
//                 document.getElementById(buttonId).classList.add("active");
//                 document.getElementById('days').innerHTML = buttonId
//                 document.getElementById('deliveredOrders').innerHTML = response.deliveredOrders
//                 document.getElementById('shippedOrders').innerHTML = response.shippedOrders
//                 document.getElementById('placedOrders').innerHTML = response.placedOrders
//                 document.getElementById('pendingOrders').innerHTML = response.pendingOrders
//                 document.getElementById('canceledOrders').innerHTML = response.canceledOrders
//                 document.getElementById('codTotal').innerHTML = response.codTotal ? response.codTotal : 0
//                 document.getElementById('onlineTotal').innerHTML = response.onlineTotal ? response.onlineTotal : 0
//                 document.getElementById('totalAmount').innerHTML = response.totalAmount ? response.totalAmount : 0
//                 document.getElementById('refundAmount').innerHTML = response.refundAmount ? response.refundAmount : 0
//                 document.getElementById('users').innerHTML = response.users
//             }
//         }
//     })
// }



$(function () {
    $('input[name="daterange"]').daterangepicker({
        opens: 'left'
    }, function (start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });
});


// Histogram admin

window.addEventListener('load', () => {
    histogram(1, 'daily')
})


function histogram(days, buttonId) {

    $.ajax({
        url: '/admin/admin_panel/dashboard/' + days,
        method: 'get',
        success: (response) => {
            if (response) {
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => {
                    button.classList.remove('active');
                });
                document.getElementById(buttonId).classList.add("active");

                let totalOrder = response.deliveredOrders + response.shippedOrders + response.placedOrders

                document.getElementById('totalOrders').innerHTML = totalOrder
                document.getElementById('totalAmount').innerHTML = response.totalAmount

                var xValues = ["Delivered", "Shipped", "Placed", "Pending", "Canceled"];
                var yValues = [response.deliveredOrders, response.shippedOrders, response.placedOrders, response.pendingOrders, response.canceledOrders];
                var barColors = ["green", "blue", "orange", "brown", "red"];

                new Chart("order", {
                    type: "bar",
                    data: {
                        labels: xValues,
                        datasets: [{
                            backgroundColor: barColors,
                            data: yValues
                        }]
                    },
                    options: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: "Order Report"
                        }
                    }
                });

                var xValues = ["COD", "Online", "Total", "Refund"];
                var yValues = [response.codTotal, response.onlineTotal, response.totalAmount, response.refundAmount];

                var barColors = [
                    "#b91d47",
                    "#00aba9",
                    "#2b5797",
                    "#e8c3b9",
                    "#1e7145"
                ];

                new Chart("payment", {
                    type: "pie",
                    data: {
                        labels: xValues,
                        datasets: [{
                            backgroundColor: barColors,
                            data: yValues
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: "Payment Report"
                        }
                    }
                });



                // var xValues = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
                // var yValues = [0, response.users];

                // new Chart("user", {
                //     type: "line",
                //     data: {
                //         // labels: xValues,
                //         datasets: [{
                //             fill: true,
                //             lineTension: 0,
                //             // backgroundColor: "rgba(0,0,255,1.0)",
                //             borderColor: "rgba(0,0,255,0.1)",
                //             data: yValues
                //         }]
                //     },
                //     options: {
                //         legend: { display: false },
                //         scales: {
                //             yAxes: [{ ticks: { min: 0, max: 10 } }],
                //         },
                //         title: {
                //             display: true,
                //             text: "Users Signed"
                //         }
                //     }
                // });
            }
        }
    })
}



// order status
function statusChange(proId, orderId) {
    var status = document.getElementById(proId + orderId).value;
    swal({
        title: "Are you sure?",
        text: "Do you want to " + status + " the order",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, " + status + " it!",
        cancelButtonText: "No!",
        closeOnConfirm: true,
        closeOnCancel: true
    },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: '/admin/admin_panel/orderStatus',
                    data: {
                        proId,
                        orderId,
                        status
                    },
                    method: 'post',
                    success: (response) => {
                        if (response.status) {
                            // document.getElementById(orderId + proId).innerHTML = status
                            location.reload()
                        }
                    }
                })       // submitting the form when user press yes
            } else {
                location.reload()
            }
        }
    );
}


// function orderStatus(status) {
//     $.ajax({
//         url: '/admin/admin_panel/orders/' + status,
//         method: 'get',
//         success: (response) => {
//             if (response) {
//                 var elements = document.querySelectorAll(".order-data");
//                 console.log($('#manage_user table > tbody:first').find('tr:first').before(response[0].status));
//                 $('#manage_user table > tbody:first').find('tr:first').before(response[0].status);
//                 // for (let i = 0; i < response.length; i++) {
//                 //     for (var j = 0; j < 9; j++) {
//                 //         elements[i].innerHTML = response[i].deliveryDetails.fullname;
//                 //         elements[i].innerHTML = response[i].status;
//                 //     }
//                 // }

//             }
//         }
//     })
// }




// cropper
// let result = document.querySelector(".result"),
//     img_result = document.querySelector(".img-result"),
//     img_w = document.querySelector(".img-w"),
//     img_h = document.querySelector(".img-h"),
//     options = document.querySelector(".options"),
//     save = document.querySelector(".save"),
//     cropped = document.querySelector(".cropped"),
//     dwn = document.querySelector(".download"),
//     upload = document.querySelector("#file-input"),
//     cropper = "";

// on change show image with crop options
// upload.addEventListener("change", (e) => {
//     if (e.target.files.length) {
//         // start file reader
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             if (e.target.result) {
//                 // create new image
//                 let img = document.createElement("img");
//                 img.id = "image";
//                 img.src = e.target.result;
//                 // clean result before
//                 result.innerHTML = "";
//                 // append new image
//                 result.appendChild(img);
//                 // show save btn and options
//                 save.classList.remove("hide");
//                 options.classList.remove("hide");
//                 // init cropper
//                 cropper = new Cropper(img);
//             }
//         };
//         reader.readAsDataURL(e.target.files[0]);
//     }
// });


// const imagebox4 = document.getElementsByClassName('image-box1')
// const crop_btn4 = document.getElementById('crop-btn1')
// const input4 = document.getElementById('id_image4')

// input4.addEventListener('change', () => {

//     const img_data1 = input4.files[0]
//     const url1 = URL.createObjectURL(img_data1)
//     // imagebox4.innerHTML = <img src="${url1}" id="image4" style="width:100%;"/>
//     imagebox4.innerHTML = $(".image-box1").attr("src", url1);
//     const image4 = document.getElementById('image4')
//     // document.getElementsByClassName('image-box1').style.display = 'block'
//     document.getElementById('crop-btn1').style.display = 'block'
//     const cropper4 = new Cropper(image4, {
//         autoCropArea: 1,
//         viewMode: 1,
//         scalable: false,
//         zoomable: false,
//         movable: false,
//         minCropBoxWidth: 50,
//         minCropBoxHeight: 50,
//     })
//     crop_btn4.addEventListener('click', () => {
//         cropper4.getCroppedCanvas().toBlob((blob) => {
//             let fileInputElement1 = document.getElementById('id_image4');
//             let file1 = new File([blob], img_data1.name, { type: "image/*", lastModified: new Date().getTime() });
//             let container1 = new DataTransfer();
//             container1.items.add(file1);
//             fileInputElement1.files = container1.files;
//             document.getElementById('imgView4').src = URL.createObjectURL(fileInputElement1.files[0])
//             // document.getElementById('image-box1').style.display = 'none'
//             document.getElementById('crop-btn1').style.display = 'none'
//             console.log(document.getElementById('imgView4'));
//             let newInput = '<input type="text" class="form-control">';
//         })
//     })
// })

// // save on click
// save.addEventListener("click", (e) => {
//     e.preventDefault();
//     // get result to data uri
//     let imgSrc = cropper
//         .getCroppedCanvas({
//             width: img_w.value, // input value
//         })
//         .toDataURL();
//     // remove hide class of img
//     cropped.classList.remove("hide");
//     img_result.classList.remove("hide");
//     // show image cropped
//     cropped.src = imgSrc;
//     dwn.classList.remove("hide");
//     dwn.download = "imagename.png";
//     dwn.setAttribute("href", imgSrc);
// });
// cropper



// ----------------------admin side functionalities--------------------------------------

// order status

function changeOrderStatus(orderId, proId, status) {
    swal({
        title: "Are you sure?",
        text: "Do you want to " + status + "the order",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, archive it!",
        cancelButtonText: "No, cancel please!",
        closeOnConfirm: true,
        closeOnCancel: true
    },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: '/change-order-status',
                    method: 'put',
                    data: {
                        orderId,
                        proId,
                        status
                    },
                    success: (response) => {
                        if (response.status) {
                            document.getElementById(orderId + proId).innerHTML = status
                            document.getElementById(orderId + proId).style.color = 'red'
                            document.getElementById(proId + orderId).style.display = 'none'
                        }
                    }
                })          // submitting the form when user press yes
            }
        }
    );
}
// order status


// profile
function enableEdit(fieldId) {
    $("#" + fieldId).prop('disabled', false);
    $("#" + fieldId + "-button").show();
    if (fieldId === 'username') {
        $("input[type=radio]").attr('disabled', false);
    }
}


function editPersonalInfo(fieldId) {
    var fieldValue = $('#' + fieldId).val();
    if (fieldId === 'username') {
        var gender = $('input[name="gender"]:checked').val();
    }
    $.ajax({
        url: '/profile',
        method: 'put',
        data: {
            fieldId,
            fieldValue,
            gender
        },
        success: (response) => {
            if (response.status) {
                $("#" + fieldId).prop('disabled', true);
                $("#" + fieldId + "-button").hide();
                if (fieldId === 'username') {
                    $("input[type=radio]").attr('disabled', true);
                }
            }
        }
    })
}
// profile

// coupon code
$("#coupon-form").submit((e) => {
    e.preventDefault();
    $.ajax({
        url: '/coupon',
        type: 'post',
        data: $('#coupon-form').serialize(),
        success: (response) => {
            if (!response.msg) {
                $('#coupon-invalid').text("")
                $('#coupon-offer').text(response.offer)
                $('#total-price').text(response.total)
                $('#totalAmount').val(response.total)
            } else {
                $('#coupon-offer').text("0")
                $('#total-price').text(response.total)
                $('#coupon-invalid').text(response.msg)
                $('#totalAmount').val(response.total)
            }
        }
    })
})
// coupon code

$("#category-form").submit((e) => {
    e.preventDefault();
    $.ajax({
        url: '/admin/admin_panel/category-management',
        method: 'post',
        data: $('#category-form').serialize(),
        success: (response) => {
            document.getElementById('category-message').classList.remove("d-none");
            setTimeout(function () {
                document.getElementById('category-message').classList.add("d-none");
            }, 2000);
            location.reload()
        }
    })
})
// $('#category-form').on('submit',(e) => {
//     console.log("hai");
// function addCategory(){
//     // var formData = new FormData(this);
//     console.log("kjhgfd");
//     $.ajax({
//         url: '/admin/admin_panel/category-management/add',
//         method: 'post',
//         // data: $('#category-form').serialize(),
//         data: formData,
//         success: (response) => {
//             console.log(response);
//             if (response) {
//                 document.getElementById('category-message').classList.remove("d-none");
//                 document.getElementById('category-message').innerHTML = msg;
//                 setTimeout(() => {
//                     document.getElementById('category-message').classList.add("d-none");
//                 }, 2000)
//             }
//         }
//     })
// }






// Category Edit
function editCategory(categoryId) {
    let category = document.getElementById(categoryId).innerHTML
    swal({
        title: "Edit Category!",
        // text: "Write something interesting:",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: true,
        animation: "slide-from-top",
        inputValue: category,
        inputPlaceholder: "Edit Category"
    },
        function (inputValue) {
            if (inputValue === null)
                return false;
            if (inputValue === "") {
                return false
            }
            $.ajax({
                url: '/admin/admin_panel/category-management',
                method: 'put',
                data: {
                    categoryId,
                    inputValue
                },
                success: (response) => {
                    if (response.status) {
                        document.getElementById(categoryId).innerHTML = inputValue.toUpperCase()
                    } else {
                        return false
                    }
                }
            })
        });
}

// Category Edit


// pdf export
$(document).ready(function ($) {

    $(document).on('click', '.btn_print', function (event) {
        event.preventDefault();

        //credit : https://ekoopmans.github.io/html2pdf.js

        var element = document.getElementById('container_content');

        //easy
        //html2pdf().from(element).save();

        //custom file name
        //html2pdf().set({filename: 'code_with_mark_'+js.AutoCode()+'.pdf'}).from(element).save();


        //more custom settings
        var opt =
        {
            margin: 1,
            filename: 'pageContent_' + js.AutoCode() + '.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // New Promise-based usage:
        html2pdf().set(opt).from(element).save();


    });



});

// pdf export

// excel export

function export_data() {
    let data = document.getElementById('container_content');
    var fp = XLSX.utils.table_to_book(data, { sheet: 'vishal' });
    XLSX.write(fp, {
        bookType: 'xlsx',
        type: 'base64'
    });
    XLSX.writeFile(fp, 'test.xlsx');
}

// excel export

// function messageHide() {
//     console.log("hai");
//     setTimeout(function () {
//         document.getElementById('category-message').classList.add("d-none");
//     }, 2000);
// }
// var base = document.querySelector('#category-message'); // the container for the variable content
// var selector = '.card'; // any css selector for children
// console.log("Asdasd");
// base.addEventListener('load', function (event) {
//     console.log("Asdasd");
//     setTimeout(function () {
//         document.getElementById('category-message').classList.add("d-none");
//     }, 2000);
// });

// $(document).ready(function ($) {

//     $(document).on('submit', '.category-message', function (event) {
//         event.preventDefault();
//         var xhttp = new XMLHttpRequest();
//         var fd = new FormData();
//         var datas = $('#category-form').serialize();
//         fd.append('image', document.getElementById('image').files[0]);
//         $.ajax({
//             url: '/admin/admin_panel/category-management',
//             method: 'post',
//             data: {
//                 fd,
//                 datas
//             }
//         })
//     })
// })


// document.getElementById('category-form').onsubmit = function (event) {
//     console.log("hai");
//     event.preventDefault() // prevent form from posting without JS
//     var xhttp = new XMLHttpRequest(); // create new AJAX request

//     xhttp.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) { // sucess from server
//             document.getElementById("category-message").innerHTML = 'sent' + this.responseText + xhttp.status;
//         } else { // errors occured
//             document.getElementById("category-message").innerHTML = xhttp.status;
//         }
//     }

//     xhttp.open("POST", "/admin/admin_panel/category-management")
//     var formData = new FormData()
//     formData.append('category', document.getElementById('Category_name').value)     // the text data
//     formData.append('image', document.getElementById('image').files[0]) // since inputs allow multi files submission, therefore files are in array
//     document.getElementById("category-message").classList.remove('d-none')
//     setTimeout(()=>{
//         document.getElementById("category-message").classList.add('d-none')
//     },2000)
//     xhttp.send(formData)
// }

// ----------------------admin side functionalities--------------------------------------



// change password
$("#change-password").submit((e) => {
    e.preventDefault();
    $.ajax({
        url: '/change-password',
        type: 'put',
        data: $('#change-password').serialize(),
        success: (response) => {
            if (response) {
                console.log("hai");
            }
        }
    })
})
// change password

// add category offer
$("#add-category-offer-form").submit((e) => {
    e.preventDefault();
    $.ajax({
        url: '/admin/admin_panel/add-category-offer',
        type: 'post',
        data: $('#add-category-offer-form').serialize(),
        success: (response) => {
            if (response.status) {
                location.href = '/admin/admin_panel/offers'
            } else {
                swal({
                    title: "Already Exists!",
                    text: "Offer already in this category.",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Ok",
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            location.href = '/admin/admin_panel/offers'          // submitting the form when user press yes
                        }
                    });


            }
            // var category = $('#categories').val();
            // var percentage = $('#percentage').val();
            // var expiryDate = $('#expirydate').val();
            // console.log(category, percentage, expiryDate);
            // $('#category-offer tr:last').after('<tr><td>'+category+'</td></tr><tr>...</tr>');

        }
    })
})

// add categoty offer

// edit category offer
// function editCategoryOffer() {
//     var categoryId = document.getElementById('categories').value
//     var categoryData = document.getElementById('categories').innerHTML
//     var percentage = document.getElementById('category-percentage').value
//     var date = document.getElementById('category-expirydate').value
//     $('#edit-category-offer').modal('show');
//     $("#edit-category-option").val(categoryId);
//     $("#edit-category-percentage").val(percentage);
//     $("#edit-category-expirydate").val(date);
// }

// $("#edit-category-offer-form").submit((e) => {
//     e.preventDefault();
//     $.ajax({
//         url: '/admin/edit-category-offer',
//         type: 'post',
//         data: $('#edit-category-offer-form').serialize(),
//         success: (response) => {
//             if (response.status) {
//                 location.href = '/admin/admin_panel/offers'
//             }
//             // var category = $('#categories').val();
//             // var percentage = $('#percentage').val();
//             // var expiryDate = $('#expirydate').val();
//             // console.log(category, percentage, expiryDate);
//             // $('#category-offer tr:last').after('<tr><td>'+category+'</td></tr><tr>...</tr>');

//         }
//     })
// })
// edit category offer

// delete category offer
function deleteCategoryOffer(offerId, category) {
    $.ajax({
        url: '/admin/admin_panel/delete-category-offer',
        type: 'delete',
        data: {
            category
        },
        success: (response) => {
            $("#" + offerId).remove();
        }
    })
}
// delete category offer

// add product offer
$("#add-product-offer-form").submit((e) => {
    e.preventDefault();
    $.ajax({
        url: '/admin/admin_panel/add-product-offer',
        type: 'post',
        data: $('#add-product-offer-form').serialize(),
        success: (response) => {
            location.reload()
            // location.href = '/admin/admin_panel/offers'
            // var category = $('#categories').val();
            // var percentage = $('#percentage').val();
            // var expiryDate = $('#expirydate').val();
            // console.log(category, percentage, expiryDate);
            // $('#category-offer tr:last').after('<tr><td>'+category+'</td></tr><tr>...</tr>');

        }
    })
})
// add product offer

// deleteProductOffer

function deleteProductOffer(proId) {
    $.ajax({
        url: '/admin/admin_panel/delete-product-offer',
        type: 'delete',
        data: {
            proId
        },
        success: (response) => {
            $("#" + proId).remove();
        }
    })
}

// add coupons
$("#add-coupon-form").submit((e) => {
    e.preventDefault();
    $.ajax({
        url: '/admin/admin_panel/coupons',
        type: 'post',
        data: $('#add-coupon-form').serialize(),
        success: (response) => {

            location.href = '/admin/admin_panel/coupons'
            // var category = $('#categories').val();
            // var percentage = $('#percentage').val();
            // var expiryDate = $('#expirydate').val();
            // console.log(category, percentage, expiryDate);
            // $('#category-offer tr:last').after('<tr><td>'+category+'</td></tr><tr>...</tr>');

        }
    })
})
// add coupons

// delete coupon
function deleteCoupon(couponId) {
    $.ajax({
        url: '/admin/admin_panel/coupons',
        type: 'delete',
        data: {
            couponId
        },
        success: (response) => {
            $("#" + couponId).remove();
        }
    })
}
// delete coupon

// pagination
$(document).ready(function () {
    $('#myTable').DataTable();
});

function pickAddress(addressId) {
    $.ajax({
        url: '/pick-address/' + addressId,
        method: 'get',
        success: (response) => {
            $("#firstNameField").val(response[0].address.firstname);
            $("#lastNameField").val(response[0].address.lastname);
            $("#addressField").val(response[0].address.address);
            $("#landmarkField").val(response[0].address.landmark);
            $("#phonenumberField").val(response[0].address.phonenumber);
            $('#countryField').val(response[0].address.country);
            $("#stateField").val(response[0].address.state);
            $("#zipField").val(response[0].address.pincode);
            // $("").val(addressId);
        }
    })
}

// const form = document.getElementById("add-product");

// form.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append($('#add-product').serialize());
//     for (let i = 0; i < 4; i++) {
//         formData.append("files", files.files[i]);
//     }
//     fetch("http://localhost:5000/upload_files", {
//         method: 'POST',
//         body: formData,
//         headers: {
//             "Content-Type": "multipart/form-data"
//         }
//     })
//         .then((res) => console.log(res))
//         .catch((err) => ("Error occured", err));
// });
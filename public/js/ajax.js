const { response } = require("express")

function addTocart(proId){
    $.ajax({
        url:'/addtocart/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count=$('#cartcount').html()
                count=parseInt(count)+1,
                $("#cartcount").html(count)
                location.reload()

            }
        }
    })
}



function changeQuantitty(cartId, proId,userId, count) {
    let quantity=parseInt(document.getElementById(proId).innerHTML)
    count=parseInt(count)


    $.ajax({
        url: '/changeproductquantity',
        data: {
            user:userId,
            cart: cartId,
            product: proId,
            count: count,
            quantity:quantity
        },
        method:'post',
        success: (response)=>{
            if(response.removeProduct){
                alert('product removed from cart')
                location.reload()
            }else{
                document.getElementById(proId).innerHTML=quantity+count
                document.getElementById('total').innerHTML=response.total
                 
            }
            
        }
    })
}

function removeProduct(cartId,proId) {
    $.ajax({
        url: '/removecartproduct',
        data: {
            cart: cartId,
            product: proId

        },
        method: 'post',
        success: (response) => {
            if (response.removeProduct) {
                alert('product removed from cart')
                location.reload()
            }
        }
    })
}


 
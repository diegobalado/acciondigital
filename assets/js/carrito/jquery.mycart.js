/*
* jQuery myCart - v1.1 - 2017-02-21
* http://asraf-uddin-ahmed.github.io/
* Copyright (c) 2017 Asraf Uddin Ahmed; Licensed None
*/

(function ($) {

  "use strict";

  var OptionManager = (function () {
    var objToReturn = {};

    var defaultOptions = {
      currencySymbol: '$',
      classCartIcon: 'my-cart-icon',
      classCartBadge: 'my-cart-badge',
      classProductQuantity: 'my-product-quantity',
      classProductRemove: 'my-product-remove',
      classCheckoutCart: 'my-cart-checkout',
      affixCartIcon: true,
      showCheckoutModal: true,
      cartItems: [],
      clickOnAddToCart: function($addTocart) { },
      afterAddOnCart: function(products, totalPrice, totalQuantity) { },
      clickOnCartIcon: function($cartIcon, products, totalPrice, totalQuantity) { },
      checkoutCart: function(products, totalPrice, totalQuantity) { }
      // getDiscountPrice: function(products, totalPrice, totalQuantity) { return null; }
    };


    var getOptions = function (customOptions) {
      var options = $.extend({}, defaultOptions);
      if (typeof customOptions === 'object') {
        $.extend(options, customOptions);
      }
      return options;
    }

    objToReturn.getOptions = getOptions;
    return objToReturn;
  }());


  var ProductManager = (function(){
    var objToReturn = {};

    /*
    PRIVATE
    */
    localStorage.products = localStorage.products ? localStorage.products : "";
    var getIndexOfProduct = function(id){
      var productIndex = -1;
      var products = getAllProducts();
      $.each(products, function(index, value){
        if(value.id == id){
          productIndex = index;
          return;
        }
      });
      return productIndex;
    }
    var setAllProducts = function(products){
      // console.log('***mycart products: ' + JSON.stringify(products, null, 2))
      localStorage.products = JSON.stringify(products);
    }
    var addProduct = function(id, name, summary, price, quantity, image, event, promo, ph) {
      var products = getAllProducts();
      products.push({
        id: id,
        name: name,
        summary: summary,
        price: price,
        quantity: quantity,
        image: image,
        event: event,
        promo: promo,
        ph: ph
      });
      setAllProducts(products);
    }

    /*
    PUBLIC
    */
    var getAllProducts = function(){
      try {
        var products = JSON.parse(localStorage.products);
        return products;
      } catch (e) {
        return [];
      }
    }
    var updatePoduct = function(id, quantity) {
      var productIndex = getIndexOfProduct(id);
      if(productIndex < 0){
        return false;
      }
      var products = getAllProducts();
      products[productIndex].quantity = typeof quantity === "undefined" ? products[productIndex].quantity * 1 + 1 : quantity;
      setAllProducts(products);
      return true;
    }
    var setProduct = function(id, name, summary, price, quantity, image, event, promo, ph) {
      if(typeof id === "undefined"){
        console.error("id required")
        return false;
      }
      if(typeof name === "undefined"){
        console.error("name required")
        return false;
      }
      if(typeof image === "undefined"){
        console.error("image required")
        return false;
      }
      if(typeof event === "undefined"){
        console.error("event required")
        return false;
      }
      if(!$.isNumeric(price)){
        console.error("price is not a number")
        return false;
      }
      if(!$.isNumeric(quantity)) {
        console.error("quantity is not a number");
        return false;
      }
      if(!$.isNumeric(promo)){
        console.error("promo is not a number")
        return false;
      }
      summary = typeof summary === "undefined" ? "" : summary;

      if(!updatePoduct(id)){
        addProduct(id, name, summary, price, quantity, image, event, promo, ph);
      }
    }
    var clearProduct = function(){
      setAllProducts([]);
    }
    var removeProduct = function(id){
      var products = getAllProducts();
      products = $.grep(products, function(value, index) {
        return value.id != id;
      });
      setAllProducts(products);
      /*metricas*/
      gtag('event', 'FotoBorrada', {'event_category': 'Carrito', 'event_label': `${id}` });
      /*fin metricas*/
    }
    var getTotalQuantity = function(){
      var total = 0;
      var products = getAllProducts();
      $.each(products, function(index, value){
        total += value.quantity * 1;
      });
      return total;
    }
    var getTotalPrice = function(){
      var products = getAllProducts();
      var total = 0;
      $.each(products, function(index, value){
        total += value.quantity * value.price;
      });
      return total;
    }

    var getDiscountPrice = function(){
      // console.log('***getDiscountPrice')
      const promoQuantity = 5
      let products = getAllProducts();
      let events = []
      let finalPrice = 0

      products.forEach(product=>{
        let existsEvent = false
        let i = 0
        while (i<events.length && !existsEvent) {
          existsEvent = Boolean(events[i].event === product.event)
          i++
        }
        if (!existsEvent) 
          events.push({event: product.event, promo: product.promo, price: product.price, ph: product.ph })
      })
      
      events.forEach((event, i)=>{
        let quantity = products.filter(product=>product.event === event.event).length
        events[i].quantity = quantity
        if (event.promo!==0) finalPrice += (Math.floor(quantity/promoQuantity)*event.promo + (quantity%promoQuantity)*event.price)
          else finalPrice += quantity*event.price
      })
      // console.log('*** finalPrice: ' + finalPrice)
      return finalPrice
    }

    objToReturn.getAllProducts = getAllProducts;
    objToReturn.updatePoduct = updatePoduct;
    objToReturn.setProduct = setProduct;
    objToReturn.clearProduct = clearProduct;
    objToReturn.removeProduct = removeProduct;
    objToReturn.getTotalQuantity = getTotalQuantity;
    objToReturn.getTotalPrice = getTotalPrice;
    objToReturn.getDiscountPrice = getDiscountPrice;
    return objToReturn;
  }());


  var loadMyCartEvent = function(userOptions){

    var options = OptionManager.getOptions(userOptions);
    var $cartIcon = $("." + options.classCartIcon);
    var $cartBadge = $("." + options.classCartBadge);
    var classProductQuantity = options.classProductQuantity;
    var classProductRemove = options.classProductRemove;
    var classCheckoutCart = options.classCheckoutCart;

    var idCartModal = 'my-cart-modal';
    var idCartTable = 'my-cart-table';
    var idGrandTotal = 'my-cart-grand-total';
    var idEmptyCartMessage = 'my-cart-empty-message';
    var idDiscountPrice = 'my-cart-discount-price';
    var classProductTotal = 'my-product-total';
    var classAffixMyCartIcon = 'my-cart-icon-affix';


    if(userOptions.cartItems && userOptions.cartItems.constructor === Array) {
      if (!localStorage.products) ProductManager.clearProduct();
      $.each(options.cartItems, function() {
        ProductManager.setProduct(this.id, this.name, this.summary, this.price, this.quantity, this.image, this.event, this.promo, this.ph);
      });
    }

    if (ProductManager.getTotalQuantity()>0) {
      $cartBadge.text(ProductManager.getTotalQuantity());
    } else $cartBadge.text('');

    if(!$("#" + idCartModal).length) {
      $('body').append(
        `<div class="modal fade" id="${idCartModal}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title" id="myModalLabel">
                            <span class="glyphicon glyphicon-shopping-cart"></span>
                            Mis Fotos
                        </h4>
                    </div>
                    <div class="modal-body">
                        <table class="table table-hover table-responsive" id="${idCartTable}"></table>
                        <div style="">
                            <strong>¡También podés tener tus fotos impresas!</strong>
                            <br />
                            Envianos tu consulta para conocer los precios y tamaños disponibles haciendo click <a href="/contacto" onclick="gtag('event', 'Contacto', {'event_category': 'Carrito', 'event_label': 'Consulta Fotos Impresas' });">acá</a>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                        <button type="button" /*disabled="true" */ class="btn btn-primary ${classCheckoutCart}">Continuar</button>
                    </div>
                </div>
            </div>
        </div>`
      );
    }

    var drawTable = function(){
      var $cartTable = $("#" + idCartTable);
      $cartTable.empty();

      var products = ProductManager.getAllProducts().sort((a, b)=>{
        if (a.name < b.name) return -1
          else return 1
      });
      $.each(products, function(){
        var total = this.quantity * this.price;
        $cartTable.append(
          `<tr title="[${this.name}] ${this.summary}" data-id="${this.id}" data-price="${this.price}" >
            <td class="text-center" style="width: 30px;"><img width="30px" height="30px" src="${this.image}"/></td>
            <td colspan="3">[${this.name}] ${this.summary}</td>
            <td title="Unit Price">${options.currencySymbol}${this.price}</td>
            <td title="Quantity"><input type="number" min="1" style="width: 70px;" class="${classProductQuantity}" value="${this.quantity}"/></td>
            <td title="Total" class="${classProductTotal}">${options.currencySymbol}${total}</td>
            <td title="Remove from Cart" class="text-center" style="width: 30px;"><a href="javascript:void(0);" class="btn btn-xs btn-danger ${classProductRemove}">X</a></td>
          </tr>`
        );
      });

      $cartTable.append(products.length ?
        `<tr>
          <td></td>
          <td><strong>Total</strong></td>
          <td></td>
          <td></td>
          <td title="Total Price"><strong id="${idGrandTotal}"></strong></td>
          <td></td>
        </tr>`
        : `<div class="alert alert-danger" role="alert" id="${idEmptyCartMessage}">Tu pedido está vacío</div>`
      );

      var discountPrice = ProductManager.getDiscountPrice(products, ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());

      const promoQuantity = 5
      let events = []
      products.forEach(product=>{
        let existsEvent = false
        let i = 0
        while (i<events.length && !existsEvent) {
          existsEvent = Boolean(events[i].event === product.event)
          i++
        }
        if (!existsEvent) 
          events.push({event: product.event, promo: product.promo, name: product.name})
      })

      events.forEach((promo, i)=>{
        events[i].quantity = products.filter(product=>product.event === promo.event).length
      })
        
      //chequea que haya algun evento con promo aplicable y que las promos no sean cero
      let eventsPromo = events.filter(event=>event.quantity>=promoQuantity)
      if (eventsPromo.length>0 && eventsPromo.every(promo=>promo.promo!==0)) {
        $cartTable.append(
          `<tr style="color: red">
            <td></td>
            <td><strong>Total (descuento incluído)</strong></td>
            <td></td>
            <td></td>
            <td title="Discount Price"><strong id="${idDiscountPrice}"></strong></td>
            <td></td>
          </tr>`
        );
      } 
      let eventsPromoAvailable = events.filter(event=>event.quantity<promoQuantity)
      if (eventsPromoAvailable.length>0) {
        let strevents = ''
        eventsPromoAvailable.forEach((event, i)=>{
          if (event.promo !== 0)
            strevents += `<tr style="color: red">
                            <td colspan="6">
                              <strong>Descuento disponible ${(i+1)}:<br/>5 fotos del evento ${event.name} por $${event.promo}</strong>
                            </td>
                          </tr>`  
        })
        $cartTable.append(strevents);
      }

      showGrandTotal();
      showDiscountPrice();
    }
    var showModal = function(){
      drawTable();
      $("#" + idCartModal).length && $("#" + idCartModal).modal('show');
    }
    var updateCart = function(){
      $.each($("." + classProductQuantity), function(){
        var id = $(this).closest("tr").data("id");
        ProductManager.updatePoduct(id, $(this).val());
      });
    }
    var showGrandTotal = function(){
      $("#" + idGrandTotal).text(options.currencySymbol + ProductManager.getTotalPrice());
    }
    var showDiscountPrice = function(){
      $("#" + idDiscountPrice).text(options.currencySymbol + ProductManager.getDiscountPrice(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity()));
    }

    /*
    EVENT
    */
    if(options.affixCartIcon) {
      var cartIconBottom = $cartIcon.offset().top * 1 + $cartIcon.css("height").match(/\d+/) * 1;
      var cartIconPosition = $cartIcon.css('position');
      $(window).scroll(function () {
        $(window).scrollTop() >= cartIconBottom ? $cartIcon.addClass(classAffixMyCartIcon) : $cartIcon.removeClass(classAffixMyCartIcon);
      });
    }

    $cartIcon.click(function(){
      // console.log('***click')
      options.showCheckoutModal ? showModal() : options.clickOnCartIcon($cartIcon, ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
    });

    $(document).on("input", "." + classProductQuantity, function () {
      var price = $(this).closest("tr").data("price");
      var id = $(this).closest("tr").data("id");
      var quantity = $(this).val();

      $(this).parent("td").next("." + classProductTotal).text("$" + price * quantity);
      ProductManager.updatePoduct(id, quantity);

      if (ProductManager.getTotalQuantity() > 0) {
        $cartBadge.text(ProductManager.getTotalQuantity());
      } else {
        $cartBadge.text('');
      }
      showGrandTotal();
      showDiscountPrice();
    });

    $(document).on('keypress', "." + classProductQuantity, function(evt){
      if(evt.keyCode == 38 || evt.keyCode == 40){
        return ;
      }
      evt.preventDefault();
    });

    $(document).on('click', "." + classProductRemove, function(){
      var $tr = $(this).closest("tr");
      var id = $tr.data("id");
      $tr.hide(500, function(){
        ProductManager.removeProduct(id);
        drawTable();
        if (ProductManager.getTotalQuantity()>0) {
          $cartBadge.text(ProductManager.getTotalQuantity());
        } else {
          $cartBadge.text('');
        }
      });
    });

    $("." + classCheckoutCart).click(function(){
      var products = ProductManager.getAllProducts();
      if(!products.length) {
        $("#" + idEmptyCartMessage).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
        return ;
      }
      updateCart();
      if (ProductManager.getDiscountPrice(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity()) != null) options.checkoutCart(ProductManager.getAllProducts(), ProductManager.getDiscountPrice(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity()), ProductManager.getTotalQuantity());
      else options.checkoutCart(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
      ProductManager.clearProduct();
      $cartBadge.text(ProductManager.getTotalQuantity());
      if (ProductManager.getTotalQuantity() == 0) $cartBadge.hide();
      $("#" + idCartModal).modal("hide");
    });

  }


  var MyCart = function (target, userOptions) {
    /*
    PRIVATE
    */
    var $target = $(target);
    var options = OptionManager.getOptions(userOptions);
    var $cartIcon = $("." + options.classCartIcon);
    var $cartBadge = $("." + options.classCartBadge);

    /*
    EVENT
    */
    $target.on('click', function(){
      options.clickOnAddToCart($target);

      let products = ProductManager.getAllProducts();
      let isProduct = false;
      let setAlert = {
        enabled: false,
        msg: ''
      };

      products.forEach(function(el, index) {
        if ($target.data('id') === el.id) { // 3 6 9
          isProduct = true;
          setAlert['enabled'] = true;
          setAlert['msg'] = 'Esta fotografía ya es parte de su compra.';
          return false;
        } else if ($target.data('ph') !== el.ph &&
          ($target.data('ph') !== 'JPF' || el.ph) &&
          ($target.data('ph') || el.ph === 'JPF')) { // 1 4 5 8
            isProduct = true;
            setAlert['enabled'] = true;
            setAlert['msg'] = 'Para comprar imágenes de diferentes fotógrafos,\ndebés hacer un pedido para cada uno.';
            return false;
        }
      })

      setAlert.enabled && alert(setAlert.msg);

      if (!isProduct) {
        var id = $target.data('id');
        var name = $target.data('name');
        var summary = $target.data('summary');
        var price = $target.data('price');
        var quantity = $target.data('quantity');
        var image = $target.data('image');
        var event = $target.data('event');
        var promo = $target.data('promo');
        var ph = $target.data('ph');
        var type = $target.data('type');

        // console.log('*** promo: ' + promo)
        // console.log('*** event: ' + event)
        // console.log('*** name: ' + name)


        ProductManager.setProduct(id, name, summary, price, quantity, image, event, promo, ph);
        if (ProductManager.getTotalQuantity()>0) {
          $cartBadge.show();
          $cartBadge.text(ProductManager.getTotalQuantity());
        } else {
          $cartBadge.text('');
        }        
        gtag('event', 'FotoAgregada', {'event_category': 'Evento', 'event_label': `${type}` });
      }

      options.afterAddOnCart(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
    });

  }


  $.fn.myCart = function (userOptions) {
    loadMyCartEvent(userOptions);
    return $.each(this, function () {
      new MyCart(this, userOptions);
    });
  }


})(jQuery);

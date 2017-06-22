/*CARRITO*/
function carrito() {

	var goToCartIcon = function($addTocartBtn) {
		var $cartIcon = $(".my-cart-icon");
		var $image = $('<img width="30px" height="30px" src="' + $addTocartBtn.data("image") + '"/>').css({
			position: "fixed",
			"z-index": "999"
		});
		$addTocartBtn.prepend($image);
		var position = $cartIcon.position();
		$image.animate({
			top: position.top,
			left: position.left
		}, 500, "linear", function() {
			$image.remove();
		});
	};

	$('.my-cart-btn').off();
	$('.my-cart-btn').myCart({
		currencySymbol: '$',
		classCartIcon: 'my-cart-icon',
		classCartBadge: 'my-cart-badge',
		classProductQuantity: 'my-product-quantity',
		classProductRemove: 'my-product-remove',
		classCheckoutCart: 'my-cart-checkout',
		affixCartIcon: true,
		showCheckoutModal: true,
		cartItems: [],
		clickOnAddToCart: function($addTocart) {
			goToCartIcon($addTocart);
		},
		afterAddOnCart: function(products, totalPrice, totalQuantity) {
			console.log("afterAddOnCart", products, totalPrice, totalQuantity);
      // sessionStorage.setItem('products', JSON.stringify(products));
      // sessionStorage.setItem('price', totalPrice);
      // sessionStorage.setItem('quantity', totalQuantity);
    },
    clickOnCartIcon: function($cartIcon, products, totalPrice, totalQuantity) {
    	console.log("cart icon clicked", $cartIcon, products, totalPrice, totalQuantity);
    },
    checkoutCart: function(products, totalPrice, totalQuantity) {
    	var checkoutString = "Total Price: " + totalPrice + "\nTotal Quantity: " + totalQuantity;
    	checkoutString += "\n\n id \t name \t summary \t price \t quantity \t image path";
    	$.each(products, function() {
    		checkoutString += ("\n " + this.id + " \t " + this.name + " \t " + this.summary + " \t " + this.price + " \t " + this.quantity + " \t " + this.image);
    	});
      // window.location.href = "/checkout/?n=fotosAD&p="+totalPrice+"&q="+totalQuantity;
      // alert(checkoutString)

      $.post('/checkout/index3.php', {
      	products: products,
      	totalPrice: totalPrice
      })
      .success(function(html) {
      	// console.log('**products ' + JSON.stringify(products)); 
      	$('#main').html(html);
      })
      .error(function() {
      	alert('ERROR');
      });

      // console.log('***products ' + JSON.stringify(products));
      console.log("checking out", products, totalPrice, totalQuantity);
    },
    getDiscountPrice: function(products, totalPrice, totalQuantity) {
    	const cantPromo = 5;
    	let finalPrice = totalPrice;
    	let unityPrice = totalPrice/totalQuantity;
    	if (totalQuantity >= cantPromo) {
    		finalPrice = Math.round(Math.floor(totalQuantity/cantPromo)*unityPrice/1.2*cantPromo + (totalQuantity%cantPromo)*unityPrice);
    		// console.log('***finalPrice ' + finalPrice);
    		return finalPrice;
    	} else return null;
    }
  });

  // if (sessionStorage.getItem('products') && sessionStorage.getItem('price') && sessionStorage.getItem('quantity')) {
  //   if (sessionStorage.getItem('quantity') > 0) $('.my-cart-badge').removeClass('empty').html(sessionStorage.getItem('quantity'));
  //   console.log('price ' + sessionStorage.getItem('price'));
  //   console.log('quantity ' + sessionStorage.getItem('quantity'));
  //   console.log('products ' + sessionStorage.getItem('products'));
  // }
}

/*HANDLEBARS*/
let $pathname = location.pathname;
let $section = '';
let $json = '';
let $template = '';

$('body').append('<script id="pictures-template" type="text/x-handlebars-template"></scr' + 'ipt>');

$section = $pathname.includes('/individual/') ? 'individual' : 'inicio';
// if (!$pathname.includes('/agenda')) {
// 	$template = $section == 'eventos' ? 'eventos' : $section;

	// console.log('$section ' + $section);
	// console.log('$json ' + $json);
	// console.log('$template ' + $template);


	$(document).ready(function() {
		let raw_template = $('#pictures-template').html();
		let template = Handlebars.compile(raw_template);
		let events_placeholder = $("#gallery-wrapper");
		let title_placeholder = $("#gallery_title");
		let ads_placeHolder = $("#gallery-ad");
		let galleries = getGET();
		$json = $section == 'individual' ? galleries.g : $section;

		if ($section == 'galeria' || $section == 'inicio') {
					// console.log('$section ' + $section);
					Handlebars.registerHelper('full_href', function(picture) {
						return '/eventos/?g=' + picture.ID;
					});

					// Handlebars.registerHelper('full_thumb', function(picture) {
					//   return '/assets/images/eventos/' + picture.evento + '/thumbs/' + picture.thumb + '.jpg';
					// });
				}

				$.get("/assets/datasources/" + $json + ".json", function(data, status, xhr) {
					let IdEvento = location.hostname == 'localhost' ? JSON.parse(data).IdEvento : data.IdEvento;
					let title = location.hostname == 'localhost' ? JSON.parse(data).title : data.title;
					let price = location.hostname == 'localhost' ? JSON.parse(data).price : data.price;
					let json_data = location.hostname == 'localhost' ? JSON.parse(data) : data;
					let html_element = '';
					let pics_length = location.hostname == 'localhost' ? JSON.parse(data).pictures.length : data.pictures.length;
					let index = 0;
					let pic = galleries.p;					

					html_element = '<div class="media big"> <a href=#' + json_data.IdEvento + '_' + pic + ' class="open-popup-link" > <img style="background:url(/assets/images/loading.gif) transparent no-repeat" src=/assets/images/eventos/' + json_data.IdEvento + '/' + pic + '.jpg alt="" title="" /> </a> <div class="cart_btns"> <button class="btn btn-danger my-cart-btn" data-id=' + pic + ' data-name="['+title+' ] foto ' + pic + '" data-summary=foto_' + pic + ' data-price="' + json_data.price + '" data-quantity="1" data-image=/assets/images/eventos/' + json_data.IdEvento + '/thumbs/' + pic + '.jpg > Agregar al carrito </button> </div> <div id=' + json_data.IdEvento + '_' + pic + ' class="white-popup mfp-hide"> <div class="button-group"> <a class="fb-xfbml-parse-ignore btn btn-facebook" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=http://acciondigitalfoto.com/assets/images/eventos/'+json_data.IdEvento+'/'+pic+'.jpg"> <i class="fa fa-facebook-square"> </i> Compartir </a> <div class="cart_btns"> <button class="btn btn-danger my-cart-btn" data-id=' + pic + ' data-name="['+title+' ] foto ' + pic + '" data-summary=foto_' + pic + ' data-price="' + json_data.price + '" data-quantity="1" data-image=/assets/images/eventos/' + json_data.IdEvento + '/thumbs/' + pic + '.jpg > Agregar al carrito </button> </div> </div> <div class="img-wrapper"> <img src=/assets/images/eventos/' + json_data.IdEvento + '/' + pic + '.jpg alt="" title="" /> </div> </div> </div>';
					events_placeholder.append(html_element);
					

					var load_ads = function(placeholder, data){
						if (data.ads) {
							let ad = '';				
							for (var i = 0; i < data.ads.length; i++) {
								ad = data.ads[i];
								html_ads = '<a href=' + ad.href + ' target="_blank"> <img src=/assets/images/ads/' + ad.name + ' alt="" /> </a>';
								placeholder.append(html_ads);
							}
						}
					}

					load_ads(ads_placeHolder, json_data);

					title_placeholder.append(title);

					// $('body').append('<script type="text/javascript" class="scriptCarrito" src="/assets/js/carrito/carrito.js"></script>');
					$('body').append('<script type="text/javascript" src="/assets/js/skel.min.js"></script>');
					$('body').append('<script type="text/javascript" src="/assets/js/jquery.scrolly.min.js"></script>');
					$('body').append('<script type="text/javascript" src="/assets/js/util.js"></script>');
					$('body').append('<script type="text/javascript" src="/assets/js/main.js"></script>');
					
					carrito();
					$('.open-popup-link').magnificPopup({
						gallery:{
							enabled:true,
							preload:1
						}
					})
				})
			})

function getCurrentScroll() {
	return window.pageYOffset || document.documentElement.scrollTop;
}
const shrinkHeader = 100;


/*HEADER COLAPSABLE*/
$(function() {
	$(window).scroll(function() {
		let scroll = getCurrentScroll();
		if (scroll >= shrinkHeader) {
			$('#header').addClass('shrink');
			$('#btnTop').show('400');
		} else {
			$('#header').removeClass('shrink');
			$('#btnTop').hide('400');
		}
	});
});

$(document).ready(function() {
	$('body').append('<div id="btnTop"><span class="fa fa-angle-up "></span></div>');
	if (getCurrentScroll() <= shrinkHeader) $('#btnTop').hide();
	$('#btnTop').click(function() {
		$('html,body').animate({
			scrollTop: 0
		}, 400);
		return false;
	});
});

/*PARAMETROS*/
function getGET() {
	let loc = document.location.href;
	if (loc.indexOf('?') > 0)

	{
		let getString = loc.split('?')[1];
		let GET = getString.split('+');
		let get = {};
		for (let i = 0, l = GET.length; i < l; i++) {
			let tmp = GET[i].split('=');
			//tomo el parametro sin lo que viene despues del #
			get[tmp[0]] = unescape(decodeURI(tmp[1])).indexOf('#')!=-1?unescape(decodeURI(tmp[1])).substr(0, unescape(decodeURI(tmp[1])).indexOf('#')):unescape(decodeURI(tmp[1]));
		}
		console.log('Parametros evento ' + get.g);
		console.log('Parametros foto ' + get.p);
		return get;
	}

}

/*PAGINA ACTIVA*/
$(function() {
	let $param = location.pathname;
	// console.log('$param ' + $param);
	switch ($param) {
		case '/index.html':
		$('#nav-header ul li.home').addClass('active');
		break;
		case '/galeria/':
		$('#nav-header ul li.gallery').addClass('active');
		break;
		case '/agenda/':
		$('#nav-header ul li.calendar').addClass('active');
		break;
		case '/eventos/':
		$('#nav-header ul li.gallery').addClass('active');
		break;
		case '/individual/':
		$('#nav-header ul li.gallery').addClass('active');
		break;
		case '/contacto/':
		$('#nav-header ul li.contact').addClass('active');
		break;
		default:
		$('#nav-header ul li.home').addClass('active');
	}
	carrito();
})

/*GENERALES*/
$('form').placeholder();
$('.scrolly').scrolly();
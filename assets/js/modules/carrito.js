/**
 * Módulo de Carrito
 * Maneja la funcionalidad del carrito de compras
 */

function carrito() {

	const goToCartIcon = function ($addTocartBtn) {
		const $cartIcon = $('.my-cart-icon');
		const $image = $(`<img width="30px" height="30px" src="${$addTocartBtn.data('image')}"/>`).css({
			position: "fixed",
			"z-index": "999"
		});
		$addTocartBtn.prepend($image);
		const position = $cartIcon.position();
		$image.animate({
			top: position.top,
			right: position.right
		}, 500, "linear", function () {
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
		clickOnAddToCart: function ($addTocart) {
			goToCartIcon($addTocart);
		},
		afterAddOnCart: function (products, totalPrice, totalQuantity) {
			// sessionStorage.setItem('products', JSON.stringify(products));
			// sessionStorage.setItem('price', totalPrice);
			// sessionStorage.setItem('quantity', totalQuantity);
		},
		clickOnCartIcon: function ($cartIcon, products, totalPrice, totalQuantity) {
			// console.log("cart icon clicked", $cartIcon, products, totalPrice, totalQuantity);
		},
		checkoutCart: function (products, totalPrice, totalQuantity) {
			let checkoutString = "Total Price: " + totalPrice + "\nTotal Quantity: " + totalQuantity;
			checkoutString += "\n\n id \t name \t summary \t price \t quantity \t image path \t ph";
			$.each(products, function () {
				checkoutString += ("\n " + this.id + " \t " + this.name + " \t " + this.summary + " \t " + this.price + " \t " + this.quantity + " \t " + this.image + " \t " + this.ph);
			});
			$.post('/checkout/index.php', {
				products: products,
				totalPrice: totalPrice
			})
				.success(function (html) {
					$('#main').html(html);
				})
				.error(function () {
					alert('ERROR');
				});

		},
		getDiscountPrice: function (products, totalPrice, totalQuantity) {
			const cantPromo = 5;
			let finalPrice = totalPrice;
			if (totalQuantity >= cantPromo) {
				finalPrice = 0;
				return finalPrice;
			} else return null;
		}
	});
}

/**
Css Slider by mjlescano - 2012
*/
;(function( $, window, undefined ){
	var pn = 'cssSlider';
	var defaults = {
		timer: false,
		activeClass: 'active'
	}

	function Plugin( el, options ){
		var that = this
		this.el = el
		this.$el = $(this.el)

		this.options = $.extend( {}, defaults, options)
		this._defaults = defaults
		this.end = function() { return that.$el }

		this.init()
	}

	Plugin.prototype.init = function (){
		var that = this, o = this.options, active = o.activeClass

		var $items = this.$el.find('>.item')
		var $paginator = this.$el.find('.paginator')
		var $pitems = $paginator.find('.pitem')

		var showing = false, $showing = this.$el.find('.'+active)
		if( $showing.length ) showing = $showing.index('.item')

		this.showing = function() { return showing }

		this.show = function(i){
			var that = this
			if( typeof i !== 'number' ) return NaN
			if( i < 0 || i > $items.length - 1 ) return false
			if( i === showing ) return this

			if( showing !== false ){ $showing.removeClass(active) }

			$showing = $items.eq(i).add($pitems.eq(i))
			$showing.addClass(active)

			showing = i
			return this
		}

		this.showPrev = function(){
			var prev = showing - 1
			return that.show(prev < 0 ? $items.length - 1 : prev)
		}

		this.showNext = function(){
			var next = showing + 1
			return that.show(next > $items.length - 1 ? 0 : next)
		}


		$paginator.on('click', '.pitem:not(.'+active+')', function(){
			that.show( $(this).index() )
		})

		if( typeof this.options.timer === 'number' && this.options.timer ) {
			var interval
			this.start = function() {
				if( interval ) clearInterval( interval )
				interval = setInterval(that.showNext, that.options.timer)
			}
			this.stop = function() {
				if( interval ) clearInterval( interval )
			}
			this.start()
			this.$el.on('mouseenter', this.stop)
			this.$el.on('mouseleave', this.start)
		}
	}

	$.fn[pn] = function ( options ) {
		return this.each(function () {
			if ( ! $.data(this, pn)) {
				$.data(this, pn, new Plugin(this, options))
			}
		})
	}
}(jQuery, window));

/*---- Base SCSS ----
.main_banner {
	position: relative;
	height: 350px;
	.item {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		visibility: hidden;
		opacity: 0;
		@include transition (visibility 0s linear 1s, opacity 1s linear);
		&.active {
			visibility: visible;
			opacity: 1;
			-webkit-transition-delay: 0s;
			-moz-transition-delay: 0s;
			-o-transition-delay: 0s;
			transition-delay: 0s;
		}
	}
	.paginator {
		position: absolute;
		right: 10px;
		bottom: 10px;
		.pitem {
			display: inline-block;
			float: left;
			margin: 4px;
			height: 15px;
			width: 15px;
			border-radius: 10px;
			-moz-border-radius: 10px;
			-webkit-border-radius: 10px;
			cursor: pointer;
			box-shadow: inset 0 0 6px black;
			background-color: rgba(0, 0, 0, 0.7);
			&.active {
				cursor: default;
				background-color: red;
				background-color: rgba(255, 30, 30, 0.9);
			}
		}
	}
}

/* ---- Base HAML ----
.main_banner
	.item
	.item.active
	.item
	.item
	.paginator
		.pitem
		.pitem.active
		.pitem
		.pitem

/* ---- Use Example ----
	$('.main_banner').cssSlider({
		timer: 5000
	})
*/
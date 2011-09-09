/*
 * jQuery ah-adjustfixed plugin 0.1
 *
 * https://github.com/ahomu/jquery.ah-adjustfixed
 *
 * Copyright (c) 2011 Ayumu Sato ( http://havelog.ayumusato.com )
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($) {
$.fn.ahAdjustFixed = function(options)
{
    var defaults = {
            // nothing
        },
        settings = $.extend({}, defaults, options);

    var $win    = $(window),
        $doc    = $(document);

    var init = function() {

        // IE6非対応
        if ( navigator.userAgent.indexOf('MSIE6') !== -1 ) {
            return;
        }

        var $box    = $(this),
            $parent = $box.parent();

        var boxAbs         = $box.offset(),
            boxAbsTop      = boxAbs.top,
            boxAbsLeft     = boxAbs.left,
            marginTop      = parseInt($box.css('margin-top'))  || 0,
            marginLeft     = parseInt($box.css('margin-left')) || 0,
            boxHeight      = $box.innerHeight(),

            parentAbs      = $parent.offset(),
            parentAbsLeft  = parentAbs.left,
            parentAbsDiff  = 0,
            boxLiveLeft    = boxAbsLeft - marginLeft,

            parentBottom   = parentAbs.top + $parent.innerHeight(),
            boxBottomLimit = parentBottom - (parseInt($parent.css('padding-bottom')) || 0);

        var lastPoint;

        $win.resize(function() {
            parentAbs    = $parent.offset();
            parentAbsDiff= parentAbs.left - parentAbsLeft;
            parentAbsLeft= parentAbs.left;
            boxLiveLeft   = parseInt($box.css('left')) + parentAbsDiff;
            $box.css('left', boxLiveLeft);
        });

        $win.scroll(function() {
            var pageScroll = ~~$doc.scrollTop(), movePoint, styles;

            // ネガティブスクロールには反応させない(Safari5.1など)
            if ( pageScroll < 0 ) {
                return;
            }

            // ボックスの高さを更新する
            boxHeight = $box.innerHeight();

            // スクロール量が，絶対位置に満たないとき
            if ( boxAbsTop > pageScroll ) {
                movePoint = boxAbsTop;
                styles = {
                    position   : 'absolute',
                    top        : movePoint,
                    left       : boxLiveLeft,
                    marginTop  : 0
                };
            }
            // ボトムの下限位置が，スクロール量＋ボックスの高さ(=ボックスの下位置)未満になるとき
            else if ( boxBottomLimit <= (pageScroll + boxHeight) ) {
                movePoint = boxBottomLimit - boxHeight;
                styles = {
                    position   : 'absolute',
                    top        : movePoint,
                    left       : boxLiveLeft,
                    marginTop  : 0
                };
            }
            // その他の中間位置の場所調整
            else {
                movePoint = 0;
                styles = {
                    position   : 'fixed',
                    top        : movePoint,
                    left       : boxLiveLeft,
                    marginTop  : 0
                };
            }

            if ( lastPoint !== movePoint ) {
                $box.css(styles);
            }

            lastPoint = movePoint;
        }).scroll();
    };

    this.each(function() {
        init.apply(this);
    });

    return this;
}
})(jQuery);

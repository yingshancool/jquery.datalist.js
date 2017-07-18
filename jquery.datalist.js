(function ($) {
    $.fn.extend({
        "datalist": function (option) {
            option = option == undefined?{}:option;

            window.addEventListener("keydown", function(e) {
                switch(e.keyCode) {
                    // case 32:
                    case 37:   // 左
                    case 38:   // 上
                    case 39:   // 右
                    case 40:   // 下
                        e.preventDefault();
                    break;     // Space
                    default:
                    break;     // do not block other keys
                }
            }, false);

            $(document).click(function() {
                $(".selector_item_list").hide();
            });


            var keyMove        = function (selectorItemList, event) {
                var targetLi;
                var selected = selectorItemList.find('.selected');
                if (selected.length <= 0) {
                    switch(event.keyCode) {
                        case 38:
                            targetLi = selectorItemList.find('li:visible:last');
                        break;
                        case 40:
                            targetLi = selectorItemList.find('li:visible:first');
                        break;
                    }
                } else {
                    switch(event.keyCode) {
                        case 38:
                            try {
                                var ul_len = selectorItemList.children('li:visible').length;
                                var last   = ul_len - 1;
                                selectorItemList.children('li:visible').each(function(index, el) {
                                    if ($(this).hasClass('selected')) {
                                        $(this).removeClass('selected');
                                        var prev = index - 1;
                                        if (prev >= 0 && prev < ul_len) {
                                            throw selectorItemList.find('li:visible:eq(' + prev + ')');
                                        } else {
                                            throw selectorItemList.find('li:visible:eq(' + last + ')');
                                        }
                                    }
                                });
                            } catch(e) {
                                targetLi = e;
                            }
                        break;
                        case 40:
                            try {
                                var ul_len = selectorItemList.children('li:visible').length;
                                selectorItemList.children('li:visible').each(function(index, el) {
                                    if ($(this).hasClass('selected')) {
                                        $(this).removeClass('selected');
                                        var next = index + 1;
                                        if (next >= 0 && next < ul_len) {
                                            throw selectorItemList.find('li:visible:eq(' + next + ')');
                                        } else {
                                            throw selectorItemList.find('li:visible:eq(0)');
                                        }
                                    }
                                });

                                throw selectorItemList.find('li:visible:eq(0)');
                            } catch(e) {
                                targetLi = e;
                            }
                        break;
                        case 13:
                            targetLi = selectorItemList.find('.selected');
                            selectorItemList.parent().find('.text').val(targetLi.html());
                            selectorItemList.parent().find('.the_value').val(targetLi.attr('data-value'));
                            selectorItemList.hide();
                            selectorItemList.children("li").hide();
                            selectorItemList.children(".selected").removeClass('selected');
                            return;
                        break;
                    }
                }

                if (targetLi != undefined) {
                    targetLi.addClass('selected');

                    switch(event.keyCode) {
                        case 38:
                            cameraMoveUp(selectorItemList);
                        break;
                        case 40:
                            cameraMoveDown(selectorItemList);
                        break;
                    }

                    selectorItemList.parent().find('.text').val(targetLi.html());
                    selectorItemList.parent().find('.the_value').val(targetLi.attr('data-value'));
                }
            }

            var cameraMoveUp   = function(selectorItemList) {
                if (selectorItemList.find("li:visible:last").hasClass('selected')) {
                    selectorItemList.scrollTop(selectorItemList.children('li:visible').length * selectorItemList.find('li').outerHeight() - selectorItemList.outerHeight());
                    return;
                }

                try {
                    selectorItemList.children("li:visible").each(function(index, el) {
                        if ($(this).hasClass('selected')) {
                            if ($(this).position().top < $(this).outerHeight()) {
                                throw index * $(this).outerHeight();
                            } else {
                                throw -1;
                            }
                        }
                    });
                } catch(e) {
                    if (e >= 0) {
                        selectorItemList.scrollTop(e);
                    }
                }
            }

            var cameraMoveDown = function(selectorItemList) {
                if (selectorItemList.find("li:visible:first").hasClass('selected')) {
                    selectorItemList.scrollTop(0);
                    return;
                }

                try {
                    selectorItemList.children("li:visible").each(function(index, el) {
                        if ($(this).hasClass('selected')) {
                            if (($(this).offset().top - $(this).outerHeight()) > selectorItemList.outerHeight()) {
                                throw (index + 1) * $(this).outerHeight() - selectorItemList.outerHeight();
                            } else {
                                throw -1;
                            }
                        }
                    });
                } catch(e) {
                    if (e >= 0) {
                        selectorItemList.scrollTop(e);
                    }
                }
            }

            $(this).each(function() {
                var name                         = $(this).attr('name');

                var selector                     = document.createElement('div');
                selector.className               = 'selector';
                selector.style.width             = option == undefined?252:(option.width == undefined?252:option.width);

                // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓【Technofiend <2281551151@qq.com> 2017-07-18 15:24:01】↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
                var selectorEdit                 = document.createElement('div');
                selectorEdit.className           = 'selector_edit';

                var selectorEditInput            = document.createElement('input');
                selectorEditInput.setAttribute('type', 'text');
                selectorEditInput.className      = 'selector_edit_input';

                var time                         = 0;
                selectorEditInput.onkeyup        = function(event) {
                    switch(event.keyCode) {
                        case 13: // 回车
                            var selectorItemList = $(this).parent().next('.selector_item_list');
                            this.value = selectorItemList.find('.selected').html();
                            console.log(selectorItemList.find('.selected').html());
                            selectorItemList.hide();
                        break;
                        case 37: // 左
                        case 38: // 上
                        case 39: // 右
                        case 40: // 下
                            var selectorItemList = $(this).parent().next('.selector_item_list');
                            if (selectorItemList.children('li:visible').length > 0) {
                                if (time > 0) {
                                    return;
                                }

                                keyMove(selectorItemList, event, true);
                                time = setTimeout(function() {
                                    time = 0;
                                }, 10);
                            }
                        break;
                        default:
                            // $(this).focusEnd();

                            var selectorItemList = $(this).parent().next('.selector_item_list');
                            selectorItemList.show();
                            selectorItemList.children("li").hide();
                            selectorItemList.children(".selected").removeClass('selected');

                            var text             = $(this).val();
                            selectorItemList.children('li').each(function(index) {
                                var pattern = new RegExp(text);
                                if (pattern.test($(this).html())) {
                                    $(this).show();
                                    if ($(this).html() === text) {
                                        $(this).addClass('selected');
                                    }
                                }
                            });
                        break;
                    }
                }

                var theValue                     = document.createElement('input');
                theValue.setAttribute('type', 'hidden');
                theValue.setAttribute('name', name);
                theValue.className               = 'the_value';

                var selectorDropdownButton       = document.createElement('div');
                selectorDropdownButton.tabIndex  = -1;
                selectorDropdownButton.className = 'selector_dropdown_button';
                selectorDropdownButton.onkeydown = function(event) {
                    switch(event.keyCode) {
                        case 13: // 回车
                            var selectorItemList    = $(this.parentNode.nextSibling);
                            selectorEditInput.value = selectorItemList.find('.selected').html();
                            selectorItemList.hide();
                        break;
                        case 38: // 键盘向上按钮
                        case 40: // 键盘向下按钮
                            if (time > 0) return;

                            var selectorItemList = $(this.parentNode.nextSibling);
                            keyMove(selectorItemList, event, true);

                            time = setTimeout(function() {
                                time = 0;
                            }, 10);
                        break;
                        default:
                            return;
                        break;
                    }
                }

                selectorDropdownButton.onclick   = function() {
                    $(".selector_item_list").hide();
                    var selector_item_list = $(this).parent().next();
                    selector_item_list.toggle();
                    selector_item_list.find("li").show();
                    event.stopPropagation();
                }

                var icon                         = document.createElement('i');
                icon.className                   = 'icon iconfont';
                icon.textContent                 = '▼';

                selectorDropdownButton.insertBefore(icon,         null);
                selectorEdit.insertBefore(selectorEditInput,      null);
                selectorEdit.insertBefore(theValue,               null);
                selectorEdit.insertBefore(selectorDropdownButton, null);
                // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑【Technofiend <2281551151@qq.com> 2017-07-18 15:24:04】↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

                // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓【Technofiend <2281551151@qq.com> 2017-07-18 15:24:08】↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
                var ul                           = document.createElement('ul');
                ul.className                     = 'selector_item_list';

                $(this).children('option').each(function(index, el) {
                    var temp         = document.createElement('li');
                    temp.setAttribute('data-value', $(el).prop('value'));
                    temp.textContent = $(el).html();

                    temp.onmouseover = function() {
                        $(this).parent().children('li').removeClass("selected");
                        $(this).addClass("selected");
                    }

                    temp.onclick     = function() {
                        var selector_item_list = $(this).parent();
                        selector_item_list.hide();
                        selector_item_list.prev().find('.selector_edit_input').val(($(this).text()));
                        selector_item_list.prev().find('.selector_edit_input').next('.the_value').val(($(this).attr('data-value')));
                    }

                    ul.insertBefore(temp,           null);
                });
                // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑【Technofiend <2281551151@qq.com> 2017-07-18 15:24:08】↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

                selector.insertBefore(selectorEdit, null);
                selector.insertBefore(ul,           null);

                if (option.default != undefined) {
                    if (option.default == '__FIRST__') {
                        $(selector).each(function(e) {
                            if ($(this).find('.the_value').val() == '') {
                                var firstLi = $(this).find('.selector_item_list').find('li:first');
                                $(this).find('.the_value').val(firstLi.attr('data-value'));
                                $(this).find(".selector_edit_input").val(firstLi.html());
                            }
                        });
                    } else {
                        $(selector).each(function(e) {
                            $(this).find('.the_value').val(option.default);
                            $(this).find(".selector_edit_input").val(option.default);
                        });
                    }
                }

                $(this).before(selector);
                $(this).remove();
            });
        }
    });
})(jQuery);
document.accessibleReading = {
    PARAMS: {
        SIZE: 'fontSize',
        COLORSCHEME: 'colorScheme',
        IMGHIDE: 'hideImages',
        LETTERSPACE: 'letterSpace',
        LINEHEIGHT: 'lineHeight',
        FONTFAMILY: 'fontFamily',
    },
    COOKIENAME: 'arw-settings',

    enable: function(options) {
        // Параметры по-умолчанию
        let defaultParams = {};
        defaultParams[this.PARAMS.COLORSCHEME] = '1';

        // Класс accessible_reading включает нужные свойства
        document.querySelector("html").classList.add("accessibleReading");

        // Применяем заданные опции, либо опции по-умолчанию
        if(Object.keys(options).length != 0)
            this.applyParams(options);
        else
            this.applyParams(defaultParams);

        // Добавляем таблицу для регулировки
        document.body.prepend( Object.assign( document.createElement("div"), {
            id: "accessibleReadingControls",
            innerHTML: this.settingsHtml}));

        let accessibleReadingControls = document.querySelector("#accessibleReadingControls");

        // Каждая ссылка имеет в себе настраивающийся параметр, который считываем
        accessibleReadingControls.querySelectorAll("a").forEach((node) => {
            node.addEventListener("click", (event) => {
                event.preventDefault();
                let el = event.currentTarget;
                let params = {};
                // Находим измененный параметр
                for(let p of Object.values(this.PARAMS)) {
                    let attr = el.getAttribute('arw-'+p);
                    if (attr) params[p] = attr;
                };
                this.applyParams(params);
            });
        });

        // Действие кнопки закрытия
        document.querySelector("#arw_widget_disable_button").
            addEventListener("click", (event) => {
                event.preventDefault();
                this.disable();
            });
    },

    bind: function (element, options = {}) {
        element.addEventListener("click", (event) => {
            event.preventDefault();
            this.enable(options);
        });
    },

    disable: function () {
        document.querySelector("html").classList.remove("accessibleReading");
        document.querySelector("#accessibleReadingControls").remove();
        this.removeCookie(this.COOKIENAME);
    },

    applyParams: function (params) {
        // Установка cookie
        for(let [param, value] of Object.entries(params)) {
            let cookie = this.getCookie(this.COOKIENAME);
            let newSettings = cookie ? JSON.parse(cookie) : {};
            newSettings[param] = value;
            this.setCookie(this.COOKIENAME, JSON.stringify(newSettings));
        };

        let htmlClasses = document.querySelector("html").classList; // Классы html для модификации

        // Размер шрифта
        if (params[this.PARAMS.SIZE]) {
            htmlClasses.remove("fontSize16", "fontSize20", "fontSize24", "fontSize28");
            htmlClasses.add("fontSize"+params[this.PARAMS.SIZE]);
        }

        // Цветовая схема
        if(params[this.PARAMS.COLORSCHEME]) {
            htmlClasses.remove(
                "colorScheme1", "colorScheme2", "colorScheme3", "colorScheme4", "colorScheme5");
                htmlClasses.add("colorScheme"+params[this.PARAMS.COLORSCHEME]);
        }

        // Скрывать изображения
        if(params[this.PARAMS.IMGHIDE]) {
            if(params[this.PARAMS.IMGHIDE] == 'false')
                htmlClasses.add("hiddenImages")
            else htmlClasses.remove("hiddenImages")
        }

        // Кернинг
        if(params[this.PARAMS.LETTERSPACE]) {
            htmlClasses.remove("letterSpaceInitial", "letterSpace2", "letterSpace4");
            htmlClasses.add("letterSpace"+params[this.PARAMS.LETTERSPACE]);
        }

        // Межстрочный интервал
        if(params[this.PARAMS.LINEHEIGHT]) {
            htmlClasses.remove("lineHeightNormal", "lineHeight2", "lineHeight4");
            htmlClasses.add("lineHeight"+params[this.PARAMS.LINEHEIGHT]);
        }

        // Шрифт
        if(params[this.PARAMS.FONTFAMILY]) {
            htmlClasses.remove("fontFamilyArial", "fontFamilyTimes", "fontFamilyBraille");
            htmlClasses.add("fontFamily"+params[this.PARAMS.FONTFAMILY]);
        }
    },
    setCookie: function(name, value, options = {}) {
        options = {
            path: '/',
            ...options
        };
    
        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }
    
        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    
        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }
        document.cookie = updatedCookie;
    },
    getCookie: function(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
          ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    removeCookie: function(name) {
        if(!(name instanceof Array)) name = [name];
        name.forEach((name) => {
            this.setCookie(name, "", {
                'max-age': -1
            })
        });
    },
    settingsHtml: '\
<div class="paramsFlex">\
    <div class="param">\
        <div class="paramName">Размер шрифта</div>\
        <div class="paramValue">\
            <a href="#" arw-fontSize="16" style="font-size: 16px">A</a>\
            <a href="#" arw-fontSize="20" style="font-size: 20px">A</a>\
            <a href="#" arw-fontSize="24" style="font-size: 24px">A</a>\
            <a href="#" arw-fontSize="28" style="font-size: 28px">A</a>\
        </div>\
    </div>\
    <div class="param">\
        <div class="paramName">Цветовая схема</div>\
        <div class="paramValue colorSchemes">\
            <a href="#" arw-colorScheme="1" style="background: #ffffff; color: #000000;">A</a>\
            <a href="#" arw-colorScheme="2" style="background: #000000; color: #ffffff;">A</a>\
            <a href="#" arw-colorScheme="3" style="background: #9DD1FF; color: #063462;">A</a>\
            <a href="#" arw-colorScheme="4" style="background: #f7f3d6; color: #4d4b43;">A</a>\
            <a href="#" arw-colorScheme="5" style="background: #3b2716; color: #a9e44d;">A</a>\
        </div>\
    </div>\
    <div class="param">\
        <div class="paramName">Изображения</div>\
        <div class="paramValue">\
            <a href="#" arw-hideImages="false">Выкл.</a>|<a href="#" arw-hideImages="true">Вкл.</a>\
        </div>\
    </div>\
    <div class="param">\
        <div class="paramName">Кернинг</div>\
        <div class="paramValue">\
            <a href="#" arw-letterSpace="Initial">Маленький</a>|<a href="#" arw-letterSpace="2">Средний</a>|<a href="#" arw-letterSpace="4">Большой</a>\
        </div>\
    </div>\
    <div class="param">\
        <div class="paramName">Межстрочный интервал</div>\
        <div class="paramValue">\
            <a href="#" arw-lineHeight="Normal">Маленький</a>|<a href="#" arw-lineHeight="2">Средний</a>|<a href="#" arw-lineHeight="4">Большой</a>\
        </div>\
    </div>\
    <div class="param">\
        <div class="paramName">Шрифт</div>\
        <div class="paramValue">\
            <a href="#" arw-fontFamily="Arial">Без засечек</a>|<a href="#" arw-fontFamily="Times">С засечками</a>|<a href="#" arw-fontFamily="Braille">Брайля</a>\
        </div>\
    </div>\
</div>\
<div id="arw_widget_disable_button">\
    <span class="dashicons dashicons-visibility"></span> <a href="#">Обычная версия</a>\
</div>\
',
};

document.addEventListener("DOMContentLoaded", () => {
    // Регистрируем кнопки
    document.querySelectorAll(".arw_widget_enable_button").forEach(function(node) {
        document.accessibleReading.bind( node );
    });

    // Проверяем, установлен ли куки. Если да - запускаем режим
    // с сохраненными параметрами
    let cookie = document.accessibleReading.getCookie(
        document.accessibleReading.COOKIENAME
    );
    if (cookie) {
        document.accessibleReading.enable( JSON.parse(cookie) );
    }
});

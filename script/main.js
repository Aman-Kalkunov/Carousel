$(document).ready(function() {

    //Запускаем обработчик по "клику"
    $('#load').on('click', loadPhotos);

    //Собираем запрос, содержащий метод и параметры
    function getUrl(metod, params) {
        params = params || {};
        params['access_token'] = getToken(); //Добавляем значение
        //Возвращаем строку запроса
        return 'https://api.vk.com/method/' + metod + '?' + $.param(params) + '&v=5.52';
    }

    //Получаем access_token из строки браузера
    function getToken() {
        if (window.location.hash) { //Проверяем наличие hash в адресной строке
            let hash = window.location.hash.substring(1).split('&')[0];
            let token = hash.split('=')[1]; //Разделяем hash и получаем токен
            history.pushState('', document.title, window.location.pathname); //Очищаем hash
            return token;
        } else {
            alert('Необходимо перейдти по ссылке и разрешить доступ')
        }
    }

    //Осуществляем запрос на сервер и выполняем drawPhotos(data.response.items)
    function sendRequest(method, params, func) {
        $.ajax({
            url: getUrl(method, params),
            method: 'GET',
            dataType: 'JSONP',
            success: func
        });
    }

    //Функция запроса, которая содержит конкретные параметры и метод
    function loadPhotos() {
        sendRequest('photos.get', { album_id: 'profile', type: 'z', count: 100 }, function(data) {
            drawPhotos(data.response.items);
        });
    }

    //добавляем полученные фотографии в HTML
    function drawPhotos(items) {
        let html = '';

        //Добавляем каждый элемент массива
        for (let i = 0; i < items.length; i++) {
            let ph = items[i];

            html += '<div class="swiper-slide">' +
                '<img src="' + ph.photo_604 + '" alt="Изображение не загрузилось">' +
                '</div>'
        }

        $('.swiper-wrapper').html(html);

        //Реализуем "Swiper"
        new Swiper('.swiper-container', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true,
            },
        })
    }

});
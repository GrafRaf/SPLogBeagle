# Blank

Blank — это инструмент автоматизирующий разработку качественного фронт-енда.

### Возможности:
- автоматическая сборка сайта из исходных файлов(*.jade, *.styl и т. д.),
- использовать стиль node.js модулей для работы браузерного javascript,
- node.js сервер для локального запуска,
- unit тестирование браузерного javascript, анализ покрытия кода тестами,
- обнаружение ошибок в javascript коде,
- менеджер клиентских библиотек,
- единый интерфейс запуска запуска тасков — Gulp,
- оптимизация js и css,
- деплой статики на сервер,
- легко добавить новый функционал.

### Основные технологии
Прежде чем приступить к разработке здорово будет ознакомиться с документацией по основным технологиям.
- [node.js & npm](http://nodejs.org/) — основная платформа сборщика,
- [git](http://git-scm.com/doc) — система контроля версий
- [gulp](http://gulpjs.com) — менеджер тасков,
- [bower](http://bower.io) — менеджер клиентских библиотек,
- [karma](http://karma-runner.github.io) — test runner,
- [jade](http://jade-lang.com) — шаблонизатор html,
- [stylus](http://learnboost.github.io/stylus) — препроцессор стилей,
- [browserify](http://browserify.org) — node.js модули для браузерного js

### Установка
Node.js&npm и git, ссылки на установку можно найти на оффициальных сайтах. Возможно после установки придется прописать пути в PATH.

Так как доступ в интернет у нас через прокси, то node и git должны знать об этом:

	npm set proxy http://user:password@proxy.ftc.ru:3128/
	npm set https-proxy http://user:password@proxy.ftc.ru:3128/

	git config --global http.proxy http://user:password@proxy.ftc.ru:3128/
	git config --global https.proxy https://user:password@proxy.ftc.ru:3128/

Остальные модули можно установить через npm:

	npm i -g gulp bower

Теперь мы можем приступить к разработке, создадим локальную копию проекта и перейдем в папку проекта:

	git clone git@gitlab.ftc.ru:esapronov/kloyalty.git
	cd blank1

Устанавливаем npm пакеты и bower зависимости:

	npm i
	bower i

Все почти готово, осталось сделать сборку и запустить локальный сервер:

	gulp build
	gulp start

На локальную версию сайта можно перейти по [ссылке](http://localhost:3000). Если все хорошо, то окроется сайт Программы лояльности. Это пример того, как можно сделать сайт с помощью Blank.

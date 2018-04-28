<!DOCTYPE html>
<html lang="en-US">
    <head>
        {{-- meta --}}
        <meta charset="UTF-8" />
        <link rel="preload" href="https://unpkg.com/emoji-datasource-emojione@3.0.0/img/emojione/sheets/64.png" as="image" />
        <meta name="keywords" content="" />
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta http-equiv="X-UA-Compatible" content="IE=7; IE=9" />
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="user" content="{{user()}}">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        {{-- Page title --}}
        <title> {{env("APP_NAME")}}@yield("title")</title>


        <link rel="stylesheet" type="text/css" href="css/app.css" />

        @yield('css')

    </head>

    <body>


        {{-- content section --}}
        @yield('content')



        {{-- scripts --}}
        <script src="js/app.js" type="text/javascript" charset="utf-8"></script>

        @yield('js')
    </body>
</html>

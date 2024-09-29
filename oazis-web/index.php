<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Запись на курсовую работу</title>
    <style>
        body {
            /* font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            padding: 50px; */

            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            /* background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            margin: auto; */

            display: flex;
            background-color: #fff;
            flex-direction: column;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        h1 {
            color: #333;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 20px;
        }
        .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Добро пожаловать в систему записи на курсовые работы</h1>
        <p>Выберите вашу роль: </p>
        <a href="login.php" class="btn">Студент</a>
        <a href="login.php" class="btn">Преподаватель</a>
    </div>
</body>
</html>

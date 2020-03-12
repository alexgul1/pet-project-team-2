<?php
// необходимые HTTP-заголовки
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");


// подключение базы данных и файл, содержащий объекты
include_once '../config/database.php';
include_once '../objects/product.php';

// получаем соединение с базой данных
$database = new Database();
$db = $database->getConnection();

// инициализируем объект
$product = new Product($db)

// запрашиваем товары
$stmt = $product->read();
$num = $stmt->rowCount();

// проверка, найдено ли больше 0 записей
if ($num > 0) {

    // массив товаров
    $product_arr=array();
    $product_arr["records"]=array();

    // получаем содержимое нашей таблицы 
    // fetch() быстрее, чем fetchAll()
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // извлекаем строку
        extract($row);

        $product_item=array(
            "id" => $id,
            "name" => $name,
            "description" => html_entity_decode($description),
            "price" => $price,
            "category_id" => $category_id,
            "category_name" => $category_name
        );

        array_push($product_arr["records"], $product_item);
    }

    // устанавливаем код ответа - 200 OK
    http_response_code(200);

    // выводим данные о товаре в формате JSON
    echo json_encode($product_arr);

    else {

        http_response_code(404);

        echo json_encode(array("message" => "Товары не найдены."), JSON_UNESCAPED_UNICODE);
    }
}
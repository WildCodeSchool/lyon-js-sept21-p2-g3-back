DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `listes`;
DROP TABLE IF EXISTS `ingredients`;
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `planning`;
DROP TABLE IF EXISTS `suggestions`;

CREATE TABLE `users` (
	`id` INT NOT NULL AUTO_INCREMENT, 
	`firstname` VARCHAR(255) NOT NULL, 
	`lastname` VARCHAR(255) NOT NULL, 
	`email` VARCHAR(255) NOT NULL, 
	PRIMARY KEY (`id`)
);

INSERT INTO `users` (id, firstname, lastname, email) VALUES (1, 'pedro', 'genthon', 'leroilion@genthon.fr');

CREATE TABLE `ingredients` (
	`id` VARCHAR(255) NOT NULL, 
	`name` VARCHAR(255) NOT NULL, 
	`measure`VARCHAR(255), 
	`category` VARCHAR(255), 
	`image` VARCHAR(1000),
	PRIMARY KEY (`id`)	
);


CREATE TABLE `listes` (
	`date` DATE NOT NULL,
	`user_id` INT NOT NULL, 
	`id_ingredient` VARCHAR(255) NOT NULL, 
	`quantity` FLOAT NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES users(`id`),
	FOREIGN KEY (`id_ingredient`) REFERENCES ingredients(`id`),
	PRIMARY KEY (`date`, `user_id`, `id_ingredient`)
); 

CREATE TABLE `favorites` (
	`user_id` INT NOT NULL, 
	`id_recipe` VARCHAR(255) NOT NULL, 
    `image` VARCHAR(1000) NOT NULL, 
    `label` VARCHAR(255) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES users(`id`),
	PRIMARY KEY (`user_id`, `id_recipe`)
);

CREATE TABLE `planning` (
	`user_id` INT NOT NULL, 
	`date` DATE NOT NULL, 
    `lunch` BOOLEAN NOT NULL,
    `diner` BOOLEAN NOT NULL,  
	`id_recipe` VARCHAR(255) NOT NULL,
    `image` VARCHAR(1000) NOT NULL,  
    `label` VARCHAR(255) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES users(`id`), 
	PRIMARY KEY (`user_id`, `date`, `lunch`, `diner`)	
);

CREATE TABLE `suggestions` (
	`date` DATE NOT NULL, 
	`id_recipe` VARCHAR(255) NOT NULL,
	`image` VARCHAR(1000) NOT NULL,  
    `label` VARCHAR(255) NOT NULL, 
	PRIMARY KEY (`date`, `id_recipe`)
);


INSERT INTO suggestions (date, id_recipe, image, label) 
VALUES ('2021-11-16', 'recipe_0f6199b0c6a6283e57cf42056aaf6f1f', 'https://www.edamam.com/web-img/ef9/ef96b1ac7cc124f7404ef245f5e8db2a.jpg', 'Spinach lasagne'), ('2021-11-16', 'recipe_b327cebea5d9389a1670b587fe3f7ca5', 'https://www.edamam.com/web-img/743/743ec2ab2a504e503642250efa0817f3.jpg', "Duck with Raspberries (Canard aux Framboises)"), ('2021-11-16','recipe_7107ec0cf03c58dfb4970e86c840d670', 'https://www.edamam.com/web-img/166/166c69fae3b525c9d2663fa021c333a6.jpg', "Choucroute Garnie"), ('2021-11-16', 'recipe_687b61a316de39be04b86911cff4dfe6', 'https://www.edamam.com/web-img/08a/08a7002b167ffad2ad2c675be162c170.jpg',  "Pizza Margherita"), ('2021-11-16', 'recipe_944bad149568b881f6c1cbadc107ec17', 'https://www.edamam.com/web-img/eab/eabfac15f5e25ab7f07fc1bb582b117d.jpg', "Lamb Tagine");

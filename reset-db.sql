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
	`measure`VARCHAR(255) NOT NULL, 
	`category` VARCHAR(255), 
	`image` VARCHAR(1000),
	PRIMARY KEY (`id`)	
);

INSERT INTO `ingredients` (`id`, `name`, `measure`, `category`, `image`) 
VALUES ('food_acjhpy7bkl7a9qboztipaa2i9e4m', 'mozzarella cheese', 'ounce', 'Cheese', 'https://www.edamam.com/food-img/92d/92d92d4a4dfe8c025cea407c9ce764c3.jpg' );

CREATE TABLE `listes` (
	`date` DATE NOT NULL,
	`user_id` INT NOT NULL, 
	`id_ingredient` VARCHAR(255) NOT NULL, 
	`quantity` FLOAT NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES users(`id`),
	FOREIGN KEY (`id_ingredient`) REFERENCES ingredients(`id`),
	PRIMARY KEY (`date`, `user_id`, `id_ingredient`)
); 

INSERT INTO `listes` (`date`, `user_id`, `id_ingredient`, `quantity`) 
VALUES ('2021-11-16', 1, 'food_acjhpy7bkl7a9qboztipaa2i9e4m', '2');

CREATE TABLE `favorites` (
	`user_id` INT NOT NULL, 
	`id_recipe` VARCHAR(255) NOT NULL, 
    `image` VARCHAR(1000) NOT NULL, 
    `label` VARCHAR(255) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES users(`id`),
	PRIMARY KEY (`user_id`, `id_recipe`)
);

INSERT INTO `favorites` (`user_id`, `id_recipe`, `image`, `label`) VALUES ('1', 'recipe_0f6199b0c6a6283e57cf42056aaf6f1f', 'https://www.edamam.com/food-img/4d6/4d651eaa8a353647746290c7a9b29d84.jpg', 'mon label');

CREATE TABLE `planning` (
	`user_id` INT NOT NULL, 
	`date` DATE NOT NULL, 
    `lunch` BOOLEAN NOT NULL,
    `dinner` BOOLEAN NOT NULL,  
	`id_recipe` VARCHAR(255) NOT NULL,
    `image` VARCHAR(1000) NOT NULL,  
    `label` VARCHAR(255) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES users(`id`), 
	PRIMARY KEY (`user_id`, `date`, `lunch`, `dinner`)	
);

INSERT INTO planning (`user_id`, `date`, `lunch`, `dinner` , `id_recipe`, `image`, `label` ) VALUES (1, '2021-11-16', true, false, 'recipe_0f6199b0c6a6283e57cf42056aaf6f1f', 'https://www.edamam.com/food-img/4d6/4d651eaa8a353647746290c7a9b29d84.jpg', 'mon label');

CREATE TABLE `suggestions` (
	`date` DATE NOT NULL, 
	`id_recipe` VARCHAR(255) NOT NULL, 
	PRIMARY KEY (`date`, `id_recipe`)
);

INSERT INTO suggestions (`date`, `id_recipe`) VALUES ('2021-11-16', 'recipe_0f6199b0c6a6283e57cf42056aaf6f1f');

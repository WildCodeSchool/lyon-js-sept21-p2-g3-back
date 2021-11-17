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
	`image` VARCHAR(1000) NOT NULL,  
    `label` VARCHAR(255) NOT NULL, 
	PRIMARY KEY (`date`, `id_recipe`)
);

-- INSERT INTO suggestions (`date`, `id_recipe`) VALUES ('2021-11-16', 'recipe_0f6199b0c6a6283e57cf42056aaf6f1f'), ('2021-11-16', 'recipe_b327cebea5d9389a1670b587fe3f7ca5'), ('2021-11-16','recipe_7107ec0cf03c58dfb4970e86c840d670'), ('2021-11-16', 'recipe_687b61a316de39be04b86911cff4dfe6'), ('2021-11-16', 'recipe_944bad149568b881f6c1cbadc107ec17');
-- INSERT INTO suggestions (`date`, `id_recipe`) VALUES ('2021-11-16', 'recipe_1356a760a73b96460168435f7d997d7e'), ('2021-11-16', 'recipe_766b954100d72be91ccdf3562415735c'), ('2021-11-16','recipe_c73d2caa17381bc8c2bba3d27eb831a4'), ('2021-11-16', 'recipe_c3297fe518589eda4342712023613716'), ('2021-11-16', 'recipe_86dfb3d5d3fbd58ad6e33de29a4d6cdf');
-- INSERT INTO suggestions (`date`, `id_recipe`) VALUES ('2021-11-16', 'recipe_8e7748e2710ab3fc08d733ab6903fe71'), ('2021-11-16', 'recipe_f3b207fdd58daa2c7081b07aec9beaa7'), ('2021-11-16','recipe_5320ddc0df9497e634df2f01cf9bfc4b'), ('2021-11-16', 'recipe_c6d33138e8f22f6dade4e9425da6d534'), ('2021-11-16', 'recipe_5d0c18f767a7f90e4aa0e25ee5af37ce');

